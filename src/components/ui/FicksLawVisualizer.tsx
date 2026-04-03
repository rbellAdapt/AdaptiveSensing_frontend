"use client";

import { useState, useEffect } from "react";
import DarkPlot from "./DarkPlot";
import { Activity } from "lucide-react";

export default function FicksLawVisualizer() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchFicksLaw = async () => {
    setLoading(true);
    try {
      // Simulate an array of non-steady state points
      const rawPoints = [5, 12, 18, 23, 27, 30, 32, 33];
      
      const res = await fetch("/api/ficks-law", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data_points: rawPoints,
          membrane_thickness: 0.05,
          temperature: 25.0
        }),
      });
      const json = await res.json();
      
      setData([
        {
          x: json.time,
          y: json.raw_data,
          type: "scatter",
          mode: "markers",
          name: "Raw Data",
          marker: { color: "#94a3b8", size: 8 } // slate-400
        },
        {
          x: json.time,
          y: json.predicted_data,
          type: "scatter",
          mode: "lines",
          name: "Predictive Model",
          line: { color: "#FFC400", width: 3, shape: "spline" } // amber
        }
      ]);
    } catch (e) {
      console.error("Failed to fetch Fick's Law data.", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFicksLaw();
  }, []);

  return (
    <div className="border border-slate-800 rounded-xl bg-[#0c0c0c] flex flex-col min-h-[200px] overflow-hidden">
      <div className="bg-slate-900/50 p-4 border-b border-slate-800 flex justify-between items-center">
         <div className="flex items-center space-x-2">
           <Activity className="h-5 w-5 text-amber" />
           <h3 className="font-mono text-slate-300 text-sm">Fick&apos;s Law Simulator</h3>
         </div>
      </div>
      <div className="flex-grow p-2 h-48">
        {data ? (
          <DarkPlot 
            data={data} 
            layout={{
                margin: { t: 10, r: 10, l: 30, b: 30 },
                xaxis: { title: "Time (s)", titlefont: {size: 10} },
                yaxis: { title: "Flux", titlefont: {size: 10} },
                showlegend: true,
                legend: { x: 0, y: 1, bgcolor: "rgba(0,0,0,0.5)" }
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
