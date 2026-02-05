'use client';

import React, { useState } from 'react';
import { 
  AlertCircle, RotateCcw, Eye, Terminal, 
  History, Trash2, 
  ExternalLink, Box, Cpu, X, 
  Filter, Search
} from 'lucide-react';

// /** ─────────────────────────────────────────────────────────────────────────
//  * TYPES & INTERFACES (Strictly Typed)
//  * ─────────────────────────────────────────────────────────────────────── */
// interface DlqJob {
//   id: string;
//   provider: 'DTDC' | 'Delhivery' | 'BlueDart';
//   client: string;
//   awb: string;
//   reason: string;
//   attempts: number;
//   maxAttempts: number;
//   failedAt: string;
//   payload: Record<string, unknown>; // Replaced 'any' with a strict object type
// }

// const MOCK_DLQ: DlqJob[] = [
//   {
//     id: 'job_001',
//     provider: 'DTDC',
//     client: 'Client A',
//     awb: 'AWB123456',
//     reason: 'Credential expired: Unauthorized access to provider endpoint',
//     attempts: 3,
//     maxAttempts: 5,
//     failedAt: '2025-02-01 14:32',
//     payload: { provider: 'dtdc', awb: 'AWB123456', weight: 1.5 },
//   },
//   {
//     id: 'job_002',
//     provider: 'Delhivery',
//     client: 'Client B',
//     awb: 'AWB789012',
//     reason: 'Socket Timeout: Destination server not responding within 30s',
//     attempts: 2,
//     maxAttempts: 5,
//     failedAt: '2025-02-01 14:40',
//     payload: { provider: 'delhivery', awb: 'AWB789012', weight: 0.5 },
//   },
// ];

// export default function DlqPage() {
//   const [selected, setSelected] = useState<DlqJob | null>(null);

//   return (
//     <div className="min-h-screen bg-white text-slate-900 font-sans">
//       {/* ───────────────── HEADER ───────────────── */}
//       <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
//         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded border border-red-200 bg-white text-red-600 shadow-sm">
//               <AlertCircle size={20} />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold tracking-tight">Dead Letter Queue</h1>
//               <p className="text-xs font-medium text-slate-500">API Failure Diagnosis & Recovery</p>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-2">
//             <button className="flex items-center gap-2 rounded border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors">
//               <Trash2 size={14} /> PURGE ALL
//             </button>
//             <button className="flex items-center gap-2 rounded bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-900 transition-all shadow-sm">
//               <RotateCcw size={14} /> BULK RETRY
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ───────────────── UTILITY BAR ───────────────── */}
//       <div className="border-b border-slate-200 bg-white px-6 py-3">
//         <div className="flex flex-wrap gap-2">
//           <div className="relative w-full md:w-64">
//             <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
//             <input 
//               type="text"
//               placeholder="Filter by ID or AWB..." 
//               className="w-full rounded border border-slate-300 bg-white pl-8 pr-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
//             />
//           </div>
//           <button className="flex items-center gap-2 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
//             <Filter size={14} /> ALL PROVIDERS
//           </button>
//         </div>
//       </div>

//       {/* ───────────────── DIAGNOSTIC TABLE ───────────────── */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-left border-collapse table-auto">
//           <thead>
//             <tr className="bg-slate-100/80 border-b border-slate-200">
//               <Th>Job ID</Th>
//               <Th>Source</Th>
//               <Th>Object Ref</Th>
//               <Th>Error Signature</Th>
//               <Th className="text-center">Attempts</Th>
//               <Th>Last Failure</Th>
//               <Th className="text-right">Actions</Th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-200 bg-white">
//             {MOCK_DLQ.map((job) => (
//               <tr key={job.id} className="hover:bg-blue-50/30 transition-colors">
//                 <Td>
//                   <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-slate-500">
//                     <Cpu size={12} className="text-slate-400" /> {job.id}
//                   </div>
//                 </Td>
//                 <Td>
//                   <div className="flex flex-col leading-tight">
//                     <span className="text-xs font-bold text-slate-800">{job.provider}</span>
//                     <span className="text-[9px] font-black text-slate-400 tracking-tighter uppercase">{job.client}</span>
//                   </div>
//                 </Td>
//                 <Td>
//                   <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100 w-fit">
//                     <Box size={10} /> {job.awb}
//                   </div>
//                 </Td>
//                 <Td>
//                   <div className="flex items-center gap-2 max-w-[240px]">
//                     <div className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
//                     <span className="text-xs font-medium text-red-700 truncate">{job.reason}</span>
//                   </div>
//                 </Td>
//                 <Td className="text-center">
//                   <span className="font-mono text-[10px] font-bold text-slate-600">
//                     {job.attempts} / {job.maxAttempts}
//                   </span>
//                 </Td>
//                 <Td>
//                   <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
//                     <History size={12} /> {job.failedAt}
//                   </div>
//                 </Td>
//                 <Td className="text-right">
//                   <div className="flex items-center justify-end gap-1">
//                     <button 
//                       onClick={() => setSelected(job)}
//                       className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded border border-transparent hover:border-blue-200 transition-all"
//                     >
//                       <Eye size={16} />
//                     </button>
//                     <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded border border-transparent hover:border-emerald-200 transition-all">
//                       <RotateCcw size={16} />
//                     </button>
//                   </div>
//                 </Td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* ───────────────── INSPECTION DRAWER ───────────────── */}
//       {selected && (
//         <DlqDrawer job={selected} onClose={() => setSelected(null)} />
//       )}
//     </div>
//   );
// }

