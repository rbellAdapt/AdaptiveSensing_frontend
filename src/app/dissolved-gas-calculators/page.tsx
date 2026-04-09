"use client";

import DissolvedGasSuite from '../../components/dissolved-gas-analyzer/DissolvedGasSuite';
import Link from "next/link";
import { ArrowLeft, Server } from "lucide-react";
import { useAuthFunnel } from '@/components/AuthWrapper';
import { useSession } from "next-auth/react";

function CalculatorContent() {
  const { triggerPaywall, triggerEnterpriseModal } = useAuthFunnel();
  const { status } = useSession();

  const handleConsultingClick = () => {
    triggerEnterpriseModal();
  };

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

      {/* Consulting CTA */}
      <div className="fixed bottom-8 right-8 z-40">
        <button 
          onClick={handleConsultingClick}
          className="group flex flex-col items-center justify-center gap-1 bg-amber/10 hover:bg-amber/20 border border-amber/40 text-amber px-6 py-2 rounded-full font-mono shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all hover:-translate-y-1 active:scale-95"
        >
          <div className="flex items-center gap-2 text-sm">
            <Server className="h-4 w-4" />
            <span>API & Batch Access</span>
          </div>
          <span className="text-[10px] text-amber/60 tracking-widest uppercase">Architecture Audit</span>
        </button>
      </div>
    </div>
  )
}

export default function DissolvedGasCalculatorsPage() {
  return <CalculatorContent />;
}
