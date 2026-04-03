'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';

export default function SensorConfigTab({ isOpen, onToggle, onSimulationSuccess, onPreviewUpdate, hitDetectionConfig, onHitDetectionUpdate, disabled, suggestedReady }: any) {
  const [gpsRate, setGpsRate] = useState(10.0);
  const [anemometerRate, setAnemometerRate] = useState(10.0);
  const [demoSeed, setDemoSeed] = useState(Math.random());
  const [gasRate, setGasRate] = useState(2.0);
  const [ch4Lod, setCh4Lod] = useState(10.0);
  const [c2h6Lod, setC2h6Lod] = useState(1.5);
  
  const [gpsJitter, setGpsJitter] = useState(1.0);
  const [windAngJitter, setWindAngJitter] = useState(5.0);
  const [windIntJitter, setWindIntJitter] = useState(0.2);

  const [detectionSigma, setDetectionSigma] = useState(hitDetectionConfig?.detection_sigma ?? 3.0);
  const [correlationWindow, setCorrelationWindow] = useState(hitDetectionConfig?.correlation_window ?? 20);

  const handleReset = () => {
    setGpsRate(10.0);
    setAnemometerRate(10.0);
    setDemoSeed(Math.random());
    setGasRate(2.0);
    setCh4Lod(10.0);
    setC2h6Lod(1.5);
    setGpsJitter(1.0);
    setWindAngJitter(5.0);
    setWindIntJitter(0.2);
    setDetectionSigma(3.0);
    setCorrelationWindow(20);
  };

  React.useEffect(() => {
    // Live UI sync for slider values
    if (onPreviewUpdate) {
      onPreviewUpdate({ 
        ch4_lod: ch4Lod, c2h6_lod: c2h6Lod,
        gps_jitter_m: gpsJitter, wind_ang_jitter_deg: windAngJitter, wind_int_jitter_ms: windIntJitter,
        random_seed: demoSeed
      });
    }
    
    // Auto-update the primary pipeline state to behave as a Live-Preview tab
    if (onSimulationSuccess && !disabled) {
      onSimulationSuccess({
        gps_hz: gpsRate,
        anemometer_hz: anemometerRate,
        gas_hz: gasRate,
        ch4_noise_std: ch4Lod / 3.0,
        c2h6_noise_std: c2h6Lod / 3.0,
        gps_jitter_m: gpsJitter,
        wind_ang_jitter_deg: windAngJitter,
        wind_int_jitter_ms: windIntJitter
      });
    }
    
    if (onHitDetectionUpdate && !disabled) {
      onHitDetectionUpdate({
        ...hitDetectionConfig,
        detection_sigma: detectionSigma,
        correlation_window: correlationWindow
      });
    }
  }, [ch4Lod, c2h6Lod, gpsRate, anemometerRate, gasRate, gpsJitter, windAngJitter, windIntJitter, detectionSigma, correlationWindow, demoSeed, onPreviewUpdate, onSimulationSuccess, onHitDetectionUpdate, disabled]);

  return (
    <div className={`bg-[#0d1117] text-[#b0c4de] rounded-xl border border-[#00e5ff]/30 overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-opacity duration-300 ${disabled ? 'opacity-50 grayscale-[50%]' : 'opacity-100'}`}>
      <button 
        type="button" 
        onClick={() => { if (!disabled) onToggle(); }} 
        className={`w-full p-3 flex justify-between items-center transition-colors focus:outline-none ${disabled ? 'cursor-not-allowed' : 'hover:bg-[#00e5ff]/5 cursor-pointer'} ${!suggestedReady && !isOpen && !disabled ? 'opacity-70' : ''}`}
      >
        <span className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00e5ff]/20 text-[#00e5ff] font-bold text-sm">3</span>
          <span className="text-lg font-bold text-[#b0c4de]">Sensor Payload</span>
          {suggestedReady && !isOpen && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/50 rounded animate-pulse">
              Next Step
            </span>
          )}
          <span title="INFO: Define standard Limit of Detection (LOD). The system simulates intrinsic hardware noise natively behind the scenes as LOD / 3σ.">
            <Info className="w-4 h-4 text-[#b0c4de] opacity-50 hover:opacity-100 cursor-help transition-opacity" />
          </span>
        </span>
        {isOpen ? <ChevronDown className="text-[#00e5ff] w-5 h-5" /> : <ChevronRight className="text-[#00e5ff] w-5 h-5" />}
      </button>

      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen && !disabled ? 'h-[620px] opacity-100' : 'h-0 opacity-0 pointer-events-none'}`}>
        <div className="p-4 pt-0 border-t border-[#00e5ff]/10 border-dashed mt-2">

          <form className="space-y-4">
            {/* 1. Chemical Sensor Group (Top Plot) */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-bold text-[#b0c4de] flex items-center gap-2 border-b border-white/10 pb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span> Chemical Sensor Array
              </h4>
              <div className="grid grid-cols-3 gap-x-3">
                <div className="bg-white/5 p-1.5 rounded border border-white/10">
                  <label className="block text-[10px] uppercase tracking-wider mb-1 font-semibold opacity-80 text-[#b0c4de]">Data Rate (Hz)</label>
                  <input type="number" min={0.1} max={10} step="0.1" value={gasRate} onChange={(e) => setGasRate(Number(e.target.value))} className="w-full bg-black/40 border border-white/20 rounded p-1.5 focus:ring-1 focus:ring-white/50 outline-none transition-all text-sm" />
                </div>
                <div className="bg-[#00e5ff]/5 p-1.5 rounded border border-[#00e5ff]/20">
                  <label className="block text-[10px] uppercase tracking-wider mb-1 font-semibold opacity-80 text-[#00e5ff]">CH4 LOD (ppb)</label>
                  <input type="number" min={0.1} max={100} step="0.1" value={ch4Lod} onChange={(e) => setCh4Lod(Number(e.target.value))} className="w-full bg-black/40 border border-[#00e5ff]/30 rounded p-1.5 focus:ring-1 focus:ring-[#00e5ff] outline-none transition-all text-sm" />
                </div>
                <div className="bg-[#ffab00]/5 p-1.5 rounded border border-[#ffab00]/20">
                  <label className="block text-[10px] uppercase tracking-wider mb-1 font-semibold opacity-80 text-[#ffab00]">C2H6 LOD (ppb)</label>
                  <input type="number" min={0.1} max={100} step="0.1" value={c2h6Lod} onChange={(e) => setC2h6Lod(Number(e.target.value))} className="w-full bg-black/40 border border-[#ffab00]/30 rounded p-1.5 focus:ring-1 focus:ring-[#ffab00] outline-none transition-all text-sm" />
                </div>
              </div>
            </div>

            {/* 2. Analytical Hit Logic Group (Upper-Middle Plot) */}
            <div className="space-y-3 pt-2">
               <h4 className="text-[10px] uppercase font-bold text-[#22c55e] flex items-center gap-2 border-b border-[#22c55e]/20 pb-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]/80"></span> Analytical Hit Logic
               </h4>
               <div className="grid grid-cols-2 gap-x-4 gap-y-3 bg-[#22c55e]/5 p-2 rounded border border-[#22c55e]/10">
                 <div>
                   <label className="block text-[9px] uppercase tracking-wider mb-1 font-semibold opacity-80 text-[#22c55e] cursor-help" title="Detection Threshold (σ). Increase: Fewer hits, only strong signals. Decrease: More hits, includes weaker fluctuations.">Detection Threshold (σ)</label>
                   <input type="number" step="0.1" value={detectionSigma} onChange={(e) => setDetectionSigma(Number(e.target.value))} className="w-full bg-black/40 border border-[#22c55e]/30 rounded p-1.5 focus:ring-1 focus:ring-[#22c55e] outline-none transition-all text-sm" />
                 </div>
                 <div>
                   <label className="block text-[9px] uppercase tracking-wider mb-1 font-semibold opacity-80 text-[#22c55e] cursor-help" title="Correlation Window. Increase: Flattens noise, requires longer sustained leaks. Decrease: Highly reactive to very brief, sharp spikes.">Correlation Window</label>
                   <input type="number" step="1" value={correlationWindow} onChange={(e) => setCorrelationWindow(Number(e.target.value))} className="w-full bg-black/40 border border-[#22c55e]/30 rounded p-1.5 focus:ring-1 focus:ring-[#22c55e] outline-none transition-all text-sm" />
                 </div>
               </div>
            </div>

            {/* 3. GPS Kinematics Group (Lower-Middle Plot) */}
            <div className="space-y-3 pt-2">
               <h4 className="text-[10px] uppercase font-bold text-[#10b981] flex items-center gap-2 border-b border-[#10b981]/20 pb-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]/80"></span> Location & Kinematics
               </h4>
               <div className="grid grid-cols-2 gap-x-3">
                 <div className="bg-white/5 p-1.5 rounded border border-white/10">
                   <label className="block text-[10px] uppercase tracking-wider mb-1 font-semibold opacity-80 text-[#b0c4de]">Data Rate (Hz)</label>
                   <input type="number" min={0.1} max={50} step="0.1" value={gpsRate} onChange={(e) => setGpsRate(Number(e.target.value))} className="w-full bg-black/40 border border-white/20 rounded p-1.5 focus:ring-1 focus:ring-white/50 outline-none transition-all text-sm" />
                 </div>
                 <div className="bg-[#10b981]/5 p-1.5 rounded border border-[#10b981]/20">
                   <label className="block text-[10px] uppercase tracking-wider mb-1 font-semibold opacity-80 text-[#10b981]" title="GPS Positional Variance">GPS Jitter (m)</label>
                   <input type="number" min={0} max={20} step="0.1" value={gpsJitter} onChange={(e) => setGpsJitter(Number(e.target.value))} className="w-full bg-black/40 border border-[#10b981]/30 rounded p-1.5 focus:ring-1 focus:ring-[#10b981] outline-none transition-all text-sm" />
                 </div>
               </div>
            </div>

            {/* 4. Anemometer Group (Bottom Plot) */}
            <div className="space-y-3 pt-2 mb-2">
               <h4 className="text-[10px] uppercase font-bold text-[#8b5cf6] flex items-center gap-2 border-b border-[#8b5cf6]/20 pb-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]/80"></span> Environmental Wind Vector
               </h4>
               <div className="grid grid-cols-3 gap-x-3">
                 <div className="bg-white/5 p-1.5 rounded border border-white/10">
                   <label className="block text-[10px] uppercase tracking-wider mb-1 font-semibold opacity-80 text-[#b0c4de]">Data Rate (Hz)</label>
                   <input type="number" min={0.1} max={50} step="0.1" value={anemometerRate} onChange={(e) => setAnemometerRate(Number(e.target.value))} className="w-full bg-black/40 border border-white/20 rounded p-1.5 focus:ring-1 focus:ring-white/50 outline-none transition-all text-sm" />
                 </div>
                 <div className="bg-[#8b5cf6]/5 p-1.5 rounded border border-[#8b5cf6]/20">
                   <label className="block text-[10px] uppercase tracking-wider mb-1 font-semibold opacity-80 text-[#8b5cf6]" title="Wind Direction Variance">Dir Jitter (°)</label>
                   <input type="number" min={0} max={90} step="0.5" value={windAngJitter} onChange={(e) => setWindAngJitter(Number(e.target.value))} className="w-full bg-black/40 border border-[#8b5cf6]/30 rounded p-1.5 focus:ring-1 focus:ring-[#8b5cf6] outline-none transition-all text-sm" />
                 </div>
                 <div className="bg-[#6366f1]/5 p-1.5 rounded border border-[#6366f1]/20">
                   <label className="block text-[10px] uppercase tracking-wider mb-1 font-semibold opacity-80 text-[#6366f1]" title="Wind Speed Variance">Spd Jitter (m/s)</label>
                   <input type="number" min={0.0} max={5.0} step="0.05" value={windIntJitter} onChange={(e) => setWindIntJitter(Number(e.target.value))} className="w-full bg-black/40 border border-[#6366f1]/30 rounded p-1.5 focus:ring-1 focus:ring-[#6366f1] outline-none transition-all text-sm" />
                 </div>
               </div>
            </div>
            
            <div className="flex gap-2 w-full mt-2">
              <button type="button" onClick={() => setDemoSeed(Math.random())} className="flex-1 px-3 py-3 bg-[#0d1117] text-[#00e5ff] text-[10px] sm:text-xs uppercase tracking-wider font-bold rounded border border-[#00e5ff]/30 hover:bg-[#00e5ff]/10 hover:border-[#00e5ff] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-[0_0_10px_rgba(0,229,255,0.1)]">
                Refresh Example Data
              </button>
              <button type="button" onClick={handleReset} disabled={disabled} className="flex-1 px-3 py-3 bg-black/40 text-[#b0c4de] text-[10px] sm:text-xs uppercase tracking-wider font-bold rounded border border-white/10 hover:bg-white/5 transition-all disabled:opacity-50 disabled:pointer-events-none">
                Reset to Defaults
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