// /** ─────────────────────────────────────────────────────────────────────────
//  * REFACTORED DRAWER (ERP DEBUGGER STYLE)
//  * ─────────────────────────────────────────────────────────────────────── */
// function DlqDrawer({ job, onClose }: { job: DlqJob; onClose: () => void }) {
//   return (
//     <div className="fixed inset-0 z-[100] flex justify-end">
//       <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
//       <div className="relative w-full max-w-xl bg-white border-l border-slate-200 shadow-2xl flex flex-col">
//         {/* Drawer Header */}
//         <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex justify-between items-center">
//           <div>
//             <span className="text-[10px] font-black uppercase text-red-600 tracking-widest">Diagnostic Mode</span>
//             <h2 className="text-lg font-bold text-slate-900 leading-tight">Job: {job.id}</h2>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded text-slate-500">
//             <X size={20} />
//           </button>
//         </div>

//         {/* Drawer Content */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-6">
//           <div className="grid grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded overflow-hidden">
//             <InfoGridItem label="Provider" value={job.provider} />
//             <InfoGridItem label="AWB Ref" value={job.awb} />
//             <InfoGridItem label="Retries" value={`${job.attempts} / ${job.maxAttempts}`} />
//             <InfoGridItem label="Failed At" value={job.failedAt} />
//           </div>

//           <div className="space-y-2">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Error Stack Trace</label>
//             <div className="p-3 bg-red-50 border border-red-100 rounded text-red-800 text-xs font-bold leading-relaxed">
//               {job.reason}
//             </div>
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center justify-between">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Payload Source</label>
//               <button className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
//                 <ExternalLink size={10} /> COPY RAW DATA
//               </button>
//             </div>
//             <div className="rounded border border-slate-800 bg-slate-900 p-4">
//               <pre className="text-[11px] font-mono text-blue-300 overflow-auto max-h-[400px]">
//                 {JSON.stringify(job.payload, null, 2)}
//               </pre>
//             </div>
//           </div>
//         </div>

//         {/* Drawer Actions */}
//         <div className="border-t border-slate-200 p-4 bg-slate-50 flex gap-2">
//           <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 shadow-sm transition-colors">
//             <RotateCcw size={14} /> RE-TRIGGER JOB
//           </button>
//           <button className="px-4 py-2 border border-slate-300 bg-white text-xs font-bold text-slate-600 rounded hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
//             DROP JOB
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /** ─────────────────────────────────────────────────────────────────────────
//  * COMPACT HELPERS
//  * ─────────────────────────────────────────────────────────────────────── */
// function InfoGridItem({ label, value }: { label: string, value: string }) {
//   return (
//     <div className="bg-white p-3">
//       <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">{label}</p>
//       <p className="text-xs font-bold text-slate-800">{value}</p>
//     </div>
//   );
// }

// function Th({ children, className = "" }: { children: React.ReactNode, className?: string }) {
//   return (
//     <th className={`px-6 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500 border-r border-slate-200 last:border-r-0 ${className}`}>
//       {children}
//     </th>
//   );
// }

// function Td({ children, className = "" }: { children: React.ReactNode, className?: string }) {
//   return (
//     <td className={`px-6 py-2.5 border-r border-slate-100 last:border-r-0 ${className}`}>
//       {children}
//     </td>
//   );
// }
interface DlqJob {
  id: string;
  provider: 'DTDC' | 'Delhivery' | 'BlueDart';
  client: string;
  awb: string;
  reason: string;
  attempts: number;
  maxAttempts: number;
  failedAt: string;
  payload: Record<string, unknown>;
}

