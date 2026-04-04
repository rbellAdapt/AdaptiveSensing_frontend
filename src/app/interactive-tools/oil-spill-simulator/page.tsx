import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, HardHat } from 'lucide-react';

export default function OilSpillSimulatorPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 py-8">
       <div className="container mx-auto px-4">
         <Link
           href="/"
           className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-cyan transition-colors mb-8 font-mono"
         >
           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
         </Link>

         <div className="flex flex-col items-center justify-center pt-20 pb-24 text-center">
            
            <div className="bg-slate-900/50 p-6 rounded-full border border-dashed border-slate-700/80 mb-6">
                <HardHat className="w-12 h-12 text-cyan opacity-80" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-sans text-white mb-6">Oil Spill Simulator</h1>
            
            <p className="text-slate-400 max-w-xl mx-auto mb-10 font-mono text-sm leading-relaxed">
              This interactive tool is actively under development. The backend container mapping algorithms and the dynamic UI wrapper are currently a <span className="text-amber-400">work in progress</span>.
            </p>
            
            <div className="mt-4 border border-slate-700/80 rounded-xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
              <Image 
                src="/images/Oil-spill-sim-tamoc-core.png" 
                alt="Oil Spill Simulator TAMOC Core Concept" 
                width={1200} 
                height={800} 
                className="w-full h-auto object-cover opacity-90 transition-opacity hover:opacity-100"
              />
            </div>
         </div>
       </div>
    </div>
  )
}
