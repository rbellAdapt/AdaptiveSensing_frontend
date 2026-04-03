
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS extension
import numpy as np
from scipy.optimize import newton
import gsw
import PyCO2SYS as pyco2
import math


app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app


@app.route('/bca-seawater', methods=['POST'])
def get_seawater_properties():
    """
    Receives temperature, salinity, and pressure as arguments in a POST request,
    calculates seawater properties using the SeawaterProperties class, and
    returns the seawater object as a JSON response.
    """
    try:
        data = request.get_json()  # Get the JSON data from the request body
        temp = data['temp']
        sal = data['sal']
        press = data.get('press', 0)
        lat = data.get('latitude', 33)  # Provide a default latitude
        lon = data.get('longitude', 162.5)  # Provide a default latitude

        print(data)

        #### replace below ###
        # Create a SeawaterProperties object
        seawater = basicSeawaterProperties(temp, sal, press, lat, lon)
        #saturatedGases = SeawaterProperties.satGases(temp, sal, press, lat)
        print(seawater)

        # Convert seawater properties to a dictionary
        seawater_dict = {
            'IS_Temp_C': {'value': to_significant_figures(seawater.IS_Temp_C, 4), 'units': '°C (ITS-90)',
                          'nice name': 'In-Situ Temperature'},
            'Pot_T_ITS90': {'value': to_significant_figures(seawater.Pot_T_ITS90, 4), 'units': '°C (ITS-90)',
                            'nice name': 'Potential Temperature'},
            'Cons_T_ITS90': {'value': to_significant_figures(seawater.Cons_T_ITS90, 4), 'units': '°C (ITS-90)',
                             'nice name': 'Conservative Temperature'},
            'Prac_Sal_psu': {'value': to_significant_figures(seawater.Prac_Sal_psu, 4), 'units': 'PSU',
                             'nice name': 'Practical Salinity'},
            'Abs_Sal_g_kg': {'value': to_significant_figures(seawater.Abs_Sal_g_kg, 4), 'units': 'g/kg',
                             'nice name': 'Absolute Salinity'},
            'IS_Density': {'value': to_significant_figures(seawater.IS_Density, 4), 'units': 'kg/m^3',
                           'nice name': 'In Situ Density'},
            'Press_dbar': {'value': to_significant_figures(seawater.Press_dbar, 4), 'units': 'dbar',
                           'nice name': 'Pressure'},
            'Depth_m': {'value': to_significant_figures(seawater.Depth_m, 4), 'units': 'm', 'nice name': 'Depth'},
            'VelofSound_m_s': {'value': to_significant_figures(seawater.VelofSound_m_s, 4), 'units': 'm/s',
                               'nice name': 'Velocity of Sound'},
            'HeatCap_J_gK': {'value': to_significant_figures(seawater.HeatCap_J_gK, 4), 'units': 'J/gK',
                             'nice name': 'Heat Capacity'},
            'Chlorinity_g_kg': {'value': to_significant_figures(seawater.Chlorinity_g_kg, 4), 'units': 'g/kg',
                                'nice name': 'Chlorinity'},
            'Ionic_strength_mol_kg_sw': {'value': to_significant_figures(seawater.Ionic_strength_mol_kg_sw, 3),
                                         'units': 'mol/kg-soln',
                                         'nice name': 'Ionic Strength'},
            'VP_atm': {'value': to_significant_figures(seawater.VP_atm, 4), 'units': 'atm',
                       'nice name': 'Vapor Pressure'},
            'N2sat_umol_kgsw': {'value': to_significant_figures(seawater.N2sat_umol_kgsw, 3), 'units': 'μmol/kg-soln',
                                'nice name': 'Saturated N2'},
            'O2sat_umol_kgsw': {'value': to_significant_figures(seawater.O2sat_umol_kgsw, 3), 'units': 'μmol/kg-soln',
                                'nice name': 'Saturated O2'},
            'Arsat_umol_kgsw': {'value': to_significant_figures(seawater.Arsat_umol_kgsw, 3), 'units': 'μmol/kg-soln',
                                'nice name': 'Saturated Ar'},
            'Nesat_umol_kgsw': {'value': to_significant_figures(seawater.Nesat_umol_kgsw, 3), 'units': 'μmol/kg-soln',
                                'nice name': 'Saturated Ne'},
            'Hesat_umol_kgsw': {'value': to_significant_figures(seawater.Hesat_umol_kgsw, 3), 'units': 'μmol/kg-soln',
                                'nice name': 'Saturated He'},
            'Krsat_umol_kgsw': {'value': to_significant_figures(seawater.Krsat_umol_kgsw, 3), 'units': 'μmol/kg-soln',
                                'nice name': 'Saturated Kr'},
            'Xesat_umol_kgsw': {'value': to_significant_figures(seawater.Xesat_umol_kgsw, 2), 'units': 'μmol/kg-soln',
                                'nice name': 'Saturated Xe'},
            'CO2sat_umol_kgsw': {'value': to_significant_figures(seawater.CO2sat_umol_kgsw, 3), 'units': 'μmol/kg-soln',
                                 'nice name': 'Saturated CO2'},
            'CH4sat_umol_kgsw': {'value': to_significant_figures(seawater.CH4sat_umol_kgsw, 3), 'units': 'μmol/kg-soln',
                                 'nice name': 'Saturated CH4'},
            'H2sat_umol_kgsw': {'value': to_significant_figures(seawater.H2sat_umol_kgsw, 2), 'units': 'μmol/kg-soln',
                                'nice name': 'Saturated H2'},
            'COsat_umol_kgsw': {'value': to_significant_figures(seawater.COsat_umol_kgsw, 2), 'units': 'μmol/kg-soln',
                                'nice name': 'Saturated CO'}
        }

        #### replace above ###

        # Return the seawater object as a JSON response
        return jsonify(seawater_dict), 200  # 200 OK

    except Exception as e:
        return jsonify({'error': str(e)}), 400  # 400 Bad Request

