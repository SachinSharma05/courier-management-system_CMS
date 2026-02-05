'use client';

import React, { ReactNode } from 'react';
import { 
  Activity, Server, Database, Zap, 
  Cpu, Globe, RefreshCcw, ShieldCheck, 
  AlertTriangle, XCircle, CheckCircle2,
  Clock, HardDrive, Network
} from 'lucide-react';
import clsx from 'clsx';

// /** ─────────────────────────────────────────────────────────────────────────
//  * TYPES & INTERFACES
//  * ─────────────────────────────────────────────────────────────────────── */
// type SystemStatus = 'healthy' | 'degraded' | 'down';

// interface SystemItem {
//   name: string;
//   status: SystemStatus;
//   details?: string;
// }

// interface LogEntryProps {
//   name: string;
//   ping: string;
//   load: string;
//   icon: ReactNode;
// }

// interface MetaItemProps {
//   label: string;
//   value: string;
//   icon: ReactNode;
// }

// const MOCK_SYSTEM_STATUS: SystemItem[] = [
//   { name: 'API Server', status: 'healthy', details: 'Listening on :4000' },
//   { name: 'Worker', status: 'healthy', details: 'Heartbeat 30s ago' },
//   { name: 'Redis', status: 'healthy', details: 'Connected' },
//   { name: 'DTDC Sync', status: 'degraded', details: 'High latency (850ms)' },
//   { name: 'Delhivery Sync', status: 'healthy', details: 'Operational' },
//   { name: 'Maruti Sync', status: 'down', details: 'Provider disabled' },
// ];

// export default function SystemPage() {
//   return (
//     <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      
//       {/* ───────────────── ERP HEADER (FLAT) ───────────────── */}
//       <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
//         <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
//           <div className="flex items-center gap-4">
//             <div className="h-10 w-10 rounded border border-emerald-200 bg-white flex items-center justify-center text-emerald-600 shadow-sm">
//               <Activity size={20} />
//             </div>
//             <div>
//               <div className="flex items-center gap-2">
//                 <h1 className="text-xl font-bold tracking-tight text-slate-900">System Infrastructure</h1>
//                 <span className="px-1.5 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-widest">Live</span>
//               </div>
//               <p className="text-xs font-medium text-slate-500">Real-time health monitoring & node latency.</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-6">
//             <div className="text-right border-r border-slate-200 pr-6">
//               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Uptime</p>
//               <p className="text-lg font-mono font-black text-slate-800 tracking-tighter">99.982%</p>
//             </div>
//             <button className="flex items-center gap-2 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors shadow-sm">
//               <RefreshCcw size={14} /> FORCE REFRESH
//             </button>
//           </div>
//         </div>
//       </div>

//       <main className="p-6 space-y-6">
//         {/* ───────────────── INFRASTRUCTURE GRID ───────────────── */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {MOCK_SYSTEM_STATUS.map((item) => (
//             <StatusCard key={item.name} item={item} />
//           ))}
//         </div>

//         {/* ───────────────── NODE PERFORMANCE TABLE ───────────────── */}
//         <div className="rounded border border-slate-200 bg-white shadow-sm overflow-hidden">
//           <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
//             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
//               <Network size={14} className="text-blue-500" /> Active Node Heartbeats
//             </h3>
//             <span className="text-[9px] font-bold text-slate-400 font-mono">TS: {new Date().toISOString()}</span>
//           </div>
//           <table className="w-full text-left border-collapse">
//             <tbody className="divide-y divide-slate-100">
//               <LogEntry name="Primary DB" ping="12ms" load="14%" icon={<Database size={14}/>} />
//               <LogEntry name="Worker-Pool-A" ping="45ms" load="68%" icon={<Cpu size={14}/>} />
//               <LogEntry name="Redis-Cache" ping="2ms" load="4%" icon={<Zap size={14}/>} />
//             </tbody>
//           </table>
//         </div>
//       </main>

//       {/* ───────────────── SYSTEM META FOOTER ───────────────── */}
//       <footer className="fixed bottom-0 w-full border-t border-slate-200 bg-white px-6 py-3 flex flex-wrap items-center justify-between gap-4">
//         <div className="flex gap-8">
//           <MetaItem label="Env" value="Production" icon={<Globe size={14}/>} />
//           <MetaItem label="Version" value="v1.0.4-stable" icon={<ShieldCheck size={14}/>} />
//           <MetaItem label="Region" value="Asia-South-1" icon={<HardDrive size={14}/>} />
//         </div>
//         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//           <Clock size={12} /> Last Full Audit: 22 Dec 2025, 22:01:17
//         </div>
//       </footer>
//     </div>
//   );
// }

