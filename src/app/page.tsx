import Link from "next/link";
import { ArrowRight, Activity, Cpu, Anchor, FlaskConical, Cloud, Waves } from "lucide-react";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-20 lg:py-24 bg-background border-b border-slate-800 overflow-hidden">
        {/* Abstract background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center space-x-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-sm text-cyan backdrop-blur-sm mb-8 font-mono">
              <span className="flex h-2 w-2 rounded-full bg-cyan"></span>
              <span>Advanced Data Science & Instrumentation</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 mb-6 font-sans">
              Adaptive Decision Support for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-amber">Complex Atmospheric Plumes</span> <br />
              & Extreme Environments.
            </h1>
            
            <p className="max-w-4xl text-lg md:text-xl text-slate-400 mb-10 font-sans leading-relaxed">
              The independent engineering and data science consulting practice of <strong className="text-slate-200 font-semibold">Dr. Ryan Bell</strong>.<br/>
              Specializing in bespoke analytical instrumentation, digital signal processing, and quantitative chemometrics for high-stakes Defense, Subsea, and Industrial applications.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="#tools"
                className="inline-flex items-center justify-center rounded-md bg-cyan px-8 py-3 text-sm font-medium text-black shadow-sm hover:bg-cyan/90 transition-colors font-mono"
              >
                Launch Engineering Tools <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="https://BCAnalytical.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-transparent px-8 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors font-sans text-center"
              >
                Looking for commercial subsea systems? Visit Beaver Creek Analytical.
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Snapshot */}
      <section className="py-12 bg-[#0c0c0c] border-b border-slate-900">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
               <h2 className="text-3xl font-bold text-slate-200 font-sans tracking-tight mb-4">Core Consulting Capabilities</h2>
               <p className="max-w-4xl text-slate-400 font-sans text-base leading-relaxed">
                 Drawing on 20+ years of experience integrating advanced sensors with real-time data architectures, Dr. Bell provides specialized solutions that bridge the gap between academic research and mission-critical commercial operations.
               </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              
              <div className="p-6 rounded-xl border border-slate-800 bg-background/50 hover:border-cyan/50 transition-colors group flex flex-col h-full">
                <Activity className="h-10 w-10 text-cyan mb-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                <h3 className="text-xl font-semibold mb-3">Atmospheric Sensing & Plume Modeling</h3>
                <p className="text-slate-400 font-sans text-sm leading-relaxed mb-4">
                  Integration of UAS platforms with spectroscopic sensors for real-time trace gas quantification. Experience in UAS Plume Simulation and statistical source signature delineation.
                </p>
                <ul className="mt-auto text-slate-500 text-sm list-disc pl-5 space-y-1.5 marker:text-cyan/50">
                  <li>Spectroscopic Trace Gas Quantification</li>
                  <li>UAS Plume Simulation</li>
                  <li>Autonomous Sensing Platform Optimization</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-slate-800 bg-background/50 hover:border-amber/50 transition-colors group flex flex-col h-full">
                <Cpu className="h-10 w-10 text-amber mb-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                <h3 className="text-xl font-semibold mb-3">Scientific Software & Agentic AI</h3>
                <p className="text-slate-400 font-sans text-sm leading-relaxed mb-4">
                  With extensive cross-functional experience in environmental sciences and scientific programming (Python, LabVIEW, and MATLAB), I am equipped to thoroughly review Agentic AI outputs and accelerate the development cycle within a responsible implementation framework.
                </p>
                <ul className="mt-auto text-slate-500 text-sm list-disc pl-5 space-y-1.5 marker:text-amber/50">
                  <li>Sensor Network Engineering</li>
                  <li>Agent Workflows</li>
                  <li>Automated Report Generation</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-slate-800 bg-background/50 hover:border-cyan/50 transition-colors group flex flex-col h-full">
                <Anchor className="h-10 w-10 text-cyan mb-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                <h3 className="text-xl font-semibold mb-3">Extreme-Environment Instrumentation</h3>
                <p className="text-slate-400 font-sans text-sm leading-relaxed mb-4">
                  Authority in chemical interface mechanics and in-situ mass spectrometry. Designing subsea and terrestrial payloads that translate complex physical chemistry into ruggedized "Hardware-as-a-Service" deployments.
                </p>
                <ul className="mt-auto text-slate-500 text-sm list-disc pl-5 space-y-1.5 marker:text-cyan/50">
                  <li>3,000m-Rated System Design</li>
                  <li>ROV/AUV & UAV Payload Integration</li>
                  <li>In-situ Fluidic Calibration Systems</li>
                  <li>Sensor-Triggered, Target-Positive Sample Collection</li>
                </ul>
              </div>

            </div>
            

         </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-slate-800 pb-4 gap-4">
             <h2 className="text-3xl font-bold text-slate-200 font-sans tracking-tight">Interactive Analytical Tools</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/interactive-tools/uas-plume-simulator" className="group p-8 rounded-xl border border-slate-700/50 bg-slate-900/20 hover:bg-slate-800/40 hover:border-cyan/50 transition-all flex flex-col items-center text-center">
               <div className="h-12 w-12 rounded-full bg-cyan/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <Cloud className="h-6 w-6 text-cyan" />
               </div>
               <h3 className="text-xl font-bold text-slate-200 mb-3">UAS Plume Simulator</h3>
               <p className="text-slate-400 text-sm font-sans mb-6 flex-grow">
                 Interactive simulation for modeling atmospheric dispersion and tracing fugitive emissions.
               </p>
               <span className="inline-flex items-center text-cyan text-sm font-mono group-hover:underline">
                 Launch Tool <ArrowRight className="ml-1 h-4 w-4" />
               </span>
            </Link>



            <Link href="/dissolved-gas-calculators" className="group p-8 rounded-xl border border-amber/30 bg-amber/5 hover:bg-amber/10 hover:border-amber/50 transition-all flex flex-col items-center text-center">
               <div className="h-12 w-12 rounded-full bg-amber/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <FlaskConical className="h-6 w-6 text-amber" />
               </div>
               <h3 className="text-xl font-bold text-slate-200 mb-3">Dissolved Gas Calculators</h3>
               <p className="text-slate-400 text-sm font-sans mb-6 flex-grow">
                 TEOS-10 Seawater Properties, Gas Solutions & Partial Pressures (CO2SYS).
               </p>
               <span className="inline-flex items-center text-amber text-sm font-mono group-hover:underline">
                 Explore Suite <ArrowRight className="ml-1 h-4 w-4" />
               </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
