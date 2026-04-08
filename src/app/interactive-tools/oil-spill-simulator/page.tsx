"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, HardHat, Download } from 'lucide-react';
import { AuthWrapper, useAuthFunnel } from '@/components/AuthWrapper';

function SimulatorContent() {
  const { triggerPaywall } = useAuthFunnel();

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 py-8 relative pb-20">
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
            
            <div className="mt-4 border border-slate-700/80 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-4xl mx-auto">
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

      {/* Batch Processing CTA */}
      <div className="fixed bottom-8 right-8 z-40">
        <button 
          onClick={triggerPaywall}
          className="group flex items-center gap-3 bg-amber/10 hover:bg-amber/20 border border-amber/40 text-amber px-6 py-3 rounded-full font-mono text-sm shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all hover:-translate-y-1 active:scale-95"
        >
          <Download className="h-4 w-4" />
          <span>Export Batch Payload</span>
        </button>
      </div>
    </div>
  )
}

export default function OilSpillSimulatorPage() {
  return (
    <AuthWrapper>
      <SimulatorContent />
    </AuthWrapper>
  );
}
