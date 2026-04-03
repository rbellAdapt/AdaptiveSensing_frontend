import math
import gsw
import PyCO2SYS as pyco2
from scipy.optimize import newton

def to_significant_figures(x, sig=4):
    """Rounds a number to a specified number of significant figures."""
    if x == 0:
        return 0.0
    return round(x, sig - int(math.floor(math.log10(abs(x)))) - 1)

def I_from_PSS(sal, units=0):
    # OCADS - Guide to Best Practices for Ocean CO2 Measurements., 0.723 at S=35
    if units == 0:
        I = 0.019924 * sal  # I mol/kg-sw (0.697 @ 35)
    else:
        I = 19.924 * sal / (1000 - 1.005 * sal)  # I mol/kg-H2O (0.722 @ 35)
    return I

def calculate_water_vapor_pressure(sal, temp):
    result = pyco2.sys(
        par1=2200,  # Dummy value for DIC
        par2=8.1,  # Dummy value for Alkalinity
        par1_type=1,
        par2_type=2,
        salinity=sal,
        temperature=temp,
        pressure=0,
    )
    return 1 - result['vp_factor']

class basicSeawaterProperties:
    def __init__(self, t_ITS90, SP, p=0, lat=33, lon=162.5):
        self._lat = lat
        self._lon = lon
        self.IS_Temp_C = t_ITS90
        self.Prac_Sal_psu = SP
        self.Press_dbar = p
        
        self.Abs_Sal_g_kg = gsw.SA_from_SP(SP, p, lon, lat)
        self.Cons_T_ITS90 = gsw.CT_from_t(self.Abs_Sal_g_kg, t_ITS90, p)
        self.Pot_T_ITS90 = gsw.pt0_from_t(self.Abs_Sal_g_kg, t_ITS90, p)
        self.IS_Density = gsw.rho(self.Abs_Sal_g_kg, self.Cons_T_ITS90, p)
        self.Depth_m = gsw.z_from_p(p, lat) * -1.0
        self.VelofSound_m_s = gsw.sound_speed(self.Abs_Sal_g_kg, self.Cons_T_ITS90, p)
        self.HeatCap_J_gK = gsw.cp_t_exact(self.Abs_Sal_g_kg, t_ITS90, p)
        self.Chlorinity_g_kg = SP / 1.80655
        self.Ionic_strength_mol_kg_sw = I_from_PSS(SP)
        self.VP_atm = calculate_water_vapor_pressure(SP, t_ITS90)

def getConcinUnits(conc_umol_kg_soln, MW, sal, temp, units):
    CT = gsw.CT_from_t(sal, temp, 0)
    rho = gsw.rho(sal, CT, 0)
    match units:
        case 'molarity':
            return conc_umol_kg_soln * rho / 1000  # umol/L
        case 'molinity':
            return conc_umol_kg_soln               # umol/kg-soln
        case 'molality':
            mass_water = 1 - (sal / 1000)
            return conc_umol_kg_soln / mass_water  # umol/kg-H2O
        case 'ppm':
            mass_gas_ug = conc_umol_kg_soln * MW
            return mass_gas_ug / 1000              # mg/kg
        case 'ppb':
            return conc_umol_kg_soln * MW          # ug/kg
        case 'ppt':
            return conc_umol_kg_soln * MW * 1000   # ng/kg
        case _:
            return conc_umol_kg_soln

