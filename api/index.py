import os
import time
import math
from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security.api_key import APIKeyHeader
from pydantic import BaseModel, Field
from typing import List, Optional
import numpy as np

# Import the new decoupled IP algorithms
import dissolved_gas as dg

app = FastAPI(title="AdaptiveSensing API")

# --- Security & CORS Configuration ---
# API Key Authentication
API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

def get_api_key(api_key_header: str = Security(api_key_header)):
    # Retrieve authorized keys from the environment variables, comma-separated.
    # Defaulting to an internal key for the React frontend if not set on Cloud Run.
    valid_keys_str = os.getenv("AUTHORIZED_API_KEYS", "adaptivesensing-internal-react-key")
    valid_keys = [k.strip() for k in valid_keys_str.split(",") if k.strip()]
    
    if api_key_header in valid_keys:
        return api_key_header
    raise HTTPException(status_code=401, detail="Invalid or missing API Key")

# CORS Restriction
# Only allow requests from approved domains
origins = [
    "http://localhost:3000",          # Local Development
    "https://adaptivesensing.io",     # Production Next.js 
    "https://www.adaptivesensing.io", # Production Next.js (www)
    "https://bcanalytical.com",       # approved external domain
    "https://www.bcanalytical.com",   # approved external domain
    # Add Vercel branch preview URLs if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)
# -------------------------------------

# --- Original Pydantic Models ---
class PlumeParams(BaseModel):
    wind_speed: float
    emission_rate: float
    target_distance: float
    stability_class: str # A-F

class FicksLawParams(BaseModel):
    data_points: list[float]
    membrane_thickness: float
    temperature: float

class SignalParams(BaseModel):
    noise_level: float
    sampling_frequency: float
    mode: str # "Standard" or "Gulp"

# --- Dissolved Gas Pydantic Models ---
class SeawaterRequest(BaseModel):
    temp: float
    tempUnits: str = "°C (ITS-90)"
    salt: float
    saltUnits: str = "Salinity(PSS_78)"
    atmPress: float = 101325
    atmPressUnits: str = "Pa"
    latitude: Optional[float] = 33
    longitude: Optional[float] = 162.5

class DissolvedGasRequest(SeawaterRequest):
    reportingUnits: str
    moleFractions: List[float]
    gasAllNames: List[str]

class PartialPressureRequest(SeawaterRequest):
    reportingUnits: str
    gasAllConcs: List[float]
    gasAllUnits: List[str]
    gasAllNames: List[str]


# --- Original Endpoints ---

@app.get("/")
def read_root():
    return {"status": "IP Fortress Active", "version": "1.0.0"}

@app.post("/api/dispersion")
def calculate_plume_dispersion(params: PlumeParams):
    try:
        x = np.linspace(0, params.target_distance, 50)
        y = np.linspace(-params.target_distance/2, params.target_distance/2, 50)
        X, Y = np.meshgrid(x, y)

        wind_factor = max(0.1, params.wind_speed)
        spread = 10 if params.stability_class.upper() in ['A', 'B'] else 5
        
        Z = (params.emission_rate / (math.pi * wind_factor * spread)) * np.exp(- (Y**2) / (2 * spread**2)) * np.exp(- X / 100)
        
        noise = np.random.normal(0, np.max(Z)*0.05, X.shape)
        Z = np.abs(Z + noise)

        return {
            "x": x.tolist(),
            "y": y.tolist(),
            "z": Z.tolist()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ficks-law")
def calculate_ficks_law(params: FicksLawParams):
    try:
         time_steps = np.arange(len(params.data_points))
         raw_data = np.array(params.data_points)
         
         if len(raw_data) < 2:
             raise ValueError("Need at least 2 data points.")
             
         target_steady_state = raw_data[-1] * 1.5
         predicted_curve = target_steady_state * (1 - np.exp(-0.1 * time_steps))
         
         return {
             "time": time_steps.tolist(),
             "raw_data": raw_data.tolist(),
             "predicted_data": predicted_curve.tolist()
         }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/signal-to-noise")
def simulate_signal_to_noise(params: SignalParams):
    try:
        duration = 5 # seconds
        t = np.linspace(0, duration, int(duration * params.sampling_frequency))
        
        signal = 10 * np.exp(-((t - 2.5) / 0.2)**2)
        
        actual_noise_level = params.noise_level
        if params.mode.lower() == "gulp":
            actual_noise_level = params.noise_level / 3.2
            
        noise = np.random.normal(0, actual_noise_level, len(t))
        waveform = signal + noise
        
        return {
            "time": t.tolist(),
            "waveform": waveform.tolist(),
            "signal_base": signal.tolist()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------
# NEW: Dissolved Gas Calculator Endpoints (IP Fortress)
# ---------------------------------------------------------

def _convert_inputs(request: SeawaterRequest):
    T = 25.0
    if request.tempUnits in ['°C (ITS-90)', 'celsius90']: T = request.temp
    elif request.tempUnits == 'fahrenheit': T = (request.temp - 32) * 5/9
    elif request.tempUnits == 'kelvin': T = request.temp - 273.15

    S = 35.0
    if request.saltUnits == 'Salinity(PSS_78)': S = request.salt
    elif request.saltUnits == 'IonicStrength(mol_kg_H2O)': S = 0.019924 * request.salt
    elif request.saltUnits == 'IonicStrength(mol_kg_soln)': S = 19.924 * request.salt / (1000 - 1.005 * request.salt)
    elif request.saltUnits == 'Conductivity(mS_cm)': S = dg.gsw.SP_from_C(request.salt, T, 0)

    Patm = 1.0
    if request.atmPressUnits == 'Pa': Patm = request.atmPress / 101325
    elif request.atmPressUnits == 'kPa': Patm = request.atmPress / 101.325
    elif request.atmPressUnits == 'hPa': Patm = request.atmPress / 10.1325
    elif request.atmPressUnits == 'atm': Patm = request.atmPress
    elif request.atmPressUnits == 'mbar': Patm = request.atmPress / 10.1325
    elif request.atmPressUnits == 'inHg': Patm = request.atmPress / 33.8639

    return T, S, Patm

def _build_seawater_dict(sw):
    return {
        'IS_Temp_C': {'value': dg.to_significant_figures(sw.IS_Temp_C), 'units': '°C', 'nice name': 'In-Situ Temperature'},
        'Pot_T_ITS90': {'value': dg.to_significant_figures(sw.Pot_T_ITS90), 'units': '°C', 'nice name': 'Potential Temperature'},
        'Cons_T_ITS90': {'value': dg.to_significant_figures(sw.Cons_T_ITS90), 'units': '°C', 'nice name': 'Conservative Temperature'},
        'Prac_Sal_psu': {'value': dg.to_significant_figures(sw.Prac_Sal_psu), 'units': 'PSU', 'nice name': 'Practical Salinity'},
        'Abs_Sal_g_kg': {'value': dg.to_significant_figures(sw.Abs_Sal_g_kg), 'units': 'g/kg', 'nice name': 'Absolute Salinity'},
        'Chlorinity_g_kg': {'value': dg.to_significant_figures(sw.Chlorinity_g_kg), 'units': 'g/kg', 'nice name': 'Chlorinity'},
        'Ionic_strength_mol_kg_sw': {'value': dg.to_significant_figures(sw.Ionic_strength_mol_kg_sw), 'units': 'mol/kg-sw', 'nice name': 'Ionic Strength'},
        'IS_Density': {'value': dg.to_significant_figures(sw.IS_Density), 'units': 'kg/m³', 'nice name': 'In Situ Density'},
        'Press_dbar': {'value': dg.to_significant_figures(sw.Press_dbar), 'units': 'dbar', 'nice name': 'Pressure'},
        'Depth_m': {'value': dg.to_significant_figures(sw.Depth_m), 'units': 'm', 'nice name': 'Depth'},
        'VelofSound_m_s': {'value': dg.to_significant_figures(sw.VelofSound_m_s), 'units': 'm/s', 'nice name': 'Velocity of Sound'},
        'HeatCap_J_gK': {'value': dg.to_significant_figures(sw.HeatCap_J_gK), 'units': 'J/(g·K)', 'nice name': 'Heat Capacity'},
        'VP_atm': {'value': dg.to_significant_figures(sw.VP_atm), 'units': 'atm', 'nice name': 'Vapor Pressure'}
    }

@app.post("/api/seawater")
async def calculate_seawater(request: SeawaterRequest, api_key: str = Depends(get_api_key)):
    T, S, _ = _convert_inputs(request)
    # Defaulting latitude and longitude to handle Optional type hinting properly
    lat = request.latitude if request.latitude is not None else 33.0
    lon = request.longitude if request.longitude is not None else 162.5
    sw = dg.basicSeawaterProperties(T, S, p=0, lat=lat, lon=lon)
    return _build_seawater_dict(sw)

@app.post("/api/dissolved-gas")
async def calculate_dissolved_gas(request: DissolvedGasRequest, api_key: str = Depends(get_api_key)):
    T, S, Patm = _convert_inputs(request)
    sw = dg.basicSeawaterProperties(T, S)
    
    gasNames = []
    concG = []
    
    for i in range(len(request.moleFractions)):
        PatmG = float(request.moleFractions[i]) * Patm
        C, _, _ = dg.getGasSolubility(request.gasAllNames[i], S, T, request.reportingUnits, PatmG)
        if not math.isnan(C):
            concG.append(dg.to_significant_figures(C))
            gasNames.append(request.gasAllNames[i])
            
    res = _build_seawater_dict(sw)
    res['concG'] = {'value': concG, 'units': request.reportingUnits, 'nice name': gasNames}
    return res

@app.post("/api/partial-pressure")
async def calculate_partial_pressure(request: PartialPressureRequest, api_key: str = Depends(get_api_key)):
    T, S, Patm = _convert_inputs(request)
    sw = dg.basicSeawaterProperties(T, S)
    
    gasNames = []
    PartialPressures = []
    totalP_atm = 0
    
    for i in range(len(request.gasAllConcs)):
        targetConc = float(request.gasAllConcs[i])
        # Get an initial guess from solubility curve
        _, _, pp_mf_Init = dg.getGasSolubility(request.gasAllNames[i], S, T, request.gasAllUnits[i])
        
        try:
            # Handle the initialization of the x0 array for scipy newton
            x0_init = 0.001 if isinstance(pp_mf_Init, float) and math.isnan(pp_mf_Init) else pp_mf_Init
            
            pp_mf = dg.newton(
                dg.newtonSolveForGasConc, 
                x0=x0_init, 
                args=(S, T, request.gasAllNames[i], request.gasAllUnits[i], targetConc),
                tol=1e-6, maxiter=50
            )
            totalP_atm += float(pp_mf) # Ensure numeric addition
            pp_units = dg.conv_MF_to_Units(pp_mf, request.reportingUnits)
            
            if pp_units is not None:
                PartialPressures.append(dg.to_significant_figures(float(pp_units)))
                gasNames.append(request.gasAllNames[i])
        except Exception as e:
            continue

    percentSat = 100 * totalP_atm / Patm if Patm > 0 else 0
    
    res = _build_seawater_dict(sw)
    res['partialP'] = {'value': PartialPressures, 'units': request.reportingUnits, 'nice name': gasNames}
    res['Saturation_Percent'] = {'value': dg.to_significant_figures(percentSat), 'units': '%', 'nice name': 'Gas Saturation'}
    return res
