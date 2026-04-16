"use client";

import { Server } from "lucide-react";
import { useAuthFunnel } from "@/components/AuthWrapper";

export default function TerminalRequestHook() {
  const { triggerGeneralModal } = useAuthFunnel();

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-950 p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-4xl mx-auto flex flex-col items-center text-center mt-12 mb-8">
      <h3 className="text-2xl font-bold font-sans text-slate-200 tracking-tight mb-3">
        Ready to deploy custom solutions?
      </h3>
      <button
        onClick={triggerGeneralModal}
        className="group flex flex-col items-center justify-center gap-1 bg-cyan/10 hover:bg-cyan/20 border border-cyan/40 text-cyan px-8 py-3 rounded font-mono shadow-[0_0_15px_rgba(0,229,255,0.15)] hover:shadow-[0_0_25px_rgba(0,229,255,0.3)] transition-all active:scale-95 uppercase tracking-widest text-sm"
      >
        <div className="flex items-center gap-3">
          <Server className="h-4 w-4" />
          <span>Begin Request</span>
        </div>
      </button>
    </div>
  );
}
