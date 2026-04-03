'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Info } from 'lucide-react';

// Next.js App Router requires dynamic import without SSR for Plotly 
// because Plotly.js depends on the window object
const Plot = dynamic(() => import('react-plotly.js'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-[#0d1117] text-[#b0c4de] rounded-xl border border-[#00e5ff]/20">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-[#00e5ff] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-mono">Loading scientific viewport...</p>
      </div>
    </div>
  )
});

interface SimulationViewportProps {
  gridData: any;
  gridConfig?: any;
  plumeData: any;
  plumeConfig?: any;
  flightConfig?: any;
  flightData?: any;
  activeTab?: string;
  previewSensorConfig?: any;
  sensorConfig?: any;
  hitData?: any;
  hitDetectionConfig?: any;
  demoTimeseries?: any;
  demoHitData?: any;
}

export default function SimulationViewport({ gridData, gridConfig, plumeData, plumeConfig, flightConfig, flightData, activeTab, previewSensorConfig, sensorConfig, hitData, hitDetectionConfig, demoTimeseries, demoHitData }: SimulationViewportProps) {
  const [animFrame, setAnimFrame] = useState(-1);
  const [showBgWithPlume, setShowBgWithPlume] = useState(true);

  useEffect(() => {
    if (activeTab === 'adaptive' && flightData?.timeseries?.length > 0) {
      setAnimFrame(0);
      const totalPoints = flightData.timeseries.length;
      const durationMs = 3000;
      const intervalMs = 30; // ~33 FPS
      const totalSteps = Math.floor(durationMs / intervalMs);
      const pointsPerStep = Math.max(1, Math.ceil(totalPoints / totalSteps));
      
      const timer = setInterval(() => {
        setAnimFrame(prev => {
          if (prev >= totalPoints - 1) {
            clearInterval(timer);
            return prev;
          }
          return Math.min(prev + pointsPerStep, totalPoints - 1);
        });
      }, intervalMs);
      return () => clearInterval(timer);
    } else {
      setAnimFrame(-1);
    }
  }, [activeTab, flightData]);

  const volumeData = React.useMemo(() => {
    if (activeTab !== 'plume' || !plumeConfig || !gridConfig) return { traces: [], maxDist: 0, zMax: 30 };
    const xs: number[] = [], ys: number[] = [], zs: number[] = [], vals: number[] = [];
    const leakHeight = plumeConfig.leak_height;
    const measAlt = gridConfig.measurement_altitude || 10;
    
    // Abstract stability logic for client-side purely aesthetic 3D rendering
    const stab = (gridConfig.stability_class || 'D').toUpperCase();
    let sy_a = 0.07, sy_b = 0.89, sz_a = 0.06, sz_b = 0.89;
    if (stab === 'A') { sy_a=0.20; sz_a=0.16; sz_b=1.09; }
    else if (stab === 'B') { sy_a=0.16; sz_a=0.11; sz_b=1.05; }
    else if (stab === 'C') { sy_a=0.10; sz_a=0.10; sz_b=0.94; }
    else if (stab === 'E') { sy_a=0.05; sz_a=0.04; sz_b=0.83; }
    else if (stab === 'F') { sy_a=0.03; sz_a=0.02; sz_b=0.78; }

    const ws = Math.max(0.5, gridConfig.wind_speed_at_10m_mph * 0.44704);
    const Q = plumeConfig.leak_rate_scfh * 100.0;
    
    // Sweep the geometric plane mathematically to accurately identify the measurement peak!
    let maxConcAtMeasAlt = 0;
    let distOfMaxConc = 0;
    for (let x = 1; x <= 300; x += 1) {
      const sy = Math.max(sy_a * Math.pow(x, sy_b), 0.1);
      const sz = Math.max(sz_a * Math.pow(x, sz_b), 0.1);
      const expZ = Math.exp(-Math.pow(measAlt - leakHeight, 2) / (2 * Math.pow(sz, 2))) + 
                   Math.exp(-Math.pow(measAlt + leakHeight, 2) / (2 * Math.pow(sz, 2)));
      let valAtCenter = (1.0 / (2 * Math.PI * sy * sz * ws)) * expZ * Q;
      if (valAtCenter > maxConcAtMeasAlt) {
        maxConcAtMeasAlt = valAtCenter;
        distOfMaxConc = x;
      }
    }

    let maxVal = 0;
    // Exactly bound Z-ceiling to the measurement plane + 10%
    const zCeil = measAlt * 1.1;
    
    // Extremely accelerated structural sampling arrays (Reduces native iterations from 93,000 to <15,000 to prevent Main Thread blocking on UI sliders)
    const xArr = [0.05, 1, 5, 20];
    for (let xi = 1; xi <= 30; xi++) xArr.push(20 + xi * (980 / 30));
    
    const yArr = [0.0];
    for (let yi = 0; yi <= 30; yi++) {
        let v = -500 + yi * (1000 / 30);
        if (Math.abs(v) > 0.01) yArr.push(v);
    }
    yArr.sort((a, b) => a - b);
    
    const zArr = [leakHeight, measAlt];
    for (let zi = 0; zi <= 12; zi++) {
        let v = zi * (zCeil / 12);
        if (Math.abs(v - leakHeight) > 0.01 && Math.abs(v - measAlt) > 0.01) zArr.push(v);
    }
    zArr.sort((a, b) => a - b);
    
    for (let x of xArr) {
      const sy = Math.max(sy_a * Math.pow(x, sy_b), 0.1);
      const sz = Math.max(sz_a * Math.pow(x, sz_b), 0.1);
      for (let y of yArr) {
        for (let z of zArr) {
          const expY = Math.exp(-Math.pow(y, 2) / (2 * Math.pow(sy, 2)));
          const expZ = Math.exp(-Math.pow(z - leakHeight, 2) / (2 * Math.pow(sz, 2))) + 
                       Math.exp(-Math.pow(z + leakHeight, 2) / (2 * Math.pow(sz, 2)));
          
          let rawVal = (1.0 / (2 * Math.PI * sy * sz * ws)) * expY * expZ * Q;
          // Revert to Logarithmic Concentration: translates 6 orders of magnitude variance perfectly into linear interpolation geometries spanning cleanly downwind thousands of meters natively!
          let val = Math.log10(Math.max(rawVal, 0.01));
          
          xs.push(x); ys.push(y); zs.push(z); vals.push(val);
          if (val > maxVal) maxVal = val;
        }
      }
    }
    
    if (vals.length === 0 || maxVal <= 0) return { traces: [], maxDist: 0, zMax: zCeil };
    
    const volTrace = {
      type: 'volume' as any,
      x: xs, y: ys, z: zs, value: vals,
      // Hardcode the Isocontours mathematically bounding the outer layer cleanly to 0.1 ppb (-1.0 base-10 exponent) mapping the extreme downwind tails!
      isomin: -1.0,
      isomax: Math.max(maxVal, 2.0),
      opacity: 1.0, // Force global opacity open so the dynamically-mapped RGBA transparency map handles visibility natively
      surface: {show: true, count: 16, fill: 0.8}, // Halved layer density for fluid WebGL UI performance
      colorscale: [
        [0.0, 'rgba(0, 255, 255, 0.25)'],  // Lowest Signal: High-contrast Cyan at 25% opacity
        [0.5, 'rgba(150, 255, 100, 0.50)'],// Mid Signal: Bright Mint-Green at 50% opacity
        [1.0, 'rgba(255, 200, 0, 0.75)']   // Core Signal: Sharp Yellow/Orange at 75% opacity
      ],
      showscale: true,
      colorbar: {
        title: { text: '[CH4]<br>Core', font: { color: '#00e5ff' } },
        tickmode: 'array',
        tickvals: [-1, 0, 1, 2, 3, 4, 5, 6, 7],
        ticktext: ['0.1 ppb', '1 ppb', '10 ppb', '100 ppb', '1k ppb', '10k ppb', '100k ppb', '1M ppb', '10M ppb'],
        tickfont: { color: '#b0c4de', size: 10 },
        thickness: 15,
        len: 0.6
      }
    };

    const planeTrace = {
      type: 'surface' as any,
      x: [[0, 1000], [0, 1000]],
      y: [[-500, -500], [500, 500]],
      z: [[measAlt, measAlt], [measAlt, measAlt]],
      opacity: 0.25,
      colorscale: [[0, '#00e5ff'], [1, '#00e5ff']],
      showscale: false,
      hoverinfo: 'none',
      name: 'Measurement Plane'
    };

    const sourceTrace = {
      type: 'scatter3d' as any,
      mode: 'markers',
      x: [0.0],
      y: [0.0],
      z: [leakHeight],
      marker: { color: '#ff2a2a', size: 4, symbol: 'diamond' },
      hoverinfo: 'name',
      name: 'Leak Source',
      showlegend: false
    };

    return { traces: [volTrace, planeTrace, sourceTrace], maxDist: distOfMaxConc, zMax: zCeil };
  }, [activeTab, plumeConfig, gridConfig]);

  // Default empty state Plotly layout
  const defaultLayout = {
    title: 'UAS Simulator Viewport',
    xaxis: { title: { text: 'X Distance (m)', font: { color: '#b0c4de', size: 14 } }, automargin: true },
    yaxis: { title: { text: 'Y Distance (m)', font: { color: '#b0c4de', size: 14 } }, scaleanchor: 'x', scaleratio: 1, automargin: true },
    template: 'plotly_dark',
    autosize: true,
    margin: { t: 40, b: 40, l: 40, r: 40 },
    plot_bgcolor: '#0d1117',
    paper_bgcolor: '#0d1117',
    font: { color: '#b0c4de' },
    showlegend: false
  };

  if (!gridData && !plumeData) {
    return (
      <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-[#0d1117] text-[#b0c4de] rounded-xl border border-[#00e5ff]/20 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
        <h3 className="text-xl mb-2 text-[#ffab00]">No Simulation Data</h3>
        <p className="text-sm opacity-70">Configure parameters on the left and run a simulation.</p>
      </div>
    );
  }

  // Create traces based on provided data
  const traces = [];
  const mapAnnotations = [];
  const mapShapes: any[] = [];
  
  // Compute the current timestamp reached by the drone tracking animation
  const current_t_sec = (animFrame >= 0 && flightData?.timeseries && flightData.timeseries.length > animFrame) 
        ? flightData.timeseries[animFrame].t_sec 
        : Number.MAX_VALUE;
  
  if (gridData && gridData.ch4_bg && activeTab === 'grid') {
    traces.push({
      z: gridData.ch4_bg,
      x: gridData.X[0],
      y: gridData.Y.map((yRow: any) => yRow[0]),
      type: 'heatmap',
      colorscale: 'Viridis',
      colorbar: { title: 'CH4 (ppb)' },
      name: 'Background'
    });
  }

  if (plumeData && plumeData.ch4_plume && activeTab !== 'grid') {
    // Render the pure Gaussian Plume visually isolated from atmospheric background
    // to preserve native histogram colorscales and dynamic contrast, unless toggled.
    const zData = showBgWithPlume && gridData
      ? gridData.ch4_bg.map((row: number[], i: number) => 
          row.map((val: number, j: number) => val + plumeData.ch4_plume[i][j])
        )
      : plumeData.ch4_plume;

    traces.push({
      z: zData,
      x: gridData ? gridData.X[0] : [],
      y: gridData ? gridData.Y.map((yRow: any) => yRow[0]) : [],
      type: 'heatmap',
      colorscale: 'Viridis',
      colorbar: { title: 'Total CH4 (ppb)' },
      name: 'Plume'
    });

    // Push physical tracking reticle mapped exactly uniquely to the analytical plume origin vector
    traces.push({
      x: [plumeConfig.leak_x],
      y: [plumeConfig.leak_y],
      mode: 'markers',
      type: 'scatter',
      marker: { color: '#ff2a2a', size: 12, symbol: 'diamond' },
      hoverinfo: 'name',
      showlegend: false
    });
  }
  
  // Resolve Active Snapshot timeline natively for dynamic updates
  let activeSnapshot: any = null;
  const isAdaptiveMode = ['flight', 'adaptive'].includes(activeTab || '');
  
  let hasTriggeredActionRoutine = false;
  if (flightData?.timeseries) {
    hasTriggeredActionRoutine = flightData.timeseries.some((pt: any) => pt.t_sec <= current_t_sec && pt.is_adaptive_turn);
  }

  if (isAdaptiveMode && flightData?.snapshots?.length > 0) {
      activeSnapshot = flightData.snapshots.slice().reverse().find((s: any) => s.time_sec <= current_t_sec);
  }
  if (!activeSnapshot && hitData?.predicted_source) {
      // Only append the final aggregated polygon prediction if we reach the end of the flight mathematically
      const lastFlightTime = flightData?.timeseries?.[flightData.timeseries.length - 1]?.t_sec || Number.MAX_VALUE;
      if (current_t_sec >= lastFlightTime) {
          activeSnapshot = hitData.predicted_source;
      }
  }
  
  // Phase 12: Probability Contour Ungating -> Native tracking against Slider organically across entirely flight history
  // if (flightData?.timeseries?.length > 0 && !hasTriggeredActionRoutine) {
  //     activeSnapshot = null;
  // }

  // Adaptive Target Prediction HUD OVERLAY and GEOMETRY rendering
  if (activeSnapshot && isAdaptiveMode) {
      // 1. Draw Probabilistic Continuous Heatmap Underlay (Jet Colorscale)
      if (activeSnapshot.heatmap && activeSnapshot.heatmap.z) {
          traces.push({
            type: 'contour',
            x: activeSnapshot.heatmap.x,
            y: activeSnapshot.heatmap.y,
            z: activeSnapshot.heatmap.z,
            colorscale: 'Jet',
            opacity: 0.45,
            showscale: false, // hide the contour colorbar to keep HUD clean
            name: 'Jet Probability Field',
            hoverinfo: 'skip',
            contours: { coloring: 'heatmap' }
          });
      }
      
      // 2. Plot Absolute Converged Target
      traces.push({
          x: [activeSnapshot.x],
          y: [activeSnapshot.y],
          mode: 'markers',
          type: 'scatter',
          marker: { color: '#ef4444', size: 18, symbol: 'star-triangle-up', line: { color: '#ffffff', width: 2 } },
          name: `Predicted Epicenter (${activeSnapshot.contributors || '?'} Hits)`,
          hoverinfo: 'name+x+y'
      });
  }

  // Environmental Parameter Overlay HUD
  if (gridConfig) {
      const windKmh = (gridConfig.wind_speed_at_10m_mph * 1.60934).toFixed(1);
      
      // Determine compass direction string from degrees
      const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const compassIdx = Math.round((gridConfig.wind_direction_deg % 360) / 22.5) % 16;
      const compassStr = dirs[compassIdx];
      
      // Plotly doesn't natively support hover-text deeply on static annotations natively in HTML mode, 
      // but users reading "UI Compress [i]" will intuitively understand visual sampling is active
      const compressionStr = gridData?.compression_ratio && gridData.compression_ratio > 1
            ? `<br><span style="color:#ffab00">UI Compression ${gridData.compression_ratio}x</span>` 
            : "";

      mapAnnotations.push({
          xref: 'paper', yref: 'paper',
          x: 0.98, y: 0.98,
          xanchor: 'right', yanchor: 'top',
          text: `<b>&#10022; ENVIRONMENT SENSOR HUD</b><br>Measurement Alt: ${gridConfig.measurement_altitude}m<br>Avg 10m Wind: ${windKmh} km/h<br>Global Vector: ${gridConfig.wind_direction_deg}° (${compassStr})<br>Stability Class: ${gridConfig.stability_class}${compressionStr}`,
          showarrow: false,
          font: { family: 'monospace', size: 11, color: '#00e5ff' },
          align: 'right',
          bgcolor: 'rgba(13, 17, 23, 0.85)',
          bordercolor: 'rgba(0, 229, 255, 0.4)',
          borderwidth: 1,
          borderpad: 8
      });
  }

  // Plume Source Descriptor Overlay HUD (Bottom Right)
  // Only displays when the Plume Generation tab is contextually active
  if (activeTab === 'plume' && plumeConfig) {
      const meta = plumeData?.metadata || {};
      const ch4Conc = typeof meta.max_conc_ppb === 'number' ? meta.max_conc_ppb.toFixed(1) : "0.0";
      const ch4Snr = typeof meta.snr === 'number' ? meta.snr.toFixed(1) : "0.0";
      const c2h6Conc = typeof meta.max_c2h6_ppb === 'number' ? meta.max_c2h6_ppb.toFixed(1) : "0.0";
      const c2h6Snr = typeof meta.c2h6_snr === 'number' ? meta.c2h6_snr.toFixed(1) : "0.0";
      
      mapAnnotations.push({
          xref: 'paper', yref: 'paper',
          x: 0.98, y: 0.02,
          xanchor: 'right', yanchor: 'bottom',
          text: `<b>&#10034; DISPERSION METRICS</b><br>Max CH<sub>4</sub> above BG: ${ch4Conc} ppb<br>Peak CH<sub>4</sub> Signal/Noise: ${ch4Snr}x<br>Max C<sub>2</sub>H<sub>6</sub> above BG: ${c2h6Conc} ppb<br>Peak C<sub>2</sub>H<sub>6</sub> Signal/Noise: ${c2h6Snr}x`,
          showarrow: false,
          font: { family: 'monospace', size: 11, color: '#f59e0b' },
          align: 'right',
          bgcolor: 'rgba(13, 17, 23, 0.85)',
          bordercolor: 'rgba(245, 158, 11, 0.4)',
          borderwidth: 1,
          borderpad: 8
      });
  }

  const flightPath = flightData?.path || flightData;
  if (flightPath && flightPath.x && flightPath.y) {
    let renderX = flightPath.x;
    let renderY = flightPath.y;
    
    if (animFrame >= 0 && flightData.timeseries) {
       const slice = flightData.timeseries.slice(0, animFrame + 1);
       renderX = slice.map((t: any) => t.x);
       renderY = slice.map((t: any) => t.y);
       
       const currentDrone = slice[slice.length - 1];
       traces.push({
           x: [currentDrone.x],
           y: [currentDrone.y],
           mode: 'markers',
           type: 'scatter',
           name: 'UAS Live Position',
           showlegend: false,
           marker: {
               symbol: 'triangle-up-dot',
               color: currentDrone.is_adaptive_turn ? '#a855f7' : '#00e5ff', 
               size: 16,
               line: { color: '#ffffff', width: 2 }
           }
       });
       
       if (currentDrone.is_adaptive_turn) {
           traces.push({
               x: [currentDrone.x],
               y: [currentDrone.y],
               mode: 'markers',
               type: 'scatter',
               name: 'REROUTE TRIGGER',
               showlegend: false,
               marker: {
                   symbol: 'circle-open',
                   color: '#a855f7', 
                   size: 35,
                   line: { color: '#a855f7', width: 3 }
               }
           });
       }
    }

    traces.push({
      x: renderX,
      y: renderY,
      mode: 'lines',
      type: 'scatter',
      name: 'UAS Lawnmower Path',
      line: { color: '#22c55e', width: 2, dash: 'dot' } // Tailwind Green 500
    });
    
    // Explicitly add Ground Truth source target if user originated the Plume
    if (plumeConfig && plumeConfig.leak_x != null && plumeConfig.leak_y != null) {
      traces.push({
        x: [plumeConfig.leak_x],
        y: [plumeConfig.leak_y],
        mode: 'markers',
        type: 'scatter',
        name: 'Ground Truth Source',
        marker: { 
          color: '#ffffff', 
          size: 14, 
          symbol: 'cross-dot',
          line: { color: '#000000', width: 2 } 
        },
        hoverinfo: 'name+x+y'
      });
    }
    
    // Highlight the starting / takeoff point
    traces.push({
      x: [flightPath.x[0]],
      y: [flightPath.y[0]],
      mode: 'markers',
      type: 'scatter',
      name: 'UAS Base',
      marker: { color: '#ffab00', size: 12, symbol: 'star' }
    });
    
    // Compute purely headless direction markers using native scatter rotation
    const dirX: number[] = [];
    const dirY: number[] = [];
    const dirAngle: number[] = [];
    
    for (let i = 0; i < flightPath.x.length - 1; i++) {
        const x0 = flightPath.x[i];
        const y0 = flightPath.y[i];
        const x1 = flightPath.x[i+1];
        const y1 = flightPath.y[i+1];
        
        const dist = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
        
        // Exclude very short transit or turning segments (< 75m)
        if (dist < 75.0) continue;
        
        // Place exactly 1 arrow directly in the center of the segment
        const mx = (x0 + x1) / 2;
        const my = (y0 + y1) / 2;
        
        // Compute heading in degrees where 0 is UP and 90 is RIGHT (Standard map heading)
        // Math.atan2(dx, dy) achieves exactly this!
        let angle = (Math.atan2(x1 - x0, y1 - y0) * 180) / Math.PI;
        
        // Hide future arrows during playback animation
        if (animFrame >= 0 && i >= animFrame) {
            continue;
        }
        
        dirX.push(mx);
        dirY.push(my);
        dirAngle.push(angle);
    }
    
    if (dirX.length > 0) {
        traces.push({
            x: dirX,
            y: dirY,
            mode: 'markers',
            type: 'scatter',
            name: 'Travel Direction',
            marker: {
                symbol: 'arrow', // Native Plotly chevron marker without a line!
                size: 14,
                color: '#22c55e',
                angle: dirAngle
            },
            showlegend: false,
            hoverinfo: 'skip'
        });
    }
    
    // Flight Stats HUD Overlay
    if (flightPath.total_distance_m !== undefined) {
        const distM = Math.round(flightPath.total_distance_m || 0);
        const maxDistM = Math.round(flightPath.max_distance_m || 0);
        const sweeps = flightPath.sweeps || 0;
        const spacing = Math.round(flightPath.track_spacing_m || 0);
        
        let timeSec = 0;
        
        // Compute precise time natively traversing altitude trajectories if missing
        if (flightData.timeseries && flightData.timeseries.length > 0) {
            timeSec = flightData.timeseries[flightData.timeseries.length - 1].t_sec;
        } else {
            // Reconstruct estimated Pre-Flight duration precisely
            const speed = flightConfig?.cruise_speed_mps || (35 / 3.6);
            const alt = gridConfig?.measurement_altitude || 50;
            const climbRate = 2.0; 
            
            timeSec += 2.0 / climbRate; // takeoff to 2m
            timeSec += 30.0; // hover
            timeSec += (10.0 - 2.0) / climbRate; // climb to 10m
            timeSec += 30.0; // hover
            
            if (alt > 10.0) {
                timeSec += (alt - 10.0) / climbRate;
            } else if (alt < 10.0) {
                timeSec += (10.0 - alt) / climbRate;
            }
            
            if (flightPath.x && flightPath.x.length > 0) {
                for (let i = 1; i < flightPath.x.length; i++) {
                    let dx = flightPath.x[i] - flightPath.x[i-1];
                    let dy = flightPath.y[i] - flightPath.y[i-1];
                    let dist = Math.hypot(dx, dy);
                    timeSec += dist / speed;
                }
            }
            timeSec += alt / climbRate; // descent
        }
        
        let annotationText = `<b>UAV TELEMETRY</b><br>Distance: ${distM}m (Max: ${maxDistM}m)<br>Flight Time: ${Math.round(timeSec)}s / ${(timeSec / 60).toFixed(1)}m<br>Sweeps: ${sweeps} (${spacing}m spacing)`;
        
        if (flightData.adaptive_metrics && flightData.adaptive_metrics.triggered) {
            const am = flightData.adaptive_metrics;
            annotationText += `<br><br><b>ADAPTIVE ROUTINE</b><br>Total Plume Hits: ${am.total_hits}<br>Verified Targets: ${am.confident_hits}<br>Downstream Recaptured: ${am.stage_3_recaptured ? '<span style="color:#a855f7;">YES</span>' : '<span style="color:#ef4444;">NO</span>'}`;
        }
        
        mapAnnotations.push({
            xref: 'paper', yref: 'paper',
            x: 0.02, y: 0.98,
            xanchor: 'left', yanchor: 'top',
            text: annotationText,
            showarrow: false,
            font: { family: 'monospace', size: 12, color: '#22c55e' },
            align: 'left',
            bgcolor: 'rgba(13, 17, 23, 0.85)', // Matching dark background
            bordercolor: 'rgba(34, 197, 94, 0.4)', // Faded green border
            borderwidth: 1,
            borderpad: 8
        });
    }
  }
  
  // Extract Hit markers onto 2D Map if we are in hits view
  const isAdaptiveHit = activeTab === 'adaptive' && hitData?.peaks && hitData.peaks.length > 0 && flightData?.timeseries;
  const isSensorHit = activeTab === 'sensors' && demoHitData?.peaks && demoHitData.peaks.length > 0 && demoTimeseries;
  
  if (isAdaptiveHit || isSensorHit) {
      const workingHitData = isAdaptiveHit ? hitData : demoHitData;
      const workingTimeseries = isAdaptiveHit ? flightData.timeseries : demoTimeseries;
      
      const hitX: number[] = [];
      const hitY: number[] = [];
      const hitSizes: number[] = [];
      const hitLabels: string[] = [];
      const hitColors: string[] = [];
      const hitLineColors: string[] = [];
      
      workingHitData.peaks.forEach((peak: any, idx: number) => {
          if (current_t_sec >= peak.time_sec) {
              const targetTime = peak.time_sec;
              let closestPt = workingTimeseries[0];
              let minDiff = Infinity;
              
              for (const pt of workingTimeseries) {
                  const diff = Math.abs(pt.t_sec - targetTime);
                  if (diff < minDiff) {
                      minDiff = diff;
                      closestPt = pt;
                  }
              }
              
              if (closestPt) {
                  hitX.push(closestPt.x);
                  hitY.push(closestPt.y);
                  
                  // Scale size based on the peak confidence (base 14, aggressively scaled up)
                  const dynamicSize = Math.max(14, 14 + (peak.confidence * 25));
                  hitSizes.push(dynamicSize);
                  hitLabels.push(`${idx + 1}`);
                  
                  // Scale color from Yellow to Red based on confidence
                  const conf = Math.max(0, Math.min(1, peak.confidence));
                  const r = 255;
                  const g = Math.round(171 * (1 - conf));
                  const b = Math.round(85 * conf);
                  hitColors.push(`rgba(${r}, ${g}, ${b}, 0.5)`);
                  hitLineColors.push(`rgb(${r}, ${g}, ${b})`);
              }
          }
      });
      
      if (hitX.length > 0) {
          traces.push({
              x: hitX,
              y: hitY,
              text: hitLabels,
              mode: 'markers+text',
              textposition: 'middle center',
              textfont: {
                  color: hitLineColors,
                  size: 11,
                  family: 'monospace',
                  weight: 'bold'
              },
              type: 'scatter',
              name: 'Verified Source Plumes',
              marker: {
                  color: hitColors, // Faded center
                  size: hitSizes,
                  symbol: 'circle-open', // Removed dot to make room for text
                  line: { color: hitLineColors, width: 3 } // Solid circumference mapping confidence
              },
              hoverinfo: 'x+y+name'
          });
      }

      // Map individual geometric Annular Sectors (Cones) tracking to Wind Drift Expansion
      workingHitData.peaks.forEach((peak: any, idx: number) => {
          // Hide targets completely until the drone actually surpasses their mathematical evaluation window
          if (peak.cone && current_t_sec >= peak.window_end_sec) {
              const { x0, y0, r_min, r_max, theta_min, theta_max } = peak.cone;
              
              // Plotly native layout shapes DO NOT reliably support the SVG 'A' (Arc) command.
              // To guarantee a smoothly curved pie wedge, we construct a 12-point linear polygon along the radius.
              const numSegments = 12;
              
              // 1. Start at inner radius min-angle
              const p1x = x0 + r_min * Math.cos(theta_min);
              const p1y = y0 + r_min * Math.sin(theta_min);
              let pathString = `M ${p1x} ${p1y}`;
              
              // 2. Line outward to outer radius min-angle
              const p2x = x0 + r_max * Math.cos(theta_min);
              const p2y = y0 + r_max * Math.sin(theta_min);
              pathString += ` L ${p2x} ${p2y}`;
              
              // 3. Trace curves along the outer radius up to max-angle
              for (let i = 1; i <= numSegments; i++) {
                  const t = theta_min + (theta_max - theta_min) * (i / numSegments);
                  const px = x0 + r_max * Math.cos(t);
                  const py = y0 + r_max * Math.sin(t);
                  pathString += ` L ${px} ${py}`;
              }
              
              // 4. Trace curves backwards along the inner radius down to min-angle
              for (let i = numSegments - 1; i >= 0; i--) {
                  const t = theta_min + (theta_max - theta_min) * (i / numSegments);
                  const px = x0 + r_min * Math.cos(t);
                  const py = y0 + r_min * Math.sin(t);
                  pathString += ` L ${px} ${py}`;
              }
              pathString += ' Z';
              
              mapShapes.push({
                  type: 'path',
                  path: pathString,
                  xref: 'x', yref: 'y',
                  line: { color: 'rgba(255, 171, 0, 0.4)', width: 1.5, dash: 'dot' },
                  fillcolor: 'rgba(255, 171, 0, 0.08)',
                  layer: 'above' 
              });
              
              if (peak.predicted_x != null && peak.predicted_y != null) {
                  traces.push({
                      x: [peak.predicted_x],
                      y: [peak.predicted_y],
                      mode: 'markers',
                      type: 'scatter',
                      hovertext: `Hit ${idx+1} Math Origin`,
                      marker: {
                          color: 'rgba(255, 171, 0, 0.6)',
                          size: 6,
                          symbol: 'x'
                      },
                      showlegend: false,
                      hoverinfo: 'text'
                  });
                  
                  // Sketch a micro-trace connecting the drone hit directly to this cone's vertex
                  traces.push({
                      x: [x0, peak.predicted_x],
                      y: [y0, peak.predicted_y],
                      mode: 'lines',
                      type: 'scatter',
                      line: { color: 'rgba(255, 171, 0, 0.3)', width: 1, dash: 'dash' },
                      showlegend: false,
                      hoverinfo: 'skip'
                  });
              }
          }
      });

      // Map the probability envelope and estimated global epicenter
      // If we have an active snapshot dynamically resolved previously, render its native 2D geometries
      
      if (activeSnapshot) {
          const ps = activeSnapshot;
          
          if (ps.polygon && ps.polygon.length > 2) {
              // Convert the ConvexHull vertices into an enclosed SVG SVG path
              let polyPath = `M ${ps.polygon[0].x} ${ps.polygon[0].y}`;
              for (let i = 1; i < ps.polygon.length; i++) {
                  polyPath += ` L ${ps.polygon[i].x} ${ps.polygon[i].y}`;
              }
              polyPath += ' Z';
              
              mapShapes.push({
                  type: 'path',
                  path: polyPath,
                  xref: 'x', yref: 'y',
                  line: { color: 'rgba(0, 229, 255, 0.8)', width: 2, dash: 'dot' },
                  fillcolor: 'rgba(0, 229, 255, 0.15)',
                  layer: 'above'
              });
          } else {
              // Fallback to a programmatic 8-point polygon (>4 area) demarking the 90% confidence variance
              const numPoints = 8;
              let polyPath = '';
              for (let i = 0; i < numPoints; i++) {
                  const angle = (i * 2 * Math.PI) / numPoints;
                  const px = ps.x + ps.rmse_m * Math.cos(angle);
                  const py = ps.y + ps.rmse_m * Math.sin(angle);
                  polyPath += (i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`);
              }
              polyPath += ' Z';
              
              mapShapes.push({
                  type: 'path',
                  path: polyPath,
                  xref: 'x', yref: 'y',
                  line: { color: 'rgba(0, 229, 255, 0.8)', width: 2, dash: 'dot' },
                  fillcolor: 'rgba(0, 229, 255, 0.15)',
                  layer: 'above'
              });
          }
          
          if (plumeConfig) {
              const true_x = plumeConfig.leak_x ?? 0;
              const true_y = plumeConfig.leak_y ?? 0;
              const errDist = Math.hypot(ps.x - true_x, ps.y - true_y);
              const true_rate = Math.max(0.01, plumeConfig.leak_rate_scfh);
              const errRate = Math.abs(ps.leak_rate_scfh - plumeConfig.leak_rate_scfh) / true_rate * 100;
              const errC2 = Math.abs(ps.percent_c2h6 - plumeConfig.percent_c2h6);
              
              mapAnnotations.push({
                  xref: 'paper', yref: 'paper',
                  x: 0.02, y: 0.96,
                  xanchor: 'left', yanchor: 'top',
                  text: `<b>GROUND TRUTH PERFORMANCE</b><br><br>` +
                        `<b>Location:</b> (${ps.x.toFixed(1)}, ${ps.y.toFixed(1)}) <i><span style="color:#ffab00">[Err: ${errDist.toFixed(1)}m]</span></i><br>` +
                        `<b>Emission:</b> ${ps.leak_rate_scfh} SCFH <i><span style="color:#ffab00">[Err: ${errRate.toFixed(1)}%]</span></i><br>` +
                        `<b>Gas Match:</b> ${ps.percent_c2h6}% C2 <i><span style="color:#ffab00">[Err: ${errC2.toFixed(1)}%]</span></i>`,
                  showarrow: false,
                  bgcolor: 'rgba(10, 20, 30, 0.85)',
                  bordercolor: '#a855f7',
                  borderwidth: 2,
                  font: { color: '#e2e8f0', size: 11, family: 'monospace' },
                  align: 'left',
                  borderpad: 8
              });
          }

          traces.push({
              x: [ps.x],
              y: [ps.y],
              mode: 'markers',
              type: 'scatter',
              name: 'Predicted Source',
              marker: {
                  color: 'rgba(0, 0, 0, 0.8)',
                  size: 16,
                  symbol: 'star-dot',
                  line: { color: '#00e5ff', width: 2 }
              },
              hoverinfo: 'name'
          });
          
          // Map inverted wind tracer line pointing back to hit cluster
          if (hitX.length > 0) {
              const avgHitX = hitX.reduce((a, b) => a + b, 0) / hitX.length;
              const avgHitY = hitY.reduce((a, b) => a + b, 0) / hitY.length;
              traces.push({
                  x: [avgHitX, ps.x],
                  y: [avgHitY, ps.y],
                  mode: 'lines',
                  type: 'scatter',
                  name: 'Wind Vector Trace',
                  line: { color: 'rgba(0, 229, 255, 0.4)', width: 2, dash: 'dash' },
                  hoverinfo: 'skip',
                  showlegend: false
              });
          }
      }
  }

  // Create Timeseries Traces
  const tsTraces: any[] = [];
  let tsTitle = 'UAS Sensor Telemetry (1D Time-Series)';
  let tsShapes: any[] = [];
  const isAdaptiveHitMode = activeTab === 'adaptive' && flightData && flightData.timeseries && hitData;
  const isSensorModeWithHits = activeTab === 'sensors' && demoTimeseries && demoHitData;

  if (isAdaptiveHitMode || isSensorModeWithHits) {
    const workingHitData = isAdaptiveHitMode ? hitData : demoHitData;
    const workingTimeseries = isAdaptiveHitMode ? flightData.timeseries : demoTimeseries;
    
    tsTitle = isAdaptiveHitMode ? 'Hit Detection Analytics: Confidence & Extracted Peaks' : 'UAS Sensor Telemetry - Preview (30s Diagnostic Track)';
    const ts = workingTimeseries;
    
    // If we're in Sensor preview tab, do not clip using animFrame because animFrame isn't running
    const clipIdx = (isAdaptiveHitMode && animFrame >= 0) ? animFrame + 1 : ts.length;
    
    const t = ts.map((pt: any) => pt.t_sec).slice(0, clipIdx);
    const ch4 = ts.map((pt: any) => pt.ch4_ppb).slice(0, clipIdx);
    const c2h6 = ts.map((pt: any) => pt.c2h6_ppb).slice(0, clipIdx);
    
    // Render fading base traces
    tsTraces.push({
      x: t, y: ch4, name: 'Raw CH4 (ppb)', type: 'scatter', mode: 'lines', line: { color: 'rgba(0, 229, 255, 0.4)', width: 1.5 }, yaxis: 'y1'
    });
    tsTraces.push({
      x: t, y: c2h6, name: 'Raw C2H6 (ppb)', type: 'scatter', mode: 'lines', line: { color: 'rgba(255, 171, 0, 0.4)', width: 1.5 }, yaxis: 'y2'
    });

    // Render Confidence Envelopes
    if (workingHitData.confidence_timeseries && workingHitData.confidence_timeseries.length > 0) {
      const confRender = workingHitData.confidence_timeseries.slice(0, clipIdx);
      tsTraces.push({
        x: t, y: confRender, name: 'Confidence Score (σ)', type: 'scatter', mode: 'lines', line: { color: '#22c55e', width: 2 }, fill: 'tozeroy', fillcolor: 'rgba(34, 197, 94, 0.2)', yaxis: isAdaptiveMode ? 'y3' : 'y7'
      });
    }

    if (isSensorModeWithHits) {
      const u = ts.map((pt: any) => pt.u).slice(0, clipIdx);
      const v = ts.map((pt: any) => pt.v).slice(0, clipIdx);
      const windSpd = u.map((_u: number, i: number) => Math.hypot(_u, v[i]));
      const windDir = ts.map((pt: any) => pt.wind_dir_noisy || pt.wind_dir || 0).slice(0, clipIdx);
      const gpsX = ts.map((pt: any) => pt.x).slice(0, clipIdx);
      const gpsY = ts.map((pt: any) => pt.y).slice(0, clipIdx);
      
      tsTraces.push({
        x: t, y: gpsY, name: 'Northing (m)', type: 'scatter', mode: 'lines', line: { color: '#22c55e', width: 1.5 }, yaxis: 'y3', xaxis: 'x3'
      });
      tsTraces.push({
        x: t, y: gpsX, name: 'Easting (m)', type: 'scatter', mode: 'lines', line: { color: '#10b981', width: 1.5 }, yaxis: 'y4', xaxis: 'x3'
      });
      tsTraces.push({
        x: t, y: windDir, name: 'Wind Dir (°)', type: 'scatter', mode: 'lines', line: { color: '#8b5cf6', width: 1.5, dash: 'dot' }, yaxis: 'y5', xaxis: 'x5'
      });
      tsTraces.push({
        x: t, y: windSpd, name: 'Wind Spd (m/s)', type: 'scatter', mode: 'lines', line: { color: '#6366f1', width: 1.5, dash: 'dash' }, yaxis: 'y6', xaxis: 'x5'
      });
    }

    // Render Peaks and Shapes
    if (workingHitData.peaks && workingHitData.peaks.length > 0) {
      // Filter out futuristic peaks that the drone hasn't structurally cleared yet (or show all in sensors mode)
      const currentSimTime = isAdaptiveMode ? current_t_sec : 999999;
      const visiblePeaks = workingHitData.peaks.filter((p: any) => currentSimTime >= p.window_end_sec);
      
      if (visiblePeaks.length > 0) {
          const peakTimes = visiblePeaks.map((p: any) => p.time_sec);
          const ch4Base = gridData?.ch4_mean || 2037.0;
          const peakVals = visiblePeaks.map((p: any) => p.ch4_enh_ppb + ch4Base);
          
          // Must match the original global index for HUD consistency!
          const peakLabels = visiblePeaks.map((p: any) => {
              const origIdx = workingHitData.peaks.indexOf(p);
              return `${origIdx + 1}`;
          });
          
          const peakLineColors = visiblePeaks.map((p: any) => {
              const conf = Math.max(0, Math.min(1, p.confidence));
              const r = 255;
              const g = Math.round(171 * (1 - conf));
              const b = Math.round(85 * conf);
              return `rgb(${r}, ${g}, ${b})`;
          });
          const peakFillColors = visiblePeaks.map((p: any) => {
              const conf = Math.max(0, Math.min(1, p.confidence));
              const r = 255;
              const g = Math.round(171 * (1 - conf));
              const b = Math.round(85 * conf);
              return `rgba(${r}, ${g}, ${b}, 0.5)`;
          });
          
          tsTraces.push({
            x: peakTimes, y: peakVals, text: peakLabels, name: 'Verified Hit Targets', type: 'scatter', mode: 'markers+text',
            textposition: 'middle center',
            textfont: { color: peakLineColors, weight: 'bold', size: 11, family: 'monospace' },
            marker: { color: peakFillColors, size: 24, symbol: 'circle-open', line: { color: peakLineColors, width: 2 } }, yaxis: 'y1'
          });
    
          // Construct vertical bounding box spans for each peak window
          visiblePeaks.forEach((p: any) => {
             // If animFrame interrupts the middle of an active observation window, clip the box
             const renderEnd = isAdaptiveMode ? Math.min(p.window_end_sec, current_t_sec) : p.window_end_sec;
             tsShapes.push({
                type: 'rect',
                xref: 'x', yref: 'paper',
                x0: p.window_start_sec, y0: 0,
                x1: renderEnd, y1: 1,
                fillcolor: 'rgba(34, 197, 94, 0.1)',
                line: { width: 1, color: 'rgba(34, 197, 94, 0.5)', dash: 'dot' },
                layer: 'below'
             });
          });
      }
    }
    
    // Always structurally plot the native Confidence Threshold regardless of trigger success
    const triggerConf = hitDetectionConfig?.adaptive_threshold || 0.40;
    tsShapes.push({
        type: 'line',
        xref: 'paper', yref: isAdaptiveMode ? 'y3' : 'y7',
        x0: 0, y0: triggerConf,
        x1: 1, y1: triggerConf,
        line: { color: 'rgba(168, 85, 247, 0.6)', width: 1.5, dash: 'dashdot' },
        layer: 'below'
    });
    
    // Add Adaptive Trigger Marker on Timeseries
    const adaptiveTriggerPt = isAdaptiveMode ? flightData.timeseries.find((pt: any) => pt.is_adaptive_turn) : null;
    if (adaptiveTriggerPt && current_t_sec >= adaptiveTriggerPt.t_sec) {
        tsShapes.push({
            type: 'line',
            xref: 'x', yref: 'paper',
            x0: adaptiveTriggerPt.t_sec, y0: 0,
            x1: adaptiveTriggerPt.t_sec, y1: 1,
            line: { color: '#a855f7', width: 2, dash: 'dash' },
            layer: 'above'
        });
        
        tsTraces.push({
            x: [adaptiveTriggerPt.t_sec],
            y: [0.05], // Map cleanly above the bottom of the confidence scale
            text: ['  ADAPTIVE REROUTE INITIATED'],
            mode: 'text',
            textposition: 'top right',
            textfont: { color: '#a855f7', size: 10, family: 'monospace', weight: 'bold' },
            showlegend: false,
            hoverinfo: 'skip',
            yaxis: isAdaptiveMode ? 'y3' : 'y7'
        });
    }

  } else if ((activeTab === 'grid' || (activeTab === 'plume' && plumeData)) && gridData && gridData.ch4_bg) {
    const showPlume = plumeData && activeTab !== 'grid';
    tsTitle = showPlume ? 'Environment Gas Distributions (Background + Plume)' : 'Environment Background Gas Distributions (μ, σ)';
    
    // Flatten and subsample the matrices (target ~2500 pixels for fast WebGL rendering)
    const flatCH4: number[] = [];
    const flatC2H6: number[] = [];
    
    const step = Math.max(1, Math.floor(gridData.ch4_bg.length / 50));
    for (let i = 0; i < gridData.ch4_bg.length; i += step) {
        for (let j = 0; j < gridData.ch4_bg[i].length; j += step) {
            let ch4_val = gridData.ch4_bg[i][j];
            if (showPlume && plumeData.ch4_plume) {
                ch4_val += plumeData.ch4_plume[i][j];
            }
            flatCH4.push(ch4_val);
            
            if (gridData.c2h6_bg) {
                let c2h6_val = gridData.c2h6_bg[i][j];
                if (showPlume && plumeData.c2h6_plume) {
                    c2h6_val += plumeData.c2h6_plume[i][j];
                }
                flatC2H6.push(c2h6_val);
            }
        }
    }
    
    tsTraces.push({
      x: flatCH4, name: showPlume ? 'Total CH4' : 'Background CH4', type: 'histogram', marker: { color: 'rgba(0, 229, 255, 0.7)' }, xaxis: 'x', yaxis: 'y'
    });
    if (flatC2H6.length > 0) {
        tsTraces.push({
          x: flatC2H6, name: showPlume ? 'Total C2H6' : 'Background C2H6', type: 'histogram', marker: { color: 'rgba(255, 171, 0, 0.7)' }, xaxis: 'x2', yaxis: 'y'
        });
    }
  } else if (flightData && !flightData.timeseries && ['flight', 'adaptive'].includes(activeTab || '')) {
    tsTitle = 'UAS Pre-Flight Altitude Trajectory (AGL)';
    const speed = flightConfig?.cruise_speed_mps || (35 / 3.6);
    const alt = gridConfig?.measurement_altitude || 50;
    const climbRate = 2.0; 
    
    let current_t = 0;
    let t_arr = [0];
    let z_arr = [0]; 
    let v_arr = [0];
    
    // Takeoff to 2m
    current_t += 2.0 / climbRate;
    t_arr.push(current_t); z_arr.push(2.0); v_arr.push(0);
    
    // Hover 30s
    current_t += 30.0;
    t_arr.push(current_t); z_arr.push(2.0); v_arr.push(0);
    
    // Climb to 10m
    current_t += (10.0 - 2.0) / climbRate;
    t_arr.push(current_t); z_arr.push(10.0); v_arr.push(0);
    
    // Hover 30s
    current_t += 30.0;
    t_arr.push(current_t); z_arr.push(10.0); v_arr.push(0);
    
    // Ascend to Cruise
    if (alt > 10.0) {
        current_t += (alt - 10.0) / climbRate;
        t_arr.push(current_t); z_arr.push(alt); v_arr.push(0);
    } else if (alt < 10.0) {
        current_t += (10.0 - alt) / climbRate;
        t_arr.push(current_t); z_arr.push(alt); v_arr.push(0);
    }
    
    if (flightData.x && flightData.x.length > 0) {
        for (let i = 1; i < flightData.x.length; i++) {
            let dx = flightData.x[i] - flightData.x[i-1];
            let dy = flightData.y[i] - flightData.y[i-1];
            let dist = Math.hypot(dx, dy);
            let seg_speed = flightData.v && flightData.v[i] !== undefined ? flightData.v[i] : speed;
            let dt = dist / (seg_speed > 0 ? seg_speed : speed);
            current_t += dt;
            t_arr.push(current_t);
            z_arr.push(alt);
            v_arr.push(Math.max(0, seg_speed));
        }
    }
    
    // Descent structurally maps cleanly back to 0
    current_t += alt / climbRate;
    t_arr.push(current_t);
    z_arr.push(0);
    v_arr.push(0);
    
    tsTraces.push({
      x: t_arr, y: z_arr, name: 'Altitude (m)', type: 'scatter', mode: 'lines', line: { color: '#22c55e', width: 2 }, fill: 'tozeroy', fillcolor: 'rgba(34, 197, 94, 0.2)', yaxis: 'y1'
    });
    
    if (flightData.v && flightData.v.length > 0) {
      tsTitle = 'UAS Pre-Flight Trajectory (Altitude & Regulated Velocity)';
      tsTraces.push({
        x: t_arr, y: v_arr, name: 'Velocity (m/s)', type: 'scatter', mode: 'lines', fill: 'tozeroy', fillcolor: 'rgba(0, 229, 255, 0.1)', line: { color: '#00e5ff', width: 2, dash: 'dot' }, yaxis: 'y3'
      });
    }
  } else if (flightData && flightData.timeseries && flightData.timeseries.length > 0 && activeTab !== 'sensors' && activeTab !== 'grid' && activeTab !== 'plume') {
    const ts = flightData.timeseries;
    const t = animFrame >= 0 ? ts.map((pt: any) => pt.t_sec).slice(0, animFrame + 1) : ts.map((pt: any) => pt.t_sec);
    const ch4 = animFrame >= 0 ? ts.map((pt: any) => pt.ch4_ppb <= 1.0 ? null : pt.ch4_ppb).slice(0, animFrame + 1) : ts.map((pt: any) => pt.ch4_ppb <= 1.0 ? null : pt.ch4_ppb);
    const c2h6 = animFrame >= 0 ? ts.map((pt: any) => pt.c2h6_ppb <= 0.05 ? null : pt.c2h6_ppb).slice(0, animFrame + 1) : ts.map((pt: any) => pt.c2h6_ppb <= 0.05 ? null : pt.c2h6_ppb);
    const v_mps = animFrame >= 0 ? ts.map((pt: any) => pt.v_mps).slice(0, animFrame + 1) : ts.map((pt: any) => pt.v_mps);
    
    tsTraces.push({
      x: t, y: ch4, name: 'CH4 (ppb)', type: 'scatter', mode: 'lines', line: { color: '#00e5ff', width: 1.5 }, yaxis: 'y1'
    });
    tsTraces.push({
      x: t, y: c2h6, name: 'C2H6 (ppb)', type: 'scatter', mode: 'lines', line: { color: '#ffab00', width: 1.5 }, yaxis: 'y1'
    });
    
    tsTitle = 'UAS Sensor Telemetry';
  }

    let isHistogramMode = (['grid', 'plume'].includes(activeTab || '') || (['flight', 'adaptive'].includes(activeTab || '') && !flightData)) && tsTraces.length > 0 && tsTraces[0].type === 'histogram';
  let isSensorMode = activeTab === 'sensors' && sensorConfig !== null;
  
  let yAxis1Title = '[CH4] (ppb)';
  if (isHistogramMode) yAxis1Title = 'Pixel Count';
  else if (flightData && !flightData.timeseries && ['flight', 'adaptive'].includes(activeTab || '')) yAxis1Title = 'Altitude (m AGL)';

  const hw = plumeData?.metadata?.hw_ratio ? plumeData.metadata.hw_ratio.toFixed(2) : "0.00";

  const tsAnnotations: any[] = [];

  return (
    <div className="w-full flex flex-col gap-4 h-full flex-1">
      <div className={`w-full ${isSensorMode ? 'hidden' : 'h-[600px]'} shrink-0 bg-[#0d1117] rounded-xl border border-[#00e5ff]/20 overflow-hidden shadow-[0_0_15px_rgba(0,229,255,0.1)] relative`}>
        {['plume', 'sensors'].includes(activeTab || '') && plumeData && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 border border-[#ffab00]/30 p-2.5 rounded-lg backdrop-blur-md shadow-lg transition-all hover:bg-black/80">
            <label className="text-xs uppercase tracking-wider font-semibold text-[#b0c4de] cursor-pointer flex items-center gap-2 select-none">
              <input 
                type="checkbox" 
                checked={showBgWithPlume}
                onChange={(e) => setShowBgWithPlume(e.target.checked)}
                className="w-4 h-4 rounded border-[#ffab00]/50 bg-black/50 accent-[#ffab00] cursor-pointer"
              />
              Merge Ambient Background Data
            </label>
          </div>
        )}
        
        {/* Establish Explicit Mapping Bounds Native Extents Guaranteeing Fixed Aspect Ratios Over Ticks */}
        {(() => {
            // As explicitly requested, always assign identical fixed 1500m bounding boxes mathematically.
            const mapXRange: [number, number] = [0, 1500];
            const mapYRange: [number, number] = [0, 1500];
            
            const customLayout: any = { 
                ...defaultLayout, 
                uirevision: true,
                annotations: mapAnnotations, 
                shapes: mapShapes 
            };
            
            customLayout.xaxis = { ...customLayout.xaxis, range: mapXRange, autorange: false };
            customLayout.yaxis = { ...customLayout.yaxis, range: mapYRange, autorange: false };

            return (
                <>
                  {/* @ts-ignore */}
                  <Plot
                    data={traces as any}
                    layout={customLayout}
                    revision={current_t_sec}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%' }}
                    config={{ responsive: true, displayModeBar: true }}
                  />
                </>
            );
        })()}
      </div>
      
      {tsTraces.length > 0 && (
        <div className="w-full flex-1 shrink-0 flex gap-4 min-h-[300px]">
          <div className={`${activeTab === 'plume' ? 'w-1/2' : 'w-full'} h-full bg-[#0d1117] rounded-xl border border-[#00e5ff]/20 overflow-hidden shadow-[0_0_15px_rgba(0,229,255,0.1)] relative flex flex-col`}>
             

            
            {/* Mission Timeline Interactive Scrubbing HUD */}
            {flightData?.timeseries?.length > 0 && ['flight', 'adaptive'].includes(activeTab || '') && (
                <div className="w-full max-w-4xl mx-auto mb-3 mt-1 px-4 z-20 shrink-0">
                   <div className="bg-[#0b0f14]/85 border border-[#00e5ff]/30 p-3 pt-2 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.1)] flex flex-col gap-2 transition-all hover:bg-[#0b0f14]/95 hover:border-[#00e5ff]/60">
                       <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                           <span className="text-[#6e7681]">0.0s</span>
                           <span className="text-[#00e5ff] uppercase tracking-widest bg-[#00e5ff]/10 px-4 py-0.5 rounded-full border border-[#00e5ff]/20 flex items-center gap-2">
                               <span className="opacity-70">Mission Timeline Scrub</span> 
                               <span className="text-white">{(animFrame >= 0 ? flightData.timeseries[animFrame]?.t_sec || 0 : flightData.timeseries[flightData.timeseries.length - 1]?.t_sec || 0).toFixed(1)}s</span>
                           </span>
                           <span className="text-[#6e7681]">{flightData.timeseries[flightData.timeseries.length - 1].t_sec.toFixed(1)}s</span>
                       </div>
                       <input 
                           type="range"
                           min={0}
                           max={flightData.timeseries.length - 1}
                           value={animFrame >= 0 ? animFrame : flightData.timeseries.length - 1}
                           onChange={(e) => setAnimFrame(parseInt(e.target.value))}
                           onMouseDown={(e) => e.stopPropagation()}
                           onTouchStart={(e) => e.stopPropagation()}
                           className="w-full h-1.5 bg-[#1f2937] rounded-lg appearance-none cursor-pointer accent-[#00e5ff] hover:accent-[#ffab00] transition-all outline-none"
                           style={{ WebkitAppearance: 'none' }}
                       />
                   </div>
                </div>
            )}
            
            <div className="flex-1 min-h-0 w-full relative">
               {activeTab === 'adaptive' && hitData && hitData.peaks && (
                 <div className="absolute top-2 left-3 z-10 group">
                     <div className="bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/50 px-3 py-1.5 rounded-lg font-bold text-[10px] sm:text-xs cursor-help backdrop-blur-md flex items-center gap-2 shadow-lg hover:bg-[#22c55e]/30 transition-colors">
                         <span>{hitData.peaks.length} Targets Detected</span>
                         <span className="text-[10px] opacity-70 border-l border-[#22c55e]/50 pl-2 hidden sm:block">(Hover to View)</span>
                     </div>
                     <div className="absolute top-full left-0 mt-2 w-72 bg-[#0d1117]/95 border border-[#00e5ff]/30 rounded-xl p-3 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                         <div className="text-xs uppercase tracking-wider text-[#b0c4de] font-semibold border-b border-white/10 pb-2 mb-2">Target Summary Table</div>
                         <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                             {hitData.peaks.map((p: any, i: number) => (
                                 <div key={i} className="flex justify-between items-center bg-black/40 p-2 rounded border border-white/5 text-sm">
                                    <div>
                                       <span className="text-[#00e5ff] font-mono mr-2">#{i+1}</span>
                                       <span className="opacity-80 font-mono text-[#b0c4de]">{p.time_sec.toFixed(1)}s</span>
                                    </div>
                                    <div className="flex gap-3 text-right">
                                        <span className="text-[#b0c4de]"><span className="opacity-50 pr-1">Conf:</span><span className={(p.confidence >= (hitDetectionConfig?.adaptive_threshold || 0.40) ? "text-[#22c55e]" : "text-[#ffab00]")}>{p.confidence.toFixed(2)}</span></span>
                                    </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>
              )}
            {/* @ts-ignore */}
            <Plot
              data={tsTraces as any}
              layout={{
                title: tsTitle,
                xaxis: { 
                    title: { text: isHistogramMode ? '[CH4] (ppb)' : (!isSensorMode ? 'Flight Time (s)' : ''), font: { color: isHistogramMode ? '#00e5ff' : '#b0c4de', size: 14 } }, 
                    tickfont: { color: isHistogramMode ? '#00e5ff' : '#b0c4de' },
                    automargin: true,
                    ...(isSensorMode ? { 
                        range: [0, 30], showticklabels: false, zeroline: false,
                        showgrid: true, gridcolor: 'rgba(255,255,255,0.12)',
                        showline: true, linewidth: 1, linecolor: 'rgba(255,255,255,0.3)', mirror: true,
                        domain: [0.08, 1.0]
                    } : {}),
                    ...(activeTab === 'adaptive' && hitData ? { domain: [0.08, 0.95] } : {})
                },
                ...(isHistogramMode ? {
                    xaxis2: { 
                        title: { text: '[C2H6] (ppb)', font: { color: '#ffab00', size: 14 } }, 
                        overlaying: 'x', side: 'top', 
                        tickfont: { color: '#ffab00' },
                        automargin: true,
                        visible: true 
                    }
                } : {
                    xaxis2: { visible: false }
                }),
                yaxis: { 
                  title: { text: yAxis1Title, font: { color: isHistogramMode ? '#b0c4de' : (yAxis1Title.includes('Altitude') ? '#22c55e' : '#00e5ff'), size: 14 } },
                  tickfont: { color: isHistogramMode ? '#b0c4de' : (yAxis1Title.includes('Altitude') ? '#22c55e' : '#00e5ff') },
                  automargin: true,
                  autorange: true,
                  rangemode: yAxis1Title.includes('Altitude') ? 'tozero' : 'normal'
                },
                ...(isHistogramMode ? {
                    yaxis2: { visible: false }
                } : {
                    yaxis2: {
                      title: { text: '[C2H6] (ppb)', font: { color: '#ffab00', size: 14 } },
                      tickfont: { color: '#ffab00' },
                      overlaying: 'y',
                      side: activeTab === 'adaptive' && hitData ? 'left' : 'right',
                      position: activeTab === 'adaptive' && hitData ? 0.0 : undefined,
                      automargin: true,
                      visible: false
                    }
                }),
                ...(activeTab === 'adaptive' && hitData ? {
                    yaxis3: {
                      title: { text: 'Confidence (0-1)', font: { color: '#22c55e', size: 14 } },
                      range: [0, 1.05],
                      tickfont: { color: '#22c55e' },
                      overlaying: 'y',
                      side: 'right',
                      automargin: true,
                      visible: true
                    }
                } : (flightData && activeTab === 'flight' && tsTraces.some(t => t.name === 'Velocity (m/s)') ? {
                    yaxis3: {
                      title: { text: 'Velocity (m/s)', font: { color: '#00e5ff', size: 14 } },
                      tickfont: { color: '#00e5ff' },
                      overlaying: 'y',
                      side: 'right',
                      rangemode: 'normal',
                      automargin: true,
                      visible: true
                    }
                } : {})),
                ...(isSensorMode ? {
                    xaxis3: {
                        anchor: 'y3', matches: 'x', showticklabels: false, zeroline: false,
                        showgrid: true, gridcolor: 'rgba(255,255,255,0.12)',
                        showline: true, linewidth: 1, linecolor: 'rgba(255,255,255,0.3)', mirror: true,
                        domain: [0.08, 1.0]
                    },
                    xaxis5: {
                        anchor: 'y5', matches: 'x', title: { text: 'Flight Time (s)', font: { color: '#b0c4de', size: 14 } },
                        tickfont: { color: '#b0c4de', size: 12 }, showticklabels: true, zeroline: false, automargin: true,
                        showgrid: true, gridcolor: 'rgba(255,255,255,0.12)',
                        showline: true, linewidth: 1, linecolor: 'rgba(255,255,255,0.3)', mirror: true,
                        domain: [0.08, 1.0]
                    },
                    yaxis: {
                       title: { text: 'CH4 (ppb)', font: { color: '#00e5ff', size: 13 } }, tickfont: { color: '#00e5ff', size: 12 },
                       autorange: true,
                       domain: [0.68, 1.0], automargin: true,
                       showgrid: true, gridcolor: 'rgba(255,255,255,0.08)',
                       showline: true, linewidth: 1, linecolor: 'rgba(255,255,255,0.3)', mirror: true
                    },
                    yaxis2: { 
                        title: { text: 'C2H6 (ppb)', font: { color: '#ffab00', size: 13 } }, tickfont: { color: '#ffab00', size: 12 },
                        overlaying: 'y', side: 'left', anchor: 'free', position: 0.0, automargin: true, visible: true,
                        autorange: true, showgrid: false
                    },
                    yaxis3: {
                        title: { text: 'North (m)', font: { color: '#22c55e', size: 13 } }, tickfont: { color: '#22c55e', size: 12 },
                        domain: [0.35, 0.65], automargin: true, visible: true,
                        showgrid: true, gridcolor: 'rgba(255,255,255,0.08)',
                        showline: true, linewidth: 1, linecolor: 'rgba(255,255,255,0.3)', mirror: true
                    },
                    yaxis4: {
                        title: { text: 'East (m)', font: { color: '#10b981', size: 13 } }, tickfont: { color: '#10b981', size: 12 },
                        overlaying: 'y3', side: 'right', automargin: true, visible: true,
                        showgrid: false
                    },
                    yaxis5: {
                        title: { text: 'Wind Dir (°)', font: { color: '#8b5cf6', size: 13 } }, tickfont: { color: '#8b5cf6', size: 12 },
                        domain: [0.0, 0.32], range: [-10, 370], automargin: true, visible: true,
                        showgrid: true, gridcolor: 'rgba(255,255,255,0.08)',
                        showline: true, linewidth: 1, linecolor: 'rgba(255,255,255,0.3)', mirror: true
                    },
                    yaxis6: {
                        title: { text: 'Wind Spd (m/s)', font: { color: '#6366f1', size: 13 } }, tickfont: { color: '#6366f1', size: 12 },
                        overlaying: 'y5', side: 'right', automargin: true, visible: true,
                        showgrid: false
                    },
                    yaxis7: {
                        title: { text: 'Confidence (0-1)', font: { color: '#22c55e', size: 13 } }, tickfont: { color: '#22c55e', size: 12 },
                        overlaying: 'y', side: 'right', position: 1.0, automargin: true, visible: true, range: [-0.05, 1.05],
                        showgrid: false
                    }
                } : {}),
                template: 'plotly_dark',
                autosize: true,
                margin: { t: isSensorMode ? 25 : 40, b: isSensorMode ? 30 : 40, l: 40, r: 40 },
                plot_bgcolor: '#0d1117',
                paper_bgcolor: '#0d1117',
                font: { color: '#b0c4de' },
                shapes: tsShapes,
                annotations: isSensorMode ? tsAnnotations : undefined,
                barmode: isHistogramMode ? 'overlay' : undefined,
                legend: { 
                    orientation: 'h', 
                    y: isSensorMode ? 1.05 : 1.15, 
                    x: 1.0, 
                    xanchor: 'right', 
                    yanchor: 'bottom',
                    bgcolor: 'rgba(13, 17, 23, 0.0)' 
                }
               }}
               useResizeHandler={true}
               style={{ width: '100%', height: '100%' }}
               config={{ responsive: true, displayModeBar: false }}
             />
            </div>
          </div>

          {activeTab === 'plume' && (
             <div className="w-1/2 h-full bg-[#0b0f14] rounded-xl border border-[#f59e0b]/20 overflow-hidden shadow-[0_0_15px_rgba(245,158,11,0.1)] relative">
                <div className="absolute top-3 right-3 bg-black/60 border border-[#f59e0b]/40 p-2.5 rounded-lg z-10 font-mono text-[10px] sm:text-xs backdrop-blur-md">
                    <div className="text-[#f59e0b] font-bold mb-1.5 flex items-center"><span className="mr-1.5 opacity-80">⬢</span> 3D PLUME TOPOLOGY</div>
                    <div className="text-gray-300">Z-Axis Exaggeration: <span className="text-[#00e5ff]">10x</span></div>
                    <div className="text-gray-300">Est. Aspect (H/W): <span className="text-[#00e5ff]">{hw}</span></div>
                    <div className="text-gray-300">Dist of Max Conc @ Meas Alt: <span className="text-[#00e5ff]">{volumeData.maxDist}m</span></div>
                </div>
                
                {/* @ts-ignore */}
                <Plot
                  data={volumeData.traces}
                  layout={{
                    scene: {
                      xaxis: { title: 'Downwind (m)', color: '#6e7681', exponentformat: 'none' },
                      yaxis: { title: 'Crosswind (m)', color: '#6e7681', exponentformat: 'none' },
                      zaxis: { title: 'Altitude (m)', color: '#6e7681', exponentformat: 'none', range: [0, volumeData.zMax] },
                      aspectmode: 'manual',
                      // Explicitly lock X and Y to true 1:1, structurally map Z natively with precisely 10x vertical exaggeration
                      aspectratio: { x: 1, y: 1.0, z: Math.max((volumeData.zMax / 1000.0) * 10.0, 0.15) },
                      camera: { eye: { x: -1.7, y: -1.7, z: 0.6 } }
                    },
                    template: 'plotly_dark',
                    autosize: true,
                    margin: { t: 0, b: 0, l: 0, r: 0 },
                    plot_bgcolor: '#0b0f14',
                    paper_bgcolor: '#0b0f14',
                  }}
                  useResizeHandler={true}
                  style={{ width: '100%', height: '100%' }}
                  config={{ responsive: true, displayModeBar: false }}
                />
             </div>
          )}
        </div>
      )}
    </div>
  );
}
