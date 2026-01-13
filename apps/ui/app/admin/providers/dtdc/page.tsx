'use client';

import { useProviderStats } from '@/hooks/useProviderStats';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeftRight, 
  Plus, 
  Layers, 
  Printer, 
  XCircle,
  TrendingUp
} from 'lucide-react';

export default function DtdcOverviewPage() {
  const { data, isLoading } = useProviderStats('dtdc');

  if (isLoading) return (
    <div className="h-96 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
    </div>
  );

  // Inside your component, before the return statement:
const sanitizedBreakdown = data.breakdown.reduce((acc: any[], current: any) => {
  const existing = acc.find(item => item.label === current.label);
  if (existing) {
    existing.value += current.value; // Sum the values of duplicates
  } else {
    acc.push({ ...current });
  }
  return acc;
}, []);

// Then map over sanitizedBreakdown instead of data.breakdown
{sanitizedBreakdown.map((b: any) => (
  <div key={b.label} className="group cursor-default">
    {/* ... UI remains the same */}
  </div>
))}

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* --- HERO METRICS SECTION (BENTO GRID) --- */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 gap-4">
        <MetricCard 
          label="Total Shipments" 
          value={data.total} 
          icon={<Package className="text-indigo-600" size={20} />}
          trend="+12% from last month"
          className="md:col-span-2 lg:col-span-1"
        />
        <MetricCard 
          label="Delivered" 
          value={data.delivered} 
          icon={<CheckCircle2 className="text-emerald-500" size={20} />}
          color="emerald"
        />
        <MetricCard 
          label="In-Transit" 
          value={data.inTransit} 
          icon={<Truck className="text-amber-500" size={20} />}
          color="amber"
        />
        <MetricCard 
          label="RTO / Returns" 
          value={data.rto} 
          icon={<ArrowLeftRight className="text-rose-500" size={20} />}
          color="rose"
        />
        <MetricCard 
          label="NDR Issues" 
          value={data.ndr} 
          icon={<AlertCircle className="text-orange-500" size={20} />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- STATUS DISTRIBUTION (VISUAL PROGRESS) --- */}
        <div className="lg:col-span-2 rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900">Live Status Breakdown</h3>
              <p className="text-sm text-slate-400 font-medium">Real-time tracking distribution</p>
            </div>
            <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold text-slate-600">
              {data.total} Total Units
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {data.breakdown.map((b: any, index: number) => (
              <div key={`${b.label}-${index}`} className="group cursor-default">
                <div className="flex justify-between mb-2 items-end">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">
                    {b.label}
                  </span>
                  <span className="text-sm font-bold text-slate-900">{b.value}</span>
                </div>
                <div className="relative h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                  <div
                    className="absolute top-0 left-0 h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out group-hover:bg-indigo-400"
                    style={{ width: `${(b.value / data.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- QUICK ACTIONS (MODERN BUTTONS) --- */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Quick Operations</h3>
          <ActionTile title="Create Shipment" icon={<Plus size={18}/>} theme="dark" />
          <ActionTile title="Bulk Upload CSV" icon={<Layers size={18}/>} theme="white" />
          <ActionTile title="Print Shipping Labels" icon={<Printer size={18}/>} theme="white" />
          <ActionTile title="Cancel Shipment" icon={<XCircle size={18}/>} theme="danger" />
        </div>
      </div>
    </div>
  );
}

/* ---------------- MODERN SUB-COMPONENTS ---------------- */

function MetricCard({ label, value, icon, trend, color = "indigo", className = "" }: any) {
  return (
    <div className={`group relative overflow-hidden rounded-[2rem] bg-white border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${className}`}>
      <div className="flex justify-between items-start relative z-10">
        <div className={`p-3 rounded-2xl bg-${color}-50 border border-${color}-100 transition-transform group-hover:scale-110`}>
          {icon}
        </div>
        {trend && (
           <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
             {trend}
           </span>
        )}
      </div>
      <div className="mt-6 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900">{value.toLocaleString()}</p>
      </div>
      {/* Subtle background decoration */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${color}-50/50 rounded-full blur-2xl group-hover:bg-${color}-100/80 transition-colors`} />
    </div>
  );
}

function ActionTile({ title, icon, theme }: { title: string, icon: React.ReactNode, theme: 'dark' | 'white' | 'danger' }) {
  const styles = {
    dark: "bg-slate-900 text-white hover:bg-slate-800 border-transparent",
    white: "bg-white text-slate-900 hover:bg-slate-50 border-slate-100",
    danger: "bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-100"
  };

  return (
    <button className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] border font-bold transition-all active:scale-95 group ${styles[theme]}`}>
      <span className="flex items-center gap-3">
        <span className={`${theme === 'dark' ? 'bg-white/10' : 'bg-slate-100'} p-2 rounded-xl group-hover:rotate-12 transition-transform`}>
          {icon}
        </span>
        {title}
      </span>
      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-100'}`}>
        <TrendingUp size={14} className="opacity-50" />
      </div>
    </button>
  );
}