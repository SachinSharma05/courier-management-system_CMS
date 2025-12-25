'use client';

import { useState } from 'react';
import { 
  AlertCircle, RotateCcw, Eye, Terminal, 
  History, Trash2, 
  ExternalLink, Box, Cpu, X 
} from 'lucide-react';
import clsx from 'clsx';

// ... (MOCK_DLQ remains same)
type DlqJob = {
  id: string;
  provider: string;
  client: string;
  awb: string;
  reason: string;
  attempts: number;
  failedAt: string;
  payload: any;
};

const MOCK_DLQ: DlqJob[] = [
  {
    id: 'job_001',
    provider: 'DTDC',
    client: 'Client A',
    awb: 'AWB123456',
    reason: 'Credential expired',
    attempts: 3,
    failedAt: '10 min ago',
    payload: { provider: 'dtdc', awb: 'AWB123456' },
  },
  {
    id: 'job_002',
    provider: 'Delhivery',
    client: 'Client B',
    awb: 'AWB789012',
    reason: 'Timeout',
    attempts: 2,
    failedAt: '25 min ago',
    payload: { provider: 'delhivery', awb: 'AWB789012' },
  },
];

export default function DlqPage() {
  const [selected, setSelected] = useState<DlqJob | null>(null);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-100">
            <AlertCircle size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dead Letter Queue</h1>
            <p className="text-sm text-slate-500 font-medium">Investigate and recover failed API transactions.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 transition-all">
                <Trash2 size={16} /> Purge All
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-md">
                <RotateCcw size={16} /> Bulk Retry
            </button>
        </div>
      </div>

      {/* ───────────────── DIAGNOSTIC TABLE ───────────────── */}
      <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <Th>Transaction ID</Th>
                <Th>Source & Client</Th>
                <Th>AWB Number</Th>
                <Th>Failure Signature</Th>
                <Th className="text-center">Retries</Th>
                <Th>Timestamp</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_DLQ.map((j) => (
                <tr key={j.id} className="group hover:bg-slate-50/80 transition-colors">
                  <Td>
                    <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-slate-400">
                        <Cpu size={12} /> {j.id}
                    </div>
                  </Td>
                  <Td>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-xs">{j.provider}</span>
                        <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">{j.client}</span>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg w-fit text-[11px] font-black text-slate-600 border border-slate-200/50">
                        <Box size={12} /> {j.awb}
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2 text-red-600">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold truncate max-w-[180px]">{j.reason}</span>
                    </div>
                  </Td>
                  <Td className="text-center">
                    <div className="inline-flex items-center justify-center h-6 w-10 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 border border-slate-200">
                        {j.attempts}/5
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <History size={14} /> {j.failedAt}
                    </div>
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button 
                            onClick={() => setSelected(j)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                            <Eye size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                            <RotateCcw size={18} />
                        </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ───────────────── INSPECTION DRAWER ───────────────── */}
      {selected && (
        <DlqDrawer job={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

/* ───────────────── REFINED DRAWER ───────────────── */

function DlqDrawer({ job, onClose }: { job: DlqJob; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white shadow-2xl animate-in slide-in-from-right duration-500 ease-out">
        <div className="flex h-full flex-col">
          
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Execution Failed
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <X size={20} className="text-slate-500" />
                </button>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Job Inspection: {job.id}</h2>
          </div>

          <div className="p-6 space-y-6 flex-1 overflow-y-auto no-scrollbar">
            
            <div className="grid grid-cols-2 gap-4">
                <InfoCard label="Carrier" value={job.provider} />
                <InfoCard label="AWB Number" value={job.awb} />
                <InfoCard label="Retry Count" value={`${job.attempts} of 5`} />
                <InfoCard label="Time in Queue" value={job.failedAt} />
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Exception Stack Trace</label>
               <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-800 text-sm font-bold flex items-start gap-3">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  {job.reason}
               </div>
            </div>

            <div className="space-y-3">
               <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Payload Data</label>
                  <button className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1">
                    <ExternalLink size={10} /> Copy JSON
                  </button>
               </div>
               <div className="relative rounded-2xl bg-slate-950 p-6 shadow-inner group">
                  <Terminal className="absolute right-4 top-4 text-slate-700 group-hover:text-indigo-500 transition-colors" size={20} />
                  <pre className="text-[12px] font-mono text-indigo-300 overflow-auto max-h-[300px] leading-relaxed no-scrollbar">
                    {JSON.stringify(job.payload, null, 2)}
                  </pre>
               </div>
            </div>

          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
             <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                <RotateCcw size={18} /> Retry Job
             </button>
             <button className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">
                <Trash2 size={18} /> Drop
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── MINI HELPERS ───────────────── */

function InfoCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-tight">{label}</p>
            <p className="text-sm font-black text-slate-800">{value}</p>
        </div>
    )
}

function Th({ children, className }: any) {
  return <th className={clsx("px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-slate-400", className)}>{children}</th>;
}

function Td({ children, className }: any) {
  return <td className={clsx("px-6 py-4 text-sm", className)}>{children}</td>;
}