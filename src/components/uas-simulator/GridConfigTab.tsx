'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function GridConfigTab({ isOpen, onToggle, onSimulationSuccess }: { isOpen: boolean, onToggle: () => void, onSimulationSuccess: (data: any, config: any) => void }) {
  const [gridSize, setGridSize] = useState(1500);
  const [resolution, setResolution] = useState(2);
  const [measurementAlt, setMeasurementAlt] = useState(10);
  const [windSpeedKmh, setWindSpeedKmh] = useState(4.8);
  const [windDir, setWindDir] = useState(270);
  const [stabilityClass, setStabilityClass] = useState("E");
  const [ch4Mean, setCh4Mean] = useState(1950.0);
  const [ch4Std, setCh4Std] = useState(5.0);
  const [c2h6Mean, setC2h6Mean] = useState(1.5);
  const [c2h6Std, setC2h6Std] = useState(0.2);
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setGridSize(1500);
    setResolution(2);
    setMeasurementAlt(10);
    setWindSpeedKmh(4.8);
    setWindDir(270);
    setStabilityClass("E");
    setCh4Mean(1950.0);
    setCh4Std(5.0);
    setC2h6Mean(1.5);
    setC2h6Std(0.2);
  };

  const executeSimulation = async (isManual: boolean = false) => {
    setLoading(true);
    const config: any = {
      grid_size_xy: gridSize,
      grid_res_xy: resolution,
      measurement_altitude: measurementAlt,
      wind_speed_at_10m_mph: windSpeedKmh * 0.621371,
      wind_direction_deg: windDir,
      stability_class: stabilityClass,
      ch4_mean: ch4Mean, ch4_std: ch4Std,
      c2h6_mean: c2h6Mean, c2h6_std: c2h6Std
    };
    
    // Explicitly wipe the python caching hash on manual button presses
    // by altering the parameter serialization footprint
    if (isManual) {
        config.random_seed = Math.random();
    }

    try {
      const res = await fetch('/api/simulate/grid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      onSimulationSuccess(data, config);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeSimulation(true);
  };

  return (
    <div className="bg-[#0d1117] text-[#b0c4de] rounded-xl border border-[#00e5ff]/30 overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
      <button 
        type="button" 
        onClick={onToggle} 
        className="w-full p-3 flex justify-between items-center hover:bg-[#00e5ff]/5 transition-colors focus:outline-none"
      >
        <span className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00e5ff]/20 text-[#00e5ff] font-bold text-sm">1</span>
          <span className="text-lg font-bold text-[#b0c4de]">Background Airspace Grid</span>
        </span>
        {isOpen ? <ChevronDown className="text-[#00e5ff] w-5 h-5" /> : <ChevronRight className="text-[#00e5ff] w-5 h-5" />}
      </button>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'h-[620px] opacity-100' : 'h-0 opacity-0 pointer-events-none'}`}>
        <div className="p-4 pt-0 border-t border-[#00e5ff]/10 border-dashed mt-2">
          <form onSubmit={handleSubmit} className="space-y-3 pt-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">Grid Size (m)</label>
                <input type="number" value={gridSize} disabled className="w-full bg-black/40 border border-[#00e5ff]/20 rounded p-1.5 opacity-50 cursor-not-allowed outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">Resolution (m)</label>
                <input type="number" min={1} max={50} value={resolution} onChange={(e) => setResolution(Number(e.target.value))} className="w-full bg-black/40 border border-[#00e5ff]/20 rounded p-1.5 focus:ring-1 focus:ring-[#00e5ff] focus:border-[#00e5ff] outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">Measure Alt (m)</label>
                <input type="number" min={1} max={150} value={measurementAlt} onChange={(e) => setMeasurementAlt(Number(e.target.value))} className="w-full bg-black/40 border border-[#00e5ff]/20 rounded p-1.5 focus:ring-1 focus:ring-[#00e5ff] focus:border-[#00e5ff] outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">10m Wind (km/h)</label>
                <input type="number" min={1} max={200} step="0.1" value={windSpeedKmh} onChange={(e) => setWindSpeedKmh(Number(e.target.value))} className="w-full bg-black/40 border border-[#00e5ff]/20 rounded p-1.5 focus:ring-1 focus:ring-[#00e5ff] focus:border-[#00e5ff] outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">Wind Dir (deg)</label>
                <input type="number" min={0} max={359} value={windDir} onChange={(e) => setWindDir(Number(e.target.value))} className="w-full bg-black/40 border border-[#00e5ff]/20 rounded p-1.5 focus:ring-1 focus:ring-[#00e5ff] focus:border-[#00e5ff] outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">Stability Class</label>
                <select value={stabilityClass} onChange={(e) => setStabilityClass(e.target.value)} className="w-full bg-black/40 border border-[#00e5ff]/20 rounded p-1.5 focus:ring-1 focus:ring-[#00e5ff] focus:border-[#00e5ff] outline-none transition-all text-sm">
                  <option value="A">A - Very Unstable</option>
                  <option value="B">B - Moderately Unstable</option>
                  <option value="C">C - Slightly Unstable</option>
                  <option value="D">D - Neutral</option>
                  <option value="E">E - Slightly Stable</option>
                  <option value="F">F - Very Stable</option>
                </select>
              </div>

              {/* Ambient Background Section */}
              <div className="col-span-full mt-2 pt-2 border-t border-[#00e5ff]/20">
                 <h4 className="text-sm font-semibold opacity-90 mb-3 tracking-wider flex items-center text-[#ffab00]">
                   <ChevronRight className="w-4 h-4 mr-1 text-[#ffab00]" /> 
                   Ambient Noise Simulation
                 </h4>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">CH4 Mean (ppb)</label>
                      <input type="number" min={1800} max={3000} step={1.0} value={ch4Mean} onChange={(e) => setCh4Mean(Number(e.target.value))} className="w-full bg-black/40 border border-[#00e5ff]/20 rounded p-1.5 focus:ring-1 focus:ring-[#00e5ff] focus:border-[#00e5ff] outline-none transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">CH4 Noise ± (ppb)</label>
                      <input type="number" min={0.1} max={50} step={0.1} value={ch4Std} onChange={(e) => setCh4Std(Number(e.target.value))} className="w-full bg-black/40 border border-[#00e5ff]/20 rounded p-1.5 focus:ring-1 focus:ring-[#00e5ff] focus:border-[#00e5ff] outline-none transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">C2H6 Mean (ppb)</label>
                      <input type="number" min={0.0} max={100.0} step={0.1} value={c2h6Mean} onChange={(e) => setC2h6Mean(Number(e.target.value))} className="w-full bg-black/40 border border-[#00e5ff]/20 rounded p-1.5 focus:ring-1 focus:ring-[#00e5ff] focus:border-[#00e5ff] outline-none transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">C2H6 Noise ± (ppb)</label>
                      <input type="number" min={0.01} max={10.0} step={0.01} value={c2h6Std} onChange={(e) => setC2h6Std(Number(e.target.value))} className="w-full bg-black/40 border border-[#00e5ff]/20 rounded p-1.5 focus:ring-1 focus:ring-[#00e5ff] focus:border-[#00e5ff] outline-none transition-all text-sm" />
                    </div>
                 </div>
              </div>
            </div>
            <div className="flex gap-2 w-full mt-2">
              <button type="button" onClick={handleReset} disabled={loading} className="px-3 py-3 bg-black/40 text-[#b0c4de] text-[10px] sm:text-xs uppercase tracking-wider font-bold rounded border border-white/10 hover:bg-white/5 transition-all disabled:opacity-50 disabled:pointer-events-none">
                Reset
              </button>
              <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-[#00e5ff] text-[#0d1117] font-extrabold rounded shadow-[0_0_10px_rgba(0,229,255,0.4)] hover:shadow-[0_0_20px_rgba(0,229,255,0.7)] hover:bg-[#00b8cc] transition-all disabled:opacity-50 disabled:pointer-events-none">
                {loading ? 'Processing...' : 'Generate Background Grid'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
