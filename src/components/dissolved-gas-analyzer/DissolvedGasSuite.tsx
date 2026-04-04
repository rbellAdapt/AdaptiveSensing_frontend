"use client";

import { useState } from 'react';
import ConcToGas from './components/calculators/ConcToGas';
import GasToConc from './components/calculators/GasToConc';
import SeawaterProperties from './components/calculators/SeawaterProperties';
import SourcesModal from './components/SourcesModal';

export default function DissolvedGasSuite() {
  const [activeTab, setActiveTab] = useState<'concToGas' | 'gasToConc' | 'seawater'>('gasToConc');
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold font-sans text-white mb-4">Seawater Properties and Dissolved Gas Calculators</h1>
        <p className="text-xs text-gray-500 max-w-4xl leading-relaxed mb-4">
          Online calculators are provided by Beaver Creek Analytical, LLC on an "as is" basis. Users assume all risk associated with its use, and Beaver Creek Analytical, LLC expressly disclaims any and all liability for errors, inaccuracies, or any expenses or damages resulting from the use of or reliance upon the information provided by this calculator.
        </p>

        <div className="mt-1 mb-6 p-4 border border-cyan/20 bg-[#0C1B33]/60 shadow-sm max-w-3xl text-left text-xs text-gray-300 w-full">
          <p className="mb-2 text-cyan font-bold tracking-wide">SCIENTIFIC BOUNDARIES & LIMITATIONS</p>
          <p className="mb-2">This calculator uses equilibrium formulas from academic literature that were intended for use with:</p>
          <ul className="list-disc list-inside mb-3 ml-2 space-y-1 text-gray-400">
            <li>Atmosphere-like gas compositions</li>
            <li>Barometric pressure near 1 atm</li>
            <li>Temperature between 0 and 30°C</li>
            <li>Salinity between 0 and 40 psu</li>
          </ul>
          <p className="italic text-gray-400">
            Using input values that go beyond these ranges will generate extrapolations with increasing levels of uncertainty due to non-ideal effects. The calculator requires mindful use.
          </p>
        </div>

        <button 
          onClick={() => setIsSourcesOpen(true)}
          className="text-xs text-cyan hover:text-white underline decoration-cyan/50 hover:decoration-white underline-offset-4 transition-colors font-sans"
        >
          View Academic Sources & Literature
        </button>
      </div>

      <div className="flex flex-row justify-center mb-8 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('seawater')}
          className={`px-6 py-3 font-mono text-sm transition-colors duration-150 border-b-2 ${
            activeTab === 'seawater'
              ? 'border-cyan text-cyan'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
          }`}
        >
          Seawater Properties
        </button>
        <button
          onClick={() => setActiveTab('gasToConc')}
          className={`px-6 py-3 font-mono text-sm transition-colors duration-150 border-b-2 ${
            activeTab === 'gasToConc'
              ? 'border-cyan text-cyan'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
          }`}
        >
          Partial Pressure &rarr; Aqueous Concentration
        </button>
        <button
          onClick={() => setActiveTab('concToGas')}
          className={`px-6 py-3 font-mono text-sm transition-colors duration-150 border-b-2 ${
            activeTab === 'concToGas'
              ? 'border-cyan text-cyan'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
          }`}
        >
          Aqueous Concentration &rarr; Partial Pressure
        </button>
      </div>

      <div className="w-full flex-grow flex justify-center">
        {activeTab === 'seawater' && <SeawaterProperties />}
        {activeTab === 'gasToConc' && <GasToConc />}
        {activeTab === 'concToGas' && <ConcToGas />}
      </div>
      <SourcesModal isOpen={isSourcesOpen} onClose={() => setIsSourcesOpen(false)} />
    </div>
  );
}
