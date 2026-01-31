"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Box, Package, CheckCircle2, Clock, Download, Search, 
  Calendar, ChevronRight, Eye, MapPin, Navigation, Truck,
  ChevronsLeft, ChevronLeft, ChevronsRight, Loader2,
  RefreshCw, Filter, List, Hash, History, X,
  ArrowUpRight, AlertTriangle
} from 'lucide-react';
import { clsx } from 'clsx';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useDebounce } from '@/hooks/useDebounce';
import { useClients } from '@/hooks/useClients';
import { useProviders } from '@/hooks/useProviders';
import { useConsignments, useConsignmentsSummary, useConsignmentEvents } from '@/hooks/useConsignments';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';

export default function ConsignmentsPage() {
  const queryClient = useQueryClient();
  const { data: clients } = useClients();
  const { data: providers } = useProviders();
  
  const [filters, setFilters] = useState({
    awb: '',
    clientId: '',
    provider: '', // This matches the "Carrier" dropdown
    status: '',
    tat: '',
    from: '',
    to: '',
  });

  const [page, setPage] = useState(1);
  const [selectedAwb, setSelectedAwb] = useState<any>(null); 
  const limit = 50;

  const debounceAwb = useDebounce(filters.awb, 400);

  // ─── LOGIC: Ensure filters are correctly passed to the hook ───
  const normalizedFilters = useMemo(() => ({
    page,
    limit,
    awb: debounceAwb.trim() || undefined,
    clientId: filters.clientId ? Number(filters.clientId) : undefined,
    provider: filters.provider || undefined, // Carrier filter mapping
    status: filters.status || undefined,
    tat: filters.tat || undefined,
    from: filters.from || undefined,
    to: filters.to || undefined,
  }), [debounceAwb, filters, page]);

  const { data, isLoading, isFetching } = useConsignments(normalizedFilters);
  const { data: events, isLoading: isEventsLoading } = useConsignmentEvents(selectedAwb?.awb);
  const { data: summary, isLoading: isSummaryLoading } = useConsignmentsSummary(filters.clientId ? Number(filters.clientId) : undefined);

  useEffect(() => { setPage(1); }, [debounceAwb, filters]);

  const totalRecords = data?.meta?.total || 0;
  const totalPages = data?.meta?.pages || 1;
  const startRange = (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, totalRecords);

  // ─── HANDLER: Export CSV ───
  const handleExport = async () => {
    try {
      toast.loading("Generating Export...", { id: 'export' });
      const response = await api.get('/admin/consignments/export', {
        params: normalizedFilters,
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `consignments_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      toast.success("Export Downloaded", { id: 'export' });
    } catch (error) {
      toast.error("Export Failed", { id: 'export' });
    }
  };

  const liveSync = useMutation({
    mutationFn: async (awb: string) => {
      const res = await api.post(`/admin/consignments/${awb}/sync`);
      return res.data;
    },
    onSuccess: (data, awb) => {
      toast.success(`AWB ${awb} Synced Successfully`);
      queryClient.invalidateQueries({ queryKey: ['consignments'] });
    },
  });

  return (
    <div className="p-4 space-y-3 bg-slate-50 min-h-screen font-sans">
      
      {/* ERP HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between bg-white p-4 border border-slate-200 rounded-sm shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-slate-900 flex items-center justify-center text-white rounded-sm shadow-md">
            <Box size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-none uppercase tracking-tight">Consignment_Master_Log</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Real-time Operations Control</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4 lg:mt-0">
          <SummaryMini label="Total" value={summary?.total} loading={isSummaryLoading} color="text-slate-900" />
          <SummaryMini label="Delivered" value={summary?.delivered} loading={isSummaryLoading} color="text-emerald-600" />
          <SummaryMini label="In Transit" value={summary?.pending} loading={isSummaryLoading} color="text-amber-600" />
          <SummaryMini label="NDR" value={summary?.ndr} loading={isSummaryLoading} color="text-rose-600" />
          <SummaryMini label="RTO" value={summary?.rto} loading={isSummaryLoading} color="text-indigo-600" />
          
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 rounded-sm bg-slate-900 px-4 py-2 text-[10px] font-black text-white hover:bg-black transition-all uppercase tracking-widest ml-2"
          >
            <Download size={14} /> Export_CSV
          </button>
        </div>
      </div>

      {/* FILTER TERMINAL */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-2 bg-white p-2 border border-slate-200 rounded-sm shadow-sm">
        <div className="xl:col-span-4 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            placeholder="FILTER_BY_AWB_OR_REF..."
            value={filters.awb}
            onChange={e => setFilters(f => ({ ...f, awb: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 text-xs font-bold text-slate-700 outline-none focus:border-slate-400 transition-all font-mono"
          />
        </div>

        <div className="xl:col-span-8 flex flex-wrap gap-2">
          <SelectFilter 
            value={filters.clientId} 
            onChange={v => setFilters(f => ({ ...f, clientId: v }))}
            options={clients || []}
            labelKey="company_name"
            placeholder="ALL_CLIENTS"
          />
          
          {/* CARRIER FILTER */}
          <select 
            value={filters.provider} 
            onChange={e => setFilters(f => ({ ...f, provider: e.target.value }))}
            className="bg-white border border-slate-200 rounded-sm px-3 py-2 text-[10px] font-black uppercase text-slate-600 outline-none focus:border-slate-400 min-w-[140px]"
          >
            <option value="">ALL_CARRIERS</option>
            {providers?.map((p: any) => (
              <option key={p.id || p.name} value={p.name}>{p.name.toUpperCase()}</option>
            ))}
          </select>

          <select 
            value={filters.status} 
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
            className="bg-white border border-slate-200 rounded-sm px-3 py-2 text-[10px] font-black uppercase text-slate-600 outline-none focus:border-slate-400"
          >
            <option value="">ALL_STATUS</option>
            <option value="delivered">Delivered</option>
            <option value="in_transit">In Transit</option>
            <option value="rto">RTO</option>
            <option value="ndr">NDR</option>
          </select>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-sm px-3 py-1">
            <Calendar size={12} className="text-slate-400" />
            <input type="date" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value}))} className="bg-transparent text-[10px] font-black outline-none text-slate-600 uppercase" />
            <span className="text-slate-300">/</span>
            <input type="date" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value}))} className="bg-transparent text-[10px] font-black outline-none text-slate-600 uppercase" />
          </div>
        </div>
      </div>

      {/* DATA GRID */}
      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm relative">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-30 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
             <div className="bg-slate-900 text-white px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
                <Loader2 size={12} className="animate-spin" /> SYNCING_RECORDS...
             </div>
          </div>
        )}

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse table-fixed min-w-[1200px]">
            <thead className="bg-slate-900 text-white sticky top-0 z-20">
              <tr>
                <Th className="w-48 pl-6">AWB_IDENTITY</Th>
                <Th className="w-64">ENTITY_&_CARRIER</Th>
                <Th className="text-center w-32">LIFECYCLE</Th>
                <Th className="w-48">TIMESTAMPS</Th>
                <Th className="w-56">ROUTE_LOG</Th>
                <Th className="w-32">KPI_SLA</Th>
                <Th className="text-right pr-6 w-44">OPERATIONS</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={7} className="p-12 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Initializing_Data_Stream...</td></tr>
              ) : data?.data?.map((c: any) => (
                <tr key={c.id} className="group hover:bg-slate-50 transition-colors">
                  <Td className="pl-6">
                    <span className="font-mono text-[11px] font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-sm border border-slate-200 inline-block uppercase tracking-tighter">
                      {c.awb}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-xs uppercase tracking-tight truncate">{c.client}</span>
                      <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">{c.provider}</span>
                    </div>
                  </Td>
                  <Td className="text-center">
                    <StatusBadge status={c.status} />
                  </Td>
                  <Td>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-400 w-10">BOOK:</span>
                        <span className="text-[10px] font-bold text-slate-700 font-mono">{formatDateTime(c.bookedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600">
                        <span className="text-[9px] font-black w-10">UPDT:</span>
                        <span className="text-[10px] font-black font-mono">{formatDateTime(c.lastUpdatedAt)}</span>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter overflow-hidden">
                      <span className="text-slate-500 truncate">{c.origin || 'N/A'}</span>
                      <ChevronRight size={12} className="text-slate-300 shrink-0" />
                      <span className="text-slate-900 truncate">{c.destination || 'N/A'}</span>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex flex-col gap-1">
                      {tatBadgeUI(c.tat)}
                      {moveBadgeUI(c.movement)}
                    </div>
                  </Td>
                  <Td className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => liveSync.mutate(c.awb)}
                        className="p-2 rounded-sm bg-white border border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all shadow-sm"
                        title="Sync Now"
                      >
                        <RefreshCw size={14} className={clsx(liveSync.isPending && liveSync.variables === c.awb && "animate-spin")} />
                      </button>
                      <button 
                        onClick={() => setSelectedAwb(c)} 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-slate-900 text-white text-[10px] font-black uppercase hover:bg-black transition-all shadow-sm"
                      >
                        <Eye size={12} /> DETAILS
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-500 uppercase">
            Showing_Entries: <span className="text-slate-900 font-mono">{startRange}-{endRange}</span> / {totalRecords}
          </p>
          <div className="flex items-center gap-1">
            <PaginationBtn onClick={() => setPage(1)} disabled={page === 1}><ChevronsLeft size={14}/></PaginationBtn>
            <PaginationBtn onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft size={14}/></PaginationBtn>
            <div className="px-3 py-1 bg-white border border-slate-200 text-slate-900 rounded-sm text-[10px] font-black mx-2 min-w-[60px] text-center font-mono">
              {page} / {totalPages}
            </div>
            <PaginationBtn onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}><ChevronRight size={14}/></PaginationBtn>
            <PaginationBtn onClick={() => setPage(totalPages)} disabled={page >= totalPages}><ChevronsRight size={14}/></PaginationBtn>
          </div>
        </div>
      </div>

      {/* DETAILS DRAWER */}
      <Sheet open={!!selectedAwb} onOpenChange={() => setSelectedAwb(null)}>
        <SheetContent className="sm:max-w-md w-full p-0 border-l border-slate-200 shadow-2xl flex flex-col bg-white">
          <SheetTitle className="sr-only">Consignment Details - {selectedAwb?.awb}</SheetTitle>
          <div className="p-6 bg-slate-900 text-white shrink-0">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-sm text-blue-500"><Hash size={20}/></div>
                  <div>
                    <h2 className="text-xl font-mono font-black uppercase tracking-tighter leading-none">{selectedAwb?.awb}</h2>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Entity_Audit_Detail</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAwb(null)} className="p-2 hover:bg-slate-800 rounded-sm transition-all text-slate-400">
                  <X size={20} />
                </button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
              <div className="grid grid-cols-2 gap-2">
                  <DrawerInfoBox label="Origin_Hub" value={selectedAwb?.origin} icon={MapPin} />
                  <DrawerInfoBox label="Target_Dest" value={selectedAwb?.destination} icon={Navigation} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <History size={14}/> Operational_Audit_Trail
                  </h3>
                  <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm uppercase font-mono">
                      {isEventsLoading ? 'Syncing...' : `${events?.length || 0} Events`}
                  </span>
                </div>
                <ShipmentTimeline events={events || []} isLoading={isEventsLoading} />
              </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ───────────────── UI UTILS ───────────────── */

function SummaryMini({ label, value, loading, color }: any) {
  return (
    <div className="px-4 border-r border-slate-200 last:border-0">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none">{label}</p>
      <p className={clsx("text-sm font-black mt-1 leading-none font-mono", color)}>
        {loading ? '...' : (value || 0)}
      </p>
    </div>
  );
}

function SelectFilter({ value, onChange, options, labelKey, placeholder }: any) {
  return (
    <select 
      value={value} 
      onChange={e => onChange(e.target.value)}
      className="bg-white border border-slate-200 rounded-sm px-3 py-2 text-[10px] font-black uppercase text-slate-600 outline-none focus:border-slate-400 max-w-[150px]"
    >
      <option value="">{placeholder}</option>
      {options?.map((opt: any) => (
        <option key={opt.id || opt[labelKey]} value={opt.id || opt[labelKey]}>{opt[labelKey].toUpperCase()}</option>
      ))}
    </select>
  );
}

function PaginationBtn({ children, onClick, disabled }: any) {
  return (
    <button onClick={onClick} disabled={disabled} className="p-1.5 rounded-sm border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all">
      {children}
    </button>
  );
}

function DrawerInfoBox({ label, value, icon: Icon }: any) {
  return (
    <div className="bg-slate-50 p-3 border border-slate-200 rounded-sm">
      <div className="flex items-center gap-2 text-slate-400 mb-1">
        <Icon size={12} />
        <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
      </div>
      <span className="text-[11px] font-black text-slate-900 uppercase truncate block">{value || '---'}</span>
    </div>
  );
}

function StatusBadge({ status }: any) {
  const styles: any = {
    'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'In Transit': 'bg-blue-50 text-blue-700 border-blue-200',
    'Out for Delivery': 'bg-amber-50 text-amber-700 border-amber-200',
    'RTO': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'NDR': 'bg-rose-50 text-rose-700 border-rose-200',
    'default': 'bg-slate-50 text-slate-600 border-slate-100'
  };
  return <span className={clsx("px-2 py-0.5 rounded-sm border text-[9px] font-black uppercase tracking-widest", styles[status] || styles.default)}>{status || 'Unknown'}</span>;
}

function ShipmentTimeline({ events, isLoading }: { events: any[], isLoading: boolean }) {
  if (isLoading) return <div className="py-20 text-center text-[10px] font-black animate-pulse text-slate-400 tracking-widest uppercase italic">Syncing_Live_Stream...</div>;
  if (!events?.length) return <div className="py-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest border border-dashed border-slate-200 rounded-sm">No_Record_Logs_Found</div>;
  
  return (
    <div className="relative space-y-6 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
      {events.map((event, idx) => (
        <div key={idx} className="relative flex items-start gap-4">
          <div className={clsx("h-[22px] w-[22px] shrink-0 rounded-sm border-2 border-white z-10 flex items-center justify-center", idx === 0 ? "bg-blue-600 shadow-md" : "bg-slate-200")} />
          <div className="flex-1 pb-6 border-b border-slate-50 last:border-0">
            <div className="flex justify-between items-start mb-1">
              <span className={clsx("text-[11px] font-black uppercase tracking-tight", idx === 0 ? "text-blue-600" : "text-slate-800")}>{event.status}</span>
              <span className="text-[9px] font-mono font-black text-slate-400">{new Date(event.event_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}</span>
            </div>
            <div className="flex items-center gap-1.5 mb-1 text-slate-500">
                <MapPin size={10} className="shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">{event.location || 'Central_Hub'}</span>
            </div>
            {event.remarks && <p className="text-[10px] text-slate-400 font-bold italic border-l-2 border-slate-100 pl-3 uppercase tracking-tighter leading-relaxed">"{event.remarks}"</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDateTime(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`;
}

function Th({ children, className }: any) { return <th className={clsx("px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400", className)}>{children}</th>; }
function Td({ children, className }: any) { return <td className={clsx("px-4 py-3 text-xs border-slate-100", className)}>{children}</td>; }

function tatBadgeUI(t: string) {
  const common = "text-[9px] font-black uppercase px-2 py-0.5 rounded-sm tracking-tighter text-center block w-20 border";
  if (t === "Sensitive") return <span className={clsx(common, "bg-red-600 text-white border-red-700")}>Sensitive</span>;
  if (t === "Critical") return <span className={clsx(common, "bg-red-50 text-red-800 border-red-100")}>Critical</span>;
  return <span className={clsx(common, "bg-slate-50 text-slate-600 border-slate-100")}>Standard</span>;
}

function moveBadgeUI(t: string) { return tatBadgeUI(t); }