const MOCK_DLQ: DlqJob[] = [
  {
    id: 'job_001',
    provider: 'DTDC',
    client: 'Client A',
    awb: 'AWB123456',
    reason: 'Credential expired: Unauthorized access to provider endpoint',
    attempts: 3,
    maxAttempts: 5,
    failedAt: '2025-02-01 14:32',
    payload: { provider: 'dtdc', awb: 'AWB123456', weight: 1.5 },
  },
  {
    id: 'job_002',
    provider: 'Delhivery',
    client: 'Client B',
    awb: 'AWB789012',
    reason: 'Socket Timeout: Destination server not responding within 30s',
    attempts: 2,
    maxAttempts: 5,
    failedAt: '2025-02-01 14:40',
    payload: { provider: 'delhivery', awb: 'AWB789012', weight: 0.5 },
  },
];

export default function DlqPage() {
  const [selected, setSelected] = useState<DlqJob | null>(null);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 font-sans">
      
      {/* IDENTICAL HEADER SECTION */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-100">
            <AlertCircle size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Dead Letter Queue</h1>
            <p className="text-xs font-medium text-slate-500">API Failure Diagnosis & Automated Recovery</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 size={14} /> PURGE ALL
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-[#0F172A] px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-sm">
            <RotateCcw size={14} /> BULK RETRY
          </button>
        </div>
      </div>

      {/* UNIFIED TABLE CONTAINER */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        
        {/* IDENTICAL UTILITY BAR */}
        <div className="flex items-center gap-4 border-b border-slate-50 p-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Filter by Job ID or AWB..." 
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5"
            />
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={14} /> ALL PROVIDERS
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <Th>Job ID</Th>
                <Th>Source</Th>
                <Th>Object Ref</Th>
                <Th>Error Signature</Th>
                <Th className="text-center">Attempts</Th>
                <Th>Last Failure</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_DLQ.map((job) => (
                <tr key={job.id} className="group transition-colors hover:bg-slate-50/30">
                  <Td>
                    <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-slate-500">
                      <Cpu size={12} className="text-slate-400" /> {job.id}
                    </div>
                  </Td>
                  <Td>
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-bold text-slate-800">{job.provider}</span>
                      <span className="text-[9px] font-black text-slate-400 tracking-tighter uppercase">{job.client}</span>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50/50 px-2.5 py-1 rounded border border-indigo-100 w-fit">
                      <Box size={10} /> {job.awb}
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2 max-w-[240px]">
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                      <span className="text-xs font-medium text-red-700 truncate">{job.reason}</span>
                    </div>
                  </Td>
                  <Td className="text-center">
                    <span className="font-mono text-[10px] font-bold text-slate-600">
                      {job.attempts} / {job.maxAttempts}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                      <History size={12} /> {job.failedAt}
                    </div>
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelected(job)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-600 transition-all hover:bg-slate-50"
                      >
                        DIAGNOSE
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white">
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <DlqDrawer job={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

/** ─────────────────────────────────────────────────────────────────────────
 * UPDATED DRAWER (MATCHES GLOBAL THEME)
 * ─────────────────────────────────────────────────────────────────────── */
function DlqDrawer({ job, onClose }: { job: DlqJob; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="border-b border-slate-100 bg-white px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
               <AlertCircle size={20} />
             </div>
             <div>
               <span className="text-[10px] font-black uppercase text-red-600 tracking-widest">Diagnostic Mode</span>
               <h2 className="text-lg font-bold text-slate-900 leading-tight">Job: {job.id}</h2>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <InfoGridItem label="Provider" value={job.provider} />
            <InfoGridItem label="AWB Ref" value={job.awb} />
            <InfoGridItem label="Retries" value={`${job.attempts} / ${job.maxAttempts}`} />
            <InfoGridItem label="Failed At" value={job.failedAt} />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Error Stack Trace</label>
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-800 text-xs font-bold leading-relaxed">
              {job.reason}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Payload Source</label>
              <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                <ExternalLink size={10} /> COPY RAW DATA
              </button>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5 shadow-inner">
              <pre className="text-[11px] font-mono text-indigo-300 overflow-auto max-h-[400px]">
                {JSON.stringify(job.payload, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 p-6 bg-slate-50/50 flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
            <RotateCcw size={14} /> RE-TRIGGER JOB
          </button>
          <button className="px-6 py-3 border border-slate-200 bg-white text-xs font-bold text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">
            DROP JOB
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoGridItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">{label}</p>
      <p className="text-xs font-bold text-slate-800">{value}</p>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <th className={`px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <td className={`px-6 py-4 ${className}`}>
      {children}
    </td>
  );
}