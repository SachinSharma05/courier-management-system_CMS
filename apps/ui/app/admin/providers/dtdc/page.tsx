'use client';

import { useProviderStats } from '@/hooks/useProviderStats';
import { 
  Package, Truck, CheckCircle2, AlertCircle, 
  Plus, Layers, Printer, XCircle, ChevronRight, 
  Activity, Database, Hash, TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export default function DtdcOverviewPage() {
  const { data, isLoading } = useProviderStats('dtdc');

  if (isLoading) return <LoadingTerminal />;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* EXECUTIVE SUMMARY */}
      <div className="flex items-end justify-between border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.25em] flex items-center gap-2">
            <div className="h-1 w-4 bg-blue-600 rounded-full" /> Real-Time Metrics
          </h2>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">DTDC Operational Insight</h3>
          <p className="text-sm text-slate-500 mt-1">Aggregated performance data across DTDCs regional clusters.</p>
        </div>
        <div className="text-[11px] font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 flex items-center gap-2 shadow-sm uppercase">
          <TrendingUp size={14} /> Network Health: Optimized
        </div>
      </div>

      {/* STATS MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        <StatNode label="Total In Pipe" value={data.total} icon={<Package size={20}/>} color="blue" />
        <StatNode label="Delivered" value={data.delivered} icon={<CheckCircle2 size={20}/>} color="emerald" />
        <StatNode label="Transit Active" value={data.inTransit} icon={<Truck size={20}/>} color="amber" />
        <StatNode label="RTO Returns" value={data.rto} icon={<AlertCircle size={20}/>} color="rose" />
        <StatNode label="NDR Issues" value={data.ndr} icon={<AlertCircle size={20}/>} color="orange" />
      </div>

      {/* ANALYTICS TERMINAL */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-3">
             <Database size={18} className="text-blue-500" />
             <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Network Lifecycle Distribution</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 divide-x divide-slate-50">
          {data.breakdown.map((b: any) => (
            <div key={b.label} className="p-8 hover:bg-slate-50/50 transition-colors group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-blue-600 transition-colors">
                {b.label.replace('_', ' ')}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tighter font-mono">
                  {b.value}
                </span>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Units</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK ACCESS TILES */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Critical Operational Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActionTile 
            title="Initialize Shipment" 
            icon={<Plus size={24} />} 
            theme="dark" 
            href="/admin/providers/dtdc/create"
            desc="Create single DTDC airway bill" 
          />
          <ActionTile 
            title="Batch Ingestion" 
            icon={<Layers size={24} />} 
            theme="white" 
            href="/admin/providers/dtdc/bulk"
            desc="Process high-volume manifests"
          />
          <ActionTile 
            title="Label Gen Center" 
            icon={<Printer size={24} />} 
            theme="white" 
            href="/admin/providers/dtdc/label"
            desc="Thermal print engine access"
          />
          <ActionTile 
            title="Terminate Node" 
            icon={<XCircle size={24} />} 
            theme="danger" 
            href="/admin/providers/dtdc/cancel"
            desc="Void active network IDs"
          />
        </div>
      </div>
    </div>
  );
}

// ───────────────── SHARED ERP COMPONENTS ─────────────────

function StatNode({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) {
  const themes: any = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
  };

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm relative overflow-hidden group">
      <div className={clsx("absolute top-0 left-0 w-1 h-full", themes[color].split(' ')[0].replace('border-', 'bg-'))} />
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter font-mono">{value}</h3>
        </div>
        <div className={clsx("p-2 rounded-sm border", themes[color])}>
          {icon}
        </div>
      </div>
    </div>
  );
}

type themeType = 'dark' | 'white' | 'danger';

function ActionTile({ title, icon, theme, href, desc }: { title: string, icon: React.ReactNode, theme: themeType, href: string, desc: string }) {
  const styles = {
    dark: "bg-[#0F172A] text-white border-slate-800 hover:bg-slate-800 shadow-blue-100",
    white: "bg-white text-slate-900 border-slate-100 hover:border-blue-200 hover:bg-slate-50 shadow-slate-100",
    danger: "bg-white text-rose-600 border-rose-100 hover:bg-rose-50 hover:border-rose-200 shadow-rose-100"
  };

  return (
    <Link 
      href={href}
      className={clsx(
        "flex flex-col p-6 border transition-all active:scale-[0.98] group relative rounded-2xl shadow-lg",
        styles[theme as keyof typeof styles]
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div className={clsx(
            "p-3 rounded-xl shadow-inner",
            theme === 'dark' ? "bg-white/10" : "bg-slate-100"
        )}>
            {icon}
        </div>
        <ChevronRight size={20} className="text-slate-400 group-hover:translate-x-2 transition-transform" />
      </div>
      <h4 className="text-xs font-black uppercase tracking-widest">{title}</h4>
      <p className={clsx(
        "text-[11px] mt-2 font-medium leading-relaxed",
        theme === 'dark' ? "text-slate-400" : "text-slate-500"
      )}>{desc}</p>
      
      <div className="absolute bottom-4 right-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
        <Hash size={48} strokeWidth={3} />
      </div>
    </Link>
  );
}

function LoadingTerminal() {
    return (
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
            <Activity className="animate-spin text-blue-600 duration-[3000ms]" size={64} />
            <div className="text-center">
                <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
                    Synchronizing DTDC Data Matrix
                </span>
            </div>
        </div>
    );
}