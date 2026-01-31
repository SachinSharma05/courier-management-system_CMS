'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, Terminal, Cpu, Activity, Globe } from 'lucide-react';
import clsx from 'clsx';

const PROVIDERS = [
  { key: 'delhivery', label: 'DELHIVERY_CORE', color: 'bg-orange-500', region: 'DOMESTIC' },
  { key: 'dtdc', label: 'DTDC_PRO_SYNC', color: 'bg-blue-600', region: 'GLOBAL' },
];

export default function ProvidersLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const activeProvider = PROVIDERS.find(p =>
    pathname.includes(`/providers/${p.key}`),
  )?.key;

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-6 min-h-screen font-sans bg-slate-50/30">
      
      {/* ───────────────── MASTER COMMAND HEADER ───────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 bg-slate-900 flex items-center justify-center text-white rounded-sm shadow-lg border border-slate-700">
            <Cpu size={28} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 mb-0.5">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Logistics_Kernel_v2.0</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
              Provider_Operations
            </h1>
            <div className="flex items-center gap-3">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                 <Terminal size={12} /> Active_Session: Root_Admin
               </p>
               <span className="text-slate-200">|</span>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                 <Activity size={12} /> Network_Status: Nominal
               </p>
            </div>
          </div>
        </div>

        {/* ───────────────── PROVIDER MATRIX TOGGLES ───────────────── */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-sm shadow-sm">
           {PROVIDERS.map(p => {
            const isActive = activeProvider === p.key;
            return (
              <button
                key={p.key}
                onClick={() => router.push(`/admin/providers/${p.key}`)}
                className={clsx(
                  'group relative flex flex-col items-start px-5 py-2 transition-all duration-200 border border-transparent',
                  isActive
                    ? 'bg-slate-900 border-slate-800 shadow-md'
                    : 'hover:bg-slate-50'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                    <div className={clsx(
                    "w-1.5 h-1.5 rounded-full",
                    isActive ? p.color : "bg-slate-300 group-hover:bg-slate-400"
                    )} />
                    <span className={clsx(
                        "text-[10px] font-black uppercase tracking-[0.15em]",
                        isActive ? "text-white" : "text-slate-400"
                    )}>
                        {p.label}
                    </span>
                </div>
                
                <div className="flex items-center gap-2">
                    <Globe size={10} className={isActive ? "text-slate-500" : "text-slate-300"} />
                    <span className={clsx(
                        "text-[8px] font-bold uppercase tracking-widest",
                        isActive ? "text-indigo-400" : "text-slate-300"
                    )}>
                        Node_{p.region}
                    </span>
                </div>

                {isActive && (
                  <div className="absolute -bottom-1 left-0 w-full h-1 bg-indigo-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ───────────────── PAGE CONTENT TERMINAL ───────────────── */}
      <main className="relative bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden min-h-[600px]">
        {/* Subtle decorative grid lines for ERP feel */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>
        
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}