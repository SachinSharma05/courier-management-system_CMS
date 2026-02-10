'use client';

import { 
  Activity, Server, Database, Zap, 
  Cpu, RefreshCcw, AlertTriangle, XCircle, CheckCircle2, Network
} from 'lucide-react';
import clsx from 'clsx';
import { SystemItem, SystemStatus } from '../interface/adminInterface';

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

function LogEntry({ name, ping, load, icon }: { name: string, ping: string, load: string, icon: React.ReactNode}) {
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