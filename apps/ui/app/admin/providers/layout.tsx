'use client';

import { usePathname, useRouter } from 'next/navigation';
import { RefreshCcw, ShieldCheck, Box, Activity, FileUp, PlusCircle, Loader2, Download } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';

const PROVIDERS = [
  { key: 'delhivery', label: 'Delhivery', color: 'bg-orange-500' },
  { key: 'dtdc', label: 'DTDC', color: 'bg-blue-600' },
];

export default function ProvidersLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const activeProvider = PROVIDERS.find(p =>
    pathname.includes(`/providers/${p.key}`),
  )?.key;

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8 min-h-screen">
      
      {/* --- MASTER HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <ShieldCheck size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Logistics Command</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Provider Operations
          </h1>
          <p className="text-slate-500 font-medium max-w-md">
            Execute and monitor shipments across your integrated logistics network.
          </p>
        </div>

        <div className="flex items-center gap-2">
           {PROVIDERS.map(p => {
            const isActive = activeProvider === p.key;
            return (
              <button
                key={p.key}
                onClick={() => router.push(`/admin/providers/${p.key}`)}
                className={clsx(
                  'relative flex items-center gap-3 px-6 py-2.5 rounded-[1.2rem] text-sm font-black transition-all duration-300 overflow-hidden',
                  isActive
                    ? 'bg-white text-slate-900 shadow-md shadow-slate-200 ring-1 ring-slate-200'
                    : 'text-slate-400 hover:text-slate-600'
                )}
              >
                {/* Colored Dot Indicator */}
                <div className={clsx(
                  "w-2 h-2 rounded-full",
                  isActive ? p.color : "bg-slate-300"
                )} />
                
                {p.label}
                
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900 opacity-10" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- PAGE CONTENT --- */}
      <div className="relative">
        {/* Subtle background glow for the active page */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-10" />
        {children}
      </div>
    </div>
  );
}