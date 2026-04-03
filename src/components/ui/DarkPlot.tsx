"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import Plotly to avoid SSR issues with Next.js
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface DarkPlotProps {
  data: any[];
  layout?: any;
  config?: any;
  className?: string;
}

export default function DarkPlot({ data, layout = {}, config = {}, className = "" }: DarkPlotProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={`flex items-center justify-center bg-[#0a0a0a] border border-slate-800 rounded-lg min-h-[300px] ${className}`}>
        <span className="font-mono text-slate-500 animate-pulse text-sm">Initializing Plotly Engine...</span>
      </div>
    );
  }

  const baseLayout = {
    paper_bgcolor: "#0a0a0a", // Tailwind background
    plot_bgcolor: "#0a0a0a",
    font: {
      family: "var(--font-fira-code), monospace",
      color: "#94a3b8", // slate-400
    },
    margin: { t: 40, r: 20, l: 40, b: 40 },
    xaxis: {
      gridcolor: "#1e293b", // slate-800
      zerolinecolor: "#334155", // slate-700
    },
    yaxis: {
      gridcolor: "#1e293b",
      zerolinecolor: "#334155",
    },
    ...layout, // Override defaults with specific layout props
  };

  const baseConfig = {
    displayModeBar: false,
    responsive: true,
    ...config,
  };

  return (
    <div className={`w-full h-full min-h-[300px] overflow-hidden rounded-lg ${className}`}>
      <Plot
        data={data}
        layout={baseLayout}
        config={baseConfig}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
      />
    </div>
  );
}
