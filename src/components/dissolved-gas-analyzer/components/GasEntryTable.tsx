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
  const [contextMenu, setContextMenu] = React.useState<{x: number, y: number, index: number} | null>(null);

  React.useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const updateRow = (index: number, field: keyof GasRow, val: string | number) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: val };
    onChange(newRows);
  };

  const insertRowBelow = () => {
    if (contextMenu === null) return;
    const newRows = [...rows];
    newRows.splice(contextMenu.index + 1, 0, { name: 'C2H6', value: 0.1, unit: mode === 'conc' ? 'molarity' : 'Percent' });
    onChange(newRows);
  };

  const deleteRow = () => {
    if (contextMenu === null) return;
    if (rows.length > 1) { 
      const newRows = [...rows];
      newRows.splice(contextMenu.index, 1);
      onChange(newRows);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, index });
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
            <tr key={i} onContextMenu={(e) => handleContextMenu(e, i)} className="hover:bg-gray-800/50 transition-colors">
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
      
      {contextMenu && (
        <div 
          className="fixed bg-white border border-gray-300 shadow-md z-[1000] flex flex-col w-[150px] text-[#0a0a0a]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <div className="p-2 cursor-pointer text-sm hover:bg-cyan/20 transition-colors" onClick={insertRowBelow}>
            Insert Row Below
          </div>
          <div className="p-2 cursor-pointer text-sm hover:bg-cyan/20 transition-colors" onClick={deleteRow}>
            Delete Row
          </div>
        </div>
      )}
    </div>
  );
}
