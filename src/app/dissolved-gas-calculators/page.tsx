"use client";

import DissolvedGasSuite from '../../components/dissolved-gas-analyzer/DissolvedGasSuite';
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { AuthWrapper, useAuthFunnel } from '@/components/AuthWrapper';

function CalculatorContent() {
  const { triggerPaywall } = useAuthFunnel();

  return (
    <div className="bg-slate-950 min-h-screen relative pb-20">
       {/* Minimal Nav Header */}
       <div className="container mx-auto px-4 py-8">
         <Link
           href="/"
           className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-cyan transition-colors font-mono"
         >
           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
         </Link>
       </div>
       <DissolvedGasSuite />

      {/* Batch Processing CTA */}
      <div className="fixed bottom-8 right-8 z-40">
        <button 
          onClick={triggerPaywall}
          className="group flex items-center gap-3 bg-amber/10 hover:bg-amber/20 border border-amber/40 text-amber px-6 py-3 rounded-full font-mono text-sm shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all hover:-translate-y-1 active:scale-95"
        >
          <Download className="h-4 w-4" />
          <span>Export Batch Data</span>
        </button>
      </div>
    </div>
  )
}

export default function DissolvedGasCalculatorsPage() {
  return (
    <AuthWrapper>
      <CalculatorContent />
    </AuthWrapper>
  );
}
