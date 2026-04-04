import React from 'react';

export interface GasRow {
  name: string;
  value: number; // Concentration or Mole Fraction
  unit?: string; // e.g. 'molarity', 'ppmv'
}

interface GasEntryTableProps {
  rows: GasRow[];
  onChange: (rows: GasRow[]) => void;
  mode: 'conc' | 'fraction'; 
}

export const GAS_OPTIONS = ['N2', 'O2', 'Ar', 'CO2', 'CH4', 'C2H6', 'C3H8', 'nC4H10', 'He', 'Ne', 'Kr', 'Xe', 'H2', 'CO'];
const CONC_UNITS = [
  { value: 'molarity', label: 'µmol/L (molarity)' },
  { value: 'molinity', label: 'µmol/kg-soln (molinity)' },
  { value: 'molality', label: 'µmol/kg-H2O (molality)' },
  { value: 'ppm', label: 'mg/kg (ppm)' },
  { value: 'ppb', label: 'µg/kg (ppb)' },
  { value: 'ppt', label: 'ng/kg (ppt)' }
];

const FRACTION_UNITS = [
  { value: 'Percent', label: 'Percent' },
  { value: 'Mole Fraction', label: 'Mole Fraction' },
  { value: 'ppthv', label: 'parts per thousand' },
  { value: 'ppmv', label: 'ppmv' },
  { value: 'ppbv', label: 'ppbv' },
  { value: 'pptv', label: 'pptv' }
];

export function GasEntryTable({ rows, onChange, mode }: GasEntryTableProps) {
  const updateRow = (index: number, field: keyof GasRow, val: string | number) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: val };
    onChange(newRows);
  };

  const addRow = () => {
    onChange([...rows, { name: 'C2H6', value: 0.1, unit: mode === 'conc' ? 'molarity' : 'Percent' }]);
  };

  const deleteRow = () => {
    if (rows.length > 1) { // Prevent deleting all rows
      onChange(rows.slice(0, rows.length - 1));
    }
  };

  return (
    <div className="w-full mt-4">
      <table className="w-full max-w-[500px] text-sm border-collapse border border-gray-700 bg-gray-900/30">
        <colgroup>
          <col className="w-[140px]" />
          <col className="w-[110px]" />
          <col className="w-[190px]" />
        </colgroup>
        <thead>
          <tr className="bg-gray-800/80">
            <th className="border border-gray-700 p-1.5 text-left font-bold text-white">Dry Gas Content</th>
            <th className="border border-gray-700 p-1.5 text-left font-bold text-white">Value</th>
            <th className="border border-gray-700 p-1.5 text-left font-bold text-white">Unit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="border border-gray-700 p-0">
                <select className="w-full h-full bg-transparent p-1.5 border-none outline-none focus:ring-1 focus:ring-cyan text-gray-300" value={row.name} onChange={(e) => updateRow(i, 'name', e.target.value)}>
                  {GAS_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </td>
              <td className="border border-gray-700 p-0">
                <input type="number" step="any" className="w-full h-full bg-transparent p-1.5 border-none outline-none focus:ring-1 focus:ring-cyan text-cyan" value={row.value} onChange={(e) => updateRow(i, 'value', parseFloat(e.target.value) || 0)} />
              </td>
              <td className="border border-gray-700 p-0">
                 {mode === 'conc' ? (
                   <select className="w-full h-full bg-transparent p-1.5 border-none outline-none focus:ring-1 focus:ring-cyan text-gray-300" value={row.unit || 'molarity'} onChange={(e) => updateRow(i, 'unit', e.target.value)}>
                     {CONC_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                   </select>
                 ) : (
                   <select className="w-full h-full bg-transparent p-1.5 border-none outline-none focus:ring-1 focus:ring-cyan text-gray-300" value={row.unit || 'Percent'} onChange={(e) => updateRow(i, 'unit', e.target.value)}>
                     {FRACTION_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                   </select>
                 )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="flex flex-row gap-3 mt-4 items-center max-w-[500px]">
        <button onClick={addRow} className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-3 py-1 rounded shadow-sm transition-colors border border-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan">
          Add Row
        </button>
        <button onClick={deleteRow} className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-3 py-1 rounded shadow-sm transition-colors border border-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan" disabled={rows.length <= 1}>
          Delete Row
        </button>
      </div>
    </div>
  );
}
