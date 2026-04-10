import Link from "next/link";
import { ArrowRight, Activity, Cpu, Anchor, FlaskConical, Cloud, Waves } from "lucide-react";
import TerminalAuditHook from "@/components/ui/TerminalAuditHook";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-20 lg:py-24 bg-background border-b border-slate-800 overflow-hidden">
        {/* Abstract background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-start sm:items-center max-w-full space-x-2 rounded-xl sm:rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1.5 sm:py-1 text-xs sm:text-sm text-cyan backdrop-blur-sm mb-8 font-mono">
              <span className="flex-shrink-0 flex h-2 w-2 rounded-full bg-cyan mt-1 sm:mt-0"></span>
              <span className="text-left leading-relaxed">Advanced Data Science & Instrumentation</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 mb-6 font-sans">
              Deconvolving <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-amber">Complex Sensor Data</span> <br />
              into Actionable Intelligence.
            </h1>

            <p className="max-w-4xl text-lg md:text-xl text-slate-400 mb-10 font-sans leading-relaxed">
              AdaptiveSensing.io is the independent engineering and data science consulting practice of <strong className="text-slate-200 font-semibold whitespace-nowrap">Dr. Ryan Bell</strong>. Bridging PhD-level environmental chemistry with field-deployable engineering to orchestrate end-to-end intelligence pipelines. I design, build, and deploy advanced analytical instrumentation and quantitative models for high-stakes operations in extreme environments.
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
      <section className="py-12 bg-slate-950 border-b border-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-200 font-sans tracking-tight mb-4">Core Consulting Capabilities</h2>
            <p className="max-w-4xl text-slate-400 font-sans text-base leading-relaxed">
              Drawing on 20+ years of experience integrating advanced sensors with real-time data architectures, <span className="whitespace-nowrap">Dr. Bell</span> provides specialized solutions that bridge the gap between academic research and mission-critical commercial operations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="p-6 rounded-xl border border-slate-800 bg-background/50 hover:border-amber/50 transition-colors group flex flex-col h-full">
              <Cpu className="h-10 w-10 text-amber mb-4 group-hover:scale-110 transition-transform flex-shrink-0" />
              <h3 className="text-xl font-semibold mb-3">Agentic Orchestration & Scientific Software</h3>
              <p className="text-slate-400 font-sans text-sm leading-relaxed mb-4">
                Operating as an engineering force-multiplier, I architect and orchestrate autonomous multi-agent AI ecosystems to parallelize full-stack development.<br /><br />
                By bridging the gap between abstract business requirements and targeted machine execution, I safely accelerate complex software lifecycles—ranging from native cyber-physical integrations to cloud-based thermodynamic simulators—all governed under strict architectural locks and rigorous, human-in-the-loop physical validation.
              </p>
              <ul className="mt-auto text-slate-500 text-sm list-disc pl-5 space-y-1.5 marker:text-amber/50">
                <li>Multi-Agent Pipeline Orchestration</li>
                <li>Agile "Persona" Engineering</li>
                <li>Zero-Trust Architectural Governance</li>
                <li>CI/CD Systems Integration and Automation</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-background/50 hover:border-cyan/50 transition-colors group flex flex-col h-full">
              <Activity className="h-10 w-10 text-cyan mb-4 group-hover:scale-110 transition-transform flex-shrink-0" />
              <h3 className="text-xl font-semibold mb-3">Atmospheric Sensing & Plume Modeling</h3>
              <p className="text-slate-400 font-sans text-sm leading-relaxed mb-4">
                Leveraging advanced analytical instrumentation—ranging from integrated mobile laboratories to UAS-mounted trace gas sensors—to conduct high-resolution, real-time chemical tracking. I specialize in Real-Time Data Acquisition System engineering and geospatial data fusion, capturing fugitive emissions (methane, VOCs) across extensive terrain.<br /><br />
                These raw telemetry streams are ultimately synthesized into predictive atmospheric dispersion models.
              </p>
              <ul className="mt-auto text-slate-500 text-sm list-disc pl-5 space-y-1.5 marker:text-cyan/50">
                <li>Real-Time Data Acquisition Systems</li>
                <li>Geospatial Trace Gas & Telemetry Fusion</li>
                <li>High-Resolution Spectroscopic Quantification</li>
                <li>Predictive Atmospheric Dispersion Modeling</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-background/50 hover:border-cyan/50 transition-colors group flex flex-col h-full">
              <Anchor className="h-10 w-10 text-cyan mb-4 group-hover:scale-110 transition-transform flex-shrink-0" />
              <h3 className="text-xl font-semibold mb-3">Extreme Environment Instrumentation</h3>
              <p className="text-slate-400 font-sans text-sm leading-relaxed mb-4">
                As an authority in underwater mass spectrometry, I build mission-critical sensing infrastructure tailored for rigorous deep-water operations. My expertise spans vacuum metrology, membrane interface mechanics, and real-time data acquisition.<br /><br />
                By translating complex physical chemistry into ruggedized terrestrial and subsea payloads, I enable clients to execute target-positive anomaly detection and definitive hydrocarbon seep analysis across extreme deployment environments.
              </p>
              <ul className="mt-auto text-slate-500 text-sm list-disc pl-5 space-y-1.5 marker:text-cyan/50">
                <li>Underwater Mass Spectrometry</li>
                <li>In-Situ Chemical Interface Calibrations</li>
                <li>Ruggedized Subsea Payload Integration</li>
                <li>Sensor-Triggered Target-Positive Sampling</li>
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

          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/interactive-tools/uas-plume-simulator" className="group p-8 rounded-xl border border-slate-700/50 bg-slate-900/20 hover:bg-slate-800/40 hover:border-cyan/50 transition-all flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-cyan/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cloud className="h-6 w-6 text-cyan" />
              </div>
              <h3 className="text-xl font-bold text-slate-200 mb-3">UAS Plume Simulator</h3>
              <p className="text-slate-400 text-sm font-sans mb-6 flex-grow">
                Interactive simulation for modeling atmospheric dispersion, tracing fugitive emissions, and optimizing UAS sensor deployment strategies.
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
                Scientific calculators for oceanographic, atmospheric, and commercial applications. Includes TEOS-10 Seawater Properties, Gas Solutions & Partial Pressures (CO2SYS).
              </p>
              <span className="inline-flex items-center text-amber text-sm font-mono group-hover:underline">
                Explore Suite <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>

            <Link href="/interactive-tools/oil-spill-simulator" className="group p-8 rounded-xl border border-blue-400/30 bg-blue-400/5 hover:bg-blue-400/10 hover:border-blue-400/50 transition-all flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-400/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Waves className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-200 mb-3">Oilspill Simulator with a TAMOC Core</h3>
              <p className="text-slate-400 text-sm font-sans mb-6 flex-grow">
                Dynamic simulation for subsea blowout and methane seep thermodynamics.
              </p>
              <span className="inline-flex items-center text-blue-400 text-sm font-mono group-hover:underline">
                Explore Simulator <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <TerminalAuditHook />
      </div>
    </div>
  );
}
