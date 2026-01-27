'use client';

import { usePathname, useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Truck, 
  Calculator, 
  MapPin, 
  Printer, 
  AlertTriangle, 
  XCircle, 
  ChevronRight, 
  Edit3
} from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { key: '', label: 'Overview', icon: BarChart3 },
  { key: 'cost', label: 'Cost Estimator', icon: Calculator },
  { key: 'pincode', label: 'Serviceability', icon: MapPin },
  { key: 'label', label: 'Print Center', icon: Printer },
  { key: 'update', label: 'Update Shipment', icon: Edit3 },
  { key: 'ndr', label: 'NDR', icon: AlertTriangle },
  { key: 'cancel', label: 'Cancel', icon: XCircle },
];

export default function DelhiveryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const base = '/admin/providers/delhivery';

  const activeKey =
    NAV_ITEMS.find(i =>
      i.key ? pathname.includes(`${base}/${i.key}`) : pathname === base,
    )?.key ?? '';

  return (
    // pb-20 added to ensure content doesn't get cut off at the bottom
    <div className="min-h-screen space-y-6 pb-20">
      
      {/* --- PROVIDER HEADER & BREADCRUMBS --- */}
      {/* Reduced mt-4 to mt-2 to keep it tight */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 mt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
             <Truck size={20} strokeWidth={2.5} />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black tracking-tight text-slate-900">Delhivery</h1>
            <ChevronRight size={16} className="text-slate-300" />
            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {NAV_ITEMS.find(i => i.key === activeKey)?.label}
            </span>
          </div>
        </div>
      </div>

      {/* --- FLOATING COMMAND BAR (SUB-NAV) --- */}
      <div className="sticky top-[72px] z-40 py-2">
        <nav className="flex items-center gap-1 p-1.5 bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-[1.5rem] shadow-xl shadow-slate-200/30 w-fit mx-auto md:mx-0 transition-all">
          {NAV_ITEMS.map((item) => {
            const href = item.key ? `${base}/${item.key}` : base;
            const isActive = activeKey === item.key;
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={() => router.push(href)}
                className={clsx(
                  'relative group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300',
                  isActive 
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-300' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/80'
                )}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className={clsx(
                  "transition-transform group-hover:scale-110",
                  isActive ? "text-indigo-400" : "text-slate-400"
                )} />
                <span className="hidden lg:inline-block">{item.label}</span>
                
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* --- PAGE CONTENT --- */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {children}
      </div>
    </div>
  );
}