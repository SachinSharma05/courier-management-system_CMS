'use client';

import { 
  LifeBuoy, Search, Calendar, 
  MessageSquareWarning, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, MoreHorizontal,
  ArrowUpRight, Ticket,
  Send,
  Package,
  X,
  ChevronDown,
  ChevronLeft
} from 'lucide-react';
import clsx from 'clsx';
import { useAllComplaints, useUpdateComplaintStatus } from '@/hooks/useAdminComplaints';
import { useCreateComplaint } from '@/hooks/useComplaints';
import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

type Complaint = {
  id: string;
  awb: string;
  client: string;
  provider: string;
  issue: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  comments: string;
  resolved_at: string;
  createdAt: string;
};

export default function ComplaintsPage() {
  const queryClient = useQueryClient();
  
  // ───────────────── DATA FETCHING ─────────────────
  const { data, isLoading } = useAllComplaints();
  const updateStatus = useUpdateComplaintStatus();
  const createComplaint = useCreateComplaint();

  // ───────────────── STATE MANAGEMENT ─────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [newComplaint, setNewComplaint] = useState({ awb: '', issue: '' });
  const [resolutionComment, setResolutionComment] = useState('');
  
  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // ───────────────── LOGIC & FILTERING ─────────────────
  
  // Map raw data to UI-friendly objects
  const complaints = useMemo(() => (data ?? []).map(mapComplaint), [data]);

  // Quick Stats
  const stats = useMemo(() => ({
    open: complaints.filter((c: Complaint) => c.status === 'Open').length,
    inProgress: complaints.filter((c: Complaint) => c.status === 'In Progress').length,
    resolved: complaints.filter((c: Complaint) => c.status === 'Resolved').length,
  }), [complaints]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Unified Filtering Logic
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c: Complaint) => {
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesSearch = !debouncedSearch || 
        c.awb.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        String(c.id).toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [complaints, statusFilter, debouncedSearch]);

  // Reset page when filters change
  useEffect(() => setCurrentPage(1), [statusFilter, debouncedSearch]);

  // Pagination Logic
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
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
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
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-all shadow-md active:scale-95"
        >
          <MessageSquareWarning size={16} />
          Raise Escalation
        </button>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MiniStat label="Open Tickets" value={stats.open} color="text-red-600" bg="bg-red-50" icon={AlertCircle} />
        <MiniStat label="In Progress" value={stats.inProgress} color="text-amber-600" bg="bg-amber-50" icon={Clock} />
        <MiniStat label="Resolved Today" value={stats.resolved} color="text-emerald-600" bg="bg-emerald-50" icon={CheckCircle2} />
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Ticket ID or AWB..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-red-500/10 focus:border-red-500/40 transition-all font-mono"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:border-slate-300 transition-all relative min-w-[140px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full appearance-none bg-transparent pr-6 outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 pointer-events-none text-slate-400" />
        </div>
        
        <div className="h-8 w-[1px] bg-slate-100" />
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
          <Calendar size={20} />
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto no-scrollbar max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
              <tr className="border-b border-slate-100">
                <Th>AWB</Th>
                <Th>Client & Provider</Th>
                <Th>Issue Description</Th>
                <Th>Status</Th>
                <Th>Created</Th>
                <Th className="text-right"></Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={6} className="p-10 text-center text-slate-400 animate-pulse">Loading tickets...</td></tr>
              ) : paginatedComplaints.map((c: Complaint) => (
                <tr key={c.id} className="group hover:bg-slate-50/80 transition-colors">
                  <Td>
                    <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-900 bg-slate-100 w-fit px-1.5 py-0.5 rounded">
                      <Ticket size={10} className="text-slate-500" /> {c.awb}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-xs">{c.client}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{c.provider}</span>
                    </div>
                  </Td>
                  <Td>
                    <p className="max-w-[240px] truncate text-sm text-slate-600 font-medium">{c.issue}</p>
                  </Td>
                  <Td>
                    <select
                      value={c.status}
                      onChange={(e) => {
                        const val = e.target.value;
                        const statusMap: any = { 'Open': 'open', 'In Progress': 'in_progress', 'Resolved': 'resolved' };
                        const status = statusMap[val];

                        if (status === 'resolved') {
                          setSelectedTicket(c);
                          return;
                        }

                        updateStatus.mutate({ id: Number(c.id), status });
                      }}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold outline-none focus:ring-2 focus:ring-slate-100"
                    >
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>
                  </Td>
                  <Td>
                    <div className="flex flex-col text-[11px]">
                      <span className="font-bold text-slate-700">{c.createdAt.split(' ')[0]}</span>
                      <span className="text-slate-400">{c.createdAt.split(' ')[1]}</span>
                    </div>
                  </Td>
                  <Td className="text-right">
                    <button 
                      onClick={() => setSelectedTicket(c)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Details <ChevronRight size={14} />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500">
            Showing <span className="text-slate-900">{startIndex + 1}</span> to <span className="text-slate-900">{Math.min(startIndex + pageSize, filteredComplaints.length)}</span> of <span className="text-slate-900">{filteredComplaints.length}</span>
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

      {/* ───────────────── RAISE ESCALATION MODAL ───────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="h-full w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-500">
            <div className="flex h-full flex-col">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 p-6 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                    <MessageSquareWarning size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">New Escalation</h2>
                    <p className="text-xs text-slate-500 font-medium">Raise a ticket for a shipment</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-white hover:text-slate-600 transition-all">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shipment AWB</label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      required
                      value={newComplaint.awb}
                      onChange={(e) => setNewComplaint({ ...newComplaint, awb: e.target.value })}
                      placeholder="Enter AWB Number..."
                      className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm font-mono outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Issue Description</label>
                  <textarea
                    required
                    rows={6}
                    value={newComplaint.issue}
                    onChange={(e) => setNewComplaint({ ...newComplaint, issue: e.target.value })}
                    placeholder="Describe the issue in detail (e.g. Shipment stuck at warehouse for 3 days...)"
                    className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all resize-none"
                  />
                </div>

                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                  <div className="flex gap-3">
                    <AlertCircle className="text-amber-600 shrink-0" size={18} />
                    <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                      Raising an escalation will notify the carrier support team immediately. Please ensure the AWB is valid before submitting.
                    </p>
                  </div>
                </div>
              </form>

              {/* Modal Footer */}
              <div className="border-t border-slate-100 p-6 bg-slate-50/50">
                <button 
                  type="submit"
                  onClick={handleSubmit}
                  disabled={createComplaint.isPending}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 transition-all shadow-lg shadow-red-100 disabled:opacity-50"
                >
                  {createComplaint.isPending ? 'Submitting...' : 'Submit Escalation'} 
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="h-full w-full max-w-lg bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            
            {/* HEADER: Ticket Info & Quick Status Change */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                    #{selectedTicket.id}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">{selectedTicket.awb}</h2>
                </div>
                <p className="text-xs text-slate-500 font-medium">Ticket raised by {selectedTicket.client}</p>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="p-2 hover:bg-white rounded-full transition-all text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* CONTENT: Issue & Conversation */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
              {/* Original Issue Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Original Issue</p>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {selectedTicket.issue}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold">{selectedTicket.createdAt}</span>
                  <StatusBadge status={selectedTicket.status} />
                </div>
              </div>

              {/* Reply Timeline (Dummy for now, you can map real replies here later) */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Updates & History</h4>
                <div className="border-l-2 border-slate-100 ml-4 pl-6 space-y-6">
                    {/* Example Update */}
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 h-2 w-2 rounded-full bg-slate-300" />
                      <p className="text-xs font-bold text-slate-900">Carrier Response</p>
                      <p className="text-xs text-slate-500 mt-1">Status changed to In Progress. Investigation started please wait for the updates.</p>
                    </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Customer Support Response</p>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {selectedTicket.comments}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold">{selectedTicket.resolved_at}</span>
                  <StatusBadge status={selectedTicket.status} />
                </div>
              </div>
            </div>

            {/* FOOTER: Action Box */}
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <select 
                    value={selectedTicket.status}
                    onChange={(e) => {
                      const status = e.target.value
                        .toLowerCase()
                        .replace(' ', '_') as 'open' | 'in_progress' | 'resolved';

                      // Allow non-terminal transitions immediately
                      if (status !== 'resolved') {
                        updateStatus.mutate({
                          id: Number(selectedTicket.id),
                          status,
                        });
                        setSelectedTicket((t: Complaint | null) => t ? { ...t, status: e.target.value as any } : t);
                        return;
                      }

                      // If resolved → wait for comment submission
                      setSelectedTicket((t: Complaint | null) => t ? { ...t, status: 'Resolved' } : t);
                    }}
                    className="flex-1 rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold outline-none shadow-sm"
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </div>
                
                {selectedTicket.status === 'Resolved' && (
                  <div className="relative">
                    <textarea 
                      value={resolutionComment}
                      onChange={(e) => setResolutionComment(e.target.value)}
                      placeholder="Add resolution comment (required)"
                      className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all resize-none shadow-sm"
                      rows={3}
                    />

                    <button
                      disabled={!resolutionComment.trim()}
                      onClick={() =>
                        updateStatus.mutate(
                          {
                            id: Number(selectedTicket.id),
                            status: 'resolved',
                            resolution_comment: resolutionComment,
                          },
                          {
                            onSuccess: () => {
                              setResolutionComment('');
                              setSelectedTicket(null);
                              queryClient.invalidateQueries({ queryKey: ['complaints'] });
                            },
                          }
                        )
                      }
                      className="absolute bottom-3 right-3 bg-emerald-600 text-white p-2 rounded-xl hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50"
                    >
                      <Send size={16} />
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

function Th({ children, className }: any) {
  return <th className={clsx("px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400", className)}>{children}</th>;
}

function Td({ children, className }: any) {
  return <td className={clsx("px-6 py-4 text-sm text-slate-600", className)}>{children}</td>;
}

function mapComplaint(c: any): Complaint {
  return {
    id: String(c.id),
    awb: c.awb,
    client: c.client,
    provider: '-', // optional if you add later
    issue: c.message,
    comments: c.resolution_comment,
    resolved_at: c.resolved_at,
    status:
      c.status === 'open'
        ? 'Open'
        : c.status === 'in_progress'
        ? 'In Progress'
        : 'Resolved',
    createdAt: new Date(c.created_at).toLocaleString(),
  };
}