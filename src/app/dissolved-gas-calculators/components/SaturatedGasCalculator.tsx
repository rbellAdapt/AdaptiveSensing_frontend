"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, Droplets, Info, MapPin } from "lucide-react";

// Dynamically import the map component to prevent SSR window reference errors
const Maplet = dynamic(() => import("./MapComponent"), { ssr: false });

const REPORTING_UNIT_OPTIONS = [
  { value: "molarity", label: "µmol/L (molarity)" },
  { value: "molinity", label: "µmol/kg-soln (molinity)" },
  { value: "molality", label: "µmol/kg-H2O (molality)" },
  { value: "ppm", label: "mg/kg (ppm)" },
  { value: "ppb", label: "µg/kg (ppb)" },
  { value: "ppt", label: "ng/kg (ppt)" },
];

interface ApiResults {
  seawater?: any;
  concG?: {
    value: number[];
    units: string;
    "nice name": string[];
  };
}

export default function SaturatedGasCalculator() {
  const [temp, setTemp] = useState(10);
  const [tempUnit, setTempUnit] = useState("celsius90");
  const [salt, setSalt] = useState(35);
  const [saltUnit, setSaltUnit] = useState("Salinity(PSS_78)");
  const [pressure, setPressure] = useState(101325);
  const [pressureUnit, setPressureUnit] = useState("Pa");
  const [reportingUnit, setReportingUnit] = useState("molarity");
  const [latitude, setLatitude] = useState(33.00);
  const [longitude, setLongitude] = useState(162.50);

  const [results, setResults] = useState<ApiResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateSaturatedGas = async () => {
    setLoading(true);
    setError(null);
    try {
      // Standard NOAA Atmospheric Gas Mole Fractions
      const atmMoleFractions = [
        0.78084,   // N2
        0.20946,   // O2
        0.00934,   // Ar
        0.00042,   // CO2
        0.00001818, // Ne
        0.00000524, // He
        0.00000192, // CH4
        0.00000114, // Kr
        0.00000055, // H2
        0.00000009  // Xe
      ];
      
      const atmGasNames = ["N2", "O2", "Ar", "CO2", "Ne", "He", "CH4", "Kr", "H2", "Xe"];

      const payload = {
        temp: temp,
        tempUnits: tempUnit,
        salt: salt,
        saltUnits: saltUnit,
        atmPress: pressure,
        atmPressUnits: pressureUnit,
        latitude: latitude,
        longitude: longitude,
        reportingUnits: reportingUnit,
        gasAllNames: atmGasNames,
        moleFractions: atmMoleFractions,
      };

      const apiUrl = "/api/dissolved-gas";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "X-API-Key": "adaptivesensing-internal-react-key"
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-calculate on mount and when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateSaturatedGas();
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [temp, tempUnit, salt, saltUnit, pressure, pressureUnit, reportingUnit, latitude, longitude]);


  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700/50">
              <h3 className="text-[var(--color-cyan)] font-semibold flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Seawater Conditions
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {/* Temp Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Temperature</label>
                <div className="flex gap-2">
                    <input
                    type="number"
                    value={temp}
                    onChange={(e) => setTemp(parseFloat(e.target.value) || 0)}
                    className="w-1/2 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                    />
                    <select
                    value={tempUnit}
                    onChange={(e) => setTempUnit(e.target.value)}
                    className="w-1/2 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                    >
                    <option value="celsius90">°C (ITS-90)</option>
                    <option value="kelvin">K</option>
                    <option value="fahrenheit">°F</option>
                    </select>
                </div>
              </div>

              {/* Salt Input */}
              <div className="space-y-1.5 border-t border-slate-800/50 pt-4">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Dissolved Salts</label>
                <div className="flex gap-2">
                    <input
                    type="number"
                    value={salt}
                    onChange={(e) => setSalt(parseFloat(e.target.value) || 0)}
                    className="w-1/3 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                    />
                    <select
                    value={saltUnit}
                    onChange={(e) => setSaltUnit(e.target.value)}
                    className="w-2/3 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                    >
                    <option value="Salinity(PSS_78)">Salinity (PSS-78)</option>
                    <option value="IonicStrength(mol_kg_H2O)">Mol/kg-soln</option>
                    <option value="IonicStrength(mol_kg_soln)">Mol/kg-H2O</option>
                    <option value="Conductivity(mS_cm)">Conductivity (mS/cm)</option>
                    </select>
                </div>
              </div>

              {/* Pressure Input */}
              <div className="space-y-1.5 border-t border-slate-800/50 pt-4">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Atmospheric Pressure</label>
                <div className="flex gap-2">
                    <input
                    type="number"
                    value={pressure}
                    onChange={(e) => setPressure(parseFloat(e.target.value) || 0)}
                    className="w-1/2 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                    />
                    <select
                    value={pressureUnit}
                    onChange={(e) => setPressureUnit(e.target.value)}
                    className="w-1/2 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                    >
                    <option value="Pa">Pa</option>
                    <option value="kPa">kPa</option>
                    <option value="hPa">hPa</option>
                    <option value="atm">atm</option>
                    <option value="mbar">mbar</option>
                    <option value="inHg">inHg</option>
                    </select>
                </div>
              </div>

              {/* Reporting Units */}
              <div className="space-y-1.5 border-t border-slate-800/50 pt-4 pb-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Result Units</label>
                  <select
                    value={reportingUnit}
                    onChange={(e) => setReportingUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                  >
                    {REPORTING_UNIT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700/50">
              <h3 className="text-slate-300 font-semibold flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-[var(--color-cyan)]" />
                Geographic Location
              </h3>
            </div>
            <div className="p-4 bg-slate-950/50 space-y-4">
              <Maplet lat={latitude} lon={longitude} setLat={setLatitude} setLon={setLongitude} />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Latitude (°)</label>
                  <input
                    type="number"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Longitude (°)</label>
                  <input
                    type="number"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 italic mt-2 leading-relaxed">
                  * Latitude contributes to a small gravitational term affecting depth conversions.<br/>
                  * Lat/Lon coordinates contribute to a compositional term affecting Absolute Salinity via TEOS-10.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700/50">
              <h3 className="text-slate-300 font-semibold flex items-center gap-2 text-sm">
                <Info className="w-4 h-4 text-[var(--color-cyan)]" />
                NOAA Atmospheric Assumptions
              </h3>
            </div>
            <div className="p-4 bg-slate-950/50">
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                The equilibrium calculations use the following standard dry atmospheric mole fractions defined by NOAA:
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-slate-800/50 pb-1"><span className="text-slate-500">N₂</span><span className="text-white">78.084%</span></div>
                <div className="flex justify-between border-b border-slate-800/50 pb-1"><span className="text-slate-500">O₂</span><span className="text-white">20.946%</span></div>
                <div className="flex justify-between border-b border-slate-800/50 pb-1"><span className="text-slate-500">Ar</span><span className="text-white">0.934%</span></div>
                <div className="flex justify-between border-b border-slate-800/50 pb-1"><span className="text-slate-500">CO₂</span><span className="text-white">420 ppm</span></div>
                <div className="flex justify-between border-b border-slate-800/50 pb-1"><span className="text-slate-500">Ne</span><span className="text-white">18.18 ppm</span></div>
                <div className="flex justify-between border-b border-slate-800/50 pb-1"><span className="text-slate-500">He</span><span className="text-white">5.24 ppm</span></div>
                <div className="flex justify-between border-b border-slate-800/50 pb-1"><span className="text-slate-500">CH₄</span><span className="text-white">1.92 ppm</span></div>
                <div className="flex justify-between border-b border-slate-800/50 pb-1"><span className="text-slate-500">Kr</span><span className="text-white">1.14 ppm</span></div>
                <div className="flex justify-between border-b border-slate-800/50 pb-1"><span className="text-slate-500">H₂</span><span className="text-white">0.55 ppm</span></div>
                <div className="flex justify-between border-b border-slate-800/50 pb-1"><span className="text-slate-500">Xe</span><span className="text-white">0.09 ppm</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output Grids */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative min-h-[500px]">
            <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700/50 flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-[var(--color-cyan)]" />
                Equilibrium Results
              </h3>
              {loading && (
                <div className="flex items-center gap-2 text-xs text-[var(--color-cyan)]">
                  <div className="w-3 h-3 rounded-full border-2 border-slate-500 border-t-[var(--color-cyan)] animate-spin" />
                  Calculating...
                </div>
              )}
            </div>

            {error && (
              <div className="m-4 p-3 bg-red-950/50 border border-red-900 text-red-400 rounded-lg text-sm">
                Safety Stop: {error}
              </div>
            )}

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Seawater Properties Table */}
              <div className="space-y-4 relative z-10">
                <h4 className="text-sm font-semibold text-white tracking-wider flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-cyan)]"></div>
                 Seawater Properties
                </h4>
                <div className="rounded border border-slate-800/80 overflow-hidden bg-slate-950/30 text-xs shadow-inner">
                  {[
                    "IS_Temp_C",
                    "Pot_T_ITS90",
                    "Cons_T_ITS90",
                    "Prac_Sal_psu",
                    "Abs_Sal_g_kg",
                    "Chlorinity_g_kg",
                    "Ionic_strength_mol_kg_sw",
                    "IS_Density",
                    "Press_dbar",
                    "Depth_m",
                    "VelofSound_m_s",
                    "HeatCap_J_gK",
                    "VP_atm",
                  ].map((key) => {
                    const prop = results ? (results as any)[key] : null;
                    return (
                      <div
                        key={key}
                        className="grid grid-cols-[1fr_auto] items-center p-2 border-b border-slate-800/40 last:border-0 hover:bg-slate-800/40 transition-colors"
                      >
                        <span className="text-slate-400 truncate pr-2" title={prop?.["nice name"] || key}>
                          {prop ? prop["nice name"] : key.split("_")[0]}
                        </span>
                        <div className="font-mono text-right flex items-baseline justify-end gap-1.5 min-w-[100px]">
                          <span className="text-slate-200">{prop ? prop.value : "---"}</span>
                          <span className="text-slate-600 text-[10px] w-6 text-left">
                            {prop ? prop.units : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dissolved Gas Concentration Table */}
              <div className="space-y-4 relative z-10">
                <h4 className="text-sm font-semibold text-white tracking-wider flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-amber)]"></div>
                 Saturated Gases @ Equilibrium
                </h4>
                <div className="rounded border border-slate-800/80 overflow-hidden bg-slate-950/30 text-xs shadow-inner">
                  <div className="grid grid-cols-[1fr_auto] gap-2 p-2 border-b border-slate-800 bg-slate-800/40 font-semibold text-slate-300">
                    <div>Atmospheric Gas</div>
                    <div className="text-right">Concentration ({reportingUnit})</div>
                  </div>
                  {results?.concG?.["nice name"]?.map((name, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[1fr_auto] items-center p-2 border-b border-slate-800/40 last:border-0 hover:bg-slate-800/40 transition-colors"
                    >
                      <span className="text-slate-400">
                        {name}
                      </span>
                      <div className="font-mono text-right text-[var(--color-amber)] min-w-[100px]">
                        {results.concG?.value[idx]}
                      </div>
                    </div>
                  ))}
                  {!results && (
                    <div className="p-8 text-center text-slate-500 text-xs italic">
                      Awaiting calculation...
                    </div>
                  )}
                </div>
                
                <p className="text-[10px] text-slate-500 italic mt-4 px-2 leading-relaxed">
                  * See the NOAA Atmospheric Assumptions list for the exact dry partial pressures used in this calculation.
                </p>
              </div>
            </div>

            {/* Background Logo Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none mix-blend-screen">
               {/* Decorative Background Element */}
               <div className="w-64 h-64 border border-slate-600 rounded-full rotate-45 transform"></div>
               <div className="w-48 h-48 border border-slate-500 rounded-full rotate-45 transform absolute"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
