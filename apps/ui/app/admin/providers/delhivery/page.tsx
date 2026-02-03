'use client';

import { useProviderStats } from '@/hooks/useProviderStats';
import { 
  Package, Truck, CheckCircle2, AlertCircle, 
  Plus, Layers, Printer, XCircle, ChevronRight, 
  Activity, Database, Hash, BarChart3, TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export default function DelhiveryOverviewPage() {
  const { data, isLoading } = useProviderStats('delhivery');

  if (isLoading) return <LoadingTerminal />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* ───────────────── EXECUTIVE SUMMARY ───────────────── */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
            <BarChart3 size={16} className="text-indigo-600" /> Real-Time_Metrics
          </h2>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Live shipment lifecycle monitoring for Delhivery network nodes.</p>
        </div>
        <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-2">
          <TrendingUp size={12} /> +12.4% VOLUME_GROWTH
        </div>
      </div>

      {/* ───────────────── STATS MATRIX ───────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <StatNode label="Total_In_Pipe" value={data.total} icon={<Package size={18}/>} color="indigo" />
        <StatNode label="Delivered_Nodes" value={data.delivered} icon={<CheckCircle2 size={18}/>} color="emerald" />
        <StatNode label="Transit_Active" value={data.inTransit} icon={<Truck size={18}/>} color="amber" />
        <StatNode label="RTO_Returns" value={data.rto} icon={<AlertCircle size={18}/>} color="rose" />
        <StatNode label="NDR_Issues" value={data.ndr} icon={<AlertCircle size={18}/>} color="orange" />
      </div>

      {/* ───────────────── ANALYTICS TERMINAL ───────────────── */}
      <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center gap-2">
             <Database size={16} className="text-slate-700" />
             <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Shipment_Lifecycle_Distribution</h3>
           </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 divide-x divide-slate-100">
          {data.breakdown.map((b: any) => (
            <div key={b.label} className="p-6 hover:bg-slate-50 transition-colors group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 group-hover:text-indigo-600 transition-colors">
                {b.label.replace('_', ' ')}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tighter font-mono">{b.value}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Units</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────── QUICK ACCESS TILES ───────────────── */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Critical_Operational_Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionTile 
            title="INITIALIZE_SHIPMENT" 
            icon={<Plus size={20} />} 
            theme="dark" 
            href="/admin/providers/delhivery/create"
            desc="Single-node shipment creation" 
          />
          <ActionTile 
            title="BATCH_INGESTION" 
            icon={<Layers size={20} />} 
            theme="white" 
            href="/admin/providers/delhivery/bulk"
            desc="CSV/XLSX manifest processing"
          />
          <ActionTile 
            title="LABEL_GEN_CENTER" 
            icon={<Printer size={20} />} 
            theme="white" 
            href="/admin/providers/delhivery/label"
            desc="Thermal/Laser waybill output"
          />
          <ActionTile 
            title="TERMINATE_NODE" 
            icon={<XCircle size={20} />} 
            theme="danger" 
            href="/admin/providers/delhivery/cancel"
            desc="Void active tracking IDs"
          />
        </div>
      </div>
    </div>
  );
}

// Sub-components: StatNode and ActionTile remain similar but with refined Padding and Borders
function LoadingTerminal() {
    return (
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="relative">
                <Activity className="animate-pulse text-indigo-600" size={48} />
                <div className="absolute inset-0 bg-indigo-600/20 blur-xl animate-pulse rounded-full" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">
                Syncing_Delhivery_Data_Node...
            </span>
        </div>
    );
}

/* ───────────────── ERP COMPONENTS ───────────────── */

function StatNode({ label, value, icon, color }: any) {
  const colors: any = {
    indigo: "border-indigo-500 text-indigo-600 bg-indigo-50",
    emerald: "border-emerald-500 text-emerald-600 bg-emerald-50",
    amber: "border-amber-500 text-amber-600 bg-amber-50",
    rose: "border-rose-500 text-rose-600 bg-rose-50",
    orange: "border-red-500 text-red-600 bg-red-50",
  };

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm relative overflow-hidden group">
      <div className={clsx("absolute top-0 left-0 w-1 h-full", colors[color].split(' ')[0].replace('border-', 'bg-'))} />
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter font-mono">{value}</h3>
        </div>
        <div className={clsx("p-2 rounded-sm border", colors[color])}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActionTile({ title, icon, theme, href, desc }: any) {
  const styles = {
    dark: "bg-slate-900 text-white border-slate-800 hover:bg-slate-800",
    white: "bg-white text-slate-900 border-slate-200 hover:border-slate-400 hover:bg-slate-50",
    danger: "bg-white text-rose-600 border-rose-100 hover:bg-rose-50"
  };

  return (
    <Link 
      href={href}
      className={clsx(
        "flex flex-col p-5 border transition-all active:scale-[0.98] group relative rounded-sm",
        styles[theme as keyof typeof styles]
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={clsx(
            "p-2 rounded-sm",
            theme === 'dark' ? "bg-white/10" : "bg-slate-100"
        )}>
            {icon}
        </div>
        <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
      </div>
      <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">{title}</h4>
      <p className={clsx(
        "text-[10px] mt-1 font-bold",
        theme === 'dark' ? "text-slate-400" : "text-slate-500"
      )}>{desc}</p>
      
      <div className="absolute top-2 right-2 opacity-10">
        <Hash size={40} />
      </div>
    </Link>
  );
}