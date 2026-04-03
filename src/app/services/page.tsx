import { ArrowRight, Activity, Cpu, Anchor, ShieldCheck, Leaf, Map } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Services | AdaptiveSensing.io",
  description: "Specialized engineering and analytical sensing services for Atmospheric, Field, and Subsea environments.",
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="relative border-b border-slate-800 bg-[#0c0c0c] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-100 mb-4 font-sans">
              Specialized Engineering Services
            </h1>
            <p className="text-xl text-slate-400 font-sans">
              Deployable chemical and physical analysis solutions for mission-critical, high-stakes environments.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* Atmospheric Sensing */}
        <section id="atmospheric">
          <div className="flex items-center space-x-3 mb-8">
            <Activity className="h-8 w-8 text-cyan" />
            <h2 className="text-3xl font-bold text-slate-200 font-sans">Atmospheric Sensing</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                Precision mapping of complex atmospheric plumes and fugitive emissions in realtime. Utilizing UAV integration for scalable data collection and high-resolution mass spectrometry.
              </p>
              <ul className="space-y-4 font-sans text-slate-300">
                <li className="flex items-start">
                  <span className="text-cyan mr-2 font-mono">{">"}</span>
                  Deterministic Source Attribution Mapping
                </li>
                <li className="flex items-start">
                  <span className="text-cyan mr-2 font-mono">{">"}</span>
                  UAV Sensor Payload Integration
                </li>
                <li className="flex items-start">
                  <span className="text-cyan mr-2 font-mono">{">"}</span>
                  Fugitive Emissions Tracking for Industrial & Defense Sectors
                </li>
              </ul>
            </div>
            <div className="border border-slate-800 rounded-xl bg-slate-900/50 p-2 flex flex-col justify-center">
              <div className="w-full relative rounded-lg border border-slate-800 overflow-hidden">
                  <img src="/images/DroneExampleMap.jpeg" alt="UAV Atmospheric Plume Mapping Dashboard" className="w-full h-auto object-cover opacity-80 mix-blend-screen" />
              </div>
            </div>
          </div>
        </section>

        {/* Seep Hunting & Reservoir Derisking */}
        <section id="seep-hunting">
          <div className="flex items-center space-x-3 mb-8">
            <Map className="h-8 w-8 text-indigo-400" />
            <h2 className="text-3xl font-bold text-slate-200 font-sans">Seep Hunting & Reservoir Derisking</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="order-2 md:order-1 border border-slate-800 rounded-xl bg-slate-900/50 p-6 flex flex-col justify-center">
              <div className="w-full aspect-video bg-[#050505] rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582994464161-12c823fecd24?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 mix-blend-luminosity group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative z-10 text-center space-y-2">
                       <p className="font-mono text-indigo-400 text-sm tracking-widest">[ CHEMICAL_GROUNDTRUTH ]</p>
                      <p className="text-slate-500 text-xs">Phase-protected aromatics detected...</p>
                  </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                Leveraging in-situ Subsea Mass Spectrometry (UMS) to detect rapid advection pathways and phase-protected aromatics directly at the seafloor. Differentiating true reservoir &quot;Live Oil&quot; from aged sediment overprints in real-time.
              </p>
              <ul className="space-y-4 font-sans text-slate-300">
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2 font-mono">{">"}</span>
                  Adaptive Cruise Management & Target-Positive Coring
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2 font-mono">{">"}</span>
                  Pre-drill Gas-Oil Ratio (GOR) Forecasting
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2 font-mono">{">"}</span>
                  Chemical Ground-Truthing of 3D Seismic Traps
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-800">
                 <Link href="https://BCAnalytical.com" target="_blank" className="flex items-center text-slate-300 hover:text-indigo-400 transition-colors">
                   <ShieldCheck className="h-5 w-5 mr-3 text-indigo-400" />
                   Need mission-ready seep hunting instrumentation? Visit www.bcanalytical.com
                 </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Carbon Capture & CCUS */}
        <section id="carbon-capture">
          <div className="flex items-center space-x-3 mb-8">
            <Leaf className="h-8 w-8 text-green-500" />
            <h2 className="text-3xl font-bold text-slate-200 font-sans">Carbon Capture Industry Support</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                Specializing in robust Measurement, Reporting, and Verification (MRV) protocols. Delivering analytical certainty for Carbon Capture, Utilization, and Storage (CCUS) projects operating in environmentally sensitive or deep-sea domains.
              </p>
              <ul className="space-y-4 font-sans text-slate-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-mono">{">"}</span>
                  Inorganic Carbon (DIC) Baseline Profiling
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-mono">{">"}</span>
                  Subsea Leak Detection & Benthic Flux Modeling
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-mono">{">"}</span>
                  Rigorous GHG Compliance & Validation Scrutiny
                </li>
              </ul>
            </div>
            <div className="border border-slate-800 rounded-xl bg-slate-900/50 p-2 flex flex-col justify-center">
              <div className="w-full relative rounded-lg border border-slate-800 overflow-hidden">
                  <img src="/images/CarbonMVP.jpeg" alt="Carbon Capture MRV Dashboard" className="w-full h-auto object-cover opacity-80 mix-blend-screen" />
              </div>
            </div>
          </div>
        </section>

        {/* Custom Software/Firmware */}
        <section id="software">
          <div className="flex items-center space-x-3 mb-8">
            <Cpu className="h-8 w-8 text-amber" />
            <h2 className="text-3xl font-bold text-slate-200 font-sans">Custom Software/Firmware</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
             <div className="order-2 md:order-1 border border-slate-800 rounded-xl bg-slate-950 p-8 flex flex-col space-y-2.5 font-mono text-sm text-slate-400 overflow-x-auto justify-center shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] leading-snug">
                <div>
                  <span className="text-pink-500">import</span> <span>PyCO2SYS</span> <span className="text-pink-500">as</span> <span>pyco2</span>
                </div>
                <div className="mt-2">
                   <span className="text-pink-500">def</span> <span className="text-amber">getGasSolubility</span>(gas, S, T, units, pp):
                </div>
                <div className="pl-4">
                  <span className="text-pink-500">if</span> gas == <span className="text-green-400">'CO2'</span>:
                </div>
                <div className="pl-8 text-slate-500 italic">
                  # Predict DIC parameters enforcing TEOS-10
                </div>
                <div className="pl-8">
                  MW = <span className="text-cyan">44.0095</span>
                </div>
                <div className="pl-8">
                  result = pyco2.sys(par1=pp*<span className="text-cyan">1e6</span>, par2=<span className="text-cyan">8.1</span>,
                </div>
                <div className="pl-16">
                  par1_type=<span className="text-cyan">4</span>, par2_type=<span className="text-cyan">3</span>,
                </div>
                <div className="pl-16">
                  salinity=S, temperature=T, pressure=<span className="text-cyan">0</span>)
                </div>
                <div className="pl-8 mt-2">
                  conc_umol = result[<span className="text-green-400">'aqueous_CO2'</span>]
                </div>
                <div className="pl-8 mt-2">
                  <span className="text-pink-500">return</span> getConcinUnits(conc_umol, MW, S, T, units)
                </div>
             </div>
             <div className="order-1 md:order-2">
              <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                Bridging the gap between embedded hardware control and higher-level algorithmic processing. Developing secure, portable algorithms that protect proprietary IP.
              </p>
              <ul className="space-y-4 font-sans text-slate-300">
                <li className="flex items-start">
                  <span className="text-amber mr-2 font-mono">{">"}</span>
                  Low-Level Hardware Communication Protocols
                </li>
                <li className="flex items-start">
                  <span className="text-amber mr-2 font-mono">{">"}</span>
                  C++ / Python / MATLAB Spectral Deconvolution Arrays
                </li>
                <li className="flex items-start">
                  <span className="text-amber mr-2 font-mono">{">"}</span>
                  Customized Real-time Laboratory GUIs
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Subsea Hardware Integration */}
        <section id="subsea">
          <div className="flex items-center space-x-3 mb-8">
            <Anchor className="h-8 w-8 text-cyan" />
            <h2 className="text-3xl font-bold text-slate-200 font-sans">Subsea Hardware Integration</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                Bringing laboratory-precision analytical sensing to the deepest, most extreme environments on the planet. Surviving high-pressure gradients with autonomous functionality.
              </p>
              <ul className="space-y-4 font-sans text-slate-300">
                <li className="flex items-start">
                  <span className="text-cyan mr-2 font-mono">{">"}</span>
                  High-Pressure Vessel Architecture
                </li>
                <li className="flex items-start">
                  <span className="text-cyan mr-2 font-mono">{">"}</span>
                  ROV Payload Integration
                </li>
                <li className="flex items-start">
                  <span className="text-cyan mr-2 font-mono">{">"}</span>
                  Autonomous Real-Time Deep-Sea Analytics
                </li>
              </ul>
              
              <div className="mt-8 pt-6 border-t border-slate-800">
                 <Link href="https://BCAnalytical.com" target="_blank" className="flex items-center text-slate-300 hover:text-cyan transition-colors">
                   <ShieldCheck className="h-5 w-5 mr-3 text-cyan" />
                   Looking for off-the-shelf COTS subsea systems? Visit www.bcanalytical.com
                 </Link>
              </div>
            </div>
            
            <div className="border border-slate-800 rounded-xl bg-slate-900/50 p-2 flex flex-col justify-center">
              <div className="w-full relative rounded-lg border border-slate-800 overflow-hidden">
                  <img src="/images/Rovintegration.jpeg" alt="ROV Subsea Hardware Integration" className="w-full h-auto object-cover opacity-80 mix-blend-screen" />
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
