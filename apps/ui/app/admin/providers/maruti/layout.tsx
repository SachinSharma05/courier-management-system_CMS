"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Shield, ChevronRight, Activity, Box } from 'lucide-react';

export default function MarutiLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const pathSegments = pathname.split('/');
  const currentAction = pathSegments[pathSegments.length - 1] === 'maruti' 
    ? 'OVERVIEW HUB' 
    : pathSegments[pathSegments.length - 1].toUpperCase().replace('_', ' ');

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* ───────────────── MODERN CONTEXTUAL HEADER ───────────────── */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-5">
          <div className="bg-[#0F172A] p-2.5 rounded-xl shadow-lg shadow-indigo-100">
            <Box size={20} className="text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
              Providers <ChevronRight size={10} /> Maruti <ChevronRight size={10} /> 
              <span className="text-indigo-600">{currentAction}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              Maruti Control Node
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Network Status</p>
            <div className="flex items-center gap-2 justify-end mt-0.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-600 uppercase">Live Connection</span>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-100" />
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-2">
            <Activity size={14} className="text-indigo-500" />
            <span className="text-[11px] font-bold text-slate-700">99.9% SYNC</span>
          </div>
        </div>
      </header>

      {/* ───────────────── MAIN WORKSPACE ───────────────── */}
      <main className="flex-1 p-8 relative overflow-auto">
        <div className="absolute top-10 right-10 pointer-events-none opacity-[0.02] select-none">
          <Shield size={320} strokeWidth={1} className="text-slate-900" />
        </div>
        
        <div className="relative z-10 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}