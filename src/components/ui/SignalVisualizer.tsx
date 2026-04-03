"use client";

import { useState, useEffect } from "react";
import DarkPlot from "./DarkPlot";
import { Activity } from "lucide-react";

export default function SignalVisualizer() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("Standard"); // "Standard" or "Gulp"

  const fetchSignal = async (currentMode: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/signal-to-noise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noise_level: 2.5,
          sampling_frequency: 100,
          mode: currentMode
        }),
      });
      const json = await res.json();
      
      setData([{
          x: json.time,
          y: json.waveform,
          type: "scatter",
          mode: "lines",
          name: "Sensor Output",
          line: { 
            color: currentMode === "Gulp" ? "#00E5FF" : "#e2e8f0", 
            width: 1 
          } 
      }]);
    } catch (e) {
      console.error("Failed to fetch Signal data.", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSignal(mode);
  }, [mode]);

  return (
    <div className="border border-slate-800 rounded-xl bg-[#0c0c0c] flex flex-col min-h-[200px] overflow-hidden">
      <div className="bg-slate-900/50 p-4 border-b border-slate-800 flex justify-between items-center flex-wrap gap-2">
         <div className="flex items-center space-x-2">
           <Activity className="h-5 w-5 text-cyan" />
           <h3 className="font-mono text-slate-300 text-sm">Signal-to-Noise Simulator</h3>
         </div>
         <div className="flex space-x-2 font-mono text-xs">
            <button 
                onClick={() => setMode("Standard")}
                className={`px-3 py-1 rounded transition-colors ${mode === "Standard" ? "bg-slate-700 text-white" : "bg-transparent border border-slate-700 text-slate-400 hover:text-slate-200"}`}
            >
                STANDARD
            </button>
            <button 
                onClick={() => setMode("Gulp")}
                className={`px-3 py-1 rounded transition-colors ${mode === "Gulp" ? "bg-cyan/20 border-cyan/50 border text-cyan" : "bg-transparent border border-slate-700 text-slate-400 hover:text-cyan"}`}
            >
                GULP MODE
            </button>
         </div>
      </div>
      <div className="flex-grow p-2 h-48">
        {data ? (
          <DarkPlot 
            data={data} 
            layout={{
                margin: { t: 10, r: 10, l: 30, b: 30 },
                xaxis: { title: "Time (s)", titlefont: {size: 10} },
                yaxis: { title: "Amplitude", titlefont: {size: 10}, range: [-5, 15] },
            }}
            config={{ staticPlot: true }} // Disables interactivity for a cleaner 'oscilloscope' feel
          />
        ) : null}
      </div>
    </div>
  );
}
