"use client";

import Link from 'next/link';
import { useState, useRef } from 'react';

export default function Navigation() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-slate-800 bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold tracking-tighter text-slate-200" onClick={() => setIsMobileMenuOpen(false)}>
              AdaptiveSensing<span className="text-cyan">.io</span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8 font-mono text-sm tracking-wide">
            <Link href="/" className="text-slate-300 hover:text-cyan transition-colors px-3 py-2">
              Home
            </Link>
            <Link href="/services" className="text-slate-300 hover:text-cyan transition-colors px-3 py-2">
              Services
            </Link>
            <div
              className="relative px-3 py-2 cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span className="text-slate-300 hover:text-cyan transition-colors flex items-center">
                Interactive_Tools
                <svg className={`w-4 h-4 ml-1 opacity-70 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-cyan' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </span>

              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 pt-2 pb-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="bg-slate-950 border border-slate-700/80 rounded-md shadow-2xl py-2 flex flex-col relative z-50">
                    <Link href="/interactive-tools/uas-plume-simulator" className="px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-cyan transition-colors">
                      UAS Plume Simulator
                    </Link>

                    <div className="border-t border-slate-800 my-1"></div>
                    <Link href="/dissolved-gas-calculators" className="px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-cyan transition-colors">
                      Gas Calculators Suite
                    </Link>

                    <div className="border-t border-slate-800 my-1"></div>
                    <Link href="/interactive-tools/oil-spill-simulator" className="px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-cyan transition-colors">
                      Oil Spill Simulator
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link href="/about" className="text-slate-300 hover:text-cyan transition-colors px-3 py-2">
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-cyan hover:bg-slate-800 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-2 pt-2 pb-4 space-y-1 font-mono text-sm">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-slate-300 hover:text-cyan hover:bg-slate-800 transition-colors">Home</Link>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-slate-300 hover:text-cyan hover:bg-slate-800 transition-colors">Services</Link>
            
            <div className="px-3 py-2 mt-2 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-800 pb-1">Interactive Tools</div>
            <div className="pl-4 border-l border-slate-800 ml-2 space-y-1">
                <Link href="/interactive-tools/uas-plume-simulator" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-slate-400 hover:text-cyan hover:bg-slate-800 transition-colors">UAS Plume Simulator</Link>
                <Link href="/dissolved-gas-calculators" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-slate-400 hover:text-cyan hover:bg-slate-800 transition-colors">Gas Calculators Suite</Link>
                <Link href="/interactive-tools/oil-spill-simulator" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-slate-400 hover:text-cyan hover:bg-slate-800 transition-colors">Oil Spill Simulator</Link>
            </div>
            
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-slate-300 hover:text-cyan hover:bg-slate-800 transition-colors mt-2 border-t border-slate-800 pt-2">About</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