// /** ─────────────────────────────────────────────────────────────────────────
//  * INTERNAL COMPONENTS
//  * ─────────────────────────────────────────────────────────────────────── */

// function StatusCard({ item }: { item: SystemItem }) {
//   const isHealthy = item.status === 'healthy';
//   const isDegraded = item.status === 'degraded';

//   return (
//     <div className={clsx(
//       "p-4 rounded border transition-colors",
//       isHealthy ? "bg-white border-slate-200" : 
//       isDegraded ? "bg-amber-50 border-amber-200" : 
//       "bg-red-50 border-red-200"
//     )}>
//       <div className="flex items-start justify-between mb-2">
//         <div className={clsx(
//           "p-2 rounded border",
//           isHealthy ? "bg-slate-50 border-slate-200 text-slate-500" : 
//           isDegraded ? "bg-white border-amber-200 text-amber-600" : 
//           "bg-white border-red-200 text-red-600"
//         )}>
//           {item.name.includes('API') ? <Server size={18} /> : 
//            item.name.includes('Sync') ? <RefreshCcw size={18} /> : 
//            item.name.includes('Redis') ? <Database size={18} /> : <Cpu size={18} />}
//         </div>
//         <StatusIndicator status={item.status} />
//       </div>

//       <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
//       <p className={clsx(
//         "text-[11px] font-medium leading-tight mt-1",
//         isHealthy ? "text-slate-500" : isDegraded ? "text-amber-700" : "text-red-700"
//       )}>
//         {item.details || 'System operational.'}
//       </p>

//       {!isHealthy && (
//         <div className="mt-3 pt-3 border-t border-current/10 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest italic">
//           <AlertTriangle size={10} /> Ops Investigation Req.
//         </div>
//       )}
//     </div>
//   );
// }

// function StatusIndicator({ status }: { status: SystemStatus }) {
//   if (status === 'healthy') return <CheckCircle2 className="text-emerald-500" size={16} />;
//   if (status === 'degraded') return <AlertTriangle className="text-amber-500" size={16} />;
//   return <XCircle className="text-red-500" size={16} />;
// }

// function LogEntry({ name, ping, load, icon }: LogEntryProps) {
//   return (
//     <tr className="hover:bg-slate-50/80 transition-colors group">
//       <td className="py-2.5 px-4">
//         <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
//           <span className="text-slate-400 group-hover:text-blue-500 transition-colors">{icon}</span> {name}
//         </div>
//       </td>
//       <td className="py-2.5 px-4 text-[11px] font-mono text-slate-400 border-x border-slate-100">
//         RTT: <span className="text-emerald-600 font-bold">{ping}</span>
//       </td>
//       <td className="py-2.5 px-4 text-[11px] font-mono text-slate-400 text-right">
//         LOAD: <span className="text-slate-900 font-bold">{load}</span>
//       </td>
//     </tr>
//   );
// }

// function MetaItem({ label, value, icon }: MetaItemProps) {
//   return (
//     <div className="flex items-center gap-2 border-r border-slate-200 pr-6 last:border-0">
//       <div className="text-slate-400">{icon}</div>
//       <div className="flex flex-col">
//         <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{label}</span>
//         <span className="text-[11px] font-bold text-slate-700">{value}</span>
//       </div>
//     </div>
//   );
// }
type SystemStatus = 'healthy' | 'degraded' | 'down';

interface SystemItem {
  name: string;
  status: SystemStatus;
  details?: string;
}

interface LogEntryProps {
  name: string;
  ping: string;
  load: string;
  icon: ReactNode;
}

interface MetaItemProps {
  label: string;
  value: string;
  icon: ReactNode;
}

const MOCK_SYSTEM_STATUS: SystemItem[] = [
  { name: 'API Server', status: 'healthy', details: 'Listening on :4000' },
  { name: 'Worker', status: 'healthy', details: 'Heartbeat 30s ago' },
  { name: 'Redis', status: 'healthy', details: 'Connected' },
  { name: 'DTDC Sync', status: 'degraded', details: 'High latency (850ms)' },
  { name: 'Delhivery Sync', status: 'healthy', details: 'Operational' },
  { name: 'Maruti Sync', status: 'down', details: 'Provider disabled' },
];

