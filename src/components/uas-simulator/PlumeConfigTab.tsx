'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';

export default function PlumeConfigTab({ isOpen, onToggle, gridConfig, onSimulationSuccess, disabled, suggestedReady }: { isOpen: boolean, onToggle: () => void, gridConfig: any, onSimulationSuccess: (data: any, config: any) => void, disabled: boolean, suggestedReady?: boolean }) {
  const [leakRate, setLeakRate] = useState(10.0);
  const [percentEthane, setPercentEthane] = useState(5.0);
  const [leakHeight, setLeakHeight] = useState(0.0);
  const [leakX, setLeakX] = useState(200);
  const [leakY, setLeakY] = useState(750);
  const [dispersionModel, setDispersionModel] = useState("gaussian");
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setLeakRate(10.0);
    setPercentEthane(5.0);
    setLeakHeight(0.0);
    setLeakX(200);
    setLeakY(750);
    setDispersionModel("gaussian");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || !gridConfig) return;
    setLoading(true);

    const payload: any = {
      grid_config: gridConfig,
      leak_rate_scfh: leakRate,
      percent_c2h6: percentEthane,
      leak_x: leakX,
      leak_y: leakY,
      leak_height: leakHeight,
      random_seed: Math.random()
    };

    try {
      const res = await fetch('/api/simulate/plume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      
      // Inject the backend UUID into the config payload so the Flight step can 
      // request the exact mathematically equivalent matrices from the stateless API cache
      if (data.plume_id) {
          payload.plume_id = data.plume_id;
      }
      
      onSimulationSuccess(data, payload);
    } catch (err) {
      console.error(err);
      alert("Error reaching Next.js gateway API.");
    }
    setLoading(false);
  };

  return (
    <div className={`bg-[#0d1117] text-[#b0c4de] rounded-xl border border-[#ffab00]/30 overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-opacity duration-300 ${disabled ? 'opacity-50 grayscale-[50%]' : 'opacity-100'}`}>
      <button 
        type="button" 
        onClick={() => { if (!disabled) onToggle(); }} 
        className={`w-full p-3 flex justify-between items-center transition-colors focus:outline-none ${disabled ? 'cursor-not-allowed' : 'hover:bg-[#ffab00]/5 cursor-pointer'}`}
      >
        <span className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ffab00]/20 text-[#ffab00] font-bold text-sm">2</span>
          <span className="text-lg font-bold text-[#b0c4de]">Natural Gas Leak Injection</span>
          {suggestedReady && !isOpen && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/50 rounded animate-pulse">
              Next Step
            </span>
          )}
          <span title="NOTE: Ensure your source coordinates fall within your defined grid bounds to visualize the plume.">
            <Info className="w-4 h-4 text-[#b0c4de] opacity-50 hover:opacity-100 cursor-help transition-opacity" />
          </span>
        </span>
        {isOpen ? <ChevronDown className="text-[#ffab00] w-5 h-5" /> : <ChevronRight className="text-[#ffab00] w-5 h-5" />}
      </button>

      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen && !disabled ? 'h-[620px] opacity-100' : 'h-0 opacity-0 pointer-events-none'}`}>
        <div className="p-4 pt-0 border-t border-[#ffab00]/10 border-dashed mt-2">

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">Leak Rate (SCFH)</label>
                <input type="number" min={0.1} max={1000} step="0.1" value={leakRate} onChange={(e) => setLeakRate(Number(e.target.value))} className="w-full bg-black/40 border border-[#ffab00]/30 rounded p-1.5 focus:ring-1 focus:ring-[#ffab00] focus:border-[#ffab00] outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">Ethane %</label>
                <input type="number" min={0} max={100} step="0.1" value={percentEthane} onChange={(e) => setPercentEthane(Number(e.target.value))} className="w-full bg-black/40 border border-[#ffab00]/30 rounded p-1.5 focus:ring-1 focus:ring-[#ffab00] focus:border-[#ffab00] outline-none transition-all text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">Leak Source Height (m)</label>
                <input type="number" min={0} max={50} step="0.1" value={leakHeight} disabled={true} onChange={(e) => setLeakHeight(Number(e.target.value))} className="w-full bg-black/40 border border-[#ffab00]/30 rounded p-1.5 focus:ring-1 focus:ring-[#ffab00] focus:border-[#ffab00] outline-none transition-all text-sm opacity-50 cursor-not-allowed" title="Locked to 0.0m for native physics inversion." />
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">Source X (m)</label>
                  <input type="number" min={0} max={1500} value={leakX} onChange={(e) => setLeakX(Number(e.target.value))} className="w-full bg-black/40 border border-[#ffab00]/30 rounded p-1.5 focus:ring-1 focus:ring-[#ffab00] focus:border-[#ffab00] outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">Source Y (m)</label>
                  <input type="number" min={0} max={1500} value={leakY} onChange={(e) => setLeakY(Number(e.target.value))} className="w-full bg-black/40 border border-[#ffab00]/30 rounded p-1.5 focus:ring-1 focus:ring-[#ffab00] focus:border-[#ffab00] outline-none transition-all text-sm" />
                </div>
              </div>
              <div className="col-span-2 border-t border-[#ffab00]/20 pt-3 mt-1">
                <label className="block text-[10px] text-[#ffab00] uppercase tracking-widest mb-1.5 font-bold">Plume Dispersion Model</label>
                <select value={dispersionModel} onChange={(e) => setDispersionModel(e.target.value)} className="w-full bg-black/60 border border-[#ffab00]/50 rounded py-2 px-2 focus:ring-1 focus:ring-[#ffab00] focus:border-[#ffab00] outline-none transition-all text-sm shadow-[0_0_10px_rgba(255,171,0,0.1)] appearance-none">
                  <option value="gaussian" className="bg-[#0d1117] text-white">Steady-State Gaussian Dispersion</option>
                  <option value="lagrangian" disabled className="italic bg-[#0d1117] text-slate-500 font-medium">Lagrangian Particle Dispersion Modeling</option>
                  <option value="cfd" disabled className="italic bg-[#0d1117] text-slate-500 font-medium">Computational Fluid Dynamics (CFD)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 w-full mt-2">
              <button type="button" onClick={handleReset} disabled={disabled} className="px-3 py-3 bg-black/40 text-[#b0c4de] text-[10px] sm:text-xs uppercase tracking-wider font-bold rounded border border-white/10 hover:bg-white/5 transition-all disabled:opacity-50 disabled:pointer-events-none">
                Reset
              </button>
              <button type="submit" disabled={loading || disabled} className="flex-1 px-6 py-3 bg-[#ffab00] text-[#0d1117] font-extrabold rounded shadow-[0_0_10px_rgba(255,171,0,0.4)] hover:shadow-[0_0_20px_rgba(255,171,0,0.7)] hover:bg-[#ffc107] transition-all disabled:opacity-50 disabled:pointer-events-none">
                {loading ? 'Dispersing Plume...' : 'Simulate Natural Gas Leak'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
