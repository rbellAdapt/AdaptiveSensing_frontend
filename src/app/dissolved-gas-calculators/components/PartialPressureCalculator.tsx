"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ArrowRight } from "lucide-react";

type GasEntry = {
  id: string;
  name: string;
  value: number;
  unit: string;
};

const GAS_OPTIONS = [
  { value: "N2", label: "Nitrogen" },
  { value: "O2", label: "Oxygen" },
  { value: "Ar", label: "Argon" },
  { value: "CO2", label: "Carbon Dioxide" },
  { value: "CH4", label: "Methane" },
  { value: "C2H6", label: "Ethane" },
  { value: "C3H8", label: "Propane" },
  { value: "nC4H10", label: "nButane" },
  { value: "He", label: "Helium" },
  { value: "Ne", label: "Neon" },
  { value: "Kr", label: "Krypton" },
  { value: "Xe", label: "Xenon" },
  { value: "H2", label: "Hydrogen" },
  { value: "CO", label: "Carbon Monoxide" },
];

const UNIT_OPTIONS = [
  { value: "molarity", label: "µmol/L (molarity)" },
  { value: "molinity", label: "µmol/kg-soln (molinity)" },
  { value: "molality", label: "µmol/kg-H2O (molality)" },
  { value: "ppm", label: "mg/kg (ppm)" },
  { value: "ppb", label: "µg/kg (ppb)" },
  { value: "ppt", label: "ng/kg (ppt)" },
];

const REPORTING_UNIT_OPTIONS = [
  { value: "Mole Fraction", label: "Mole Fraction" },
  { value: "Percent", label: "%" },
  { value: "ppthv", label: "ppthv (‰)" },
  { value: "ppmv", label: "ppmv (μatm)" },
  { value: "ppbv", label: "ppbv (natm)" },
  { value: "pptv", label: "pptv" },
];

interface ApiResults {
  seawater?: any;
  partialP?: {
    value: number[];
    units: string;
    "nice name": string[];
  };
  Saturation_Percent?: {
    value: number;
    units: string;
  };
}

