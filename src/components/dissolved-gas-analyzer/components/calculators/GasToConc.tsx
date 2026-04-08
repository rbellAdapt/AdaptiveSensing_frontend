"use client";

import { useState, useRef } from 'react';
import { SeawaterConditions, SeawaterState } from '../SeawaterConditions';
import { GasEntryTable, GasRow, GAS_OPTIONS } from '../GasEntryTable';
import { ResultsTable } from '../ResultsTable';
import { defaultGasToConcResults } from '../ResultsDefaults';
import { useAuthFunnel } from '@/components/AuthWrapper';

export default function GasToConc() {
  const { triggerPaywall } = useAuthFunnel();
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
  const [results, setResults] = useState<any>(defaultGasToConcResults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const wokeBackend = useRef(false);

  const wakeBackend = () => {
    if (!wokeBackend.current) {
      wokeBackend.current = true;
      const baseUrl = '/api';
      fetch(`${baseUrl}/`, { method: 'HEAD' }).catch(() => {});
    }
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    wokeBackend.current = true;
    try {
      // 1. Gateway Traffic Cop Ping (Rate Limit check)
      const gatewayRes = await fetch('/api/gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engine: 'gas_to_conc', parameters: {} })
      });
      if (gatewayRes.status === 429) {
        setLoading(false);
        triggerPaywall();
        return;
      }

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

      const payload = {
        ...seaState,
        reportingUnits,
        gasAllNames: [...allNames, balanceGas],
        moleFractions: [...scaledMoleFractions, remainingFraction]
      };

      const baseUrl = '/api';

      const res = await fetch(`${baseUrl}/bca-dissgas-calculator`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
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
          
          <GasEntryTable rows={gasRows} onChange={setGasRows} mode="fraction" />

          <div className="flex flex-col mt-4 w-full">
             <div className="flex flex-row justify-center">
               <button onClick={handleCalculate} disabled={loading} className="bg-cyan hover:bg-[#00cce6] text-[#0a0a0a] font-bold text-sm px-4 py-2 rounded shadow-sm transition-colors focus:outline-none w-48 disabled:opacity-50">
                 {loading ? 'Processing...' : 'Recalculate'}
               </button>
             </div>
             {error && <div className="text-red-400 mt-2 font-mono text-xs text-center w-full">ERROR: {error}</div>}
          </div>
        </div>

        {/* RESULTS CONTAINER */}
        <div className="w-full flex-grow">
           {results && <ResultsTable data={results} mode="fraction" />}
        </div>
      </div>
    </div>
  );
}
