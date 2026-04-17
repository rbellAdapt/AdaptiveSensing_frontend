"use client";

import { useState, useRef } from 'react';
import { SeawaterConditions, SeawaterState } from '../SeawaterConditions';
import { ResultsTable } from '../ResultsTable';
import { defaultSeawaterOnlyResults } from '../ResultsDefaults';
import dynamic from 'next/dynamic';

const LocationMap = dynamic(() => import('../LocationMap'), { ssr: false });

export default function SeawaterProperties() {
  const [seaState, setSeaState] = useState<SeawaterState>({
    temp: 10,
    tempUnits: '°C (ITS-90)',
    salt: 35,
    saltUnits: 'Salinity(PSS_78)',
    atmPress: 1.0,
    atmPressUnits: 'atm',
    latitude: 33.00,
    longitude: 162.50,
    press: 0
  });

  const [results, setResults] = useState<any>(defaultSeawaterOnlyResults);
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
      const payload = { ...seaState };

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';

      const res = await fetch(`${baseUrl}/bca-seawater`, {
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
        <h2 className="text-lg text-gray-400 font-sans">Seawater Properties and Dissolved Gas Calculator</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start w-full" onFocusCapture={wakeBackend}>
        <div className="flex flex-col items-center w-full max-w-[450px]">
          <SeawaterConditions 
            state={seaState} 
            onChange={setSeaState} 
            mode="seawater"
          />
          <LocationMap lat={seaState.latitude || 33} lng={seaState.longitude || 162.5} onLocationSelect={(lat, lng) => setSeaState(s => ({ ...s, latitude: parseFloat(lat.toFixed(4)), longitude: parseFloat(lng.toFixed(4)) }))} />
          <div className="text-[10px] text-gray-300 mt-2 max-w-[400px] text-left leading-tight">
            * Latitude contributes to a small gravitational term that affects depth conversions.<br/>
            * Latitude and longitude contribute to a very small compositional term that affects Absolute Salinity.
          </div>

          <div className="flex flex-col mt-4 w-full">
             <div className="flex flex-row justify-center">
               <button onClick={handleCalculate} disabled={loading} className="bg-cyan hover:bg-[#00cce6] text-[#0a0a0a] font-bold text-sm px-4 py-2 rounded shadow-sm transition-colors focus:outline-none w-48 disabled:opacity-50">
                 {loading ? 'Processing...' : 'Recalculate'}
               </button>
             </div>
             {error && <div className="text-red-400 mt-2 font-mono text-xs text-center w-full">ERROR: {error}</div>}
          </div>
        </div>

        <div className="w-full flex-grow">
           {results && <ResultsTable data={results} mode="seawater" />}
        </div>
      </div>

      <div className="mt-8 text-[11px] text-gray-400 max-w-4xl mx-auto leading-relaxed border-t border-gray-800 pt-6 px-4">
        <p className="mb-4">
          Gas calculations are based on solubilities determined using marine air and are subject to uncertainties derived from the determination of their actual atmospheric concentration. Assumed atmospheric dry partial pressures are adapted from NOAA:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 mb-4">
          <div>Nitrogen = 78.084 %</div>
          <div>Oxygen = 20.946 %</div>
          <div>Argon = 0.934 %</div>
          <div>Carbon dioxide = 0.042* %</div>
          <div>Neon = 18.182 ppmV</div>
          <div>Helium = 5.24 ppmV</div>
          <div>Methane = 1.92* ppmV</div>
          <div>Krypton = 1.14 ppmV</div>
          <div>Hydrogen = 0.55* ppmV</div>
          <div>Carbon Monoxide = 0.10* ppmV</div>
          <div>Xenon = 0.087 ppmV</div>
        </div>
        <p className="italic">*known to have considerable variability</p>
      </div>
    </div>
  );
}