export default function DissolvedGasCalculator() {
  const [temp, setTemp] = useState(10);
  const [tempUnit, setTempUnit] = useState("celsius90");
  const [salt, setSalt] = useState(35);
  const [saltUnit, setSaltUnit] = useState("Salinity(PSS_78)");
  const [pressure, setPressure] = useState(101325);
  const [pressureUnit, setPressureUnit] = useState("Pa");
  const [reportingUnit, setReportingUnit] = useState("Percent");

  const [gasEntries, setGasEntries] = useState<GasEntry[]>([
    { id: "1", name: "N2", value: 513.6, unit: "molarity" },
    { id: "2", name: "O2", value: 282.0, unit: "molarity" },
    { id: "3", name: "Ar", value: 13.95, unit: "molarity" },
    { id: "4", name: "CO2", value: 18.85, unit: "molarity" },
    { id: "5", name: "CH4", value: 1.4878, unit: "molarity" },
    { id: "6", name: "C2H6", value: 0.10863, unit: "molarity" },
  ]);

  const [results, setResults] = useState<ApiResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePartialPressure = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        temp: temp,
        tempUnits: tempUnit,
        salt: salt,
        saltUnits: saltUnit,
        atmPress: pressure,
        atmPressUnits: pressureUnit,
        reportingUnits: reportingUnit,
        gasAllNames: gasEntries.map((g) => g.name),
        gasAllConcs: gasEntries.map((g) => g.value),
        gasAllUnits: gasEntries.map((g) => g.unit),
      };

      const apiUrl = "/api/partial-pressure";

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
      calculatePartialPressure();
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [
    temp,
    tempUnit,
    salt,
    saltUnit,
    pressure,
    pressureUnit,
    reportingUnit,
    gasEntries,
  ]);

  const addGasRow = () => {
    setGasEntries([
      ...gasEntries,
      {
        id: Math.random().toString(36).substring(7),
        name: "C2H6",
        value: 0.1,
        unit: "molarity",
      },
    ]);
  };

  const removeGasRow = (id: string) => {
    if (gasEntries.length > 1) {
      setGasEntries(gasEntries.filter((g) => g.id !== id));
    }
  };

  const updateGasEntry = (id: string, field: keyof GasEntry, value: any) => {
    setGasEntries(
      gasEntries.map((g) => (g.id === id ? { ...g, [field]: value } : g))
    );
  };

  const formatGasLabel = (symbol: string) => {
    const option = GAS_OPTIONS.find((opt) => opt.value === symbol);
    return option ? option.label : symbol;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700/50">
              <h3 className="text-[var(--color-cyan)] font-semibold flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Seawater Conditions
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {/* Temp Input */}
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm text-slate-300">Temperature</label>
                <input
                  type="number"
                  value={temp}
                  onChange={(e) => setTemp(parseFloat(e.target.value) || 0)}
                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                />
                <select
                  value={tempUnit}
                  onChange={(e) => setTempUnit(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                >
                  <option value="celsius90">°C (ITS-90)</option>
                  <option value="kelvin">K</option>
                  <option value="fahrenheit">°F</option>
                </select>
              </div>

              {/* Salt Input */}
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm text-slate-300">Dissolved Salts</label>
                <input
                  type="number"
                  value={salt}
                  onChange={(e) => setSalt(parseFloat(e.target.value) || 0)}
                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                />
                <select
                  value={saltUnit}
                  onChange={(e) => setSaltUnit(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                >
                  <option value="Salinity(PSS_78)">Salinity (PSS-78)</option>
                  <option value="IonicStrength(mol_kg_H2O)">
                    Ionic Strength (mol/kg-soln)
                  </option>
                  <option value="IonicStrength(mol_kg_soln)">
                    Ionic Strength (mol/kg-H2O)
                  </option>
                  <option value="Conductivity(mS_cm)">Conductivity (mS/cm)</option>
                </select>
              </div>

              {/* Pressure Input */}
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm text-slate-300">Atm. Pressure</label>
                <input
                  type="number"
                  value={pressure}
                  onChange={(e) => setPressure(parseFloat(e.target.value) || 0)}
                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                />
                <select
                  value={pressureUnit}
                  onChange={(e) => setPressureUnit(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                >
                  <option value="Pa">Pa</option>
                  <option value="kPa">kPa</option>
                  <option value="hPa">hPa</option>
                  <option value="atm">atm</option>
                  <option value="mbar">mbar</option>
                  <option value="inHg">inHg</option>
                </select>
              </div>

              {/* Reporting Units */}
              <div className="grid grid-cols-3 gap-2 items-center pt-2 border-t border-slate-800">
                <label className="text-sm text-slate-300">Reporting Units</label>
                <div className="col-span-2">
                  <select
                    value={reportingUnit}
                    onChange={(e) => setReportingUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                  >
                    {REPORTING_UNIT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700/50 flex justify-between items-center">
              <h3 className="text-[var(--color-amber)] font-semibold flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Dry Gas Content
              </h3>
              <button
                onClick={addGasRow}
                className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Gas
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {gasEntries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-2 relative bg-slate-950/50 p-2 rounded-lg border border-slate-800/50 group hover:border-slate-700 transition-colors"
                  >
                    <button
                      onClick={() => removeGasRow(entry.id)}
                      disabled={gasEntries.length === 1}
                      className="text-slate-500 hover:text-red-400 disabled:opacity-30 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <select
                      value={entry.name}
                      onChange={(e) =>
                        updateGasEntry(entry.id, "name", e.target.value)
                      }
                      className="w-1/3 bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[var(--color-amber)]"
                    >
                      {GAS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      step="any"
                      value={entry.value}
                      onChange={(e) =>
                        updateGasEntry(
                          entry.id,
                          "value",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-1/4 bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[var(--color-amber)]"
                    />
                    <select
                      value={entry.unit}
                      onChange={(e) =>
                        updateGasEntry(entry.id, "unit", e.target.value)
                      }
                      className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[var(--color-amber)]"
                    >
                      {UNIT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output Grids */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative min-h-[500px]">
            <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700/50 flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Calculation Results
              </h3>
              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-3 h-3 rounded-full border-2 border-slate-500 border-t-[var(--color-cyan)] animate-spin" />
                  Computing...
                </div>
              )}
            </div>

            {error && (
              <div className="m-4 p-3 bg-red-950/50 border border-red-900 text-red-400 rounded-lg text-sm">
                Calculation Error: {error}
              </div>
            )}

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Seawater Properties Table */}
              <div className="space-y-3 relative z-10">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Seawater Properties
                </h4>
                <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-950/50 text-sm">
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
                        className="grid grid-cols-[3fr_2fr_1fr] md:grid-cols-[1.5fr_1fr] items-center p-2.5 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors"
                      >
                        <span className="text-slate-300 truncate pr-2" title={prop?.["nice name"] || key}>
                          {prop ? prop["nice name"] : key.split("_")[0]}
                        </span>
                        <div className="font-mono text-right md:-translate-x-4">
                          <span className="text-white">
                            {prop ? prop.value : "---"}
                          </span>
                          <span className="text-slate-500 text-xs ml-1.5 inline-block min-w-[36px] text-left">
                            {prop ? prop.units : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dry Partial Pressure Table */}
              <div className="space-y-3 relative z-10">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Dry Partial Pressure
                </h4>
                <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-950/50 text-sm">
                  <div className="grid grid-cols-[auto_1fr] md:grid-cols-2 gap-4 p-2.5 border-b border-slate-800/50 bg-slate-800/20 text-xs font-semibold text-slate-400">
                    <div>Gas</div>
                    <div className="text-right md:pr-4">Value ({reportingUnit})</div>
                  </div>
                  {results?.partialP?.["nice name"]?.map((name, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[auto_1fr] md:grid-cols-2 items-center p-2.5 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors"
                    >
                      <span className="text-[var(--color-cyan)] font-mono">
                        {formatGasLabel(name)}
                      </span>
                      <div className="font-mono text-right text-white md:pr-4">
                        {results.partialP?.value[idx]}
                      </div>
                    </div>
                  ))}
                  {!results && (
                    <div className="p-4 text-center text-slate-500 text-xs italic">
                      Awaiting calculation...
                    </div>
                  )}
                </div>

                {/* Total Saturation Footer */}
                {results?.Saturation_Percent && (
                  <div className="mt-4 p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg flex justify-between items-center shadow-inner">
                    <span className="text-sm text-slate-300">Total Saturation</span>
                    <span className="font-mono font-bold text-[var(--color-amber)]">
                      {results.Saturation_Percent.value} {results.Saturation_Percent.units}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Background Logo Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none mix-blend-screen">
              <svg width="300" height="300" viewBox="0 0 100 100" className="text-white">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M25 50 L50 25 L75 50 L50 75 Z" fill="none" stroke="currentColor" strokeWidth="4" />
                <circle cx="50" cy="50" r="10" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
