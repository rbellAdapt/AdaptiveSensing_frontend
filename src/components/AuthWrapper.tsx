"use client";

import React, { useState, createContext, useContext, ReactNode } from "react";
import { Lock, Mail, Server } from "lucide-react";

interface AuthContextType {
  triggerPaywall: () => void;
}

const AuthContext = createContext<AuthContextType>({
  triggerPaywall: () => {},
});

export const useAuthFunnel = () => useContext(AuthContext);

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [showPaywall, setShowPaywall] = useState(false);

  const triggerPaywall = () => setShowPaywall(true);

  return (
    <AuthContext.Provider value={{ triggerPaywall }}>
      <div className="relative w-full h-full min-h-screen">
        {/* The isolated Tool UI */}
        <div className={showPaywall ? "pointer-events-none blur-md transition-all duration-500 select-none opacity-50" : "transition-all duration-500"}>
          {children}
        </div>

        {/* The Gated Paywall / Google Auth Modal */}
        {showPaywall && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-xl max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-amber/10 rounded-full flex items-center justify-center mb-6 border border-amber/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Lock className="h-8 w-8 text-amber" />
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-2 font-sans tracking-tight">Enterprise Batch Processing</h3>
              <p className="text-slate-400 font-sans text-sm leading-relaxed mb-8">
                High-throughput batch processing and programmatic API access are reserved for commercial partners running dedicated Dockerized deployments.
              </p>
              
              <button className="w-full bg-slate-100 text-slate-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center mb-4 hover:bg-white transition-colors cursor-pointer disabled:opacity-50" disabled>
                <Mail className="h-5 w-5 mr-3" />
                Sign in with Google (Coming Soon)
              </button>
              
              <a href="mailto:ryan.bell@adaptivesensing.io?subject=Batch Processing Access" className="w-full bg-transparent border border-amber/40 text-amber font-semibold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-amber/10 transition-colors cursor-pointer">
                <Server className="h-5 w-5 mr-3" />
                Request Commercial Access
              </a>
              
              <button onClick={() => setShowPaywall(false)} className="mt-6 text-slate-600 text-xs hover:text-slate-400 font-mono tracking-widest uppercase transition-colors">
                 [ Close Modal ]
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
}
