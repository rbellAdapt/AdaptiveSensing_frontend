"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, BookOpen, AlertCircle } from "lucide-react";
import SaturatedGasCalculator from "./components/SaturatedGasCalculator";
import PartialPressureCalculator from "./components/PartialPressureCalculator";
import DissolvedGasCalculator from "./components/DissolvedGasCalculator";

export default function DissolvedGasCalculatorsPage() {
  const [activeTab, setActiveTab] = useState<"saturated" | "partial" | "dissolved">("saturated");

  return (
    <div className="flex flex-col min-h-screen bg-background text-slate-200">
      
      {/* Header Section */}
      <section className="relative w-full py-16 md:py-24 bg-slate-950 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-[var(--color-cyan)] transition-colors mb-8 font-mono"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 font-sans">
              Seawater Properties & <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-amber)]">Dissolved Gas Calculators</span>
            </h1>
            
            <p className="max-w-3xl text-sm text-slate-500 font-sans leading-relaxed">
              These online calculators are provided by Beaver Creek Analytical, LLC on an "as is" basis. 
              Users assume all risk associated with their use. Beaver Creek Analytical, LLC expressly disclaims 
              any and all liability for errors, inaccuracies, or any expenses or damages resulting from the use 
              of or reliance upon the information provided by these calculators.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Tabs */}
          <div className="flex overflow-x-auto space-x-1 sm:space-x-4 border-b border-slate-800 mb-8 scrollbar-hide">
            <button
              onClick={() => setActiveTab('saturated')}
              className={`whitespace-nowrap px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'saturated' 
                  ? 'text-[var(--color-cyan)] border-[var(--color-cyan)]' 
                  : 'text-slate-400 border-transparent hover:text-white hover:border-slate-700'
              }`}
            >
              Seawater Properties
            </button>
            <button
              onClick={() => setActiveTab('dissolved')}
              className={`whitespace-nowrap px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'dissolved' 
                  ? 'text-[var(--color-cyan)] border-[var(--color-cyan)]' 
                  : 'text-slate-400 border-transparent hover:text-white hover:border-slate-700'
              }`}
            >
              Aqueous Concentration
            </button>
            <button
              onClick={() => setActiveTab('partial')}
              className={`whitespace-nowrap px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'partial' 
                  ? 'text-[var(--color-cyan)] border-[var(--color-cyan)]' 
                  : 'text-slate-400 border-transparent hover:text-white hover:border-slate-700'
              }`}
            >
              Partial Pressure
            </button>
          </div>

          <div className="min-h-[600px]">
            {/* Calculator 1: Seawater Properties & Saturated Gases */}
            {activeTab === 'saturated' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="max-w-4xl">
                  <h2 className="text-3xl font-bold text-white mb-4">Seawater Properties & Saturated Gases</h2>
                  <p className="text-slate-400 mb-6">
                    Calculate the 13 foundational thermodynamic properties of Seawater alongside equilibrium concentrations of standard atmospheric gases based on current NOAA observations.
                  </p>
                </div>
                {/* The React Component */}
                <SaturatedGasCalculator />
              </div>
            )}

            {/* Calculator 2: Dissolved Gas from Partial Pressure */}
            {activeTab === 'dissolved' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="max-w-4xl">
                  <h2 className="text-3xl font-bold text-white mb-4">Dissolved Gas from Partial Pressure</h2>
                  <p className="text-slate-400 mb-6">
                    Calculate the aqueous concentration of dissolved gases in seawater given a specified equilibration gas composition and condition.
                  </p>
                </div>
                
                {/* The React Component */}
                <DissolvedGasCalculator />
                
                <div className="max-w-4xl">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mt-8 text-sm text-slate-300">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-[var(--color-amber)] flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-white font-semibold mb-2">Usage Assumptions</h4>
                        <p className="mb-2">This calculator uses equilibrium formulas from academic literature intended for:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2 text-slate-400">
                          <li>Atmosphere-like gas compositions</li>
                          <li>Barometric pressure near 1 atm</li>
                          <li>Temperature between 0 and 30°C</li>
                          <li>Salinity between 0 and 40 psu</li>
                        </ul>
                        <p className="mt-4 text-xs italic opacity-80">
                          Using input values that go beyond these ranges will generate extrapolations with increasing 
                          levels of uncertainty due to non-ideal effects. The calculator requires mindful use.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Calculator 3: Partial Pressure from Dissolved Gas */}
            {activeTab === 'partial' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="max-w-4xl">
                  <h2 className="text-3xl font-bold text-white mb-4">Partial Pressure from Dissolved Gas</h2>
                  <p className="text-slate-400 mb-6">
                    Calculate the dry partial pressure of gases in seawater given a specified aqueous content and environmental conditions.
                  </p>
                </div>
                
                {/* The React Component */}
                <PartialPressureCalculator />

                <div className="max-w-4xl">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mt-8 text-sm text-slate-300">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-[var(--color-amber)] flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-white font-semibold mb-2">Usage Assumptions</h4>
                        <p className="mb-2">This calculator uses equilibrium formulas from academic literature intended for:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2 text-slate-400">
                          <li>Atmosphere-like gas compositions</li>
                          <li>Barometric pressure near 1 atm</li>
                          <li>Temperature between 0 and 30°C</li>
                          <li>Salinity between 0 and 40 psu</li>
                        </ul>
                        <p className="mt-4 text-xs italic opacity-80">
                          Using input values that go beyond these ranges will generate extrapolations with increasing 
                          levels of uncertainty due to non-ideal effects. The calculator requires mindful use.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Academic Sources Footer */}
      <section className="py-12 bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-6">
              <BookOpen className="w-5 h-5 text-[var(--color-cyan)]" /> Algorithm Sources & Literature
            </h3>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-xs text-slate-500 font-sans">
              <p>McDougall, T.J. and P.M. Barker, 2011: Getting started with TEOS-10 and the Gibbs Seawater (GSW) Oceanographic Toolbox, 28pp., SCOR/IAPSO WG127, ISBN 978-0-646-55621-5.</p>
              <p>Humphreys, M. P., Schiller, A. J., Sandborn, D. E., Gregor, L., Pierrot, D., van Heuven, S. M. A. C., Lewis, E. R., and Wallace, D. W. R. (2024). PyCO2SYS: marine carbonate system calculations in Python. Zenodo. doi:10.5281/zenodo.3744275.</p>
              <p>Garcia, H. E.; Gordon, L. I. Oxygen Solubility in Seawater: Better Fitting Equations. Limnol. Oceanogr. 1992, 37 (6), 1307–1312.</p>
              <p>Hamme, R. C.; Emerson, S. R. The Solubility of Neon, Nitrogen and Argon in Distilled Water and Seawater. Deep Sea Res. Part I 2004, 51 (11), 1517–1528.</p>
              <p>Jenkins, W. J.; Lott, D. E.; Cahill, K. L. A Determination of Atmospheric Helium, Neon, Argon, Krypton, and Xenon Solubility Concentrations in Water and Seawater. Marine Chemistry 2019, 211, 94–107.</p>
              <p>Wiesenburg, D.A.; Guinasso, N.L. Equilibrium Solubilities of Methane, Carbon Monoxide, and Hydrogen in Water and Seawater. J. Chem. Eng. Data, 1979, 24(4), 356–360.</p>
              <p>H. L. Clever and C. L. Young, Eds., IUPAC Solubility Data Series, Vol. 27/28, Methane, Pergamon Press, Oxford, England, 1987.</p>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-900 text-center text-sm text-slate-600">
                © {new Date().getFullYear()} by Beaver Creek Analytical, LLC. All rights reserved.
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