@app.route('/bca-dissgas-calculator', methods=['POST'])
def get_dissovled_gas_calculator():
    """
    Receives temperature, salinity, and pressure as arguments in a POST request,
    calculates seawater properties using the SeawaterProperties class, and
    returns the seawater object as a JSON response.
    """
    try:
        data = request.get_json()  # Get the JSON data from the request body

        temp = float(data['temp'])
        tempUnit = data['tempUnits']
        
        salt = float(data['salt'])
        saltUnits = data['saltUnits']
        
        atmPress = float(data['atmPress'])
        atmpressUnits = data['atmPressUnits']
        
        reportingUnit = data['reportingUnits']
        
        moleFractions = data['moleFractions']
        gasAllNames = data['gasAllNames']



        #### Unit conversions  ####
        #convert Temp to celsius90
        T = 25.0
        match tempUnit:
            case '°C (ITS-90)':
                T=temp
            case 'celsius90':
                T = temp
            case 'fahrenheit':
                T = (temp - 32) * 5/9
            case 'kelvin':
                T = temp - 273.15
            case _:
                print("Invalid temp input")

        #convert salt to PSS78
        S = 35.0
        match saltUnits:
            case 'Salinity(PSS_78)':
                S = salt
            case 'IonicStrength(mol_kg_H2O)':
                S = 0.019924*salt
            case 'IonicStrength(mol_kg_soln)':
                S = 19.924*salt/(1000-1.005*salt)
            case 'Conductivity(mS_cm)':
                S = gsw.SP_from_C(salt,T,0)
            case _:
                print("Invalid salt input")

            # convert atmPress to atm
        Patm = 1.0

        match atmpressUnits:
            case 'Pa':
                Patm = atmPress/101325
            case 'kPa':
                Patm = atmPress/101.325
            case 'hPa)':
                Patm = atmPress/10.1325
            case 'atm':
                Patm = atmPress
            case 'mbar':
                Patm = atmPress/10.1325
            case 'inHg':
                Patm = atmPress/33.8639
            case _:
                print("Invalid atmPress input")


        # Create a SeawaterProperties object, defualt P, lat, lon
        seawater = basicSeawaterProperties(T, S)

        reportingUnit = data['reportingUnits']
        moleFractions = data['moleFractions']
        gasAllNames = data['gasAllNames']

        gasNames = []
        concG = []
        for i in range(len(moleFractions)):
            PatmG = float(moleFractions[i]) * (Patm)
            C,_,_ = solveForGasConc(S, T, gasAllNames[i], reportingUnit, PatmG)
            concG.append(to_significant_figures(C,4))
            gasNames.append(gasAllNames[i])

        # Convert seawater properties to a dictionary
        seawater_dict = {
            'IS_Temp_C': {'value': to_significant_figures(seawater.IS_Temp_C, 4), 'units': '°C (ITS-90)',
                          'nice name': 'In-Situ Temperature'},
            'Pot_T_ITS90': {'value': to_significant_figures(seawater.Pot_T_ITS90, 4), 'units': '°C (ITS-90)',
                            'nice name': 'Potential Temperature'},
            'Cons_T_ITS90': {'value': to_significant_figures(seawater.Cons_T_ITS90, 4), 'units': '°C (ITS-90)',
                             'nice name': 'Conservative Temperature'},
            'Prac_Sal_psu': {'value': to_significant_figures(seawater.Prac_Sal_psu, 4), 'units': 'PSU',
                             'nice name': 'Practical Salinity'},
            'Abs_Sal_g_kg': {'value': to_significant_figures(seawater.Abs_Sal_g_kg, 4), 'units': 'g/kg',
                             'nice name': 'Absolute Salinity'},
            'IS_Density': {'value': to_significant_figures(seawater.IS_Density, 4), 'units': 'kg/m^3',
                           'nice name': 'In Situ Density'},
            'Press_dbar': {'value': to_significant_figures(seawater.Press_dbar, 4), 'units': 'dbar',
                           'nice name': 'Pressure'},
            'Depth_m': {'value': to_significant_figures(seawater.Depth_m, 4), 'units': 'm', 'nice name': 'Depth'},
            'VelofSound_m_s': {'value': to_significant_figures(seawater.VelofSound_m_s, 4), 'units': 'm/s',
                               'nice name': 'Velocity of Sound'},
            'HeatCap_J_gK': {'value': to_significant_figures(seawater.HeatCap_J_gK, 4), 'units': 'J/gK',
                             'nice name': 'Heat Capacity'},
            'Chlorinity_g_kg': {'value': to_significant_figures(seawater.Chlorinity_g_kg, 4), 'units': 'g/kg',
                                'nice name': 'Chlorinity'},
            'Ionic_strength_mol_kg_sw': {'value': to_significant_figures(seawater.Ionic_strength_mol_kg_sw, 3),
                                         'units': 'mol/kg-soln',
                                         'nice name': 'Ionic Strength'},
            'VP_atm': {'value': to_significant_figures(seawater.VP_atm, 4), 'units': 'atm',
                       'nice name': 'Vapor Pressure'},
            'concG': {'value': concG, 'units': reportingUnit,
                        'nice name': gasNames},

        }


        # Return the seawater object as a JSON response
        return jsonify(seawater_dict), 200  # 200 OK

    except Exception as e:
        return jsonify({'error': str(e)}), 400  # 400 Bad Request


