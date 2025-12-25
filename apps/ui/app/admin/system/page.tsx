'use client';

import { 
  Activity, Server, Database, Zap, 
  Cpu, Globe, RefreshCcw, ShieldCheck, 
  AlertTriangle, XCircle, CheckCircle2,
  Clock, HardDrive, Network
} from 'lucide-react';
import clsx from 'clsx';

type Status = 'healthy' | 'degraded' | 'down';

// ... (MOCK_SYSTEM_STATUS stays the same)
type SystemItem = {
  name: string;
  status: Status;
  details?: string;
};

const MOCK_SYSTEM_STATUS: SystemItem[] = [
  {
    name: 'API Server',
    status: 'healthy',
    details: 'Listening on :4000',
  },
  {
    name: 'Worker',
    status: 'healthy',
    details: 'Last heartbeat 30s ago',
  },

  {
    name: 'Redis',
    status: 'healthy',
    details: 'Connected',
  },
  {
    name: 'DTDC Sync',
    status: 'degraded',
    details: 'High latency detected',
  },
  {
    name: 'Delhivery Sync',
    status: 'healthy',
  },
  {
    name: 'Maruti Sync',
    status: 'down',
    details: 'Provider disabled',
  },
];

export default function SystemPage() {
  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      
      {/* ───────────────── HEADER & METRICS ───────────────── */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200 animate-pulse">
            <Activity size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Pulse</h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">Live</span>
            </div>
            <p className="text-slate-500 font-medium">Real-time health monitoring for platform infrastructure.</p>
          </div>
        </div>

        <div className="flex gap-4">
            <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Uptime</p>
                <p className="text-xl font-mono font-black text-slate-800">99.98%</p>
            </div>
            <div className="h-10 w-[1px] bg-slate-200" />
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
              <RefreshCcw size={16} /> Force Refresh
            </button>
        </div>
      </div>

      {/* ───────────────── INFRASTRUCTURE GRID ───────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_SYSTEM_STATUS.map((item) => (
          <StatusCard key={item.name} item={item} />
        ))}
      </div>

      {/* ───────────────── RECENT INCIDENTS / LOGS ───────────────── */}
      <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Network size={16} className="text-indigo-500" /> Node Latency & Heartbeats
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Updates every 15s</span>
        </div>
        <div className="p-0 overflow-x-auto">
            <table className="w-full text-left">
                <tbody className="divide-y divide-slate-50">
                    <LogEntry name="Primary DB" ping="12ms" load="14%" icon={<Database size={14}/>} />
                    <LogEntry name="Worker-Pool-A" ping="45ms" load="68%" icon={<Cpu size={14}/>} />
                    <LogEntry name="Redis-Cache" ping="2ms" load="4%" icon={<Zap size={14}/>} />
                </tbody>
            </table>
        </div>
      </div>

      {/* ───────────────── FOOTER ───────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl">
          <div className="flex gap-8">
            <MetaItem label="Environment" value="Production" icon={<Globe size={14}/>} />
            <MetaItem label="Version" value="v1.0.4-stable" icon={<ShieldCheck size={14}/>} />
            <MetaItem label="Region" value="Asia-South-1" icon={<HardDrive size={14}/>} />
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
             <Clock size={14} /> Last fully verified at 22 Dec 2025, 22:01:17
          </div>
      </div>

    </div>
  );
}

/* ───────────────── COMPONENTS ───────────────── */

function StatusCard({ item }: { item: SystemItem }) {
  const isHealthy = item.status === 'healthy';
  const isDegraded = item.status === 'degraded';

  return (
    <div className={clsx(
        "relative group p-6 rounded-3xl border transition-all duration-300",
        isHealthy ? "bg-white border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50" : 
        isDegraded ? "bg-amber-50 border-amber-200 shadow-sm" : 
        "bg-red-50 border-red-200 shadow-sm"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={clsx(
            "p-3 rounded-2xl",
            isHealthy ? "bg-slate-50 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600" : 
            isDegraded ? "bg-white text-amber-600" : 
            "bg-white text-red-600"
        )}>
            {item.name.includes('API') ? <Server size={24} /> : 
             item.name.includes('Sync') ? <RefreshCcw size={24} /> : 
             item.name.includes('Redis') ? <Database size={24} /> : <Cpu size={24} />}
        </div>
        <StatusIndicator status={item.status} />
      </div>

      <h3 className="text-lg font-black text-slate-900 mb-1">{item.name}</h3>
      <p className={clsx(
          "text-xs font-medium leading-relaxed",
          isHealthy ? "text-slate-500" : isDegraded ? "text-amber-700" : "text-red-700"
      )}>
        {item.details || 'Operational and responding to requests.'}
      </p>

      {!isHealthy && (
        <div className="mt-4 pt-4 border-t border-current/10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <AlertTriangle size={12} /> Investigation Required
        </div>
      )}
    </div>
  );
}

function StatusIndicator({ status }: { status: Status }) {
    if (status === 'healthy') return <CheckCircle2 className="text-emerald-500" size={20} />;
    if (status === 'degraded') return <AlertTriangle className="text-amber-500 animate-bounce" size={20} />;
    return <XCircle className="text-red-500" size={20} />;
}

function LogEntry({ name, ping, load, icon }: any) {
    return (
        <tr className="hover:bg-slate-50/50">
            <Td className="py-3 px-6">
                <div className="flex items-center gap-3 font-bold text-slate-700">
                    {icon} {name}
                </div>
            </Td>
            <Td className="text-xs font-mono text-slate-400">Response: <span className="text-emerald-600 font-bold">{ping}</span></Td>
            <Td className="text-xs font-mono text-slate-400 text-right px-6">Load: <span className="text-slate-900 font-bold">{load}</span></Td>
        </tr>
    )
}

function MetaItem({ label, value, icon }: any) {
    return (
        <div className="flex items-center gap-2">
            <div className="text-slate-500">{icon}</div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{label}</span>
                <span className="text-xs font-bold">{value}</span>
            </div>
        </div>
    )
}

function Td({ children, className }: any) {
  return <td className={clsx("py-2 px-4 text-sm", className)}>{children}</td>;
}