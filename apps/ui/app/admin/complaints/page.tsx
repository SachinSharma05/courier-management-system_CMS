'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { 
  LifeBuoy, Search, MessageSquareWarning, Clock, CheckCircle2, AlertCircle, ChevronRight,
  ArrowUpRight, Ticket, Send, X, ChevronDown, ChevronLeft, History,
  Loader2
} from 'lucide-react';
import clsx from 'clsx';
import { useAllComplaints, useUpdateComplaintStatus } from '@/hooks/useAdminComplaints';
import { useCreateComplaint } from '@/hooks/useComplaints';
import { useQueryClient } from '@tanstack/react-query';
import { Complaint, ComplaintStatus } from '../interface/adminInterface';

export default function ComplaintsPage() {
  const queryClient = useQueryClient();
  
  // ───────────────── DATA FETCHING ─────────────────
  const { data, isLoading } = useAllComplaints();
  const updateStatus = useUpdateComplaintStatus();
  const createComplaint = useCreateComplaint();

  // ───────────────── STATE MANAGEMENT ─────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);
  const [newComplaint, setNewComplaint] = useState({ awb: '', issue: '' });
  const [resolutionComment, setResolutionComment] = useState('');
  
  const [statusFilter, setStatusFilter] = useState<'All' | ComplaintStatus>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // ───────────────── LOGIC & FILTERING ─────────────────
  
  const complaints = useMemo(() => (data ?? []).map(mapComplaint), [data]);

  const stats = useMemo(() => ({
    open: complaints.filter((c: Complaint) => c.status === 'Open').length,
    inProgress: complaints.filter((c: Complaint) => c.status === 'In Progress').length,
    resolved: complaints.filter((c: Complaint) => c.status === 'Resolved').length,
  }), [complaints]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c: Complaint) => {
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesSearch = !debouncedSearch || 
        c.awb.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        String(c.id).toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [complaints, statusFilter, debouncedSearch]);

  const totalPages = Math.ceil(filteredComplaints.length / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + pageSize);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaint.awb || !newComplaint.issue) return;
    createComplaint.mutate(
      { awb: newComplaint.awb.trim(), message: newComplaint.issue.trim() },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['complaints'] });
          setNewComplaint({ awb: '', issue: '' });
          setIsModalOpen(false);
        }
      }
    );
  };

  return (
    <div className="p-2 space-y-2 bg-[#f8fafc] min-h-screen font-sans"> 
      {/* ───────────────── SYSTEM HEADER ───────────────── */}
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-300 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-red-600 flex items-center justify-center text-white rounded-xl shadow-lg shadow-red-100">
            <LifeBuoy size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Support Command Center</h1>
            <p className="text-sm text-slate-500 font-medium">Manage and resolve shipment escalations</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white hover:bg-black transition-all shadow-md"
        >
          <PlusIcon size={16} /> RAISE NEW TICKET
        </button>
      </div>

      {/* ───────────────── KPI STRIP ───────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MiniStat label="ACTIVE OPEN" value={stats.open} color="text-red-600" bg="bg-red-50" icon={AlertCircle} />
        <MiniStat label="INVESTIGATING" value={stats.inProgress} color="text-amber-600" bg="bg-amber-50" icon={Clock} />
        <MiniStat label="RESOLVED" value={stats.resolved} color="text-emerald-600" bg="bg-emerald-50" icon={CheckCircle2} />
      </div>

      {/* ───────────────── CONTROLS ───────────────── */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by AWB or Ticket ID..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all"
          />
        </div>
        
        <div className="w-full lg:w-64 relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'All' | ComplaintStatus)}
            className="w-full bg-white border border-slate-200 py-3 pl-4 pr-10 text-sm font-bold text-slate-700 outline-none rounded-xl appearance-none cursor-pointer hover:border-slate-300 transition-all"
          >
            <option value="All">All Status Logs</option>
            <option value="Open">Open Tickets</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved Cases</option>
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* ───────────────── TICKET TABLE ───────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <Th className="w-48">AWB NUMBER</Th>
                <Th className="w-64">SENDER & PROVIDER</Th>
                <Th>ISSUE SUMMARY</Th>
                <Th className="w-44">LIFECYCLE</Th>
                <Th className="w-40">TIMESTAMP</Th>
                <Th className="text-right pr-8 w-32">ACTION</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="p-20 text-center text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing Tickets...</td></tr>
              ) : paginatedComplaints.map((c: Complaint) => (
                <tr key={c.id} className="group hover:bg-slate-50/50 transition-colors">
                  <Td>
                    <span className="font-mono text-[11px] font-bold text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-2 shadow-sm">
                      <Ticket size={12} className="text-red-500" /> {c.awb}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-sm tracking-tight">{c.client}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{c.provider}</span>
                    </div>
                  </Td>
                  <Td>
                    <p className="truncate max-w-md text-sm text-slate-600 font-medium">{c.issue}</p>
                  </Td>
                  <Td>
                    <select
                      value={c.status}
                      onChange={(e) => {
                        const val = e.target.value;
                        const statusMap: Record<string, 'open' | 'in_progress' | 'resolved'> = { 'Open': 'open', 'In Progress': 'in_progress', 'Resolved': 'resolved' };
                        const status = statusMap[val];
                        if (status === 'resolved') { setSelectedTicket(c); return; }
                        updateStatus.mutate({ id: Number(c.id), status });
                      }}
                      className={clsx(
                        "w-full rounded-lg border py-1.5 px-3 text-[10px] font-bold outline-none transition-all uppercase tracking-wider",
                        c.status === 'Open' ? "bg-red-50 border-red-100 text-red-700" : 
                        c.status === 'In Progress' ? "bg-amber-50 border-amber-100 text-amber-700" : 
                        "bg-emerald-50 border-emerald-100 text-emerald-700"
                      )}
                    >
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>
                  </Td>
                  <Td className="text-[11px] font-medium text-slate-500">
                    <div className="text-slate-900">{c.createdAt.split(',')[0]}</div>
                    <div className="opacity-60 font-mono">{c.createdAt.split(',')[1]}</div>
                  </Td>
                  <Td className="text-right pr-8">
                    <button 
                      onClick={() => setSelectedTicket(c)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-all text-blue-600"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ───────────────── PAGINATION ───────────────── */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500">
            SHOWING <span className="text-slate-900">{startIndex + 1}-{Math.min(startIndex + pageSize, filteredComplaints.length)}</span> OF {filteredComplaints.length}
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={clsx(
                    "h-8 w-8 rounded-lg text-xs font-bold transition-all",
                    currentPage === i + 1 ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-200"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────── RAISE TICKET DRAWER ───────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300 border-l border-slate-200 flex flex-col">
            <div className="p-8 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                   Raise Escalation
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X size={20} /></button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Shipment AWB Number</label>
                <input
                  required
                  value={newComplaint.awb}
                  onChange={(e) => setNewComplaint({ ...newComplaint, awb: e.target.value })}
                  placeholder="Enter AWB (e.g. DT889900)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold font-mono text-slate-900 focus:ring-2 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Issue Description</label>
                <textarea
                  required
                  rows={6}
                  value={newComplaint.issue}
                  onChange={(e) => setNewComplaint({ ...newComplaint, issue: e.target.value })}
                  placeholder="Describe the problem in detail..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="bg-red-50 rounded-2xl p-4 border border-red-100 flex gap-3">
                <AlertCircle className="text-red-600 shrink-0" size={20} />
                <p className="text-[11px] text-red-700 font-bold leading-relaxed uppercase">
                  Warning: This action triggers an automated investigation with the carrier partner.
                </p>
              </div>
            </form>

            <div className="p-8 border-t border-slate-100">
              <button 
                type="submit"
                onClick={handleSubmit}
                disabled={createComplaint.isPending}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
              >
                {createComplaint.isPending ? <Loader2 className="animate-spin" size={20}/> : 'COMMIT ESCALATION'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────── DETAIL VIEW DRAWER ───────────────── */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedTicket(null)} />
          <div className="relative w-full max-w-lg bg-white shadow-2xl animate-in slide-in-from-right duration-300 border-l border-slate-200 flex flex-col">
            
            <div className="p-8 border-b border-slate-100 bg-slate-900 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-800 rounded-2xl text-amber-500 shadow-inner"><Ticket size={24}/></div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight leading-none">{selectedTicket.awb}</h2>
                    <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">System Case: #{selectedTicket.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-slate-800 rounded-full transition-all text-slate-400"><X size={20} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <Section title="Initial Ticket Log" icon={<MessageSquareWarning size={16}/>}>
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">{selectedTicket.issue}</p>
                  <div className="mt-4 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{selectedTicket.createdAt}</span>
                    <StatusBadge status={selectedTicket.status} />
                  </div>
                </div>
              </Section>

              <Section title="Investigation Audit" icon={<History size={16}/>}>
                <div className="border-l-2 border-slate-100 ml-2 pl-6 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-slate-900 border-4 border-white" />
                    <p className="text-xs font-bold text-slate-900">Protocol Initiated</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">Ticket acknowledged by support desk and flagged for carrier review.</p>
                  </div>
                </div>
              </Section>

              {selectedTicket.comments && (
                 <Section title="Resolution Summary" icon={<CheckCircle2 size={16}/>}>
                    <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
                      <p className="text-sm font-bold text-emerald-900">{selectedTicket.comments}</p>
                      <div className="mt-2 text-[10px] font-bold text-emerald-600 uppercase">Closed On: {selectedTicket.resolved_at}</div>
                    </div>
                 </Section>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50">
              <div className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Update Lifecycle</label>
                  <select 
                    value={selectedTicket.status}
                    onChange={(e) => {
                      const status = e.target.value.toLowerCase().replace(' ', '_') as 'open' | 'in_progress' | 'resolved';
                      if (status !== 'resolved') {
                        updateStatus.mutate({ id: Number(selectedTicket.id), status });
                        setSelectedTicket(t => t ? { ...t, status: e.target.value as ComplaintStatus } : t);
                        return;
                      }
                      setSelectedTicket(t => t ? { ...t, status: 'Resolved' } : t);
                    }}
                    className="w-full bg-white border border-slate-200 py-3.5 px-4 text-sm font-bold outline-none rounded-xl shadow-sm"
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </div>
                
                {selectedTicket.status === 'Resolved' && (
                  <div className="relative animate-in fade-in slide-in-from-bottom-2">
                    <textarea 
                      value={resolutionComment}
                      onChange={(e) => setResolutionComment(e.target.value)}
                      placeholder="Enter final resolution notes..."
                      className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none min-h-[120px] shadow-sm"
                    />
                    <button
                      disabled={!resolutionComment.trim()}
                      onClick={() => updateStatus.mutate(
                        { id: Number(selectedTicket.id), status: 'resolved', resolution_comment: resolutionComment },
                        { onSuccess: () => { setResolutionComment(''); setSelectedTicket(null); queryClient.invalidateQueries({ queryKey: ['complaints'] }); }}
                      )}
                      className="absolute bottom-4 right-4 bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}      
    </div>
  );
}

/* ================= COMPONENT HELPERS ================= */
function MiniStat({ label, value, color, bg, icon: Icon }: 
      {label: string, value: number, color: string, bg: string, icon: React.ComponentType<{ size: number }>}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm group hover:border-slate-300 transition-all">
      <div className="flex items-center gap-4">
        <div className={clsx("h-12 w-12 rounded-xl flex items-center justify-center border border-slate-100", bg, color)}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        </div>
      </div>
      <ArrowUpRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
    </div>
  );
}

function Section({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-400">
        <div className="p-1.5 bg-slate-50 rounded-lg">{icon}</div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: ComplaintStatus }) {
  const configs = {
    'Open': 'bg-red-50 text-red-600 border-red-100',
    'In Progress': 'bg-amber-50 text-amber-600 border-amber-100',
    'Resolved': 'bg-emerald-50 text-emerald-600 border-emerald-100'
  };
  return (
    <span className={clsx("px-2.5 py-1 text-[10px] font-bold border rounded-lg uppercase tracking-wide", configs[status])}>
      {status}
    </span>
  );
}

function Th({ children, className }: { children: React.ReactNode, className?: string }) {
  return <th className={clsx("px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400", className)}>{children}</th>;
}

function Td({ children, className }: { children: React.ReactNode, className?: string }) {
  return <td className={clsx("px-6 py-4 text-sm border-slate-50", className)}>{children}</td>;
}

function PlusIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
}

interface RawComplaint {
  id: number | string;
  awb: string;
  client: string;
  provider?: string;
  message: string;
  resolution_comment?: string;
  resolved_at?: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
}

function mapComplaint(c: RawComplaint): Complaint {
  return {
    id: String(c.id),
    awb: c.awb,
    client: c.client,
    provider: c.provider || 'N/A', 
    issue: c.message,
    comments: c.resolution_comment,
    resolved_at: c.resolved_at ? new Date(c.resolved_at).toLocaleString() : '',
    status: c.status === 'open' ? 'Open' : c.status === 'in_progress' ? 'In Progress' : 'Resolved',
    createdAt: new Date(c.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
  };
}