@app.route('/bca-partial-pressure-calculator', methods=['POST'])
def get_partial_pressure_calculator():

    try:
        data = request.get_json()  # Get the JSON data from the request body

        temp = float(data['temp'])
        tempUnit = data['tempUnits']

        salt = float(data['salt'])
        saltUnits = data['saltUnits']

        atmPress = float(data['atmPress'])
        atmpressUnits = data['atmPressUnits']

        #### Unit conversions  ####
        # convert Temp to celsius90
        T = 25
        match tempUnit:
            case '°C (ITS-90)':
                T = temp
            case 'celsius90':
                T = temp
            case 'fahrenheit':
                T = (temp - 32) * 5 / 9
            case 'kelvin':
                T = temp - 273.15
            case _:
                print("Invalid temp input")

        # convert salt to PSS78
        S = 35
        match saltUnits:
            case 'Salinity(PSS_78)':
                S = salt
            case 'IonicStrength(mol_kg_H2O)':
                S = 0.019924 * salt
            case 'IonicStrength(mol_kg_soln)':
                S = 19.924 * salt / (1000 - 1.005 * salt)
            case 'Conductivity(mS_cm)':
                S = gsw.SP_from_C(salt, T, 0)
            case _:
                print("Invalid salt input")

        # convert atmPress to atm
        Patm = 1.0
        match atmpressUnits:
            case 'Pa':
                Patm = atmPress / 101325
            case 'kPa':
                Patm = atmPress / 101.325
            case 'hPa)':
                Patm = atmPress / 10.1325
            case 'atm':
                Patm = atmPress
            case 'mbar':
                Patm = atmPress / 10.1325
            case 'inHg':
                Patm = atmPress / 33.8639
            case _:
                print("Invalid atmPress input")

        # Create a SeawaterProperties object
        seawater = basicSeawaterProperties(T, S)

        gasAllNames = data['gasAllNames']
        gasAllConcs = data['gasAllConcs']
        gasAllUnits = data['gasAllUnits']
        reportingUnit = data['reportingUnits']

        gasNames = []
        PartialPressures = []
        totalP_atm = 0
        for i in range(len(gasAllConcs)):

            _, _, pp_mf_Init = solveForGasConc(S, T, gasAllNames[i], gasAllUnits[i]) #get at value as initial guess
            targetConc = float(gasAllConcs[i])
            try:
                pp_mf, results = newton(
                    newtonSolveForGasConc,  # The function to solve
                    pp_mf_Init,  # The starting point for x
                    fprime=None,  # Ensure secant method is used (default)
                    args=(S, T, gasAllNames[i],gasAllUnits[i], targetConc),  # Tuple of *additional* fixed arguments
                    tol=1e-6,  # Optional: convergence tolerance
                    maxiter=50,  # Optional: max iterations
                    full_output=True  # Optional: get convergence result object
                )


                # if results.converged:
                #     print("\n--- Results ---")
                #     print(f"Solver converged successfully after {results.iterations} iterations.")
                #     print(f"Found root x = {pp_mf:.8f}")
                #
                #     # Verification: Plug the root back into the function with the parameters
                #     final_f_value = newtonSolveForGasConc(pp_mf, S, T, gasAllNames[i],gasAllUnits[i], targetConc)
                #     print(f"Verification: f(root, a, b, c) = {final_f_value:.3e} (should be close to 0)")
                # else:
                #     print("\n--- Results ---")
                #     # Handle cases where the solver might not converge
                #     print(f"Warning: Solver did not converge within {results.iterations} iterations.")
                #     print(f"Final estimate for x = {pp_mf:.8f}")  # 'root' contains the last value
                #     print(f"Convergence flag: {results.flag}")  # Reason for termination

                totalP_atm += pp_mf
                pp_units = conv_MF_to_Units(pp_mf, reportingUnit)
                PartialPressures.append(to_significant_figures(pp_units, 4))
                gasNames.append(gasAllNames[i])

            except Exception as e:
                # Catch potential errors during the process
                print(f"\nAn error occurred during the Newton calculation: {e}")

        percentSat = 100*totalP_atm/Patm

        # Convert seawater properties to a dictionary
        seawater_dict = {
            'IS_Temp_C': {'value': to_significant_figures(seawater.IS_Temp_C, 4), 'units': '°C (ITS-90)',
                          'nice name': 'In-Situ Temperature'},
            'Pot_T_ITS90': {'value': to_significant_figures(seawater.Pot_T_ITS90, 4), 'units': '°C (ITS-90)',
                            'nice name': 'Potential Temperature'},
            'Cons_T_ITS90': {'value': to_significant_figures(seawater.Cons_T_ITS90, 4), 'units': '°C (ITS-90)',
                             'nice name': 'Conservative Temperature'},
            'Prac_Sal_psu': {'value': to_significant_figures(seawater.Prac_Sal_psu, 4), 'units': 'PSU',
                             'nice name': 'Practical Salinity'},
            'Abs_Sal_g_kg': {'value': to_significant_figures(seawater.Abs_Sal_g_kg, 4), 'units': 'g/kg',
                             'nice name': 'Absolute Salinity'},
            'IS_Density': {'value': to_significant_figures(seawater.IS_Density, 4), 'units': 'kg/m^3',
                           'nice name': 'In Situ Density'},
            'Press_dbar': {'value': to_significant_figures(seawater.Press_dbar, 4), 'units': 'dbar',
                           'nice name': 'Pressure'},
            'Depth_m': {'value': to_significant_figures(seawater.Depth_m, 4), 'units': 'm', 'nice name': 'Depth'},
            'VelofSound_m_s': {'value': to_significant_figures(seawater.VelofSound_m_s, 4), 'units': 'm/s',
                               'nice name': 'Velocity of Sound'},
            'HeatCap_J_gK': {'value': to_significant_figures(seawater.HeatCap_J_gK, 4), 'units': 'J/gK',
                             'nice name': 'Heat Capacity'},
            'Chlorinity_g_kg': {'value': to_significant_figures(seawater.Chlorinity_g_kg, 4), 'units': 'g/kg',
                                'nice name': 'Chlorinity'},
            'Ionic_strength_mol_kg_sw': {'value': to_significant_figures(seawater.Ionic_strength_mol_kg_sw, 3),
                                         'units': 'mol/kg-soln',
                                         'nice name': 'Ionic Strength'},
            'VP_atm': {'value': to_significant_figures(seawater.VP_atm, 4), 'units': 'atm',
                       'nice name': 'Vapor Pressure'},
            'partialP': {'value': PartialPressures, 'units': reportingUnit,
                      'nice name': gasNames},
            'Saturation_Percent': {'value': to_significant_figures(percentSat, 3), 'units': '%',
                       'nice name': 'Gas Saturation'}
        }

        # Return the seawater object as a JSON response
        return jsonify(seawater_dict), 200  # 200 OK

    except Exception as e:
        return jsonify({'error': str(e)}), 400  # 400 Bad Request


########################################################
########################################################
##############  Non-Flask Functions  ###################
########################################################
########################################################

def newtonSolveForGasConc(x, S, T, gas, units='molarity', targetConc=0.01):
#def newtonSolveForGasConc(x, S, T):
    conc,_,_ = solveForGasConc(S, T, gas, units, x)
    test = conc-targetConc
    return test

def conv_MF_to_Units(mf, units):
    match units:
        case "Mole Fraction":
            moleFraction = mf
        case "Percent":
            moleFraction = mf * 100
        case "ppthv":
            moleFraction = mf * 1e3
        case "ppmv":
            moleFraction = mf * 1e6
        case "ppbv":
            moleFraction = mf * 1e9
        case "pptv":
            moleFraction = mf * 1e12
        case _:
            print(f"Unknown unit: {units}")
            return None
    return moleFraction

