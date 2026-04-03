'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Info, Cpu, Play } from 'lucide-react';

export default function AdaptiveConfigTab({ isOpen, onToggle, gridConfig, plumeConfig, sensorConfig, flightConfig, hitDetectionConfig, onConfigUpdate, disabled, suggestedReady }: any) {
  const [hitCountBeforeTrigger, setHitCountBeforeTrigger] = useState(2);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.75);

  const [coneFlexibility, setConeFlexibility] = useState(hitDetectionConfig?.cone_flexibility_multiplier !== undefined ? hitDetectionConfig.cone_flexibility_multiplier : 0.40);
  const [sourceMethod, setSourceMethod] = useState(hitDetectionConfig?.source_estimation_method || "optimizer");
  const [enableProximityClustering, setEnableProximityClustering] = useState(hitDetectionConfig?.enable_proximity_clustering ?? false);
  const [actionRoutine, setActionRoutine] = useState("pinpoint_and_verify");
  
  const [groupTimeThreshold, setGroupTimeThreshold] = useState(hitDetectionConfig?.group_time_threshold_sec ?? 10.0);
  const [groupRatioTolerance, setGroupRatioTolerance] = useState(hitDetectionConfig?.group_ratio_tolerance ?? 0.30);
  
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setHitCountBeforeTrigger(2);
    setConfidenceThreshold(0.75);
    setConeFlexibility(0.40);
    setSourceMethod("optimizer");
    setEnableProximityClustering(true);
    setActionRoutine("pinpoint_and_verify");
    setGroupTimeThreshold(10.0);
    setGroupRatioTolerance(0.30);
  };

  React.useEffect(() => {
    if (onConfigUpdate) {
      onConfigUpdate({
        hitCountBeforeTrigger,
        confidenceThreshold,
        coneFlexibility,
        sourceMethod,
        enableProximityClustering,
        actionRoutine,
        groupTimeThreshold,
        groupRatioTolerance
      });
    }
  }, [hitCountBeforeTrigger, confidenceThreshold, coneFlexibility, sourceMethod, enableProximityClustering, actionRoutine, groupTimeThreshold, groupRatioTolerance, onConfigUpdate]);

  return (
    <div className={`bg-[#0d1117] text-[#b0c4de] rounded-xl border border-purple-500/50 shadow-[0_4px_20px_rgba(168,85,247,0.2)] overflow-hidden transition-all duration-300 ${disabled ? 'opacity-50 grayscale-[50%]' : 'opacity-100'}`}>
      <button 
        type="button" 
        onClick={() => { if (!disabled) onToggle(); }} 
        className={`w-full p-3 flex justify-between items-center transition-colors focus:outline-none ${disabled ? 'cursor-not-allowed' : 'hover:bg-[#00e5ff]/5 cursor-pointer'}`}
      >
        <span className="flex items-center gap-3">
          <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/30 text-purple-400 font-bold text-sm`}><Play size={16} className="ml-1" /></span>
          <span className="text-lg font-bold text-[#b0c4de]">Adaptive Flight Plan</span>
          {suggestedReady && !isOpen && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/50 rounded animate-pulse">
              Next Step
            </span>
          )}
          <span title="A combined configuration profile. Defines how statistical algorithms classify gas encounters, and whether those discoveries execute autonomous mid-flight pathing overrides. By setting Routing Aggression to 0.0, the UAS will bypass autonomous overrides completely.">
            <Info className="w-4 h-4 text-[#b0c4de] opacity-50 hover:opacity-100 cursor-help transition-opacity" />
          </span>
        </span>
        {isOpen ? <ChevronDown className="text-[#00e5ff] w-5 h-5" /> : <ChevronRight className="text-[#00e5ff] w-5 h-5" />}
      </button>

      <div className={`transition-all duration-300 ease-in-out overflow-y-auto ${isOpen && !disabled ? 'h-[580px] opacity-100' : 'h-0 opacity-0 pointer-events-none'}`}>
        <div className={`p-3 pt-0 border-t border-purple-500/20 border-dashed mt-2`}>
          
          <div className="space-y-4 mt-3 w-full">

            {/* Container 1: Hit Assessment */}
            <div className="border border-white/10 bg-black/40 rounded-lg p-3 relative pt-4 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
              <div className="absolute -top-2 left-3 px-2 bg-[#0d1117] text-[10px] font-bold uppercase tracking-widest text-[#00e5ff] border border-white/10 rounded-sm">Hit Assessment</div>
              <div className="space-y-3">
                
                <div className="p-2 pb-1.5 bg-black/20 rounded border border-white/5 cursor-help" title="Limits scope of triggers. Scale: 0.1 (Reckless) to 1.0 (Strict)">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-purple-400">Confidence Threshold</label>
                    <span className="font-mono text-sm text-white">{confidenceThreshold.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" min="0.1" max="1.0" step="0.05" 
                    value={confidenceThreshold} 
                    onChange={(e) => setConfidenceThreshold(Number(e.target.value))} 
                    className="w-full h-2 bg-[#000000] shadow-[inset_0_2px_5px_rgba(0,0,0,1)] border border-[#00e5ff]/40 rounded-full appearance-none cursor-pointer accent-purple-500 hover:accent-[#00e5ff] transition-all" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 pb-1.5 bg-black/20 rounded border border-white/5 cursor-help" title="Max Gap (s). Increase: Merges neighboring pings. Decrease: Splits signals into discrete individual hits.">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-purple-400">Group Limit (s)</label>
                      <span className="font-mono text-sm text-white">{groupTimeThreshold}s</span>
                    </div>
                    <input 
                      type="range" min="1" max="30" step="1" 
                      value={groupTimeThreshold} 
                      onChange={(e) => setGroupTimeThreshold(Number(e.target.value))} 
                      className="w-full h-2 bg-[#000000] shadow-[inset_0_2px_5px_rgba(0,0,0,1)] border border-[#00e5ff]/40 rounded-full appearance-none cursor-pointer accent-purple-500 hover:accent-[#00e5ff] transition-all" 
                    />
                  </div>

                  <div className="p-2 pb-1.5 bg-black/20 rounded border border-white/5 cursor-help" title="Delta Ratio %. Increase: Groups hits easily even if gas signature drifts. Decrease: Requires strict gas signature matching to group.">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-purple-400">Gas Ratio Tol.</label>
                      <span className="font-mono text-sm text-white">{groupRatioTolerance.toFixed(2)}</span>
                    </div>
                    <input 
                      type="range" min="0.05" max="1.0" step="0.05" 
                      value={groupRatioTolerance} 
                      onChange={(e) => setGroupRatioTolerance(Number(e.target.value))} 
                      className="w-full h-2 bg-[#000000] shadow-[inset_0_2px_5px_rgba(0,0,0,1)] border border-[#00e5ff]/40 rounded-full appearance-none cursor-pointer accent-purple-500 hover:accent-[#00e5ff] transition-all" 
                    />
                  </div>
                </div>

                <div className="p-2 pb-1.5 bg-black/20 rounded border border-white/5 cursor-help" title="How loosely to scale the predicted boundaries. Scale: 0.1x (Strict Overlap) to 2.0x (Loose Grouping)">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-purple-400">Geometric Flex.</label>
                    <span className="font-mono text-sm text-white">{coneFlexibility.toFixed(2)}x</span>
                  </div>
                  <input 
                    type="range" min="0.1" max="2.0" step="0.05" 
                    value={coneFlexibility} 
                    onChange={(e) => setConeFlexibility(Number(e.target.value))} 
                    className="w-full h-2 bg-[#000000] shadow-[inset_0_2px_5px_rgba(0,0,0,1)] border border-[#00e5ff]/40 rounded-full appearance-none cursor-pointer accent-purple-500 hover:accent-[#00e5ff] transition-all" 
                  />
                </div>

              </div>
            </div>

            {/* Container 2: Adaptive Execution (Merged) */}
            <div className="border border-white/10 bg-black/40 rounded-lg p-3 relative pt-4 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] mt-3">
              <div className="absolute -top-2 left-3 px-2 bg-[#0d1117] text-[10px] font-bold uppercase tracking-widest text-[#00e5ff] border border-white/10 rounded-sm">Adaptive Execution</div>
              
              <div className="space-y-3">
                <div className="p-2 pb-1.5 bg-black/20 rounded border border-white/5 cursor-help" title="Scale: 1 (Instant Strike) to 4 (Scientific Consensus)">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-purple-400">Hits Before Intercept</label>
                    <span className="font-mono text-sm text-white">{hitCountBeforeTrigger} Hits</span>
                  </div>
                  <input 
                    type="range" min="1" max="4" step="1" 
                    value={hitCountBeforeTrigger} 
                    onChange={(e) => setHitCountBeforeTrigger(Number(e.target.value))} 
                    className="w-full h-2 bg-[#000000] shadow-[inset_0_2px_5px_rgba(0,0,0,1)] border border-[#00e5ff]/40 rounded-full appearance-none cursor-pointer accent-purple-500 hover:accent-[#00e5ff] transition-all" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Left Col: Action Routine */}
                  <div className="bg-black/20 rounded border border-white/5 p-2 shadow-[0_0_10px_rgba(0,229,255,0.02)]">
                    <label className="block text-[10px] text-[#00e5ff] uppercase tracking-widest mb-1 font-bold">Action Routine</label>
                    <select value={actionRoutine} onChange={(e) => setActionRoutine(e.target.value)} className="w-full bg-[#000000] border border-[#00e5ff]/40 rounded py-2 px-1 focus:ring-1 focus:ring-[#00e5ff] focus:border-[#00e5ff] outline-none transition-all text-xs shadow-[inset_0_2px_5px_rgba(0,0,0,1)] appearance-none cursor-pointer text-[#b0c4de]">
                      <option value="return_to_base" className="bg-[#0d1117] text-white">Return To Base</option>
                      <option value="circle_source" className="bg-[#0d1117] text-white">Orbit Source</option>
                      <option value="pinpoint_and_verify" className="bg-[#0d1117] text-white">Pinpoint & Verify</option>
                    </select>
                  </div>

                  {/* Right Col: Source Determination */}
                  <div className="bg-black/20 rounded border border-white/5 p-2 shadow-[0_0_10px_rgba(0,229,255,0.02)]">
                    <label className="block text-[10px] text-[#00e5ff] uppercase tracking-widest mb-1 font-bold">Source Method</label>
                    <select value={sourceMethod} onChange={(e) => setSourceMethod(e.target.value)} className="w-full bg-[#000000] border border-[#00e5ff]/40 rounded py-2 px-1 focus:ring-1 focus:ring-[#00e5ff] focus:border-[#00e5ff] outline-none transition-all text-xs shadow-[inset_0_2px_5px_rgba(0,0,0,1)] appearance-none cursor-pointer text-[#b0c4de]">
                      <option value="heuristic" className="bg-[#0d1117] text-white">Heuristic</option>
                      <option value="optimizer" className="bg-[#0d1117] text-white">Optimizer</option>
                      <option value="optimizer_with_mask" disabled className="bg-[#0d1117] text-white opacity-50">Mask Opt.</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 bg-black/20 rounded border border-white/5 shadow-[0_0_10px_rgba(0,229,255,0.02)]">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-purple-400">Proximity Clustering</label>
                  <div 
                     onClick={() => setEnableProximityClustering(!enableProximityClustering)}
                     className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${enableProximityClustering ? 'bg-purple-500' : 'bg-gray-600'}`}>
                     <div className={`w-4 h-4 rounded-full bg-white absolute top-[2px] shadow-sm transition-all ${enableProximityClustering ? 'left-[22px]' : 'left-[2px]'}`} />
                  </div>
                </div>

              </div>
            </div>

          </div>

            <div className="w-full mt-1 pt-3 border-t border-purple-500/20 border-dashed flex justify-end">
              <button 
                type="button" 
                onClick={handleReset} 
                disabled={disabled} 
                className="px-3 py-1.5 flex items-center justify-center bg-black/40 text-[#b0c4de] text-[10px] sm:text-xs uppercase tracking-wider font-bold rounded border border-white/10 hover:bg-white/5 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                Reset Defaults
              </button>
            </div>

          </div>
        </div>
      </div>
  );
}
