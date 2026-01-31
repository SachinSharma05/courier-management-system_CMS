'use client';

import { useProviderStats } from '@/hooks/useProviderStats';
import { 
  Package, Truck, CheckCircle2, AlertCircle, 
  ArrowLeftRight, Plus, Layers, Printer, 
  XCircle, ChevronRight, Activity, Database, Hash
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export default function DelhiveryOverviewPage() {
  const { data, isLoading } = useProviderStats('delhivery');

  if (isLoading) return (
    <div className="h-96 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Activity className="animate-pulse text-indigo-600" size={32} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing_Provider_Data...</span>
      </div>
    </div>
  );

  const sanitizedBreakdown = data.breakdown.reduce((acc: any[], current: any) => {
    const existing = acc.find(item => item.label === current.label);
    if (existing) {
      existing.value += current.value;
    } else {
      acc.push({ ...current });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* ───────────────── STATS MATRIX ───────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatNode label="Total_In_Pipe" value={data.total} icon={<Package size={16}/>} color="indigo" />
        <StatNode label="Delivered_Nodes" value={data.delivered} icon={<CheckCircle2 size={16}/>} color="emerald" />
        <StatNode label="Transit_Active" value={data.inTransit} icon={<Truck size={16}/>} color="amber" />
        <StatNode label="RTO / Returns" value={data.rto} icon={<AlertCircle size={16}/>} color="rose" />
        <StatNode label="NDR Issues" value={data.ndr} icon={<AlertCircle size={16}/>} color="orange" />
      </div>

      {/* ───────────────── BREAKDOWN TERMINAL ───────────────── */}
      <div className="bg-slate-900 rounded-sm border border-slate-800 shadow-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
           <div className="flex items-center gap-2">
             <Database size={14} className="text-indigo-500" />
             <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Shipment_Lifecycle_Distribution</h3>
           </div>
           <span className="text-[9px] font-mono text-slate-500">PROD_ENV // STABLE</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 divide-x divide-y divide-slate-800 border-b border-slate-800">
          {sanitizedBreakdown.map((b: any) => (
            <div key={b.label} className="p-4 hover:bg-slate-800/50 transition-colors group">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover:text-indigo-400 transition-colors">{b.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-white tracking-tighter font-mono">{b.value}</span>
                <span className="text-[9px] font-bold text-slate-600">UNITS</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────── ACTION CONTROL GRID ───────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActionTile 
          title="INITIALIZE_SHIPMENT" 
          icon={<Plus size={20} />} 
          theme="dark" 
          href="/admin/providers/delhivery/create"
          desc="Create individual single-node shipment" 
        />
        <ActionTile 
          title="BATCH_INGESTION" 
          icon={<Layers size={20} />} 
          theme="white" 
          href="/admin/providers/delhivery/bulk"
          desc="Upload CSV/XLSX manifest files"
        />
        <ActionTile 
          title="LABEL_GEN_CENTER" 
          icon={<Printer size={20} />} 
          theme="white" 
          href="/admin/providers/delhivery/label"
          desc="Generate thermal/laser waybills"
        />
        <ActionTile 
          title="TERMINATE_NODE" 
          icon={<XCircle size={20} />} 
          theme="danger" 
          href="/admin/providers/delhivery/cancel"
          desc="Cancel or void active tracking IDs"
        />
      </div>
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