'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, Terminal, Cpu, Activity, Globe } from 'lucide-react';
import clsx from 'clsx';

const PROVIDERS = [
  { key: 'delhivery', label: 'DELHIVERY_CORE', color: 'bg-orange-500', region: 'GLOBAL' },
  { key: 'dtdc', label: 'DTDC_PRO_SYNC', color: 'bg-blue-600', region: 'GLOBAL' },
  { key: 'maruti', label: 'SHRI_MARUTI', color: 'bg-orange-600', region: 'DOMESTIC' },
];

export default function ProvidersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-6 min-h-screen font-sans bg-slate-50/30">
      {/* ───────────────── PAGE CONTENT TERMINAL ───────────────── */}
      <main className="relative bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden min-h-[600px]">
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}