def solveForGasConc(S, T, gas, units='molarity', pp=-1):
    match gas:
        case 'N2':
            C, MW, pp = getN2(S, T, units, pp)
        case 'O2':
            C, MW, pp = getO2(S, T, units, pp)
        case 'Ar':
            C, MW, pp = getAr(S, T, units, pp)
        case 'CO2':
            C, MW, pp = getCO2(S, T, units, pp)
        case 'Ne':
            C, MW, pp = getNe(S, T, units, pp)
        case 'He':
            C, MW, pp = getHe(S, T, units, pp)
        case 'CH4':
            C, MW, pp = getCH4(S, T, units, pp)
        case 'Kr':
            C, MW, pp = getKr(S, T, units, pp)
        case 'H2':
            C, MW, pp = getH2(S, T, units, pp)
        case 'CO':
            C, MW, pp = getCO(S, T, units, pp)
        case 'Xe':
            C, MW, pp = getXe(S, T, units, pp)
        case 'C2H6':
            C, MW, pp = getC2H6(S, T, units, pp)
        case 'C3H8':
            C, MW, pp = getC3H8(S, T, units, pp)
        case 'nC4H10':
            C, MW, pp = getnC4H10(S, T, units, pp)
        case _:
            C, MW, pp = math.nan
            print("Invalid gas name input")
    return C, MW, pp

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


        # NOAA atm  https://www.noaa.gov/jetstream/atmosphere
        # Nitrogen	N2	78.084%
        # Oxygen	O2	20.946%
        # Argon	Ar	0.934%
        # Carbon dioxide	CO2	0.042%
        # Neon	Ne	18.182 parts per million
        # Helium	He	5.24 parts per million
        # Methane	CH4	1.92 parts per million
        # Krypton	Kr	1.14 parts per million
        # Hydrogen	H2	0.55 parts per million
        # Nitrous oxide	N2O	0.33 parts per million
        # Carbon monoxide	CO	0.10 parts per million
        # Xenon	Xe	0.09 parts per million
        # Ozone	O3	0.07 parts per million
        # Nitrogen dioxide	NO2	0.02 parts per million
        # Iodine	I2	0.01 parts per million

def calculate_water_vapor_pressure(sal, temp):

    """
    Calculates water vapor pressure in hPa (hectopascals) using the PyCO2SYS package.

    Args:
        temperature_C (float or array-like): Temperature in degrees Celsius.
        salinity (float or array-like): Salinity in PSU (practical salinity units).

    Returns:
        float or array-like: Water vapor pressure in hPa.
        :param ct:
        :param sa:
    """

    # PyCO2SYS requires input parameters to be in specific formats.
    # We are setting all other parameters to default values as they are not needed for this calculation.
    # The important parameter is temperature (temperature_C) and salinity.

    result = pyco2.sys(
        par1=2200,  # Dummy value for DIC (Dissolved Inorganic Carbon)
        par2=8.1,  # Dummy value for Alkalinity
        par1_type=1,  # DIC
        par2_type=2,  # Alkalinity
        salinity=sal,    # in PS
        temperature=temp,  #in C
        pressure=0,  # sea pressure in bar (default = 0), determines coeffeicints
    )
    # Water vapor pressure is returned in hPa
    vp_atm = 1-result['vp_factor']  #uses Weiss and Price 1980

    return vp_atm

def getN2(sal=35, temp = 10, units='molarity',pp=0.78084):
    # sal = practical salinity
    # temp = potential temperature
    #check: S=35, T=10, concN2 = 500.885
    # Roberta Hamme and Steve Emerson, 2004.
    # "The solubility of neon, nitrogen and argon in distilled water and seawater."
    # Deep - Sea Research.I, in press.
    if pp == -1:
        pp=0.78084

    MW = 28.0134
    temp_S = math.log((298.15 - temp) / (273.15 + temp))
    A0_n2 = 6.42931
    A1_n2 = 2.92704
    A2_n2 = 4.32531
    A3_n2 = 4.69149
    B0_n2 = -7.44129e-3
    B1_n2 = -8.02566e-3
    B2_n2 = -1.46775e-2
    conc_N2_air = math.exp(A0_n2 + A1_n2 * temp_S + A2_n2 * temp_S ** 2 + A3_n2 * temp_S ** 3 + sal * (
                B0_n2 + B1_n2 * temp_S + B2_n2 * temp_S ** 2))
    conc_umol_kg_soln = conc_N2_air * pp / (0.78084);
    #print(conc_N2)
    return getConcinUnits(conc_umol_kg_soln, MW, sal, temp, units), MW, pp

def getO2(sal=35, temp = 10, units='molarity',pp=0.20946):
    # sal = practical salinity
    # temp = potential temperature
    #check: S=35, T=10, concO2 = 274.647
    #Hernan E.Garcia and Louis I.Gordon, 1992.
    #"Oxygen solubility in seawater: Better fitting equations"
    #Limnology and Oceanography, 37, pp.1307 - 1312.
    #print(sal, temp)
    if pp == -1:
        pp = 0.20946
    temp_S = math.log((298.15 - temp) / (273.15 + temp))

    #Benson and Klause
    # A0_o2 = 5.80871
    # A1_o2 = 3.20291
    # A2_o2 = 4.17887
    # A3_o2 = 5.10006
    # A4_o2 = -9.86643e-2
    # A5_o2 = 3.80369
    # B0_o2 = -7.01577e-3
    # B1_o2 = -7.70028e-3
    # B2_o2 = -1.13864e-2
    # B3_o2 = -9.51519e-3
    # C0_o2 = -2.75915e-7
    MW = 32.042
    #Garcia and Gordon and
    A0_o2 = 5.80818
    A1_o2 = 3.20684
    A2_o2 = 4.11890
    A3_o2 = 4.93845
    A4_o2 = 1.01567
    A5_o2 = 1.41575
    B0_o2 = -7.01211E-3
    B1_o2 = -7.25958E-3
    B2_o2 = -7.93334E-3
    B3_o2 = -5.54491E-3
    C0_o2 = -1.32412E-7

    conc_O2_air = math.exp(
        A0_o2 + A1_o2 * temp_S + A2_o2 * temp_S ** 2 + A3_o2 * temp_S ** 3 + A4_o2 * temp_S ** 4 + A5_o2 * temp_S ** 5 + sal * (
                    B0_o2 + B1_o2 * temp_S + B2_o2 * temp_S ** 2 + B3_o2 * temp_S ** 3) + C0_o2 * sal ** 2);
    conc_umol_kg_soln = conc_O2_air * pp / (0.20946)
    return getConcinUnits(conc_umol_kg_soln, MW, sal, temp, units), MW, pp

