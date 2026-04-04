export const defaultSeawaterResults = {
  'IS_Temp_C': { value: 10.0, units: '°C (ITS-90)', 'nice name': 'In-Situ Temperature' },
  'Pot_T_ITS90': { value: 10.0, units: '°C (ITS-90)', 'nice name': 'Potential Temperature' },
  'Cons_T_ITS90': { value: 9.99, units: '°C (ITS-90)', 'nice name': 'Conservative Temperature' },
  'Prac_Sal_psu': { value: 35.0, units: 'PSU', 'nice name': 'Practical Salinity' },
  'Abs_Sal_g_kg': { value: 35.17, units: 'g/kg', 'nice name': 'Absolute Salinity' },
  'IS_Density': { value: 1027.0, units: 'kg/m^3', 'nice name': 'In Situ Density' },
  'Chlorinity_g_kg': { value: 19.37, units: 'g/kg', 'nice name': 'Chlorinity' },
  'Ionic_strength_mol_kg_sw': { value: 0.697, units: 'mol/kg-soln', 'nice name': 'Ionic Strength' },
  'Press_dbar': { value: 0.0, units: 'dbar', 'nice name': 'Pressure' },
  'Depth_m': { value: 0.0, units: 'm', 'nice name': 'Depth' },
  'VelofSound_m_s': { value: 1490.0, units: 'm/s', 'nice name': 'Velocity of Sound' },
  'HeatCap_J_gK': { value: 3.99, units: 'J/gK', 'nice name': 'Heat Capacity' },
  'VP_atm': { value: 0.01188, units: 'atm', 'nice name': 'Vapor Pressure' }
};

export const defaultGasToConcResults = {
  ...defaultSeawaterResults,
  'concG': {
    value: [282.0, 13.95, 18.85, 1.487, 0.1086, 513.6],
    units: 'molarity',
    'nice name': ['O2', 'Ar', 'CO2', 'CH4', 'C2H6', 'N2']
  }
};

export const defaultConcToGasResults = {
  ...defaultSeawaterResults,
  'partialP': {
    value: [77.97, 20.95, 0.9342, 0.042, 0.1, 0.005],
    units: 'Percent',
    'nice name': ['N2', 'O2', 'Ar', 'CO2', 'CH4', 'C2H6']
  },
  "Saturation_Percent": {
    "value": 100.0,
    "units": "%",
    "nice name": "Gas Saturation"
  }
};

export const defaultSeawaterOnlyResults = {
  ...defaultSeawaterResults,
  'N2sat_umol_kgsw': { value: 514.0, units: 'μmol/kg-soln', 'nice name': 'Saturated N2' },
  'O2sat_umol_kgsw': { value: 282.0, units: 'μmol/kg-soln', 'nice name': 'Saturated O2' },
  'Arsat_umol_kgsw': { value: 13.9, units: 'μmol/kg-soln', 'nice name': 'Saturated Ar' },
  'CO2sat_umol_kgsw': { value: 18.9, units: 'μmol/kg-soln', 'nice name': 'Saturated CO2' }
};