def getGasSolubility(gas, S, T, units='molarity', pp=-1):
    cT = (T + 273.15) / 100
    temp_S = math.log((298.15 - T) / (273.15 + T))
    
    if gas == 'N2':
        if pp == -1: pp = 0.78084
        MW = 28.0134
        A0, A1, A2, A3 = 6.42931, 2.92704, 4.32531, 4.69149
        B0, B1, B2 = -7.44129e-3, -8.02566e-3, -1.46775e-2
        conc_air = math.exp(A0 + A1 * temp_S + A2 * temp_S ** 2 + A3 * temp_S ** 3 + S * (B0 + B1 * temp_S + B2 * temp_S ** 2))
        conc_umol = conc_air * pp / 0.78084
        return getConcinUnits(conc_umol, MW, S, T, units), MW, pp
        
    elif gas == 'O2':
        if pp == -1: pp = 0.20946
        MW = 32.042
        A0, A1, A2, A3, A4, A5 = 5.80818, 3.20684, 4.11890, 4.93845, 1.01567, 1.41575
        B0, B1, B2, B3 = -7.01211E-3, -7.25958E-3, -7.93334E-3, -5.54491E-3
        C0 = -1.32412E-7
        conc_air = math.exp(A0 + A1 * temp_S + A2 * temp_S ** 2 + A3 * temp_S ** 3 + A4 * temp_S ** 4 + A5 * temp_S ** 5 + S * (B0 + B1 * temp_S + B2 * temp_S ** 2 + B3 * temp_S ** 3) + C0 * S ** 2)
        conc_umol = conc_air * pp / 0.20946
        return getConcinUnits(conc_umol, MW, S, T, units), MW, pp
        
    elif gas == 'Ar':
        if pp == -1: pp = 0.009340
        MW = 39.948
        A1, A2, A3, A4 = -227.460653433959, 305.434650897649, 180.527830535863, -27.9945029083721
        B1, B2, B3 = -0.0669421440955388, 0.0372006649453493, -0.00563641779045164
        C1 = -5.30324533250248e-06
        conc_air = math.exp(A1 + (A2 / cT) + (A3 * math.log(cT)) + (A4 * cT) + (S * (B1 + (B2 * cT) + (B3 * cT ** 2)) + C1 * S ** 2))
        conc_umol = 1e6 * conc_air * pp / 0.009340
        return getConcinUnits(conc_umol, MW, S, T, units), MW, pp
        
    elif gas == 'CO2':
        if pp == -1: pp = 420E-6
        MW = 44.0095
        result = pyco2.sys(par1=pp*1e6, par2=8.1, par1_type=4, par2_type=3, salinity=S, temperature=T, pressure=0)
        conc_umol = result['aqueous_CO2']
        return getConcinUnits(conc_umol, MW, S, T, units), MW, pp
        
    elif gas == 'He':
        if pp == -1: pp = 5.24E-6
        MW = 4.002602
        A1, A2, A3, A4 = -178.142418122215, 217.599100618858, 140.750628950247, -23.0195435350648
        B1, B2, B3 = -0.0381290952550472, 0.0191899028688744, -0.00268979859321689
        C1 = -2.55156518284938e-06
        conc_air = math.exp(A1 + (A2/cT) + (A3*math.log(cT)) + (A4*cT) + (S*(B1 + (B2*cT) + (B3*cT**2)) + C1*S**2))
        conc_umol = 1e6 * conc_air * pp / 5.24E-6
        return getConcinUnits(conc_umol, MW, S, T, units), MW, pp
        
    elif gas == 'CH4':
        if pp == -1: pp = 1.92E-6
        MW = 16.04
        T_K = T + 273.15
        A1, A2, A3, A4 = -415.2807, 596.8104, 379.2599, -62.0757
        B1, B2, B3 = -0.059160, 0.032174, -0.004844
        lnCstar = math.log(pp) + A1 + A2*(100/T_K) + A3*math.log(T_K/100) + A4*(T_K/100) + S*(B1 + B2*(T_K/100) + B3*((T_K/100)**2))
        conc_umol = math.exp(lnCstar)/1000
        return getConcinUnits(conc_umol, MW, S, T, units), MW, pp
        
    elif gas == 'H2':
        if pp == -1: pp = 0.55E-6
        MW = 2.01588
        T_K = T + 273.15
        A1, A2, A3, A4 = -320.3079, 459.7398, 299.2600, -49.3946
        B1, B2, B3 = -0.074474, 0.043363, -0.0067420
        lnCstar = math.log(pp) + A1 + A2*(100/T_K) + A3*math.log(T_K/100) + A4*(T_K/100) + S*(B1 + B2*(T_K/100) + B3*((T_K/100)**2))
        conc_umol = math.exp(lnCstar)/1000
        return getConcinUnits(conc_umol, MW, S, T, units), MW, pp

    # Handle fallback case
    return math.nan, math.nan, pp

def newtonSolveForGasConc(x, S, T, gas, units, targetConc):
    conc, _, _ = getGasSolubility(gas, S, T, units, x)
    return conc - targetConc

def conv_MF_to_Units(mf, units):
    match units:
        case "Mole Fraction": return mf
        case "Percent": return mf * 100
        case "ppthv": return mf * 1e3
        case "ppmv": return mf * 1e6
        case "ppbv": return mf * 1e9
        case "pptv": return mf * 1e12
        case _: return None