def getHe(sal=35, temp = 10, units='molarity',pp=5.24E-6):
    # sal = practical salinity
    # temp = potential temperature

    #Jenkins, W.J.; Lott, D.E.;  Cahill, K.L.A  Determination of Atmospheric Helium, Neon, Argon,
    #Krypton, and Xenon Solubility Concentrations in Water and Seawater.Marine Chemistry
    #2019, 211, 94–107. https: // doi.org / 10.1016 / j.marchem.2019.03.007.
    # check: S=35, T=10, concHe =1.7401e-09
    if pp == -1:
        pp= 5.24E-6
    MW = 4.002602
    pAir = 5.24E-6
    A1 = -178.142418122215
    A2 = 217.599100618858
    A3 = 140.750628950247
    A4 = -23.0195435350648
    B1 = -0.0381290952550472
    B2 = 0.0191899028688744
    B3 = -0.00268979859321689
    C1 = -2.55156518284938e-06
    cT=(temp+273.15)/100
    conc_air_mol_kgsw=math.exp(A1 + (A2/cT) + (A3*math.log(cT)) + (A4*cT) + (sal*(B1 + (B2*cT) + (B3*cT**2)) + C1*sal**2))
    conc_umol_kg_soln = 1e6*conc_air_mol_kgsw * pp / (pAir)

    return getConcinUnits(conc_umol_kg_soln, MW, sal, temp, units), MW, pp

def getNe(sal=35, temp=10, units='molarity', pp=18.18E-6):
    # sal = practical salinity
    # temp = potential temperature

    # Jenkins, W.J.; Lott, D.E.;  Cahill, K.L.A  Determination of Atmospheric Helium, Neon, Argon,
    # Krypton, and Xenon Solubility Concentrations in Water and Seawater.Marine Chemistry
    # 2019, 211, 94–107. https: // doi.org / 10.1016 / j.marchem.2019.03.007.
    # check: S=35, T=10, concNe =4.5581e-10
    if pp == -1:
        pp = 18.18E-6
    MW = 20.1797
    pAir = 18.18E-6
    A1 = -274.132928963079
    A2 = 352.620094347304
    A3 = 226.967588583864
    A4 = -37.1339312820422
    B1 = -0.0638595791309239
    B2 = 0.0353257090137858
    B3 = -0.00532576556488480
    C1 = 1.28232880263714e-05
    cT = (temp + 273.15) / 100
    conc_air_mol_kgsw = math.exp(A1 + (A2 / cT) + (A3 * math.log(cT)) + (A4 * cT) + (
                sal * (B1 + (B2 * cT) + (B3 * cT ** 2)) + C1 * sal ** 2))
    conc_umol_kg_soln = 1e6*conc_air_mol_kgsw * pp / (pAir)
    #print(conc)
    return getConcinUnits(conc_umol_kg_soln, MW, sal, temp, units), MW, pp

def getAr(sal=35, temp=10, units='molarity', pp=0.934E-2):
    # sal = practical salinity
    # temp = potential temperature
    '''
    # Roberta Hamme and Steve Emerson, 2004.
    # "The solubility of neon, nitrogen and argon in distilled water and seawater."
    # Deep - Sea Research.I, in press.
    #check: S=35, T=10, concAr =13.4622
    temp_S = math.log((298.15 - temp) / (273.15 + temp))
    A0_ar = 2.79150
    A1_ar = 3.17609
    A2_ar = 4.13116
    A3_ar = 4.90379
    B0_ar = -6.96233e-3
    B1_ar = -7.66670e-3
    B2_ar = -1.16888e-2
    conc_Ar_air = math.exp(A0_ar + A1_ar * temp_S + A2_ar * temp_S ** 2 + A3_ar * temp_S ** 3 + sal * (
                B0_ar + B1_ar * temp_S + B2_ar * temp_S ** 2))
    conc_Ar = conc_Ar_air * pAr / (0.009340)
   '''

    # Jenkins, W.J.; Lott, D.E.;  Cahill, K.L.A  Determination of Atmospheric Helium, Neon, Argon,
    # Krypton, and Xenon Solubility Concentrations in Water and Seawater.Marine Chemistry
    # 2019, 211, 94–107. https: // doi.org / 10.1016 / j.marchem.2019.03.007.
    # check: S=35, T=10, concAr =1.3583e-05
    if pp == -1:
        pp = 0.009340
    MW = 39.948
    pAir = 0.934E-2
    A1 = -227.460653433959
    A2 = 305.434650897649
    A3 = 180.527830535863
    A4 = -27.9945029083721
    B1 = -0.0669421440955388
    B2 = 0.0372006649453493
    B3 = -0.00563641779045164
    C1 = -5.30324533250248e-06
    cT = (temp + 273.15) / 100
    conc_air_mol_kgsw = math.exp(A1 + (A2 / cT) + (A3 * math.log(cT)) + (A4 * cT) + (
                sal * (B1 + (B2 * cT) + (B3 * cT ** 2)) + C1 * sal ** 2))
    conc_umol_kg_soln = 1e6*conc_air_mol_kgsw * pp / (pAir)
    #print(conc)
    return getConcinUnits(conc_umol_kg_soln, MW, sal, temp, units), MW, pp

