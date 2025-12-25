'use client';

import { 
  LifeBuoy, Search, Filter, Calendar, 
  MessageSquareWarning, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, MoreHorizontal,
  ArrowUpRight, Ticket
} from 'lucide-react';
import clsx from 'clsx';

// ... (MOCK_COMPLAINTS remains the same)
type Complaint = {
  id: string;
  awb: string;
  client: string;
  provider: string;
  issue: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
};

const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-001',
    awb: 'DTDC123456789',
    client: 'Client A',
    provider: 'DTDC',
    issue: 'Shipment delayed beyond SLA',
    status: 'Open',
    createdAt: '2025-02-01 11:30',
  },
  {
    id: 'CMP-002',
    awb: 'DLV987654321',
    client: 'Client B',
    provider: 'Delhivery',
    issue: 'Wrong delivery attempt marked',
    status: 'In Progress',
    createdAt: '2025-02-01 09:20',
  },
  {
    id: 'CMP-003',
    awb: 'MRT456789123',
    client: 'Client C',
    provider: 'Maruti',
    issue: 'Package damaged',
    status: 'Resolved',
    createdAt: '2025-01-31 18:05',
  },
];

export default function ComplaintsPage() {
  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-200">
            <LifeBuoy size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Support Tickets</h1>
            <p className="text-sm text-slate-500 font-medium">Manage and resolve shipment escalations.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-all shadow-md">
          <MessageSquareWarning size={16} />
          Raise Escalation
        </button>
      </div>

      {/* ───────────────── QUICK STATS ───────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MiniStat label="Open Tickets" value={12} color="text-red-600" bg="bg-red-50" icon={AlertCircle} />
        <MiniStat label="In Progress" value={5} color="text-amber-600" bg="bg-amber-50" icon={Clock} />
        <MiniStat label="Resolved Today" value={28} color="text-emerald-600" bg="bg-emerald-50" icon={CheckCircle2} />
      </div>

      {/* ───────────────── FILTERS ───────────────── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            placeholder="Search Ticket ID or AWB..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-red-500/10 focus:border-red-500/40 transition-all font-mono"
          />
        </div>
        <FilterDropdown label="All Clients" />
        <FilterDropdown label="All Providers" />
        <FilterDropdown label="All Status" />
        <div className="h-8 w-[1px] bg-slate-100" />
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
          <Calendar size={20} />
        </button>
      </div>

      {/* ───────────────── TABLE ───────────────── */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <Th>ID & AWB</Th>
                <Th>Client & Provider</Th>
                <Th>Issue Description</Th>
                <Th>Status</Th>
                <Th>Created</Th>
                <Th className="text-right"></Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_COMPLAINTS.map((c) => (
                <tr key={c.id} className="group hover:bg-slate-50/80 transition-colors cursor-pointer">
                  <Td>
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-900 bg-slate-100 w-fit px-1.5 py-0.5 rounded">
                        <Ticket size={10} className="text-slate-500" /> {c.id}
                      </span>
                      <span className="text-[10px] font-mono font-medium text-slate-400 pl-1">{c.awb}</span>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-xs">{c.client}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{c.provider}</span>
                    </div>
                  </Td>
                  <Td>
                    <p className="max-w-[240px] truncate text-sm text-slate-600 font-medium">
                      {c.issue}
                    </p>
                  </Td>
                  <Td>
                    <StatusBadge status={c.status} />
                  </Td>
                  <Td>
                    <div className="flex flex-col text-[11px]">
                      <span className="font-bold text-slate-700">{c.createdAt.split(' ')[0]}</span>
                      <span className="text-slate-400">{c.createdAt.split(' ')[1]}</span>
                    </div>
                  </Td>
                  <Td className="text-right">
                    <button className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all">
                      Details <ChevronRight size={14} />
                    </button>
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

/* ───────────────── COMPONENTS ───────────────── */

function MiniStat({ label, value, color, bg, icon: Icon }: any) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm group hover:border-slate-200 transition-all">
      <div className="flex items-center gap-3">
        <div className={clsx("h-10 w-10 rounded-xl flex items-center justify-center", bg, color)}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{label}</p>
          <h3 className="text-xl font-black text-slate-900">{value}</h3>
        </div>
      </div>
      <ArrowUpRight size={16} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
    </div>
  );
}

function StatusBadge({ status }: { status: Complaint['status'] }) {
  const configs = {
    'Open': 'bg-red-50 text-red-600 border-red-100',
    'In Progress': 'bg-amber-50 text-amber-600 border-amber-100',
    'Resolved': 'bg-emerald-50 text-emerald-600 border-emerald-100'
  };

  return (
    <span className={clsx(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-tighter",
      configs[status]
    )}>
      {status}
    </span>
  );
}

function FilterDropdown({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:border-slate-300 transition-all cursor-pointer">
      {label}
      <MoreHorizontal size={14} className="text-slate-400" />
    </div>
  );
}

function Th({ children, className }: any) {
  return <th className={clsx("px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400", className)}>{children}</th>;
}

function Td({ children, className }: any) {
  return <td className={clsx("px-6 py-4 text-sm text-slate-600", className)}>{children}</td>;
}