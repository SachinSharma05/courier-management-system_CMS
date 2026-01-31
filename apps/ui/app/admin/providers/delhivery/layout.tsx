'use client';

import { usePathname, useRouter } from 'next/navigation';
import { 
  BarChart3, Truck, Calculator, MapPin, Printer, 
  AlertTriangle, XCircle, Edit3, PlusCircle, FileUp,
  Terminal, Activity, Shield
} from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { key: '', label: 'OVERVIEW_HUB', icon: BarChart3 },
  { key: 'create', label: 'CREATE_NODE', icon: PlusCircle },
  { key: 'bulk', label: 'BULK_INGEST', icon: FileUp },
  { key: 'cost', label: 'COST_ENGINE', icon: Calculator },
  { key: 'pincode', label: 'SERVICE_MAP', icon: MapPin },
  { key: 'label', label: 'PRINT_QUEUE', icon: Printer },
  { key: 'update', label: 'PATCH_SHIPMENT', icon: Edit3 },
  { key: 'ndr', label: 'NDR_REPORTS', icon: AlertTriangle },
  { key: 'cancel', label: 'TERMINATE_ID', icon: XCircle },
];

export default function DelhiveryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const base = '/admin/providers/delhivery';

  const activeKey = NAV_ITEMS.find((item) => {
    const href = item.key ? `${base}/${item.key}` : base;
    return pathname === href;
  })?.key ?? '';

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ───────────────── SUB-TERMINAL NAVIGATION ───────────────── */}
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-2">
        <nav className="flex flex-wrap items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const href = item.key ? `${base}/${item.key}` : base;
            const isActive = activeKey === item.key;
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={() => router.push(href)}
                className={clsx(
                  'relative flex items-center gap-2 px-3 py-2 border transition-all duration-200 group',
                  isActive 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-900'
                )}
              >
                <Icon size={14} className={isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-600"} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                  {item.label}
                </span>
                
                {isActive && (
                  <div className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ───────────────── MAIN CONSOLE AREA ───────────────── */}
      <div className="flex-1 p-6 relative overflow-auto">
        {/* Technical background watermark */}
        <div className="absolute top-4 right-6 pointer-events-none opacity-[0.05] select-none">
            <Shield size={120} className="text-slate-900" />
        </div>
        
        <div className="relative z-10 h-full">
          {children}
        </div>
      </div>
    </div>
  );
}