def getKr(sal=35, temp = 10, units='molarity', pp=1.14E-6):
    # sal = practical salinity
    # temp = potential temperature

    # Jenkins, W.J.; Lott, D.E.;  Cahill, K.L.A  Determination of Atmospheric Helium, Neon, Argon,
    # Krypton, and Xenon Solubility Concentrations in Water and Seawater.Marine Chemistry
    # 2019, 211, 94–107. https: // doi.org / 10.1016 / j.marchem.2019.03.007.
    # check: S=35, T=10, concKr =3.1609e-09
    if pp == -1:
        pp = 1.14E-6
    MW = 83.8015510357147
    pAir = 1.14E-6
    A1 = -122.469388594271
    A2 = 153.565432649999
    A3 = 70.1968887463088
    A4 = -8.52524113636318
    B1 = -0.0495215016763465
    B2 = 0.0244337262302711
    B3 = -0.00339678102979012
    C1 = 4.19207939247412e-06
    cT = (temp + 273.15) / 100
    conc_air_mol_kgsw = math.exp(A1 + (A2 / cT) + (A3 * math.log(cT)) + (A4 * cT) + (
            sal * (B1 + (B2 * cT) + (B3 * cT ** 2)) + C1 * sal ** 2))
    conc_umol_kg_soln = 1e6*conc_air_mol_kgsw * pp / (pAir)
    #print(conc)
    return getConcinUnits(conc_umol_kg_soln, MW, sal, temp, units), MW, pp

def getXe(sal=35, temp = 10, units='molarity', pp=0.087E-6):
    # sal = practical salinity
    # temp = potential temperature

    # Jenkins, W.J.; Lott, D.E.;  Cahill, K.L.A  Determination of Atmospheric Helium, Neon, Argon,
    # Krypton, and Xenon Solubility Concentrations in Water and Seawater.Marine Chemistry
    # 2019, 211, 94–107. https: // doi.org / 10.1016 / j.marchem.2019.03.007.
    # check: S=35, T=10, concXe =3.1609e-09
    if pp == -1:
        pp = 0.087E-6
    MW = 131.293650885779
    pAir = 0.087E-6
    A1 = -224.510005162027
    A2 = 292.823416268736
    A3 = 157.612654665811
    A4 = -22.6689453060253
    B1 = -0.0849150652946965
    B2 = 0.0479955558549531
    B3 = -0.00735946425813854
    C1 = 6.69291891637100e-06
    cT = (temp + 273.15) / 100
    conc_air_mol_kgsw = math.exp(A1 + (A2 / cT) + (A3 * math.log(cT)) + (A4 * cT) + (
            sal * (B1 + (B2 * cT) + (B3 * cT ** 2)) + C1 * sal ** 2))
    conc_umol_kg_soln = 1e6*conc_air_mol_kgsw * pp / (pAir)
    #print(conc)
    return getConcinUnits(conc_umol_kg_soln, MW, sal, temp, units), MW, pp

def getCO2(sal=35, temp = 10, units='molarity', pp=420E-6):
    # sal = practical salinity
    # temp = potential temperature
    #check t= 10, Sal = 35, pp = 420, conc = 18.358

    # PyCO2SYS requires input parameters to be in specific formats.
    # We are setting all other parameters to default values as they are not needed for this calculation.
    # The important parameter is temperature (temperature_C) and salinity.
    if pp == -1:
        pp = 420E-6
    MW = 44.0095
    result = pyco2.sys(
        par1=pp*1e6,  # Dummy value for pCO2 - in μatm,
        par2=8.1,  # Dummy value for pH
        par1_type=4,  # DIC
        par2_type=3,  # pH
        salinity=sal,  # in PS
        temperature=temp,  # in C
        pressure=0,  # sea pressure in bar (default = 0), determines coeffeicints
    )

    conc_umol_kg_soln = result['aqueous_CO2']  # μmol·kg−1
    #print (conc_umol_kg_soln)
    return getConcinUnits(conc_umol_kg_soln, MW, sal, temp, units), MW, pp

def getH2(sal=35, temp = 10, units='molarity', pp=0.55E-6):
    # sal = practical salinity
    # temp = potential temperature
    #pp NOAA = 0.55E-6
    #Wiesenburg, D.A.; Guinasso, N.L.Equilibrium Solubilities of Methane, Carbon Monoxide,
    # and Hydrogen in Water and SeaWater.J.Chem.Eng.Data, 1979, 24(4), 356–360. https: // doi.org / 10.1021 / je60083a006.
    #check: S=34<---!!, T=10, pp = 0.58E-6 <---!!!, concH2 =0.4121 nmol/kg-sw
    if pp == -1:
        pp = 0.55E-6
    MW = 2.01588
    fG = pp  # "mole fraction of gas (fG) in the dry atmosphere"
    A1 = -320.3079
    A2 = 459.7398
    A3 = 299.2600
    A4 = -49.3946
    B1 = -0.074474
    B2 = 0.043363
    B3 = -0.0067420
    T = temp + 273.15
    lnCstar = math.log(fG) + A1 + A2*(100/T) + A3*math.log(T/100) + A4*(T/100) + sal*(B1 + B2*(T/100) + B3*((T/100)**2)) # in nmol/kgsw
    conc_umol_kg_soln = math.exp(lnCstar)/1000
    #print(conc_umol_kgsw)
    return getConcinUnits(conc_umol_kg_soln, MW, sal, temp, units), MW, pp

def getCO(sal=35, temp = 10, units='molarity', pp=0.10E-6):
    # sal = practical salinity
    # temp = potential temperature
    #pp = 0.11E-6 NOAA
    #Wiesenburg, D.A.; Guinasso, N.L.Equilibrium Solubilities of Methane, Carbon Monoxide,
    # and Hydrogen in Water and SeaWater.J.Chem.Eng.Data, 1979, 24(4), 356–360. https: // doi.org / 10.1021 / je60083a006.
    #check: S=34<---!!, T=10, pp = 0.11E-6 <---!!!, concCO =0.1102 nmol/kg-sw
    if pp == -1:
        pp = 0.10E-6
    MW = 28.01048
    fG = pp  # "mole fraction of gas (fG) in the dry atmosphere"
    A1 = -175.6092
    A2 = 267.6796
    A3 = 161.0862
    A4 = -25.6218
    B1 = 0.046103
    B2 = -0.041767
    B3 = 0.0081890
    T = temp + 273.15
    lnCstar = math.log(fG) + A1 + A2*(100/T) + A3*math.log(T/100) + A4*(T/100) + sal*(B1 + B2*(T/100) + B3*((T/100)**2)) # in nmol/kgsw
    conc_umol_kg_soln = math.exp(lnCstar)/1000
    #print(conc_umol_kgsw)
    return getConcinUnits(conc_umol_kg_soln, MW, sal, temp, units), MW, pp


