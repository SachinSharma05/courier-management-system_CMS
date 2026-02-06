'use client';

import React, { useState } from 'react';
import { 
  History, Search, Globe, Tag, 
  Calendar, ShieldCheck, Download,
  Filter,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { AuditLog, FilterState } from '../interface/adminInterface';

const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: '1', time: '2025-02-01 14:32', user: 'admin@cms.com', role: 'SUPER_ADMIN', action: 'CLIENT_LIMIT_UPDATE', entity: 'client', entityId: '12', client: 'Client A', ip: '103.21.45.11' },
  { id: '2', time: '2025-02-01 14:40', user: 'admin@cms.com', role: 'SUPER_ADMIN', action: 'DLQ_RETRY', entity: 'job', entityId: 'job_001', client: 'Client B', ip: '103.21.45.11' },
];

export default function AuditLogsPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    action: '',
    client: '',
    startDate: '',
    endDate: ''
  });

  return (
    <div className="p-2 space-y-2 bg-[#f8fafc] min-h-screen font-sans">  
      {/* IDENTICAL HEADER SECTION */}
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-300 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-white shadow-lg shadow-slate-200">
            <History size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Audit Trail</h1>
            <p className="text-sm font-medium text-slate-500">System-wide security events and administrative logs</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-[#0F172A] px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800 shadow-sm">
          <Download size={14} />
          EXPORT CSV
        </button>
      </div>

      {/* UNIFIED TABLE CONTAINER */}
      <div className="rounded-2xl border border-slate-300 bg-white shadow-sm overflow-hidden">
        
        {/* INTEGRATED UTILITY BAR (FILTERS) */}
        <div className="border-b border-slate-50 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text"
                placeholder="Filter user..." 
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs font-medium outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text"
                placeholder="Action..." 
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs font-medium outline-none transition-all focus:border-indigo-500 focus:bg-white"
                value={filters.action}
                onChange={(e) => setFilters({...filters, action: e.target.value})}
              />
            </div>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text"
                placeholder="Client..." 
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs font-medium outline-none transition-all focus:border-indigo-500 focus:bg-white"
                value={filters.client}
                onChange={(e) => setFilters({...filters, client: e.target.value})}
              />
            </div>
            <div className="lg:col-span-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 bg-slate-50/50">
              <Calendar size={14} className="text-slate-400" />
              <input type="date" className="bg-transparent text-[10px] font-bold outline-none text-slate-600 w-full cursor-pointer" />
              <span className="text-slate-300 text-[10px] font-black uppercase tracking-tighter">TO</span>
              <input type="date" className="bg-transparent text-[10px] font-bold outline-none text-slate-600 w-full cursor-pointer" />
            </div>
            <button className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
              <Filter size={14} />
              APPLY
            </button>
          </div>
        </div>

        {/* DATA GRID */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70">
                <Th>Timestamp</Th>
                <Th>Identity</Th>
                <Th>Action</Th>
                <Th>Resource & ID</Th>
                <Th>Client Context</Th>
                <Th>Network IP</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="group transition-colors hover:bg-slate-50/30">
                  <Td className="whitespace-nowrap">
                    <span className="font-mono text-[11px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors">{log.time}</span>
                  </Td>
                  <Td>
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-bold text-slate-800">{log.user}</span>
                      <span className="text-[9px] font-black text-indigo-600 tracking-wider uppercase">{log.role.replace('_', ' ')}</span>
                    </div>
                  </Td>
                  <Td>
                    <span className="inline-block px-2 py-1 rounded-lg border border-slate-100 bg-slate-50 font-mono text-[10px] font-bold text-slate-600">
                      {log.action}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-slate-400 font-medium">{log.entity}:</span>
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{log.entityId}</span>
                    </div>
                  </Td>
                  <Td>
                    <span className="text-xs font-bold text-slate-700">{log.client}</span>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 bg-slate-50/50 w-fit px-2 py-1 rounded-lg border border-slate-100">
                      <ShieldCheck size={12} className="text-emerald-500" />
                      {log.ip}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* IDENTICAL FOOTER / PAGINATION */}
        <div className="border-t border-slate-50 bg-white px-6 py-4 flex justify-between items-center">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing <span className="text-slate-900">1-2</span> of 480 entries
          </div>
          <div className="flex gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** ─────────────────────────────────────────────────────────────────────────
 * SHARED COMPONENTS (INTERNAL)
 * ─────────────────────────────────────────────────────────────────────── */
function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-6 py-4 ${className}`}>
      {children}
    </td>
  );
}