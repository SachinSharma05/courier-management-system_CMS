"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Shield, ChevronRight, Activity, Box } from 'lucide-react';
import clsx from 'clsx';

export default function MarutiLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Advanced Breadcrumb for Maruti's nested paths
  const pathSegments = pathname.split('/').filter(Boolean);
  const isOverview = pathSegments[pathSegments.length - 1] === 'maruti';
  const currentAction = isOverview 
    ? 'OVERVIEW_HUB' 
    : pathSegments.slice(pathSegments.indexOf('maruti') + 1).join(' / ').toUpperCase();

  return (
    <div className="flex flex-col h-full bg-slate-50/30">
      {/* ───────────────── MARUTI CONTEXT HEADER ───────────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-950 p-2 rounded-sm shadow-lg shadow-indigo-200">
            <Box size={18} className="text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Providers <ChevronRight size={10} /> Maruti <ChevronRight size={10} /> 
              <span className="text-indigo-600">{currentAction}</span>
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tighter uppercase mt-0.5">
              Maruti_Control_Terminal
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-400 uppercase">Ops_Mode</span>
            <div className="flex items-center gap-1.5">
               <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
               <span className="text-[10px] font-bold text-slate-700">HYBRID_ENABLED</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="bg-slate-900 text-white px-3 py-1 rounded-sm flex items-center gap-2">
            <Activity size={12} className="text-indigo-400" />
            <span className="text-[9px] font-black tracking-tighter">DATA_ENCRYPTED</span>
          </div>
        </div>
      </header>

      {/* ───────────────── WORKSPACE ───────────────── */}
      <main className="flex-1 p-8 relative overflow-auto">
        <div className="absolute top-10 right-10 pointer-events-none opacity-[0.02] select-none">
          <Shield size={280} strokeWidth={1} className="text-indigo-900" />
        </div>
        
        <div className="relative z-10 max-w-[1500px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}