def getCH4_W(sal=35, temp = 10, units='molarity', pp=1.92E-6):
    # sal = practical salinity
    # temp = potential temperature
    #Wiesenburg, D.A.; Guinasso, N.L.Equilibrium Solubilities of Methane, Carbon Monoxide,
    #and Hydrogen in Water and SeaWater.J.Chem.Eng.Data, 1979, 24(4), 356–360. https: // doi.org / 10.1021 / je60083a006.
    # check: S=34 <---!!, T=10, pp = 1.41E-6 <---!!,  concCH4 =2.091 nmol/kg-sw
    if pp == -1:
        pp = 1.92E-6
    MW = 16.04246
    fG = pp # "mole fraction of gas (fG) in the dry atmosphere"
    A1 = -417.5053
    A2 = 599.8626
    A3 = 380.3636
    A4 = -62.0764
    B1 = -0.064236
    B2 = 0.034980
    B3 = -0.0052732
    T = temp + 273.15
    lnCstar = math.log(fG) + A1 + A2 * (100 / T) + A3 * math.log(T / 100) + A4 * (T / 100) + sal * (
                B1 + B2 * (T / 100) + B3 * ((T / 100) ** 2))  # in nmol/kgsw
    conc_umol_kg_soln = math.exp(lnCstar) / 1000
    #print(conc_umol_kgsw)
    return getConcinUnits(conc_umol_kg_soln, MW, sal, temp, units), MW, pp


def getCH4(sal=35, temp = 10, units='molarity', pp=1.92E-6):
    # sal = practical salinity
    # temp = potential temperature
    #check sal = 35, t = 10, pp = 1.92E-6, conc = 0.00278 umol_kgsw
    if pp == -1:
        pp = 1.92E-6
    MW = 16.04246
    A_IUPAC = np.array([-115.6477,155.5756, 65.2553, -6.1698])  #CRC Handbook, L. H. Gevantman, Solubility   of  Selected Gases in Water.In  CRC Handbook  of Chemistry and Physics, from IUPAC Solubility Data Series 27/28 (reviewed by Wiesenburg)
    k_morrison = np.array([0.153, 0.127, 0.111, 0.102])  # Morrison and Billett, The Salting-out of Non-Electrolytes. Part II. The Effect of Variation in Non-Electrolyte. J. Chem. Soc. 1952

    conc_umol_kg_soln = get_IUPAC_umol_kgsw(sal, temp, A_IUPAC, k_morrison, pp)
    #print(conc_umol_kgsw)
    return getConcinUnits(conc_umol_kg_soln, MW, sal, temp, units), MW, pp

def getC2H6(sal=35, temp = 10, units='molarity', pp=1E-6):
    # sal = practical salinity
    # temp = potential temperature
    #check sal = 35, t = 10, pp=1E-6, conc = 0.002116 umol_kgsw
    if pp == -1:
        pp = 1E-6
    MW = 30.06904
    A_IUPAC = np.array([-90.8225,126.9559, 34.7413, 0])  #CRC Handbook, L. H. Gevantman, Solubility   of  Selected Gases in Water.In  CRC Handbook  of Chemistry and Physics, from IUPAC Solubility Data Series 27/28 (reviewed by Wiesenburg)
    k_morrison = np.array([0.184, 0.162, 0.145, 0.135])  # Morrison and Billett, The Salting-out of Non-Electrolytes. Part II. The Effect of Variation in Non-Electrolyte. J. Chem. Soc. 1952

    conc_umol_kg_soln = get_IUPAC_umol_kgsw(sal, temp, A_IUPAC, k_morrison, pp)
    #print(conc_umol_kgsw)
    return getConcinUnits(conc_umol_kg_soln, MW, sal, temp, units), MW, pp

def getC3H8(sal=35, temp = 10, units='molarity', pp=1E-6):
    # sal = practical salinity
    # temp = potential temperature
    #check sal = 35, t = 10, pp = 1E-6, conc = 0.001718 umol_kgsw
    if pp == -1:
        pp = 1E-6
    MW = 44.09562
    A_IUPAC = np.array([-102.044,144.345, 39.474, 0])  #CRC Handbook, L. H. Gevantman, Solubility   of  Selected Gases in Water.In  CRC Handbook  of Chemistry and Physics, from IUPAC Solubility Data Series 27/28 (reviewed by Wiesenburg)
    k_morrison = np.array([0.216, 0.194, 0.178, 0.165])  # Morrison and Billett, The Salting-out of Non-Electrolytes. Part II. The Effect of Variation in Non-Electrolyte. J. Chem. Soc. 1952

    conc_umol_kg_soln = get_IUPAC_umol_kgsw(sal, temp, A_IUPAC, k_morrison, pp)
    #print(conc_umol_kgsw)
    return getConcinUnits(conc_umol_kg_soln, MW, sal, temp, units), MW, pp

def getnC4H10(sal=35, temp = 10, units='molarity', pp=1E-6):
    # sal = practical salinity
    # temp = potential temperature
    #check sal = 35, t = 10, pp=1E-6, conc = 0.00144259 umol_kgsw
    if pp == -1:
        pp = 1E-6
    MW = 58.12120
    A_IUPAC = np.array([-102.029,146.04, 38.7599, 0])  #CRC Handbook, L. H. Gevantman, Solubility   of  Selected Gases in Water.In  CRC Handbook  of Chemistry and Physics, from IUPAC Solubility Data Series 27/28 (reviewed by Wiesenburg)
    k_morrison = np.array([0.243, 0.217, 0.194, 0.176])  # Morrison and Billett, The Salting-out of Non-Electrolytes. Part II. The Effect of Variation in Non-Electrolyte. J. Chem. Soc. 1952

    conc_umol_kg_soln = get_IUPAC_umol_kgsw(sal, temp, A_IUPAC, k_morrison, pp)
    #print(conc_umol_kg_soln)

    return getConcinUnits(conc_umol_kg_soln, MW, sal, temp, units), MW, pp

