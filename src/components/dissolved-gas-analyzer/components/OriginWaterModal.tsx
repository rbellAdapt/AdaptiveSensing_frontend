"use client";

import { useEffect } from 'react';

export interface OriginSeawaterState {
  temp: number | '';
  tempUnits: string;
  salt: number | '';
  saltUnits: string;
  atmPress: number | '';
  atmPressUnits: string;
  gasFractions: Record<string, number | ''>;
}

interface OriginWaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: OriginSeawaterState;
  onChange: (state: OriginSeawaterState) => void;
  activeGases: string[];
}

const DEFAULT_ATMOSPHERIC_FRACTIONS: Record<string, number> = {
  O2: 0.20946,
  N2: 0.78084,
  Ar: 0.00934,
  CO2: 0.00042,
  CH4: 1.92e-6,
  C2H6: 0.1e-6,
  He: 5.24e-6,
  Ne: 18.18e-6,
  Kr: 1.14e-6,
  Xe: 0.087e-6,
  H2: 0.55e-6,
  CO: 0.10e-6
};

export default function OriginWaterModal({ isOpen, onClose, state, onChange, activeGases }: OriginWaterModalProps) {
  
  // Keep gasFractions in sync with activeGases
  useEffect(() => {
    if (!isOpen) return;
    
    let needsUpdate = false;
    const newFractions = { ...state.gasFractions };
    
    // Default new gases
    activeGases.forEach(gas => {
      if (newFractions[gas] === undefined) {
        newFractions[gas] = DEFAULT_ATMOSPHERIC_FRACTIONS[gas] || 0;
        needsUpdate = true;
      }
    });

    // Cleanup removed gases
    Object.keys(newFractions).forEach(key => {
      if (!activeGases.includes(key)) {
        delete newFractions[key];
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      onChange({ ...state, gasFractions: newFractions });
    }
  }, [isOpen, activeGases]);

  if (!isOpen) return null;

  const updateField = (field: keyof OriginSeawaterState, val: any) => {
    onChange({ ...state, [field]: val });
  };

  const updateGas = (gas: string, val: number | '') => {
    onChange({
      ...state,
      gasFractions: {
        ...state.gasFractions,
        [gas]: val
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#122B4A] border border-cyan/40 p-6 rounded-none w-full max-w-sm shadow-2xl relative text-left h-auto max-h-[85vh] overflow-y-auto">
        <h3 className="text-xl font-bold font-sans text-white mb-2">Origin Water Conditions</h3>
        <p className="text-xs text-gray-300 mb-4 border-b border-gray-700 pb-3">
          Set the initial properties where the water was sourced. (Blank assumes Chamber conditions).
        </p>

        <table className="w-full text-sm font-sans mb-4 border-collapse">
          <tbody>
            <tr>
              <td className="p-1 text-gray-200">Temp</td>
              <td className="p-1">
                <input 
                  type="number" 
                  step="any" 
                  placeholder="Auto"
                  className="w-full bg-gray-900 border border-gray-700 p-1 text-cyan outline-none focus:border-cyan"
                  value={state.temp} 
                  onChange={e => updateField('temp', e.target.value === '' ? '' : parseFloat(e.target.value))} 
                />
              </td>
              <td className="p-1">
                <select 
                  className="w-full bg-gray-900 border border-gray-700 p-1 text-gray-300 outline-none focus:border-cyan"
                  value={state.tempUnits} 
                  onChange={e => updateField('tempUnits', e.target.value)}
                >
                  <option value="celsius90">°C</option>
                  <option value="kelvin">K</option>
                  <option value="fahrenheit">°F</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="p-1 text-gray-200">Salt</td>
              <td className="p-1">
                <input 
                  type="number" 
                  step="any" 
                  placeholder="Auto"
                  className="w-full bg-gray-900 border border-gray-700 p-1 text-cyan outline-none focus:border-cyan"
                  value={state.salt} 
                  onChange={e => updateField('salt', e.target.value === '' ? '' : parseFloat(e.target.value))} 
                />
              </td>
              <td className="p-1">
                <select 
                  className="w-full bg-gray-900 border border-gray-700 p-1 text-gray-300 outline-none focus:border-cyan"
                  value={state.saltUnits} 
                  onChange={e => updateField('saltUnits', e.target.value)}
                >
                  <option value="Salinity(PSS_78)">PSU</option>
                  <option value="IonicStrength(mol_kg_H2O)">mol/kg-H2O</option>
                  <option value="Conductivity(mS_cm)">mS/cm</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="p-1 text-gray-200">Press</td>
              <td className="p-1">
                <input 
                  type="number" 
                  step="any" 
                  placeholder="Auto"
                  className="w-full bg-gray-900 border border-gray-700 p-1 text-cyan outline-none focus:border-cyan"
                  value={state.atmPress} 
                  onChange={e => updateField('atmPress', e.target.value === '' ? '' : parseFloat(e.target.value))} 
                />
              </td>
              <td className="p-1">
                <select 
                  className="w-full bg-gray-900 border border-gray-700 p-1 text-gray-300 outline-none focus:border-cyan"
                  value={state.atmPressUnits} 
                  onChange={e => updateField('atmPressUnits', e.target.value)}
                >
                  <option value="atm">atm</option>
                  <option value="Pa">Pa</option>
                  <option value="kPa">kPa</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="border-t border-gray-700 pt-3">
          <p className="text-xs font-bold text-gray-200 mb-2">Origin Gas Dry Fraction</p>
          <table className="w-full text-sm font-sans mb-4">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-1 text-left text-gray-300 font-normal">Gas</th>
                <th className="p-1 text-left text-gray-300 font-normal">Dry Mole Fraction</th>
              </tr>
            </thead>
            <tbody>
              {activeGases.map(gas => (
                <tr key={gas}>
                  <td className="p-1 text-cyan font-bold">{gas}</td>
                  <td className="p-1">
                    <input 
                      type="number" 
                      step="any"
                      placeholder="Atmospheric"
                      className="w-full bg-gray-900 border border-gray-700 p-1.5 text-cyan outline-none focus:border-cyan"
                      value={state.gasFractions[gas] !== undefined && state.gasFractions[gas] !== '' ? state.gasFractions[gas] : ''}
                      onChange={e => updateGas(gas, e.target.value === '' ? '' : parseFloat(e.target.value))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <button 
            onClick={onClose}
            className="bg-cyan hover:bg-[#00cce6] text-[#0a0a0a] font-bold text-sm px-5 py-2 rounded transition-colors focus:outline-none"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
