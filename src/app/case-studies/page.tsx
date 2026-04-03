import { Shield, Microscope, Droplets } from "lucide-react";

export const metadata = {
  title: "Case Studies | AdaptiveSensing.io",
  description: "High-stakes analytical integration case studies including DARPA, MKS Instruments, and Deepwater Horizon.",
};

export default function CaseStudiesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="relative border-b border-slate-800 bg-[#0c0c0c] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10 border-l-2 border-cyan pl-6">
          <div className="max-w-3xl">
             <span className="font-mono text-cyan text-sm tracking-widest uppercase mb-4 block">[ MISSION_ARCHIVE ]</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-100 mb-4 font-sans">
              High-Stakes Case Studies
            </h1>
            <p className="text-xl text-slate-400 font-sans">
              Demonstrating mathematical precision and hardware reliability when failure is not an option.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* DARPA Case Study */}
        <div className="flex flex-col md:flex-row gap-8 items-start relative group">
           <div className="hidden md:flex flex-col items-center mt-2">
              <div className="h-12 w-12 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center shrink-0 group-hover:border-cyan transition-colors z-10">
                 <Shield className="h-5 w-5 text-slate-400 group-hover:text-cyan transition-colors" />
              </div>
              <div className="w-px h-full bg-slate-800 absolute top-12 bottom-[-4rem]"></div>
           </div>
           
           <div className="flex-1 bg-[#0c0c0c] border border-slate-800 rounded-xl p-8 hover:border-cyan/30 transition-colors">
              <div className="mb-4 flex flex-wrap gap-2">
                 <span className="text-xs font-mono px-2 py-1 bg-cyan/10 text-cyan rounded border border-cyan/20">ATMOSPHERIC</span>
                 <span className="text-xs font-mono px-2 py-1 bg-slate-800 text-slate-400 rounded">DEFENSE</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-200 mb-2 font-sans">DARPA/IARPA AIMMS</h2>
              <h3 className="text-lg text-slate-400 mb-6 font-sans">Data Protocols & Spectral Processing Integration</h3>
              
              <div className="text-slate-300 font-sans leading-relaxed space-y-4 text-sm md:text-base">
                 <p>
                    Engineered robust data pipelines transitioning complex multiplexed data outputs into actionable formats for federal assessment.
                 </p>
                 <p>
                    <strong>Challenge:</strong> Harmonizing disparate data streams from novel sensor prototypes into a unified, low-latency framework for threat detection.
                 </p>
                 <p>
                    <strong>Solution:</strong> Developed custom processing algorithms ensuring rapid spectral deconvolution and classification under extreme field conditions.
                 </p>
              </div>
           </div>
        </div>

        {/* MKS Case Study */}
        <div className="flex flex-col md:flex-row gap-8 items-start relative group">
           <div className="hidden md:flex flex-col items-center mt-2">
              <div className="h-12 w-12 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center shrink-0 group-hover:border-amber transition-colors z-10">
                 <Microscope className="h-5 w-5 text-slate-400 group-hover:text-amber transition-colors" />
              </div>
              <div className="w-px h-full bg-slate-800 absolute top-12 bottom-[-4rem]"></div>
           </div>
           
           <div className="flex-1 bg-[#0c0c0c] border border-slate-800 rounded-xl p-8 hover:border-amber/30 transition-colors">
              <div className="mb-4 flex flex-wrap gap-2">
                 <span className="text-xs font-mono px-2 py-1 bg-amber/10 text-amber rounded border border-amber/20">INDUSTRIAL / LAB</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-200 mb-2 font-sans">MKS Instruments</h2>
              <h3 className="text-lg text-slate-400 mb-6 font-sans">Vacuum Integrity System Analytics</h3>
              
              <div className="text-slate-300 font-sans leading-relaxed space-y-4 text-sm md:text-base">
                 <p>
                    Executed the critical transition from qualitative presence-indication to precise, quantitative gas analysis models.
                 </p>
                 <p>
                    <strong>Challenge:</strong> In high-vacuum manufacturing environments, detecting a leak isn&apos;t enough; operators require precise quantitative fault characterization.
                 </p>
                 <p>
                    <strong>Solution:</strong> Integrated custom predictive mathematical models into real-time operational software, converting raw partial pressures into actionable quantitative metrics.
                 </p>
              </div>
           </div>
        </div>

        {/* Deepwater Horizon Case Study */}
        <div className="flex flex-col md:flex-row gap-8 items-start relative group">
           <div className="hidden md:flex flex-col items-center mt-2">
              <div className="h-12 w-12 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center shrink-0 group-hover:border-cyan transition-colors z-10">
                 <Droplets className="h-5 w-5 text-slate-400 group-hover:text-cyan transition-colors" />
              </div>
           </div>
           
           <div className="flex-1 bg-[#0c0c0c] border border-slate-800 rounded-xl p-8 hover:border-cyan/30 transition-colors relative overflow-hidden">
               {/* Decorative background element for the crisis study */}
              <div className="absolute right-0 top-0 w-64 h-64 bg-cyan/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

              <div className="mb-4 flex flex-wrap gap-2 relative z-10">
                 <span className="text-xs font-mono px-2 py-1 bg-cyan/10 text-cyan rounded border border-cyan/20">SUBSEA / CRISIS</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-200 mb-2 font-sans relative z-10">Deepwater Horizon Response</h2>
              <h3 className="text-lg text-slate-400 mb-6 font-sans relative z-10">Live In-Situ Hydrocarbon Mapping</h3>
              
              <div className="text-slate-300 font-sans leading-relaxed space-y-4 text-sm md:text-base relative z-10">
                 <p>
                    Deployed specialized Underwater Mass Spectrometers (UMS) during the BP Oil Spill crisis to provide critical ground-truth data.
                 </p>
                 <p>
                    <strong>Action:</strong> Processed and assimilated complex, multidimensional data streams traversing over 1,000 nautical miles.
                 </p>
                 <p>
                    <strong>Result:</strong> Disseminated rapid-response, high-accuracy intelligence to industry and government collaborators (NOAA), mapping subsea plume boundaries when traditional methods failed.
                 </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