def getConcinUnits(conc, mw, sal=35, t=25, units='molarity'):
    match units:
        case 'molarity':
            # µmol/L
            concOut = conc*gsw.rho(sal, t, 0)/1000  #mol/L = (mol/kg)*(kg/L)
        case 'molinity':
            # µmol/kg-soln
            concOut = conc
        case 'molality':
            #µmol/kg-H2O
            concOut = conc/(1 - (0.001005 * sal))
        case 'ppm':
            # mg/kg(ppm)
            concOut = conc*mw*0.001/(1 - (0.001005 * sal))
        case 'ppb':
            #µg / kg(ppb)
            concOut = conc*mw/(1 - (0.001005 * sal))
        case 'ppt':
            # ng / kg(ppt)
            concOut = conc*mw*1000/(1 - (0.001005 * sal))
        case _:
            concOut = conc
    return concOut


def get_IUPAC_umol_kgsw(sal, temp,A, k, pp):
    T1 = (temp + 273.15) / 100
    # CRC Handbook, L. H. Gevantman, Solubility   of  Selected Gases in Water.In  CRC Handbook  of Chemistry and Physics, from IUPAC Solubility Data Series 27/28 (reviewed by Wiesenburg)
    Kh = math.exp(A[0] + A[1] / T1 + A[2] * math.log(T1) + A[3] * T1)  # solubility in mol-gas/mol-H2O*atm
    gamma = getGamma(k, temp, sal)  # Determine activiey Coeffiecnt using saling out coeffeiinets
    conc_mol_molH2O = pp * (Kh / gamma)  # Henry's Law

    # units conversion
    conc_umol_kgH2O = 1000000*1000*conc_mol_molH2O/18.01528

    conc_umol_kgsw = conc_umol_kgH2O*(1 - (0.001005 * sal))   # OCADS - Guide to Best Practices for Ocean CO2 Measurements.
    return conc_umol_kgsw

def getGamma(k,temp, sal):
    # Morrison et al k determined in NaCl, or in SW terms, Ionic stength
    # Morrison and Billett, The Salting-out of Non-Electrolytes. Part II. The Effect of Variation in Non-Electrolyte. J. Chem. Soc. 1952
    #k = array of k valeus for a give T
    #T = the target T
    OneOverT_value = 1/(temp + 273.15)
    OneOverT = np.array([0.0035, 0.0033, 0.0031, 0.0029])
    k_value = np.polyval(np.polyfit(OneOverT, k, 3), OneOverT_value) # 0.158 at S=35
    I_mol_kg_H2O = 19.924 * sal / (1000 - 1.005 * sal)  # OCADS - Guide to Best Practices for Ocean CO2 Measurements., 0.723 at S=35
    gamma = 10 ** (I_mol_kg_H2O * k_value)  # Activy Coeffient, IUPAC 27/28 Solubility Data Series, Clever et al, 1987, pp 57: USE base 10

    return gamma

class basicSeawaterProperties:
    """
    A class to calculate and store seawater properties including depth and vapor pressure.
    """
    def __init__(self, temp, sal, press=0, lat=33,lon=162.5):
        """
        Initializes the SeawaterProperties object.
        Args:
            latitude (float or array-like): Latitude in decimal degrees.
            temp (float or array-like): In-situ temperature in degrees Celsius (ITS-90)
            salinity (float or array-like): Practical salinity (PSS-78).
            pressure_dbar (float or array-like, optional): Pressure in dbar (abs-10.1325)
        """
        self.longitude = lon
        self.latitude = lat
        self.IS_Temp_C = temp
        self.Prac_Sal_psu = sal
        self.Press_dbar = press
        self.Abs_Sal_g_kg = gsw.SA_from_SP(self.Prac_Sal_psu, self.Press_dbar, self.longitude, self.latitude)
        self.Cons_T_ITS90 = gsw.CT_from_t(self.Abs_Sal_g_kg, self.IS_Temp_C, self.Press_dbar)
        self.Pot_T_ITS90 = gsw.pt_from_CT(self.Abs_Sal_g_kg,self.Cons_T_ITS90)
        self.Depth_m = gsw.z_from_p(self.Press_dbar, self.latitude)
        self.VelofSound_m_s = gsw.sound_speed(self.Abs_Sal_g_kg, self.Cons_T_ITS90, self.Press_dbar)
        self.HeatCap_J_gK = gsw.cp_t_exact(self.Abs_Sal_g_kg, self.Cons_T_ITS90, self.Press_dbar) / 1000
        self.Chlorinity_g_kg =  self.Prac_Sal_psu/ 1.80655   #Wooster, W. S.,Lee, A. J., Dietrich, G., Deep-sea Res., 18, 321 (1969).
        self.Ionic_strength_mol_kg_sw = I_from_PSS(self.Prac_Sal_psu)
        self.IS_Density = gsw.rho(self.Abs_Sal_g_kg, self.Cons_T_ITS90, self.Press_dbar)
        self.VP_atm = calculate_water_vapor_pressure(sal, self.Pot_T_ITS90)
        self.N2sat_umol_kgsw,_,_ = getN2(sal, self.Pot_T_ITS90)
        self.O2sat_umol_kgsw,_,_ = getO2(sal, self.Pot_T_ITS90)
        self.Arsat_umol_kgsw,_,_ = getAr(sal, self.Pot_T_ITS90)
        self.Nesat_umol_kgsw,_,_ = getNe(sal, self.Pot_T_ITS90)
        self.Hesat_umol_kgsw,_,_ = getHe(sal, self.Pot_T_ITS90)
        self.Krsat_umol_kgsw,_,_ = getKr(sal, self.Pot_T_ITS90)
        self.Xesat_umol_kgsw,_,_ = getXe(sal, self.Pot_T_ITS90)
        self.CO2sat_umol_kgsw,_,_ = getCO2(sal, self.Pot_T_ITS90)
        self.H2sat_umol_kgsw,_,_ = getH2(sal, self.Pot_T_ITS90)
        self.COsat_umol_kgsw,_,_ = getCO(sal, self.Pot_T_ITS90)
        self.CH4sat_umol_kgsw,_,_ = getCH4(sal, self.Pot_T_ITS90)
        # self.C2H6sat_umol_kgsw = getC2H6(self, sal, self.Pot_T_ITS90)
        # self.C3H8sat_umol_kgsw = getC3H8(self, sal, self.Pot_T_ITS90)
        # self.nC4H10sat_umol_kgsw = getnC4H10(self, sal, self.Pot_T_ITS90)

if __name__ == '__main__':
    app.run(debug=True)
