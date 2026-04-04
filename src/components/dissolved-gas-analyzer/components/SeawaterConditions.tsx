import React from 'react';

export interface SeawaterState {
  temp: number;
  tempUnits: string;
  salt: number;
  saltUnits: string;
  atmPress: number;
  atmPressUnits: string;
  latitude?: number;
  longitude?: number;
  press?: number;
}

interface SeawaterConditionsProps {
  state: SeawaterState;
  onChange: (state: SeawaterState) => void;
  reportingUnit?: string;
  onReportingUnitChange?: (val: string) => void;
  mode: 'conc' | 'fraction' | 'seawater';
}

export function SeawaterConditions({ state, onChange, reportingUnit, onReportingUnitChange, mode }: SeawaterConditionsProps) {
  const updateField = (field: keyof SeawaterState, value: string | number) => {
    onChange({ ...state, [field]: value });
  };

  return (
    <div className="w-full mt-4">
      <h2 className="text-xl font-sans font-bold text-white mb-2 text-center w-full max-w-[500px] border-b border-gray-800 pb-1">Inputs</h2>
      <table className="w-full max-w-[500px] text-sm border-collapse border border-gray-700 bg-gray-900/30">
        <colgroup>
          <col className="w-[140px]" />
          <col className="w-[110px]" />
          <col className="w-[190px]" />
        </colgroup>
        <thead>
          <tr className="bg-gray-800/80">
            <th className="border border-gray-700 p-1.5 text-left font-bold text-white">Conditions</th>
            <th className="border border-gray-700 p-1.5 text-left font-bold text-white">Value</th>
            <th className="border border-gray-700 p-1.5 text-left font-bold text-white">Unit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-700 p-1.5 text-gray-200">Temperature</td>
            <td className="border border-gray-700 p-0">
              <input type="number" step="any" className="w-full h-full bg-transparent p-1.5 border-none outline-none focus:ring-1 focus:ring-cyan text-cyan" value={state.temp} onChange={(e) => updateField('temp', parseFloat(e.target.value) || 0)} />
            </td>
            <td className="border border-gray-700 p-0">
              <select className="w-full h-full bg-transparent p-1.5 border-none outline-none focus:ring-1 focus:ring-cyan text-gray-300" value={state.tempUnits} onChange={(e) => updateField('tempUnits', e.target.value)}>
                <option value="°C (ITS-90)">°C (ITS-90)</option>
                <option value="fahrenheit">°F</option>
                <option value="kelvin">K</option>
              </select>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-700 p-1.5 text-gray-200">Dissolved Salts</td>
            <td className="border border-gray-700 p-0">
              <input type="number" step="any" className="w-full h-full bg-transparent p-1.5 border-none outline-none focus:ring-1 focus:ring-cyan text-cyan" value={state.salt} onChange={(e) => updateField('salt', parseFloat(e.target.value) || 0)} />
            </td>
            <td className="border border-gray-700 p-0">
              <select className="w-full h-full bg-transparent p-1.5 border-none outline-none focus:ring-1 focus:ring-cyan text-gray-300" value={state.saltUnits} onChange={(e) => updateField('saltUnits', e.target.value)}>
                <option value="Salinity(PSS_78)">Salinity (PSS-78)</option>
                <option value="IonicStrength(mol_kg_soln)">Ionic Strength (mol/kg-soln)</option>
                <option value="IonicStrength(mol_kg_H2O)">Ionic Strength (mol/kg-H2O)</option>
                <option value="Conductivity(mS_cm)">Conductivity (mS/cm)</option>
              </select>
            </td>
          </tr>
          {mode !== 'seawater' && (
            <tr>
              <td className="border border-gray-700 p-1.5 text-gray-200">Atm. Pressure</td>
              <td className="border border-gray-700 p-0">
                <input type="number" step="any" className="w-full h-full bg-transparent p-1.5 border-none outline-none focus:ring-1 focus:ring-cyan text-cyan" value={state.atmPress} onChange={(e) => updateField('atmPress', parseFloat(e.target.value) || 0)} />
              </td>
              <td className="border border-gray-700 p-0">
                <select className="w-full h-full bg-transparent p-1.5 border-none outline-none focus:ring-1 focus:ring-cyan text-gray-300" value={state.atmPressUnits} onChange={(e) => updateField('atmPressUnits', e.target.value)}>
                  <option value="Pa">Pa</option>
                  <option value="kPa">kPa</option>
                  <option value="hPa)">hPa</option>
                  <option value="atm">atm</option>
                  <option value="mbar">mbar</option>
                  <option value="inHg">inHg</option>
                </select>
              </td>
            </tr>
          )}
          {mode === 'seawater' && (
            <>
              <tr>
                <td className="border border-gray-700 p-1.5 text-gray-200">Hyd. Pressure</td>
                <td className="border border-gray-700 p-0">
                  <input type="number" step="any" className="w-full h-full bg-transparent p-1.5 border-none outline-none focus:ring-1 focus:ring-cyan text-cyan" value={state.press || 0} onChange={(e) => updateField('press', parseFloat(e.target.value) || 0)} />
                </td>
                <td className="border border-gray-700 p-1.5 text-gray-400 text-xs">dbar</td>
              </tr>
              <tr>
                <td className="border border-gray-700 p-1.5 text-gray-200">Latitude</td>
                <td className="border border-gray-700 p-0">
                  <input type="number" step="any" className="w-full h-full bg-transparent p-1.5 border-none outline-none focus:ring-1 focus:ring-cyan text-cyan" value={state.latitude || 0} onChange={(e) => updateField('latitude', parseFloat(e.target.value) || 0)} />
                </td>
                <td className="border border-gray-700 p-1.5 text-gray-400 text-xs">DD *</td>
              </tr>
              <tr>
                <td className="border border-gray-700 p-1.5 text-gray-200">Longitude</td>
                <td className="border border-gray-700 p-0">
                  <input type="number" step="any" className="w-full h-full bg-transparent p-1.5 border-none outline-none focus:ring-1 focus:ring-cyan text-cyan" value={state.longitude || 0} onChange={(e) => updateField('longitude', parseFloat(e.target.value) || 0)} />
                </td>
                <td className="border border-gray-700 p-1.5 text-gray-400 text-xs">DD *</td>
              </tr>
            </>
          )}
          {mode !== 'seawater' && (
            <tr>
               <td className="border border-gray-700 p-1.5 text-gray-200">Reporting Units</td>
               <td className="border border-gray-700 p-0"></td>
               <td className="border border-gray-700 p-0">
                   {mode === 'conc' ? (
                       <select className="w-full h-full bg-transparent p-1.5 border-none outline-none focus:ring-1 focus:ring-cyan text-gray-300" value={reportingUnit} onChange={(e) => onReportingUnitChange?.(e.target.value)}>
                           <option value="Mole Fraction">Mole Fraction</option>
                           <option value="Percent">%</option>
                           <option value="ppthv">ppthv (‰)</option>
                           <option value="ppmv">ppmv (μatm)</option>
                           <option value="ppbv">ppbv (natm)</option>
                           <option value="pptv">pptv</option>
                       </select>
                   ) : (
                       <select className="w-full h-full bg-transparent p-1.5 border-none outline-none focus:ring-1 focus:ring-cyan text-gray-300" value={reportingUnit} onChange={(e) => onReportingUnitChange?.(e.target.value)}>
                           <option value="molarity">molarity(µmol/L)</option>
                           <option value="molinity">molinity(µmol/kg-soln)</option>
                           <option value="molality">molality(µmol/kg-H2O)</option>
                           <option value="ppm">ppm(mg/kg-soln)</option>
                           <option value="ppb">ppb(µg/kg-soln)</option>
                           <option value="ppt">ppt(ng/kg-soln)</option>
                       </select>
                   )}
               </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