export default function SystemPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 font-sans">
      
      {/* IDENTICAL HEADER SECTION */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-100">
            <Activity size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">System Infrastructure</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">Live</span>
            </div>
            <p className="text-xs font-medium text-slate-500">Real-time health monitoring & node latency analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right border-r border-slate-100 pr-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Uptime</p>
            <p className="text-xl font-mono font-black text-emerald-600 tracking-tighter">99.982%</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-[#0F172A] px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800 shadow-sm">
            <RefreshCcw size={14} /> FORCE REFRESH
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* INFRASTRUCTURE GRID (Now with consistent Card UI) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_SYSTEM_STATUS.map((item) => (
            <StatusCard key={item.name} item={item} />
          ))}
        </div>

        {/* UNIFIED TABLE CONTAINER (Heartbeats) */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-white">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Network size={14} className="text-indigo-500" /> Active Node Heartbeats
            </h3>
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-[9px] font-bold text-slate-500 font-mono">
              LAST UPDATE: {new Date().toLocaleTimeString()}
            </div>
          </div>
          <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-slate-50">
              <LogEntry name="Primary DB" ping="12ms" load="14%" icon={<Database size={16}/>} />
              <LogEntry name="Worker-Pool-A" ping="45ms" load="68%" icon={<Cpu size={16}/>} />
              <LogEntry name="Redis-Cache" ping="2ms" load="4%" icon={<Zap size={16}/>} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/** ─────────────────────────────────────────────────────────────────────────
 * UPDATED INTERNAL COMPONENTS
 * ─────────────────────────────────────────────────────────────────────── */

function StatusCard({ item }: { item: SystemItem }) {
  const isHealthy = item.status === 'healthy';
  const isDegraded = item.status === 'degraded';

  return (
    <div className={clsx(
      "p-5 rounded-2xl border transition-all shadow-sm",
      isHealthy ? "bg-white border-slate-100 hover:border-emerald-200" : 
      isDegraded ? "bg-amber-50/50 border-amber-100" : 
      "bg-red-50/50 border-red-100"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={clsx(
          "h-10 w-10 rounded-xl flex items-center justify-center border",
          isHealthy ? "bg-slate-50 border-slate-100 text-slate-500" : 
          isDegraded ? "bg-white border-amber-200 text-amber-600" : 
          "bg-white border-red-200 text-red-600 shadow-sm"
        )}>
          {item.name.includes('API') ? <Server size={20} /> : 
           item.name.includes('Sync') ? <RefreshCcw size={20} /> : 
           item.name.includes('Redis') ? <Database size={20} /> : <Cpu size={20} />}
        </div>
        <StatusIndicator status={item.status} />
      </div>

      <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
      <p className={clsx(
        "text-[11px] font-medium leading-tight mt-1",
        isHealthy ? "text-slate-500" : isDegraded ? "text-amber-700" : "text-red-700"
      )}>
        {item.details || 'System operational.'}
      </p>

      {!isHealthy && (
        <div className="mt-4 pt-4 border-t border-current/10 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest italic">
          <AlertTriangle size={10} /> Ops Investigation Req.
        </div>
      )}
    </div>
  );
}

function StatusIndicator({ status }: { status: SystemStatus }) {
  if (status === 'healthy') return <CheckCircle2 className="text-emerald-500" size={18} />;
  if (status === 'degraded') return <AlertTriangle className="text-amber-500" size={18} />;
  return <XCircle className="text-red-500" size={18} />;
}

function LogEntry({ name, ping, load, icon }: LogEntryProps) {
  return (
    <tr className="group transition-colors hover:bg-slate-50/50">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3 text-xs font-bold text-slate-800">
          <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">{icon}</span> {name}
        </div>
      </td>
      <td className="py-4 px-6 text-[11px] font-mono text-slate-400">
        RTT <span className="text-emerald-600 font-bold ml-2">{ping}</span>
      </td>
      <td className="py-4 px-6 text-[11px] font-mono text-slate-400 text-right">
        LOAD <span className="text-slate-900 font-bold ml-2">{load}</span>
      </td>
    </tr>
  );
}

function MetaItem({ label, value, icon }: MetaItemProps) {
  return (
    <div className="flex items-center gap-3 border-r border-slate-100 pr-8 last:border-0">
      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</span>
        <span className="text-[11px] font-bold text-slate-800 leading-none">{value}</span>
      </div>
    </div>
  );
}