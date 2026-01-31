'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { 
  LifeBuoy, Search, Calendar, MessageSquareWarning, Clock, CheckCircle2, AlertCircle, ChevronRight,
  ArrowUpRight, Ticket, Send, Package, X, ChevronDown, ChevronLeft, Hash, History
} from 'lucide-react';
import clsx from 'clsx';
import { useAllComplaints, useUpdateComplaintStatus } from '@/hooks/useAdminComplaints';
import { useCreateComplaint } from '@/hooks/useComplaints';
import { useQueryClient } from '@tanstack/react-query';

/* ================= STRICT TYPES ================= */

type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved';

interface Complaint {
  id: string;
  awb: string;
  client: string;
  provider: string;
  issue: string;
  status: ComplaintStatus;
  comments: string;
  resolved_at: string;
  createdAt: string;
}

/* ================= MAIN COMPONENT ================= */

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

  useEffect(() => setCurrentPage(1), [statusFilter, debouncedSearch]);

  const totalPages = Math.ceil(filteredComplaints.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + pageSize);

  // ───────────────── HANDLERS ─────────────────

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
    <div className="p-4 space-y-4 bg-slate-50 min-h-screen font-sans">
      
      {/* ERP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 border border-slate-200 rounded-sm shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-red-600 flex items-center justify-center text-white rounded-sm">
            <LifeBuoy size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-none uppercase tracking-tight">SUPPORT_COMMAND_CENTER</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Monitor and resolve logistical escalations</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-sm bg-slate-900 px-6 py-2.5 text-xs font-black text-white hover:bg-black transition-all"
        >
          <PlusIcon size={14} /> RAISE NEW TICKET
        </button>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <MiniStat label="ACTIVE_OPEN" value={stats.open} color="text-red-600" bg="bg-red-50" icon={AlertCircle} />
        <MiniStat label="INVESTIGATING" value={stats.inProgress} color="text-amber-600" bg="bg-amber-50" icon={Clock} />
        <MiniStat label="RESOLVED_CYLE" value={stats.resolved} color="text-emerald-600" bg="bg-emerald-50" icon={CheckCircle2} />
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 bg-white p-2 border border-slate-200 rounded-sm shadow-sm">
        <div className="lg:col-span-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="FILTER BY AWB OR SYSTEM_ID..."
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-10 py-2 text-xs font-bold text-slate-700 outline-none focus:border-red-500 transition-all font-mono"
          />
        </div>
        
        <div className="lg:col-span-3 relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full bg-white border border-slate-200 py-2 pl-3 pr-8 text-xs font-black text-slate-700 outline-none appearance-none cursor-pointer uppercase"
          >
            <option value="All">ALL_STATUS_LOGS</option>
            <option value="Open">OPEN_ONLY</option>
            <option value="In Progress">IN_PROGRESS</option>
            <option value="Resolved">RESOLVED</option>
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <div className="lg:col-span-1 flex items-center justify-center border-l border-slate-100">
           <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <Calendar size={18} />
          </button>
        </div>
      </div>

      {/* DATA GRID */}
      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
            <thead>
              <tr className="bg-slate-900 text-white">
                <Th className="w-48">AWB_NUMBER</Th>
                <Th className="w-64">CLIENT_&_PROVIDER</Th>
                <Th>ISSUE_SUMMARY</Th>
                <Th className="w-40">LIFECYCLE</Th>
                <Th className="w-40">TIMESTAMP</Th>
                <Th className="text-right pr-6 w-32">ACTION</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr><td colSpan={6} className="p-12 text-center text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing_Tickets...</td></tr>
              ) : paginatedComplaints.map((c: Complaint) => (
                <tr key={c.id} className="group hover:bg-slate-50 transition-colors">
                  <Td>
                    <span className="font-mono text-[11px] font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-sm border border-slate-200 inline-flex items-center gap-2">
                      <Ticket size={10} className="text-slate-400" /> {c.awb}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-xs uppercase tracking-tight">{c.client}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{c.provider}</span>
                    </div>
                  </Td>
                  <Td>
                    <p className="truncate text-xs text-slate-600 font-bold uppercase tracking-tighter">{c.issue}</p>
                  </Td>
                  <Td>
                    <select
                      value={c.status}
                      onChange={(e) => {
                        const val = e.target.value;
                        const statusMap: any = { 'Open': 'open', 'In Progress': 'in_progress', 'Resolved': 'resolved' };
                        const status = statusMap[val];
                        if (status === 'resolved') { setSelectedTicket(c); return; }
                        updateStatus.mutate({ id: Number(c.id), status });
                      }}
                      className={clsx(
                        "w-full rounded-sm border py-1.5 px-2 text-[10px] font-black outline-none transition-all uppercase",
                        c.status === 'Open' ? "bg-red-50 border-red-200 text-red-700" : 
                        c.status === 'In Progress' ? "bg-amber-50 border-amber-200 text-amber-700" : 
                        "bg-emerald-50 border-emerald-200 text-emerald-700"
                      )}
                    >
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>
                  </Td>
                  <Td className="font-mono text-[10px] font-bold text-slate-500">
                    <div>{c.createdAt.split(',')[0]}</div>
                    <div className="text-[9px] opacity-60">{c.createdAt.split(',')[1]}</div>
                  </Td>
                  <Td className="text-right pr-6">
                    <button 
                      onClick={() => setSelectedTicket(c)}
                      className="text-[10px] font-black text-indigo-600 hover:text-indigo-900 uppercase border-b border-transparent hover:border-indigo-900 transition-all"
                    >
                      View Logs
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ERP PAGINATION */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-500 uppercase">
            Showing_Entries: <span className="text-slate-900">{startIndex + 1}-{Math.min(startIndex + pageSize, filteredComplaints.length)}</span> / {filteredComplaints.length}
          </p>
          <div className="flex items-center gap-1">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-1.5 rounded-sm border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>
            <div className="flex items-center gap-1 mx-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={clsx(
                    "h-6 w-6 rounded-sm text-[10px] font-black transition-all",
                    currentPage === i + 1 ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-200"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1.5 rounded-sm border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* CREATE MODAL: ERP DRAWER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300 border-l border-slate-200 flex flex-col">
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter text-red-600 flex items-center gap-3">
                <MessageSquareWarning size={24} /> RAISE_ESCALATION
              </h2>
              <p className="text-[10px] text-slate-500 font-black uppercase mt-1">Initiate high-priority carrier investigation</p>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Package size={12}/> SHIPMENT_AWB_NO
                </label>
                <input
                  required
                  value={newComplaint.awb}
                  onChange={(e) => setNewComplaint({ ...newComplaint, awb: e.target.value })}
                  placeholder="ID_88001122..."
                  className="w-full rounded-sm border border-slate-200 bg-white px-3 py-3 text-xs font-black font-mono text-slate-900 outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">ISSUE_DESCRIPTION_LOG</label>
                <textarea
                  required
                  rows={8}
                  value={newComplaint.issue}
                  onChange={(e) => setNewComplaint({ ...newComplaint, issue: e.target.value })}
                  placeholder="DOCUMENT_SPECIFIC_ISSUE_DETAILS..."
                  className="w-full rounded-sm border border-slate-200 bg-white p-4 text-xs font-bold text-slate-900 outline-none focus:border-red-500 resize-none"
                />
              </div>

              <div className="bg-red-50 rounded-sm p-4 border border-red-100 flex gap-3">
                <AlertCircle className="text-red-600 shrink-0" size={18} />
                <p className="text-[10px] text-red-700 font-bold leading-relaxed uppercase">
                  ESCALATION_NOTICE: This will trigger a direct notification to carrier support. Ensure AWB validity.
                </p>
              </div>
            </form>

            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <button 
                type="submit"
                onClick={handleSubmit}
                disabled={createComplaint.isPending}
                className="w-full bg-red-600 text-white py-4 rounded-sm text-xs font-black hover:bg-red-700 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {createComplaint.isPending ? 'TRANSMITTING...' : <><Send size={16}/> COMMIT_ESCALATION</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL DRAWER: ERP STYLE */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setSelectedTicket(null)} />
          <div className="relative w-full max-w-lg bg-white shadow-2xl animate-in slide-in-from-right duration-300 border-l border-slate-200 flex flex-col">
            
            <div className="p-6 border-b border-slate-200 bg-slate-900 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-sm text-amber-500"><Hash size={20}/></div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter leading-none">{selectedTicket.awb}</h2>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">CASE_ID: {selectedTicket.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-slate-800 rounded-sm transition-all text-slate-400"><X size={20} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              <Section title="Initial Ticket Log" icon={<MessageSquareWarning size={14}/>}>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm">
                  <p className="text-xs font-bold text-slate-700 leading-relaxed uppercase">{selectedTicket.issue}</p>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{selectedTicket.createdAt}</span>
                    <StatusBadge status={selectedTicket.status} />
                  </div>
                </div>
              </Section>

              <Section title="Carrier Investigation Audit" icon={<History size={14}/>}>
                <div className="border-l border-slate-200 ml-2 pl-6 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-[29px] top-0 h-3 w-3 rounded-full bg-slate-900 border-2 border-white" />
                    <p className="text-[10px] font-black text-slate-900 uppercase">System_Acknowledgment</p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase leading-tight italic">Investigation protocol initiated by support desk.</p>
                  </div>
                </div>
              </Section>

              {selectedTicket.comments && (
                 <Section title="Resolution Summary" icon={<CheckCircle2 size={14}/>}>
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-sm">
                      <p className="text-xs font-black text-emerald-900 uppercase">{selectedTicket.comments}</p>
                      <div className="mt-2 text-[9px] font-black text-emerald-600 uppercase italic">Closed: {selectedTicket.resolved_at}</div>
                    </div>
                 </Section>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Update_Lifecycle_Status</label>
                  <select 
                    value={selectedTicket.status}
                    onChange={(e) => {
                      const status = e.target.value.toLowerCase().replace(' ', '_') as any;
                      if (status !== 'resolved') {
                        updateStatus.mutate({ id: Number(selectedTicket.id), status });
                        setSelectedTicket(t => t ? { ...t, status: e.target.value as any } : t);
                        return;
                      }
                      setSelectedTicket(t => t ? { ...t, status: 'Resolved' } : t);
                    }}
                    className="w-full bg-white border border-slate-200 py-3 px-3 text-xs font-black outline-none rounded-sm"
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </div>
                
                {selectedTicket.status === 'Resolved' && (
                  <div className="relative group">
                    <textarea 
                      value={resolutionComment}
                      onChange={(e) => setResolutionComment(e.target.value)}
                      placeholder="ENTER FINAL RESOLUTION COMMENT (REQUIRED)..."
                      className="w-full rounded-sm border border-slate-200 bg-white p-4 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all resize-none min-h-[100px]"
                    />
                    <button
                      disabled={!resolutionComment.trim()}
                      onClick={() => updateStatus.mutate(
                        { id: Number(selectedTicket.id), status: 'resolved', resolution_comment: resolutionComment },
                        { onSuccess: () => { setResolutionComment(''); setSelectedTicket(null); queryClient.invalidateQueries({ queryKey: ['complaints'] }); }}
                      )}
                      className="absolute bottom-3 right-3 bg-emerald-600 text-white p-2 rounded-sm hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-md"
                    >
                      <Send size={14} />
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

/* ================= UI HELPERS ================= */

function MiniStat({ label, value, color, bg, icon: Icon }: any) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-slate-200 bg-white p-4 shadow-sm group hover:border-slate-400 transition-all">
      <div className="flex items-center gap-3">
        <div className={clsx("h-10 w-10 rounded-sm flex items-center justify-center border", bg, color)}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-tight">{label}</p>
          <h3 className="text-xl font-black text-slate-900 tracking-tighter mt-0.5">{value}</h3>
        </div>
      </div>
      <ArrowUpRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
    </div>
  );
}

function Section({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-400">
        <div className="p-1 bg-white border border-slate-100 rounded-sm">{icon}</div>
        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: ComplaintStatus }) {
  const configs = {
    'Open': 'bg-red-50 text-red-600 border-red-200',
    'In Progress': 'bg-amber-50 text-amber-600 border-amber-200',
    'Resolved': 'bg-emerald-50 text-emerald-600 border-emerald-200'
  };
  return (
    <span className={clsx("px-2 py-0.5 text-[9px] font-black border rounded-sm uppercase tracking-widest", configs[status])}>
      {status}
    </span>
  );
}

function Th({ children, className }: { children: React.ReactNode, className?: string }) {
  return <th className={clsx("px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400", className)}>{children}</th>;
}

function Td({ children, className }: { children: React.ReactNode, className?: string }) {
  return <td className={clsx("px-4 py-3 text-xs border-slate-100", className)}>{children}</td>;
}

function PlusIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
}

function mapComplaint(c: any): Complaint {
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