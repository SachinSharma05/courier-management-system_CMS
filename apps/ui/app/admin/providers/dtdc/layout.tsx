"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Shield, ChevronRight, Activity, Globe, Terminal, Zap } from 'lucide-react';

// export default function DtdcLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
  
//   // Breadcrumb Logic
//   const pathSegments = pathname.split('/');
//   const currentAction = pathSegments[pathSegments.length - 1] === 'dtdc' 
//     ? 'OVERVIEW_HUB' 
//     : pathSegments[pathSegments.length - 1].toUpperCase();

//   return (
//     <div className="flex flex-col h-full bg-slate-50/30">
//       {/* ───────────────── CONTEXTUAL HEADER ───────────────── */}
//       <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <div className="bg-blue-600 p-2 rounded-sm shadow-lg shadow-blue-200">
//             <Globe size={18} className="text-white" />
//           </div>
//           <div>
//             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
//               Providers <ChevronRight size={10} /> DTDC <ChevronRight size={10} /> 
//               <span className="text-blue-600">{currentAction}</span>
//             </div>
//             <h1 className="text-lg font-black text-slate-900 tracking-tighter uppercase mt-0.5">
//               DTDC_Network_Terminal
//             </h1>
//           </div>
//         </div>

//         <div className="flex items-center gap-6">
//           <div className="text-right hidden md:block">
//             <p className="text-[9px] font-black text-slate-400 uppercase">Network_Sync</p>
//             <div className="flex items-center gap-1.5 justify-end">
//               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//               <span className="text-[10px] font-bold text-slate-700 uppercase">Live_Connection</span>
//             </div>
//           </div>
//           <div className="h-8 w-px bg-slate-200" />
//           <div className="bg-blue-50 px-3 py-1 rounded-sm border border-blue-100 flex items-center gap-2">
//             <Activity size={14} className="text-blue-600" />
//             <span className="text-[10px] font-black text-blue-700 uppercase">Active_Nodes</span>
//           </div>
//         </div>
//       </header>

//       {/* ───────────────── MAIN WORKSPACE ───────────────── */}
//       <main className="flex-1 p-8 relative overflow-auto">
//         <div className="absolute top-10 right-10 pointer-events-none opacity-[0.03] select-none">
//           <Shield size={240} strokeWidth={1} className="text-blue-900" />
//         </div>
        
//         <div className="relative z-10 max-w-[1400px] mx-auto">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// }
export default function DtdcLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const pathSegments = pathname.split('/');
  const currentAction = pathSegments[pathSegments.length - 1] === 'dtdc' 
    ? 'OVERVIEW HUB' 
    : pathSegments[pathSegments.length - 1].toUpperCase().replace('_', ' ');

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* ───────────────── MODERN CONTEXTUAL HEADER ───────────────── */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-5">
          <div className="bg-[#0F172A] p-2.5 rounded-xl shadow-lg shadow-blue-100">
            <Zap size={20} className="text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
              Providers <ChevronRight size={10} /> DTDC <ChevronRight size={10} /> 
              <span className="text-blue-600">{currentAction}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              DTDC Control Node
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
            <Activity size={14} className="text-blue-500" />
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