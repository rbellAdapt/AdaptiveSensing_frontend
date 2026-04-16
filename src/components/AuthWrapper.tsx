"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { Lock, Mail, Server } from "lucide-react";
import { signIn, useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

interface AuthContextType {
  triggerPaywall: () => void;
  triggerEnterpriseModal: () => void;
  triggerGeneralModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  triggerPaywall: () => { },
  triggerEnterpriseModal: () => { },
  triggerGeneralModal: () => { },
});

export const useAuthFunnel = () => useContext(AuthContext);

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { data: session, status } = useSession();
  const [localShowPaywall, setLocalShowPaywall] = useState(false);
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);
  const [showGeneralModal, setShowGeneralModal] = useState(false);
  const pathname = usePathname();
  const isInteractiveToolRoute = pathname?.includes('/interactive-tools') || pathname?.includes('/dissolved-gas-calculators');

  const isAuthenticated = status === "authenticated";
  const showPaywall = localShowPaywall && !isAuthenticated;

  const triggerPaywall = () => {
    if (!isAuthenticated) {
      setLocalShowPaywall(true);
      window.history.pushState({ modalOpen: true }, '');
    }
  };

  const triggerEnterpriseModal = () => {
    setShowEnterpriseModal(true);
    window.history.pushState({ modalOpen: true }, '');
  };

  const triggerGeneralModal = () => {
    setShowGeneralModal(true);
    window.history.pushState({ modalOpen: true }, '');
  };

  const closeAllModals = () => {
    setLocalShowPaywall(false);
    setShowEnterpriseModal(false);
    setShowGeneralModal(false);
    if (window.history.state?.modalOpen) {
      window.history.back();
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      // Whenever the user hits the browser back button, definitively close any open modals
      setLocalShowPaywall(false);
      setShowEnterpriseModal(false);
      setShowGeneralModal(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <AuthContext.Provider value={{ triggerPaywall, triggerEnterpriseModal, triggerGeneralModal }}>
      <div className="relative w-full h-full min-h-screen">

        {/* Status Indicator (Optional but good UX) */}
        {isInteractiveToolRoute && (
          <div className="absolute top-4 right-4 z-50 text-xs font-mono flex items-center border border-cyan/20 bg-slate-900/50 px-3 py-1 rounded-full backdrop-blur-md text-cyan/70">
            {isAuthenticated ? (
              <>
                Logged in as {session?.user?.email}
                <button onClick={() => signOut()} className="ml-3 text-slate-500 hover:text-red-400 focus:outline-none">Log Out</button>
              </>
            ) : (
              <button onClick={() => signIn("google")} className="flex items-center hover:text-cyan transition-colors focus:outline-none">
                <Mail className="h-3 w-3 mr-1.5" />
                Sign In
              </button>
            )}
          </div>
        )}

        {/* The isolated Tool UI */}
        <div className={(showPaywall || showEnterpriseModal || showGeneralModal) ? "pointer-events-none blur-md transition-all duration-500 select-none opacity-50" : "transition-all duration-500"}>
          {children}

          {/* Strategy 5: Persistent Marketing Footer */}
          {isInteractiveToolRoute && (
            <div className="w-full text-center pb-8 pt-10 px-4 text-slate-500 font-mono text-[10px] sm:text-xs uppercase tracking-widest border-t border-slate-800/50 mt-12 bg-slate-950">
              Engineered by AdaptiveSensing.io<span className="hidden sm:inline"> | </span><br className="sm:hidden block h-1" />
              <button onClick={triggerEnterpriseModal} className="text-[#00e5ff] hover:text-white transition-colors font-bold sm:ml-2 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
                Deploy Custom Infrastructure
              </button>
            </div>
          )}
        </div>



        {/* The Gated Paywall / Google Auth Modal */}
        {showPaywall && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-xl max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-amber/10 rounded-full flex items-center justify-center mb-6 border border-amber/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Lock className="h-8 w-8 text-amber" />
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-2 font-sans tracking-tight">Unlimited Simulation Access</h3>
              <p className="text-slate-400 font-sans text-sm leading-relaxed mb-8">
                You have reached the guest threshold. Please authenticate to unlock unlimited simulations and secure your session environment.
              </p>

              <button onClick={() => signIn("google")} className="w-full bg-slate-100 text-slate-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center mb-4 hover:bg-white transition-colors cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-[1.02]">
                <Mail className="h-5 w-5 mr-3" />
                Sign in with Google
              </button>

              <button onClick={closeAllModals} className="mt-6 text-slate-600 text-xs hover:text-slate-400 font-mono tracking-widest uppercase transition-colors">
                [ Close Dialog ]
              </button>
            </div>
          </div>
        )}

        {/* The Enterprise Services Modal */}
        {showEnterpriseModal && (
          <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-700 p-6 md:p-8 rounded-xl max-w-lg w-full max-h-[95vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col relative text-center">
              <h3 className="text-xl md:text-2xl font-bold text-slate-100 mb-1 md:mb-2 font-sans tracking-tight shrink-0">Technical Requests</h3>
              <p className="text-slate-400 font-sans text-xs md:text-sm leading-relaxed mb-4 md:mb-6 shrink-0">
                Discuss custom payload integration, dedicated GPU cloud allocation, or batch API integration.
              </p>

              <div className="space-y-2 md:space-y-3 text-left mb-4 md:mb-8 w-full shrink-0">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-start gap-3">
                  <div className="min-w-fit mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></svg>
                  </div>
                  <div>
                    <h4 className="text-[13px] md:text-sm font-bold text-slate-200">Batch Processing API</h4>
                    <p className="text-[11px] leading-snug md:text-xs text-slate-400 mt-0.5">Run thousands of simulations in parallel through our integrated REST APIs.</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-start gap-3">
                  <div className="min-w-fit mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><rect width="16" height="16" x="4" y="4" rx="2" /><rect width="6" height="6" x="9" y="9" rx="1" /><path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" /><path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" /></svg>
                  </div>
                  <div>
                    <h4 className="text-[13px] md:text-sm font-bold text-slate-200">High-Performance Cloud Computing</h4>
                    <p className="text-[11px] leading-snug md:text-xs text-slate-400 mt-0.5">Deploy massive spatial grids and complex custom models on our GPU-accelerated cloud clusters.</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-start gap-3">
                  <div className="min-w-fit mt-0.5">
                    <Server className="w-4 h-4 text-amber" />
                  </div>
                  <div>
                    <h4 className="text-[13px] md:text-sm font-bold text-slate-200">Custom Analysis & Consulting</h4>
                    <p className="text-[11px] leading-snug md:text-xs text-slate-400 mt-0.5">Hire our team members to build custom wrappers, tailor specific physics models, and analyze datasets.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 md:p-4 rounded-lg border border-slate-700 w-full mb-1 md:mb-2 text-left">
                <h4 className="text-[13px] md:text-sm font-bold text-slate-200 mb-1 md:mb-2">Request Advanced Features</h4>

                {!isAuthenticated ? (
                  <div className="mb-2 p-3 bg-cyan/5 border border-cyan/20 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] md:text-xs text-cyan font-semibold">Sign in with Google to submit an automated request.</span>
                      <span className="text-[10px] md:text-[11px] text-slate-400">Or email securely: <a href="mailto:ryan.bell@adaptivesensing.io" className="text-cyan hover:underline">ryan.bell@adaptivesensing.io</a></span>
                    </div>
                    <button onClick={() => signIn("google")} className="w-full md:w-auto bg-slate-100 text-slate-900 font-bold py-1.5 px-3 rounded text-[10px] md:text-xs flex items-center justify-center hover:bg-white transition-colors whitespace-nowrap">
                      <Mail className="h-3 w-3 mr-1.5" />
                      Sign In
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] md:text-xs text-slate-400 mb-2">Please describe your expected compute needs below.</p>
                )}

                <textarea
                  id="needsInput"
                  className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-slate-300 h-16 focus:outline-none focus:border-cyan mb-3 resize-none"
                  placeholder="E.g., I need 20,000 REST API batch simulations per month... or    I need a custom telemetry pipeline integrated into our SCADA stack."
                ></textarea>
                <button
                  disabled={!isAuthenticated}
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    const needs = (document.getElementById('needsInput') as HTMLTextAreaElement)?.value || 'No specific needs listed (General Request)';
                    const userEmail = session?.user?.email || 'anonymous';
                    const userName = session?.user?.name || 'Unknown';

                    const scriptURL = process.env.NEXT_PUBLIC_ENTERPRISE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzPNZUWr46VSAxzei5TbS294-X_cdpABJVorlq2EPoxYdm-MekVFs7AcwSTR9y1Rv3l_g/exec';

                    const originalHtml = btn.innerHTML;
                    btn.innerHTML = '<span class="flex items-center"><div class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mr-2"></div> Sending...</span>';
                    btn.disabled = true;

                    fetch(`${scriptURL}?type=enterprise&email=${encodeURIComponent(userEmail)}&name=${encodeURIComponent(userName)}&needs=${encodeURIComponent(needs)}`, {
                      method: 'GET',
                      mode: 'no-cors' // Must use no-cors to prevent CORS panic from browser since Google Apps doesn't return CORS headers cleanly
                    }).then(() => {
                      btn.innerHTML = 'Transmission Complete ✓';
                      setTimeout(() => closeAllModals(), 2000);
                    }).catch(error => {
                      console.error('Error recording to proxy sheet!', error.message);
                      // Fallback
                      window.location.href = `mailto:ryan.bell@adaptivesensing.io?subject=Enterprise Cloud Provisioning Request&body=My Specific Needs:%0D%0A${encodeURIComponent(needs)}`;
                      btn.innerHTML = originalHtml;
                      btn.disabled = false;
                    });
                  }}
                  className="w-full bg-cyan text-slate-950 font-bold py-2 px-4 rounded flex items-center justify-center hover:bg-[#00cce6] transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  <span>Schedule Architecture Audit</span>
                </button>
              </div>

              <button onClick={closeAllModals} className="mt-4 md:mt-6 text-slate-600 text-[10px] md:text-xs hover:text-slate-400 font-mono tracking-widest uppercase transition-colors shrink-0">
                [ Close Dialog ]
              </button>
            </div>
          </div>
        )}

        {/* The General Consulting Modal */}
        {showGeneralModal && (
          <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-700 p-6 md:p-8 rounded-xl max-w-lg w-full max-h-[95vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col relative text-center">
              <h3 className="text-xl md:text-2xl font-bold text-slate-100 mb-1 md:mb-2 font-sans tracking-tight shrink-0">General Consulting Inquiry</h3>
              <p className="text-slate-400 font-sans text-xs md:text-sm leading-relaxed mb-4 md:mb-6 shrink-0">
                Discuss complex analytics, data pipeline optimizations, or subsea and atmospheric instrument integration.
              </p>

              <div className="bg-slate-800/80 p-3 md:p-4 rounded-lg border border-slate-700 w-full mb-1 md:mb-2 text-left mt-2">
                <h4 className="text-[13px] md:text-sm font-bold text-slate-200 mb-1 md:mb-2">Request Technical Consultation</h4>

                {!isAuthenticated ? (
                  <div className="mb-2 p-3 bg-cyan/5 border border-cyan/20 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] md:text-xs text-cyan font-semibold">Sign in with Google to submit an automated request.</span>
                      <span className="text-[10px] md:text-[11px] text-slate-400">Or email securely: <a href="mailto:ryan.bell@adaptivesensing.io" className="text-cyan hover:underline">ryan.bell@adaptivesensing.io</a></span>
                    </div>
                    <button onClick={() => signIn("google")} className="w-full md:w-auto bg-slate-100 text-slate-900 font-bold py-1.5 px-3 rounded text-[10px] md:text-xs flex items-center justify-center hover:bg-white transition-colors whitespace-nowrap">
                      <Mail className="h-3 w-3 mr-1.5" />
                      Sign In
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] md:text-xs text-slate-400 mb-2">Please describe your project requirements below.</p>
                )}

                <textarea
                  id="generalNeedsInput"
                  className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-slate-300 h-24 focus:outline-none focus:border-cyan mb-3 resize-none"
                  placeholder="E.g., I'm looking for a custom UAS payload routing integration, or we need a data science review."
                ></textarea>
                <button
                  disabled={!isAuthenticated}
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    const needs = (document.getElementById('generalNeedsInput') as HTMLTextAreaElement)?.value || 'No specific needs listed (General Request)';
                    const userEmail = session?.user?.email || 'anonymous';
                    const userName = session?.user?.name || 'Unknown';

                    const scriptURL = process.env.NEXT_PUBLIC_ENTERPRISE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzPNZUWr46VSAxzei5TbS294-X_cdpABJVorlq2EPoxYdm-MekVFs7AcwSTR9y1Rv3l_g/exec';

                    const originalHtml = btn.innerHTML;
                    btn.innerHTML = '<span class="flex items-center"><div class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mr-2"></div> Sending...</span>';
                    btn.disabled = true;

                    fetch(`${scriptURL}?type=enterprise&email=${encodeURIComponent(userEmail)}&name=${encodeURIComponent(userName)}&needs=${encodeURIComponent(`[GENERAL CONSULTING REQUEST] ${needs}`)}`, {
                      method: 'GET',
                      mode: 'no-cors'
                    }).then(() => {
                      btn.innerHTML = 'Transmission Complete ✓';
                      setTimeout(() => closeAllModals(), 2000);
                    }).catch(error => {
                      console.error('Error recording to proxy sheet!', error.message);
                      window.location.href = `mailto:ryan.bell@adaptivesensing.io?subject=General Consulting Request&body=${encodeURIComponent(needs)}`;
                      btn.innerHTML = originalHtml;
                      btn.disabled = false;
                    });
                  }}
                  className="w-full bg-cyan text-slate-950 font-bold py-2 px-4 rounded flex items-center justify-center hover:bg-[#00cce6] transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  <span>Send Consulting Inquiry</span>
                </button>
              </div>

              <button onClick={closeAllModals} className="mt-4 md:mt-6 text-slate-600 text-[10px] md:text-xs hover:text-slate-400 font-mono tracking-widest uppercase transition-colors shrink-0">
                [ Close Dialog ]
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
}
