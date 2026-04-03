'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';

export default function FlightConfigTab({ isOpen, onToggle, gridConfig, plumeConfig, sensorConfig, onSimulationSuccess, disabled, suggestedReady }: any) {
  const [startX, setStartX] = useState(100);
  const [startY, setStartY] = useState(100);
  const [cruiseSpeed, setCruiseSpeed] = useState(35.0);
  const [endurance, setEndurance] = useState(20);
  const [turnRadius, setTurnRadius] = useState(20.0);
  const [accelerationLmt, setAccelerationLmt] = useState(2.5);
  const [jerkLmt, setJerkLmt] = useState(5.0);
  const [searchMethod, setSearchMethod] = useState("zigzag_upwind");
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  const handleReset = () => {
    setStartX(100);
    setStartY(100);
    setCruiseSpeed(35.0);
    setEndurance(20);
    setTurnRadius(20.0);
    setAccelerationLmt(2.5);
    setJerkLmt(5.0);
    setSearchMethod("zigzag_upwind");
    setAnalyticsData(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || !gridConfig || !plumeConfig || !sensorConfig) return;
    
    const flightData = {
        start_x: startX,
        start_y: startY,
        cruise_speed_mps: cruiseSpeed / 3.6,
        endurance_s: endurance * 60,
        search_method: searchMethod,
        turn_radius_m: turnRadius,
        max_acceleration_mps2: accelerationLmt,
        max_jerk_mps3: jerkLmt,
        wind_direction_deg: gridConfig.wind_direction_deg,
        random_seed: Math.random()
    };
    
    try {
      setLoading(true);
      const response = await fetch('/api/simulate/flight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flightData)
      });
      const data = await response.json();
      setAnalyticsData(data);
      
      if (onSimulationSuccess) {
        onSimulationSuccess(flightData, data);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-[#0d1117] text-[#b0c4de] rounded-xl border border-green-500/30 overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-opacity duration-300 ${disabled ? 'opacity-50 grayscale-[50%]' : 'opacity-100'}`}>
      <button 
        type="button" 
        onClick={() => { if (!disabled) onToggle(); }} 
        className={`w-full p-3 flex justify-between items-center transition-colors focus:outline-none ${disabled ? 'cursor-not-allowed' : 'hover:bg-[#00e5ff]/5 cursor-pointer'} ${!suggestedReady && !isOpen && !disabled ? 'opacity-70' : ''}`}>
        <span className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400 font-bold text-sm">4</span>
          <span className="text-lg font-bold text-[#b0c4de]">Initial Pre-flight Plan</span>
          {suggestedReady && !isOpen && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/50 rounded animate-pulse">
              Next Step
            </span>
          )}
          <span title="INFO: Calculates optimal static Lawnmower path constrained by max operational endurance.">
            <Info className="w-4 h-4 text-[#b0c4de] opacity-50 hover:opacity-100 cursor-help transition-opacity" />
          </span>
        </span>
        {isOpen ? <ChevronDown className="text-green-400 w-5 h-5" /> : <ChevronRight className="text-green-400 w-5 h-5" />}
      </button>

      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen && !disabled ? 'h-[620px] opacity-100' : 'h-0 opacity-0 pointer-events-none'}`}>
        <div className="p-4 pt-0 border-t border-green-500/10 border-dashed mt-2">

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">Start X (m)</label>
                <input type="number" min={0} max={1500} value={startX} onChange={(e) => setStartX(Number(e.target.value))} className="w-full bg-black/40 border border-green-500/30 rounded p-1.5 focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">Start Y (m)</label>
                <input type="number" min={0} max={1500} value={startY} onChange={(e) => setStartY(Number(e.target.value))} className="w-full bg-black/40 border border-green-500/30 rounded p-1.5 focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">Cruise Speed (km/h)</label>
                <input type="number" min={1} max={150} step="0.1" value={cruiseSpeed} onChange={(e) => setCruiseSpeed(Number(e.target.value))} className="w-full bg-black/40 border border-green-500/30 rounded p-1.5 focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">Endurance (mins)</label>
                <input type="number" min={1} max={180} value={endurance} onChange={(e) => setEndurance(Number(e.target.value))} className="w-full bg-black/40 border border-green-500/30 rounded p-1.5 focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">Max Accel (m/s²)</label>
                <input type="number" min={0.5} max={10.0} step="0.5" value={accelerationLmt} onChange={(e) => setAccelerationLmt(Number(e.target.value))} className="w-full bg-black/40 border border-green-500/30 rounded p-1.5 focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">Max Jerk (m/s³)</label>
                <input type="number" min={0.5} max={20.0} step="0.5" value={jerkLmt} onChange={(e) => setJerkLmt(Number(e.target.value))} className="w-full bg-black/40 border border-green-500/30 rounded p-1.5 focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition-all text-sm" />
              </div>
              <div className="col-span-2 p-2 bg-black/20 rounded-lg border border-white/5 space-y-1">
                <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold opacity-80 text-green-400">
                  Cornering Radius (m)
                  <span title={`0m = Exact Motionless Pivots (Slow). >0m = Teardrop Arcs.\n[Min Radius to sustain Cruise Speed: ${Math.round(Math.pow(cruiseSpeed / 3.6, 2) / accelerationLmt)}m]`}>
                    <Info className="w-3.5 h-3.5 opacity-50 cursor-pointer" />
                  </span>
                </label>
                <input type="range" min={0} max={100} step={1} value={turnRadius} onChange={(e) => setTurnRadius(Number(e.target.value))} className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-green-500" />
                <div className="flex justify-between text-[10px] opacity-60 font-mono mt-1"><span className="text-white">{turnRadius} meters</span><span>{turnRadius === 0 ? '[Pivot Delay]' : '[Arc Sweep]'}</span></div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">Search Method</label>
                <select value={searchMethod} onChange={(e) => setSearchMethod(e.target.value)} className="w-full bg-black/40 border border-green-500/30 rounded p-1.5 focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition-all text-sm text-green-400">
                  <option value="lawnmower_downwind" className="bg-[#0d1117] text-green-400">Crosswind Lawnmower (Working Downwind)</option>
                  <option value="lawnmower_upwind" className="bg-[#0d1117] text-green-400">Crosswind Lawnmower (Working Upwind)</option>
                  <option value="zigzag_upwind" className="bg-[#0d1117] text-green-400">Upwind Zig-Zag (Tacking)</option>
                  <option value="spiral_outward" className="bg-[#0d1117] text-green-400">Archimedean Spiral (Expanding)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 w-full mt-2">
              <button type="button" onClick={handleReset} disabled={disabled} className="px-3 py-3 bg-black/40 text-[#b0c4de] text-[10px] sm:text-xs uppercase tracking-wider font-bold rounded border border-white/10 hover:bg-white/5 transition-all disabled:opacity-50 disabled:pointer-events-none">
                Reset
              </button>
              <button type="submit" disabled={loading || disabled} className="flex-1 px-6 py-3 bg-green-500 text-black font-extrabold rounded shadow-[0_0_10px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(34,197,94,0.7)] hover:bg-green-400 transition-all disabled:opacity-50 disabled:pointer-events-none">
                {loading ? 'Routing Pre-Flight Map...' : 'Plot UAV Route'}
              </button>
            </div>
            {analyticsData && analyticsData.flight_time_s !== undefined && (
              <div className="mt-4 p-3 bg-[#0d1117] border border-green-500/30 rounded-lg text-xs font-mono space-y-1">
                <div className="text-green-400 font-bold mb-1 uppercase tracking-wider text-[10px]">Kinematic Flight Profile Analytics</div>
                <div className="flex justify-between">
                  <span className="opacity-70">Total Flight Time:</span>
                  <span className="text-[#b0c4de]">{(analyticsData.flight_time_s / 60).toFixed(1)} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Crosswind Coverage (±45°):</span>
                  <span className="text-yellow-400 font-bold">{analyticsData.perp_flight_time_pct?.toFixed(1)}%</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
