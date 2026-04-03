'use client';
import React, { useState, useEffect } from 'react';
import GridConfigTab from '@/components/uas-simulator/GridConfigTab';
import PlumeConfigTab from '@/components/uas-simulator/PlumeConfigTab';
import SensorConfigTab from '@/components/uas-simulator/SensorConfigTab';
import FlightConfigTab from '@/components/uas-simulator/FlightConfigTab';
import AdaptiveConfigTab from '@/components/uas-simulator/AdaptiveConfigTab';
import SimulationViewport from '@/components/uas-simulator/SimulationViewport';

export default function Home() {
  const [gridData, setGridData] = useState<any>(null);
  const [gridConfig, setGridConfig] = useState<any>(null);
  const [liveAdaptiveConfig, setLiveAdaptiveConfig] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [plumeData, setPlumeData] = useState<any>(null);
  const [plumeConfig, setPlumeConfig] = useState<any>(null);
  const [sensorConfig, setSensorConfig] = useState<any>(null);
  const [liveSensorConfig, setLiveSensorConfig] = useState<any>({ ch4_lod: 6.0, c2h6_lod: 1.5 });
  const [flightConfig, setFlightConfig] = useState<any>(null);
  const [flightData, setFlightData] = useState<any>(null);
  const [hitData, setHitData] = useState<any>(null);
  
  const [hitDetectionConfig, setHitDetectionConfig] = useState<any>({ 
    detection_sigma: 3.0, 
    correlation_window: 20, 
    group_time_threshold_sec: 10.0, 
    group_ratio_tolerance: 0.3 
  });
  
  // Accordion active tab state
  const [activeTab, setActiveTab] = useState<'grid' | 'plume' | 'sensors' | 'flight' | 'adaptive'>('grid');

  const [demoTimeseries, setDemoTimeseries] = useState<any>(null);
  const [demoHitData, setDemoHitData] = useState<any>(null);

  useEffect(() => {
    if (activeTab === 'sensors' && liveSensorConfig) {
      const timeoutId = setTimeout(() => {
        const ts: any[] = [];
        const ch4Lod = liveSensorConfig.ch4_lod || 10.0;
        const c2h6Lod = liveSensorConfig.c2h6_lod || 1.5;
        const ch4_std = ch4Lod / 3.0;
        const c2h6_std = c2h6Lod / 3.0;
        const gpsHz = sensorConfig?.gps_hz || 10.0;
        const anemometerHz = sensorConfig?.anemometer_hz || 10.0;
        const gasHz = sensorConfig?.gas_hz || 2.0;
        const masterHz = Math.max(gpsHz, anemometerHz, gasHz);
        const windIntJitter = liveSensorConfig.wind_int_jitter_ms || 0.2;
        const windAngJitter = liveSensorConfig.wind_ang_jitter_deg || 5.0;
        const gpsJitterMeters = liveSensorConfig.gps_jitter_m || 1.0;
        const percentC2h6 = plumeConfig?.percent_c2h6 ?? 5.0;
        const c2Ratio = percentC2h6 / 100.0;
        const speedMs = 15.0;
        const ch_base = gridConfig?.ch4_mean || 1950.0;
        const c2_base = gridConfig?.c2h6_mean || 1.5;

        let seed = liveSensorConfig.random_seed ? Math.floor(liveSensorConfig.random_seed * 1000000) : 42;
        const stableRandom = () => {
          const x = Math.sin(seed++) * 10000;
          return x - Math.floor(x);
        };
        const getNoise = (std: number) => {
          let u = 0, v = 0;
          while(u === 0) u = stableRandom();
          while(v === 0) v = stableRandom();
          return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * std;
        };
        
        let last_x = 0, last_y = 0, last_u = 0, last_v = 0, last_wind_dir = 270.0;
        let last_ch4 = ch_base, last_c2h6 = c2_base;
        
        let next_gps_time = 0;
        let next_anemometer_time = 0;
        let next_gas_time = 0;

        for (let i = 0; i <= 30 * masterHz; i++) {
          const time = i / masterHz;
          
          if (time >= next_gps_time - 0.0001) {
              last_x = speedMs * time + getNoise(gpsJitterMeters);
              last_y = getNoise(gpsJitterMeters);
              next_gps_time += 1.0 / gpsHz;
          }
          
          if (time >= next_anemometer_time - 0.0001) {
              let curWindAng = 270.0 + getNoise(windAngJitter);
              if (curWindAng < 0) curWindAng += 360;
              else if (curWindAng >= 360) curWindAng -= 360;
              
              const speed = Math.max(0, 4.8 + getNoise(windIntJitter));
              last_u = speed * Math.cos(curWindAng * Math.PI / 180.0);
              last_v = Math.min(speed * Math.sin(curWindAng * Math.PI / 180.0), 0);
              last_wind_dir = curWindAng;
              next_anemometer_time += 1.0 / anemometerHz;
          }
          
          if (time >= next_gas_time - 0.0001) {
              const gaussian_shape = Math.exp(-Math.pow(time - 15.0, 2) / (2 * Math.pow(1.5, 2)));
              const ch4_enhancement = 20.0 * ch4_std * gaussian_shape;
              const c2h6_enhancement = ch4_enhancement * c2Ratio;
              
              last_ch4 = Math.max(0, ch_base + getNoise(ch4_std) + ch4_enhancement);
              last_c2h6 = Math.max(0, c2_base + getNoise(c2h6_std) + c2h6_enhancement);
              next_gas_time += 1.0 / gasHz;
          }
          
          ts.push({
            t_sec: time,
            x: last_x,
            y: last_y,
            u: last_u,
            v: last_v,
            ch4_ppb: last_ch4,
            c2h6_ppb: last_c2h6,
            wind_dir_noisy: last_wind_dir,
            is_adaptive_turn: false
          });
        }
        setDemoTimeseries(ts);
        
        const enhancedConfig = {
          ...hitDetectionConfig,
          wind_direction_deg: 270,
          wind_speed_at_10m_mph: 4.8 * 2.237,
          stability_class: "D",
          measurement_altitude: 50.0,
          confidence_threshold: liveAdaptiveConfig?.confidenceThreshold || 0.0,
          source_estimation_method: "optimizer_with_mask",
          enable_proximity_clustering: liveAdaptiveConfig?.enableProximityClustering ?? true
        };
        
        fetch('/api/simulate/analyze_hits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timeseries: ts, config: enhancedConfig })
        })
        .then(r => r.json())
        .then(data => setDemoHitData(data))
        .catch(e => console.error(e));
        
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [liveSensorConfig, hitDetectionConfig, activeTab, sensorConfig]);

  const handleAnalyzeHits = async (config: any, overrideTimeseries?: any) => {
    const ts = overrideTimeseries || (flightData ? flightData.timeseries : null);
    if (!ts || !gridConfig) return;
    try {
      const enhancedConfig = {
        ...config,
        wind_direction_deg: gridConfig.wind_direction_deg,
        wind_speed_at_10m_mph: gridConfig.wind_speed_at_10m_mph,
        stability_class: gridConfig.stability_class,
        measurement_altitude: gridConfig.measurement_altitude,
        confidence_threshold: liveAdaptiveConfig?.confidenceThreshold || 0.0,
        source_estimation_method: config.source_estimation_method || "optimizer_with_mask",
        enable_proximity_clustering: liveAdaptiveConfig?.enableProximityClustering ?? true
      };
      const response = await fetch('/api/simulate/analyze_hits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeseries: ts, config: enhancedConfig })
      });
      const data = await response.json();
      setHitData(data);
    } catch(err) {
      console.error(err);
    }
  };

  const handleMasterSimulate = async () => {
    if (!gridConfig || !plumeConfig || !sensorConfig || !flightConfig || !hitDetectionConfig || !liveAdaptiveConfig) return;
    setIsSimulating(true);
    
    const payload = {
      grid: gridConfig,
      plume: plumeConfig,
      sensors: sensorConfig,
      flight: flightConfig,
      adaptive: {
        enabled: true,
        hit_count_before_trigger: liveAdaptiveConfig.hitCountBeforeTrigger,
        confidence_threshold: liveAdaptiveConfig.confidenceThreshold,
        action_routine: liveAdaptiveConfig.actionRoutine || "return_to_base",
        random_seed: Math.random()
      },
      hit_detection: {
        ...hitDetectionConfig,
        cone_flexibility_multiplier: liveAdaptiveConfig.coneFlexibility,
        wind_direction_deg: gridConfig.wind_direction_deg,
        stability_class: gridConfig.stability_class,
        source_estimation_method: liveAdaptiveConfig.sourceMethod,
        group_time_threshold_sec: liveAdaptiveConfig.groupTimeThreshold,
        group_ratio_tolerance: liveAdaptiveConfig.groupRatioTolerance,
        confidence_threshold: liveAdaptiveConfig.confidenceThreshold,
        random_seed: Math.random()
      },
      random_seed: Math.random()
    };
    
    try {
      const res = await fetch('/api/simulate/mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      
      const mergedHitCfg = { ...payload.hit_detection, adaptive_threshold: payload.adaptive.confidence_threshold };
      setHitDetectionConfig(mergedHitCfg);
      setFlightData({ ...data.path, timeseries: data.timeseries, snapshots: data.snapshots });
      handleAnalyzeHits(mergedHitCfg, data.timeseries);
      
    } catch (err: any) {
      console.error(err);
      alert("Simulation failed.");
    }
    setIsSimulating(false);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#b0c4de] p-8 font-sans selection:bg-[#00e5ff] selection:text-[#0d1117] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00e5ff]/5 via-[#0d1117] to-black">
      <header className="mb-4 border-b border-[#00e5ff]/30 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#b0c4de]">
            UAS <span className="text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">Plume Simulator</span>
          </h1>
          <p className="opacity-70 mt-2 text-sm tracking-wide">Adaptive Decision Support for Environmental Monitoring</p>
        </div>
        <div className="flex items-center gap-4 text-sm font-mono opacity-80 backdrop-blur-sm bg-black/20 p-3 rounded-full border border-green-500/30">
          <span className="flex items-center gap-2 text-green-400">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,1)]"></span>
            System Online
          </span>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-2">
          <GridConfigTab 
            isOpen={activeTab === 'grid'}
            onToggle={() => setActiveTab('grid')}
            onSimulationSuccess={(data: any, config: any) => {
              setGridData(data);
              setGridConfig(config);
              setPlumeData(null);
              setPlumeConfig(null);
              setSensorConfig(null);
              setFlightData(null);
              setHitData(null);
            }} 
          />
          <PlumeConfigTab 
            isOpen={activeTab === 'plume'}
            onToggle={() => setActiveTab('plume')}
            gridConfig={gridConfig} 
            onSimulationSuccess={(data: any, config: any) => {
              setPlumeData(data);
              setPlumeConfig(config);
            }} 
            disabled={!gridData} 
            suggestedReady={!!gridData && !plumeData}
          />
          <SensorConfigTab 
            isOpen={activeTab === 'sensors'}
            onToggle={() => setActiveTab('sensors')}
            onPreviewUpdate={setLiveSensorConfig}
            onSimulationSuccess={setSensorConfig} 
            hitDetectionConfig={hitDetectionConfig}
            onHitDetectionUpdate={setHitDetectionConfig}
            disabled={!plumeData} 
            suggestedReady={!!plumeData && !sensorConfig}
          />
          <FlightConfigTab 
            isOpen={activeTab === 'flight'}
            onToggle={() => setActiveTab('flight')}
            gridConfig={gridConfig}
            plumeConfig={plumeConfig}
            sensorConfig={sensorConfig}
            onSimulationSuccess={(config: any, plannedPath: any) => {
              setFlightConfig(config);
              setFlightData(plannedPath);
            }}
            disabled={!sensorConfig}
            suggestedReady={!!sensorConfig && !flightData}
          />
          <AdaptiveConfigTab 
            isOpen={activeTab === 'adaptive'}
            onToggle={() => setActiveTab('adaptive')}
            gridConfig={gridConfig}
            plumeConfig={plumeConfig}
            sensorConfig={sensorConfig}
            flightConfig={flightConfig}
            hitDetectionConfig={hitDetectionConfig}
            onConfigUpdate={setLiveAdaptiveConfig}
            disabled={!flightConfig}
            suggestedReady={!!flightData}
          />
          
          <div className="mt-4 border-t border-purple-500/30 pt-4">
              <button 
                onClick={handleMasterSimulate}
                disabled={!gridConfig || !flightConfig || isSimulating || !liveAdaptiveConfig}
                title={(!gridConfig || !flightConfig) ? "Grid AND Flight Paths must be locked before execution." : "Execute full timeline."}
                className={`w-full py-4 rounded-xl font-extrabold tracking-widest uppercase transition-all flex items-center justify-center gap-3 ${!gridConfig || !flightConfig ? 'bg-black/40 text-white/20 cursor-not-allowed border border-white/5' : isSimulating ? 'bg-purple-900/40 text-purple-400 border border-purple-700/50 cursor-wait' : 'bg-purple-500/20 text-purple-400 border-2 border-purple-500/50 hover:bg-purple-500/30 hover:border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] cursor-pointer'}`}
              >
                {isSimulating ? (
                  <> <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Generating Timeline... </>
                ) : (
                  '🚀 Simulate & Analyze Flight'
                )}
              </button>
          </div>
        </div>
        <div className="lg:col-span-8 backdrop-blur-xl bg-black/10 rounded-xl p-1 border border-white/5 flex flex-col">
          <SimulationViewport gridData={gridData} gridConfig={gridConfig} plumeData={plumeData} plumeConfig={plumeConfig} flightConfig={flightConfig} flightData={flightData} activeTab={activeTab} previewSensorConfig={liveSensorConfig} sensorConfig={sensorConfig} hitData={hitData} hitDetectionConfig={hitDetectionConfig} demoTimeseries={demoTimeseries} demoHitData={demoHitData} />
        </div>
      </main>
    </div>
  );
}
