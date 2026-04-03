"use client";

import Link from 'next/link';
import { useState, useRef } from 'react';

export default function Navigation() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
            <Link href="/" className="text-xl font-bold tracking-tighter text-slate-200">
              AdaptiveSensing<span className="text-cyan">.io</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8 font-mono text-sm tracking-wide">
            <Link href="/" className="text-slate-300 hover:text-cyan transition-colors px-3 py-2">
              ~/Home
            </Link>
            <Link href="/services" className="text-slate-300 hover:text-cyan transition-colors px-3 py-2">
              ~/Services
            </Link>
            <div 
              className="relative px-3 py-2 cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span className="text-slate-300 hover:text-cyan transition-colors flex items-center">
                ~/Interactive_Tools 
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
                    <Link href="/dissolved-gas-calculators" className="px-4 py-2 text-amber-100 hover:bg-slate-800 hover:text-amber-400 transition-colors">
                      Gas Calculators Suite
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link href="/about" className="text-slate-300 hover:text-cyan transition-colors px-3 py-2">
              ~/About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
