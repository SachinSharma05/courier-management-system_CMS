'use client';

import { 
  History, Search, User, Globe, Tag, 
  Calendar, ShieldCheck, HardDrive, Download 
} from 'lucide-react';
import clsx from 'clsx';

type AuditLog = {
  id: string;
  time: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  entityId: string;
  client: string;
  ip: string;
};

const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: '1', time: '2025-02-01 14:32', user: 'admin@cms.com', role: 'SUPER_ADMIN', action: 'CLIENT_LIMIT_UPDATE', entity: 'client', entityId: '12', client: 'Client A', ip: '103.21.45.11' },
  { id: '2', time: '2025-02-01 14:40', user: 'admin@cms.com', role: 'SUPER_ADMIN', action: 'DLQ_RETRY', entity: 'job', entityId: 'job_001', client: 'Client B', ip: '103.21.45.11' },
];

export default function AuditLogsPage() {
  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
            <History size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Logs</h1>
            <p className="text-sm text-slate-500 font-medium">Security and event tracking trail</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
          <Download size={16} />
          Export Logs
        </button>
      </div>

      {/* ───────────────── FILTERS ───────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
          <input placeholder="Search user..." className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all" />
        </div>
        <div className="relative group">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
          <input placeholder="Action (e.g. UPDATE)" className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all" />
        </div>
        <div className="relative group">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
          <input placeholder="Client..." className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all" />
        </div>
        <div className="relative group lg:col-span-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 h-full">
            <Calendar size={14} className="text-slate-400" />
            <input type="date" className="bg-transparent text-[11px] outline-none text-slate-600 w-full" />
            <span className="text-slate-300 text-xs">to</span>
            <input type="date" className="bg-transparent text-[11px] outline-none text-slate-600 w-full" />
          </div>
        </div>
      </div>

      {/* ───────────────── TABLE ───────────────── */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <Th>Event Time</Th>
                <Th>User & Role</Th>
                <Th>Action Taken</Th>
                <Th>Entity Impacted</Th>
                <Th>Client</Th>
                <Th>Source IP</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="group hover:bg-slate-50/80 transition-colors">
                  <Td>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 text-xs">{log.time.split(' ')[0]}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{log.time.split(' ')[1]}</span>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <User size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">{log.user}</span>
                        <span className="text-[9px] font-bold text-indigo-500 tracking-wider uppercase">{log.role.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {log.action}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                       <HardDrive size={12} className="text-slate-400" />
                       <span className="text-xs font-medium text-slate-600">
                        {log.entity}
                        <span className="mx-1 text-slate-300">/</span>
                        <span className="font-mono text-indigo-500">{log.entityId}</span>
                       </span>
                    </div>
                  </Td>
                  <Td>
                    <span className="text-xs font-semibold text-slate-700">{log.client}</span>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] bg-slate-50 px-2 py-1 rounded-md w-fit">
                      <ShieldCheck size={12} className="text-emerald-500" />
                      {log.ip}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── REFINED HELPERS ───────────────── */

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-4 text-sm text-slate-600">{children}</td>;
}