export const defaultSWResults = {
  "IS_Temp_C": {
    "value": 10,
    "units": "°C (ITS-90)",
    "nice name": "In-Situ Temperature"
  },
  "Pot_T_ITS90": {
    "value": 10.0,
    "units": "°C (ITS-90)",
    "nice name": "Potential Temperature"
  },
  "Cons_T_ITS90": {
    "value": 9.99,
    "units": "°C (ITS-90)",
    "nice name": "Conservative Temperature"
  },
  "Prac_Sal_psu": {
    "value": 35,
    "units": "PSU",
    "nice name": "Practical Salinity"
  },
  "Abs_Sal_g_kg": {
    "value": 35.17,
    "units": "g/kg",
    "nice name": "Absolute Salinity"
  },
  "IS_Density": {
    "value": 1027.0,
    "units": "kg/m^3",
    "nice name": "In Situ Density"
  },
  "Press_dbar": {
    "value": 0.0,
    "units": "dbar",
    "nice name": "Pressure"
  },
  "Depth_m": {
    "value": 0.0,
    "units": "m",
    "nice name": "Depth"
  },
  "VelofSound_m_s": {
    "value": 1490.0,
    "units": "m/s",
    "nice name": "Velocity of Sound"
  },
  "HeatCap_J_gK": {
    "value": 3.99,
    "units": "J/gK",
    "nice name": "Heat Capacity"
  },
  "Chlorinity_g_kg": {
    "value": 19.37,
    "units": "g/kg",
    "nice name": "Chlorinity"
  },
  "Ionic_strength_mol_kg_sw": {
    "value": 0.697,
    "units": "mol/kg-soln",
    "nice name": "Ionic Strength"
  },
  "VP_atm": {
    "value": 0.01188,
    "units": "atm",
    "nice name": "Vapor Pressure"
  },
  "N2sat_umol_kgsw": {
    "value": 514.0,
    "units": "μmol/kg-soln",
    "nice name": "Saturated N2"
  },
  "O2sat_umol_kgsw": {
    "value": 282.0,
    "units": "μmol/kg-soln",
    "nice name": "Saturated O2"
  },
  "Arsat_umol_kgsw": {
    "value": 13.9,
    "units": "μmol/kg-soln",
    "nice name": "Saturated Ar"
  },
  "Nesat_umol_kgsw": {
    "value": 0.00756,
    "units": "μmol/kg-soln",
    "nice name": "Saturated Ne"
  },
  "Hesat_umol_kgsw": {
    "value": 0.00179,
    "units": "μmol/kg-soln",
    "nice name": "Saturated He"
  },
  "Krsat_umol_kgsw": {
    "value": 0.00325,
    "units": "μmol/kg-soln",
    "nice name": "Saturated Kr"
  },
  "Xesat_umol_kgsw": {
    "value": 0.00047,
    "units": "μmol/kg-soln",
    "nice name": "Saturated Xe"
  },
  "CO2sat_umol_kgsw": {
    "value": 18.9,
    "units": "μmol/kg-soln",
    "nice name": "Saturated CO2"
  },
  "CH4sat_umol_kgsw": {
    "value": 0.00286,
    "units": "μmol/kg-soln",
    "nice name": "Saturated CH4"
  },
  "H2sat_umol_kgsw": {
    "value": 0.0004,
    "units": "μmol/kg-soln",
    "nice name": "Saturated H2"
  },
  "COsat_umol_kgsw": {
    "value": 0.0001,
    "units": "μmol/kg-soln",
    "nice name": "Saturated CO"
  }
};

export const defaultGasToConcResults = {
  ...defaultSWResults,
  concG: {
  "value": [
    282.0,
    13.95,
    18.85,
    1.487,
    0.1086,
    513.6
  ],
  "units": "molarity",
  "nice name": [
    "O2",
    "Ar",
    "CO2",
    "CH4",
    "C2H6",
    "N2"
  ]
}
};

export const defaultConcToGasResults = {
  ...defaultSWResults,
  partialP: {
  "value": [
    0.2095,
    0.009342,
    0.00042,
    0.0009999,
    4.999e-05,
    0.7797
  ],
  "units": "Mole Fraction",
  "nice name": [
    "O2",
    "Ar",
    "CO2",
    "CH4",
    "C2H6",
    "N2"
  ]
},
  Saturation_Percent: {
  "value": 100.0,
  "units": "%",
  "nice name": "Gas Saturation"
}
};

export const defaultSeawaterOnlyResults = defaultSWResults;
