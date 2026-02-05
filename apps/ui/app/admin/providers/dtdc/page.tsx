'use client';

import { useProviderStats } from '@/hooks/useProviderStats';
import { 
  Package, Truck, CheckCircle2, AlertCircle, 
  Plus, Layers, Printer, XCircle, ChevronRight, 
  Activity, Database, Hash, BarChart3, ArrowRightLeft,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

// export default function DtdcOverviewPage() {
//   const { data, isLoading } = useProviderStats('dtdc');

//   if (isLoading) return <LoadingTerminal />;

//   return (
//     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
//       {/* ───────────────── HEADER METRICS ───────────────── */}
//       <div className="flex items-end justify-between">
//         <div>
//           <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
//             <BarChart3 size={16} className="text-blue-600" /> DTDC_Operational_Insight
//           </h2>
//           <p className="text-[11px] text-slate-500 font-medium mt-1">Aggregated performance data across DTDCs regional nodes.</p>
//         </div>
//       </div>

//       {/* ───────────────── STATS MATRIX ───────────────── */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
//         <StatNode label="Total_In_Pipe" value={data.total} icon={<Package size={18}/>} color="blue" />
//         <StatNode label="Delivered_Nodes" value={data.delivered} icon={<CheckCircle2 size={18}/>} color="emerald" />
//         <StatNode label="Transit_Active" value={data.inTransit} icon={<Truck size={18}/>} color="amber" />
//         <StatNode label="RTO_Returns" value={data.rto} icon={<ArrowRightLeft size={18}/>} color="rose" />
//         <StatNode label="NDR_Issues" value={data.ndr} icon={<AlertCircle size={18}/>} color="orange" />
//       </div>

//       {/* ───────────────── LIFECYCLE DISTRIBUTION ───────────────── */}
//       <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
//         <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//            <div className="flex items-center gap-2">
//              <Database size={16} className="text-blue-700" />
//              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Network_Lifecycle_Distribution</h3>
//            </div>
//            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter">Cluster_ID: DTDC_001</span>
//         </div>
//         <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 divide-x divide-slate-100">
//           {data.breakdown.map((b: any) => (
//             <div key={b.label} className="p-6 hover:bg-blue-50/30 transition-colors group">
//               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 group-hover:text-blue-600 transition-colors">
//                 {b.label.replace('_', ' ')}
//               </p>
//               <div className="flex items-baseline gap-2">
//                 <span className="text-2xl font-black text-slate-900 tracking-tighter font-mono">{b.value}</span>
//                 <span className="text-[9px] font-bold text-slate-400 uppercase">Units</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ───────────────── QUICK ACCESS ───────────────── */}
//       <div className="space-y-4">
//         <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Critical_Gateway_Links</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <ActionTile 
//             title="INITIALIZE_SHIPMENT" 
//             icon={<Plus size={20} />} 
//             theme="dark" 
//             href="/admin/providers/dtdc/create"
//             desc="Create single DTDC airway bill" 
//           />
//           <ActionTile 
//             title="BATCH_INGESTION" 
//             icon={<Layers size={20} />} 
//             theme="white" 
//             href="/admin/providers/dtdc/bulk"
//             desc="Process high-volume manifests"
//           />
//           <ActionTile 
//             title="LABEL_GEN_CENTER" 
//             icon={<Printer size={20} />} 
//             theme="white" 
//             href="/admin/providers/dtdc/label"
//             desc="Thermal print engine access"
//           />
//           <ActionTile 
//             title="TERMINATE_NODE" 
//             icon={<XCircle size={20} />} 
//             theme="danger" 
//             href="/admin/providers/dtdc/cancel"
//             desc="Void active network IDs"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// // Helpers
// function LoadingTerminal() {
//     return (
//         <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
//             <Activity className="animate-pulse text-blue-600" size={48} />
//             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
//                 Syncing_DTDC_Network_Cluster...
//             </span>
//         </div>
//     );
// }

// /* ───────────────── ERP COMPONENTS ───────────────── */

// function StatNode({ label, value, icon, color }: any) {
//   const colors: any = {
//     blue: "border-blue-500 text-blue-600 bg-blue-50",
//     emerald: "border-emerald-500 text-emerald-600 bg-emerald-50",
//     amber: "border-amber-500 text-amber-600 bg-amber-50",
//     rose: "border-rose-500 text-rose-600 bg-rose-50",
//     orange: "border-red-500 text-red-600 bg-red-50",
//   };

//   return (
//     <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm relative overflow-hidden group">
//       <div className={clsx("absolute top-0 left-0 w-1 h-full", colors[color].split(' ')[0].replace('border-', 'bg-'))} />
//       <div className="flex justify-between items-start">
//         <div className="space-y-1">
//           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
//           <h3 className="text-2xl font-black text-slate-900 tracking-tighter font-mono">{value}</h3>
//         </div>
//         <div className={clsx("p-2 rounded-sm border", colors[color])}>
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// function ActionTile({ title, icon, theme, href, desc }: any) {
//   const styles = {
//     dark: "bg-slate-900 text-white border-slate-800 hover:bg-slate-800",
//     white: "bg-white text-slate-900 border-slate-200 hover:border-slate-400 hover:bg-slate-50",
//     danger: "bg-white text-rose-600 border-rose-100 hover:bg-rose-50"
//   };

//   return (
//     <Link 
//       href={href}
//       className={clsx(
//         "flex flex-col p-5 border transition-all active:scale-[0.98] group relative rounded-sm",
//         styles[theme as keyof typeof styles]
//       )}
//     >
//       <div className="flex items-center justify-between mb-4">
//         <div className={clsx(
//             "p-2 rounded-sm",
//             theme === 'dark' ? "bg-white/10" : "bg-slate-100"
//         )}>
//             {icon}
//         </div>
//         <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
//       </div>
//       <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">{title}</h4>
//       <p className={clsx(
//         "text-[10px] mt-1 font-bold",
//         theme === 'dark' ? "text-slate-400" : "text-slate-500"
//       )}>{desc}</p>
      
//       <div className="absolute top-2 right-2 opacity-10">
//         <Hash size={40} />
//       </div>
//     </Link>
//   );
// }
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
          <p className="text-sm text-slate-500 mt-1">Aggregated performance data across DTDC's regional clusters.</p>
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

function StatNode({ label, value, icon, color }: any) {
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

function ActionTile({ title, icon, theme, href, desc }: any) {
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