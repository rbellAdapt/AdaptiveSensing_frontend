"use client";

import { useState, useRef } from 'react';
import { SeawaterConditions, SeawaterState } from '../SeawaterConditions';
import { GasEntryTable, GasRow, GAS_OPTIONS } from '../GasEntryTable';
import { ResultsTable } from '../ResultsTable';
import { defaultGasToConcResults } from '../ResultsDefaults';
import OriginWaterModal, { OriginSeawaterState } from '../OriginWaterModal';

export default function GasToConc() {
  const [seaState, setSeaState] = useState<SeawaterState>({
    temp: 10,
    tempUnits: '°C (ITS-90)',
    salt: 35,
    saltUnits: 'Salinity(PSS_78)',
    atmPress: 101325,
    atmPressUnits: 'Pa'
  });

  const [gasRows, setGasRows] = useState<GasRow[]>([
    { name: 'O2', value: 20.946, unit: 'Percent' },
    { name: 'Ar', value: 0.934, unit: 'Percent' },
    { name: 'CO2', value: 420, unit: 'ppmv' },
    { name: 'CH4', value: 1000, unit: 'ppmv' },
    { name: 'C2H6', value: 50, unit: 'ppmv' }
  ]);

  const [reportingUnits, setReportingUnits] = useState('molarity');
  const [balanceGas, setBalanceGas] = useState('N2');

  const [systemType, setSystemType] = useState<'open' | 'closed'>('open');
  const [volWater, setVolWater] = useState(1.0);
  const [volGas, setVolGas] = useState(100); // ml
  const [numWashes, setNumWashes] = useState(1);
  const [isOriginModalOpen, setIsOriginModalOpen] = useState(false);
  const [originState, setOriginState] = useState<OriginSeawaterState>({
    temp: 20, tempUnits: 'celsius90',
    salt: 35, saltUnits: 'Salinity(PSS_78)',
    atmPress: 1, atmPressUnits: 'atm',
    gasFractions: {}
  });

  const [results, setResults] = useState<any>(defaultGasToConcResults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const wokeBackend = useRef(false);

  const wakeBackend = () => {
    if (!wokeBackend.current) {
      wokeBackend.current = true;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      fetch(`${baseUrl}/`, { method: 'HEAD' }).catch(() => {});
    }
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    wokeBackend.current = true;
    try {
      const allNames = gasRows.map(r => r.name);
      if (new Set(allNames).size !== allNames.length) {
         throw new Error("Duplicate gases found in the table. Please combine or rename them.");
      }
      
      const scaledMoleFractions = gasRows.map(r => {
        const value = r.value;
        const unit = r.unit || 'Percent';
        switch (unit) {
          case "Mole Fraction": return value;
          case "Percent": return value / 100;
          case "ppthv": return value / 1e3;
          case "ppmv": return value / 1e6;
          case "ppbv": return value / 1e9;
          case "pptv": return value / 1e12;
          default: return value;
        }
      });

      const totalFraction = scaledMoleFractions.reduce((sum, val) => sum + val, 0);
      const remainingFraction = 1.0 - totalFraction;
      
      if (remainingFraction < 0) {
        throw new Error(`Sum of all gas fractions exceeds 100% (Current Total: ${(totalFraction * 100).toFixed(2)}%).`);
      }
      
      if (allNames.includes(balanceGas)) {
        throw new Error(`Balance Gas (${balanceGas}) cannot also be listed as an explicit input. Please remove it from the table or pick a different balance gas.`);
      }

      const completeGasList = [...allNames, balanceGas];

      let waterInitialMoleFractions: (number|null)[] | undefined = undefined;
      let usedCustomOrigin = false;
      const mfs = completeGasList.map(gas => {
        const val = originState.gasFractions[gas];
        if (val !== undefined && val !== '') {
            usedCustomOrigin = true;
            return val as number;
        }
        return null;
      });
      if (usedCustomOrigin || originState.temp !== '' || originState.salt !== '' || originState.atmPress !== '') {
        waterInitialMoleFractions = usedCustomOrigin ? mfs : undefined;
      }

      const payload = {
        ...seaState,
        reportingUnits,
        gasAllNames: completeGasList,
        gasInputMoleFractions: [...scaledMoleFractions, remainingFraction],
        systemType: systemType,
        ...(systemType === 'closed' && {
            systemType: 'closed',
            volWaterLiters: volWater,
            volGasLiters: volGas / 1000, // convert mL to L
            numWashes: numWashes,
            // Origin states
            waterInitialTemp: originState.temp !== '' ? originState.temp : undefined,
            waterInitialTempUnits: originState.temp !== '' ? originState.tempUnits : undefined,
            waterInitialSalt: originState.salt !== '' ? originState.salt : undefined,
            waterInitialSaltUnits: originState.salt !== '' ? originState.saltUnits : undefined,
            waterInitialAtmPress: originState.atmPress !== '' ? originState.atmPress : undefined,
            waterInitialAtmPressUnits: originState.atmPress !== '' ? originState.atmPressUnits : undefined,
            waterInitialMoleFractions: waterInitialMoleFractions
        })
      };

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';

      const res = await fetch(`${baseUrl}/bca-gas-mixing`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('API Calculation Failed');
      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto text-white">
      <div className="text-center mb-2">
        <h2 className="text-lg text-gray-400 font-sans">Partial Pressure &rarr; Aqueous Concentration</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start w-full" onFocusCapture={wakeBackend}>
        {/* INPUTS CONTAINER */}
        <div className="flex flex-col items-center w-full max-w-[450px]">
          <SeawaterConditions 
            state={seaState} 
            onChange={setSeaState} 
            reportingUnit={reportingUnits}
            onReportingUnitChange={setReportingUnits}
            mode="fraction"
          />
          <div className="flex flex-row justify-between items-center w-full max-w-[500px] mt-4 mb-2 bg-gray-900/40 border border-gray-700/80 p-2">
            <span className="text-gray-300 text-sm font-bold pl-1 uppercase tracking-wide">Balance Gas</span>
            <select className="bg-[#122B4A] border border-cyan/40 text-cyan outline-none p-1.5 text-sm focus:ring-1 focus:ring-cyan transition-colors" value={balanceGas} onChange={e => setBalanceGas(e.target.value)}>
              {GAS_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <table className="w-full max-w-[500px] text-sm border-collapse border border-gray-700 bg-gray-800/80 mb-4 mt-2">
            <tbody>
              <tr>
                <td className="border border-gray-700 p-2 font-bold text-gray-200">System Type</td>
                <td className="border border-gray-700 p-0" colSpan={2}>
                  <select 
                    className="w-full h-full bg-transparent p-2 border-none outline-none focus:ring-1 focus:ring-cyan text-cyan font-bold" 
                    value={systemType} 
                    onChange={e => setSystemType(e.target.value as 'open'|'closed')}
                  >
                    <option value="open">Open (Constant Equil.)</option>
                    <option value="closed">Closed (Finite Volume)</option>
                  </select>
                </td>
              </tr>
              {systemType === 'closed' && (
                <>
                  <tr className="bg-[#1a2e45]">
                    <td className="border border-gray-700 p-2 text-gray-300">Water Volume</td>
                    <td className="border border-gray-700 p-0">
                      <input type="number" step="any" className="w-full h-full bg-transparent p-2 border-none outline-none focus:ring-1 focus:ring-cyan text-cyan" value={volWater} onChange={e => setVolWater(parseFloat(e.target.value)||0)} />
                    </td>
                    <td className="border border-gray-700 p-2 text-gray-400 text-xs">Liters</td>
                  </tr>
                  <tr className="bg-[#1a2e45]">
                    <td className="border border-gray-700 p-2 text-gray-300">Feed Gas Volume</td>
                    <td className="border border-gray-700 p-0">
                      <input type="number" step="any" className="w-full h-full bg-transparent p-2 border-none outline-none focus:ring-1 focus:ring-cyan text-cyan" value={volGas} onChange={e => setVolGas(parseFloat(e.target.value)||0)} />
                    </td>
                    <td className="border border-gray-700 p-2 text-gray-400 text-xs">mL</td>
                  </tr>
                  <tr className="bg-[#1a2e45]">
                    <td className="border border-gray-700 p-2 text-gray-300">Num Washes</td>
                    <td className="border border-gray-700 p-0">
                      <input type="number" step="any" className="w-full h-full bg-transparent p-2 border-none outline-none focus:ring-1 focus:ring-cyan text-cyan" value={numWashes} onChange={e => setNumWashes(parseFloat(e.target.value)||0)} />
                    </td>
                    <td className="border border-gray-700 p-2 text-gray-400 text-xs">Times</td>
                  </tr>
                  <tr className="bg-[#1a2e45]">
                    <td className="border border-gray-700 p-2 text-gray-300">Origin Water</td>
                    <td className="border border-gray-700 p-1 text-center" colSpan={2}>
                      <button onClick={() => setIsOriginModalOpen(true)} className="w-full text-xs bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-200 py-1.5 rounded transition">
                        Configure Initial Gases
                      </button>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
          
          <GasEntryTable rows={gasRows} onChange={setGasRows} mode="fraction" />

          <div className="flex flex-col mt-4 w-full">
             <div className="flex flex-row justify-center">
               <button onClick={handleCalculate} disabled={loading} className="bg-cyan hover:bg-[#00cce6] text-[#0a0a0a] font-bold text-sm px-4 py-2 rounded shadow-sm transition-colors focus:outline-none w-48 disabled:opacity-50 mt-2">
                 {loading ? 'Processing...' : 'Recalculate'}
               </button>
             </div>
             {error && <div className="text-red-400 mt-2 font-mono text-xs text-center w-full">ERROR: {error}</div>}
             
             <div className="w-full max-w-[450px] p-4 mt-8 bg-[#fffbe6] border-l-4 border-[#ffcc00] text-[13px] leading-relaxed text-[#555] shadow-md">
               <strong>Note:</strong> This calculator uses equilibrium formulas from academic literature that were intended for use with:
               <ul className="mt-1 pl-5 list-disc">
                   <li>Atmosphere-like gas compositions</li>
                   <li>Barometric pressure near 1 atm</li>
                   <li>Temperature between 0 and 30&deg;C</li>
                   <li>Salinity between 0 and 40 psu</li>
               </ul>
               Using input values that go beyond these ranges will generate extrapolations with increasing levels of uncertainty due to non-ideal effects. The calculator requires mindful use.
             </div>
          </div>
        </div>

        {/* RESULTS CONTAINER */}
        <div className="w-full flex-grow">
           {results && <ResultsTable data={results} mode="fraction" />}
        </div>
      </div>

      <OriginWaterModal 
        isOpen={isOriginModalOpen} 
        onClose={() => setIsOriginModalOpen(false)} 
        state={originState} 
        onChange={setOriginState} 
        activeGases={[...gasRows.map(r => r.name), balanceGas]}
      />
    </div>
  );
}
