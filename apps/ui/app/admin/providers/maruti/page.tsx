'use client';

import { useProviderStats } from '@/hooks/useProviderStats';
import { 
  Package, Truck, CheckCircle2, ArrowLeftRight, 
  Plus, MapPin, ClipboardList, Database, 
  ChevronRight, Activity, BarChart3, ScanLine
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export default function MarutiOverviewPage() {
  const { data, isLoading } = useProviderStats('maruti');

  if (isLoading) return <LoadingTerminal />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* ───────────────── KPI STRIP ───────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <StatNode label="Active_Payload" value={data.total} icon={<Package size={18}/>} color="indigo" />
        <StatNode label="DRS_Delivered" value={data.delivered} icon={<CheckCircle2 size={18}/>} color="emerald" />
        <StatNode label="In_Transit" value={data.inTransit} icon={<Truck size={18}/>} color="blue" />
        <StatNode label="RTO_Returns" value={data.rto} icon={<ArrowLeftRight size={18}/>} color="rose" />
        <StatNode label="PRS_Pending" value={data.pendingPickup || 0} icon={<MapPin size={18}/>} color="amber" />
      </div>

      {/* ───────────────── MARUTI CORE OPS ENGINE ───────────────── */}
      <div className="bg-indigo-950 rounded-sm border border-indigo-900 shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-indigo-900 flex items-center justify-between bg-indigo-950/50">
           <div className="flex items-center gap-3">
             <div className="p-1.5 bg-indigo-500/20 rounded-sm">
                <Database size={16} className="text-indigo-400" />
             </div>
             <h3 className="text-[11px] font-black text-indigo-100 uppercase tracking-[0.2em]">Lifecycle_Operations_Matrix</h3>
           </div>
           <span className="text-[9px] font-mono text-indigo-500 uppercase tracking-widest">System_Cluster: Maruti_V2</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 divide-x divide-y divide-indigo-900/50 border-b border-indigo-900/50">
          {data.breakdown.map((b: any) => (
            <div key={b.label} className="p-6 hover:bg-indigo-900/40 transition-all group">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3 group-hover:text-white transition-colors">
                {b.label.replace('_', ' ')}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white tracking-tighter font-mono">{b.value}</span>
                <span className="text-[9px] font-bold text-indigo-700 uppercase">Nodes</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────── FUNCTIONAL COMMANDS ───────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Seller Command Group */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <BarChart3 size={14} /> Seller_Command_Suite
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ActionTile 
              title="BOOK_ECOMMERCE" icon={<Plus size={20} />} theme="dark" 
              href="/admin/providers/maruti/create/ecomm" desc="Standard shipping nodes" 
            />
            <ActionTile 
              title="HYPERLOCAL_ENGINE" icon={<MapPin size={20} />} theme="white" 
              href="/admin/providers/maruti/create/hyperlocal" desc="Intra-city rapid nodes" 
            />
          </div>
        </div>

        {/* Ops Command Group */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <ScanLine size={14} /> Logistics_Ops_Suite
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ActionTile 
              title="DRS_TERMINAL" icon={<Truck size={20} />} theme="white" 
              href="/admin/providers/maruti/drs" desc="Delivery run sheets" 
            />
            <ActionTile 
              title="PRS_SCANNER" icon={<ClipboardList size={20} />} theme="indigo" 
              href="/admin/providers/maruti/prs" desc="Pickup & scanning hub" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Maruti-Specific Loading
function LoadingTerminal() {
    return (
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
            <Activity className="animate-pulse text-indigo-600" size={48} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
                Initalizing_Maruti_Ops_Node...
            </span>
        </div>
    );
}

/* ───────────────── REUSABLE MARUTI COMPONENTS ───────────────── */

function StatNode({ label, value, icon, color }: any) {
  const colors: any = {
    indigo: "border-indigo-500 text-indigo-600 bg-indigo-50",
    emerald: "border-emerald-500 text-emerald-600 bg-emerald-50",
    blue: "border-blue-500 text-blue-600 bg-blue-50",
    rose: "border-rose-500 text-rose-600 bg-rose-50",
    amber: "border-amber-500 text-amber-600 bg-amber-50",
  };

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm relative group overflow-hidden">
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
    white: "bg-white text-slate-900 border-slate-200 hover:border-indigo-300",
    indigo: "bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
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
        <div className={clsx("p-2 rounded-sm", theme === 'white' ? "bg-slate-100" : "bg-white/10")}>
            {icon}
        </div>
      </div>
      <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">{title}</h4>
      <p className={clsx("text-[10px] mt-1 font-bold", theme === 'white' ? "text-slate-500" : "text-indigo-100/70")}>
        {desc}
      </p>
    </Link>
  );
}