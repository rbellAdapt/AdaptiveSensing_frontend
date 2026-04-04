"use client";

import { useState, useRef } from 'react';
import { SeawaterConditions, SeawaterState } from '../SeawaterConditions';
import { GasEntryTable, GasRow } from '../GasEntryTable';
import { ResultsTable } from '../ResultsTable';
import { defaultConcToGasResults } from '../ResultsDefaults';

export default function ConcToGas() {
  const [seaState, setSeaState] = useState<SeawaterState>({
    temp: 10,
    tempUnits: '°C (ITS-90)',
    salt: 35,
    saltUnits: 'Salinity(PSS_78)',
    atmPress: 101325,
    atmPressUnits: 'Pa'
  });

  const [gasRows, setGasRows] = useState<GasRow[]>([
    { name: 'N2', value: 513.6, unit: 'molarity' },
    { name: 'O2', value: 282, unit: 'molarity' },
    { name: 'Ar', value: 13.95, unit: 'molarity' },
    { name: 'CO2', value: 18.85, unit: 'molarity' },
    { name: 'CH4', value: 1.4878, unit: 'molarity' },
    { name: 'C2H6', value: 0.10863, unit: 'molarity' }
  ]);

  const [reportingUnits, setReportingUnits] = useState('Percent');
  const [results, setResults] = useState<any>(defaultConcToGasResults);
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
    wokeBackend.current = true; // no need to wake if calculating
    try {
      const payload = {
        ...seaState,
        reportingUnits,
        gasAllNames: gasRows.map(r => r.name),
        gasAllConcs: gasRows.map(r => r.value),
        gasAllUnits: gasRows.map(r => r.unit)
      };

      const baseUrl = '/api';

      const res = await fetch(`${baseUrl}/bca-partial-pressure-calculator`, {
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
        <h2 className="text-lg text-gray-400 font-sans">Aqueous Concentration &rarr; Partial Pressure</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start w-full" onFocusCapture={wakeBackend}>
        {/* INPUTS CONTAINER */}
        <div className="flex flex-col items-center w-full max-w-[450px]">
          <SeawaterConditions 
            state={seaState} 
            onChange={setSeaState} 
            reportingUnit={reportingUnits}
            onReportingUnitChange={setReportingUnits}
            mode="conc"
          />
          <GasEntryTable rows={gasRows} onChange={setGasRows} mode="conc" />

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
           {results && <ResultsTable data={results} mode="conc" />}
        </div>
      </div>
    </div>
  );
}
