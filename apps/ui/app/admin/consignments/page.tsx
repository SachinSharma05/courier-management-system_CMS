"use client";

import React, { useState, useMemo } from 'react';
import { 
  Box, Download, Search, Calendar, ChevronRight, MapPin, Navigation,
  ChevronsLeft, ChevronLeft, ChevronsRight, RefreshCw, Hash, X, ArrowRight
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
import { ProviderOption } from '@/lib/api/providers.api';
import { Consignment, DrawerInfoBoxProps, PaginationBtnProps, SelectFilterProps, StatusBadgeProps, SummaryMiniProps, TableCellProps } from '../interface/adminInterface';

export default function ConsignmentsPage() {
  const queryClient = useQueryClient();
  const { data: clients } = useClients();
  const { data: providers } = useProviders();
  
  const [filters, setFilters] = useState({
    awb: '',
    clientId: '',
    provider: '', 
    status: '',
    tat: '',
    from: '',
    to: '',
  });

  const [page, setPage] = useState(1);
  const [selectedAwb, setSelectedAwb] = useState<Consignment | null>(null); 
  const limit = 50;

  const debounceAwb = useDebounce(filters.awb, 400);

  const normalizedFilters = useMemo(() => ({
    page,
    limit,
    awb: debounceAwb.trim() || undefined,
    clientId: filters.clientId ? Number(filters.clientId) : undefined,
    provider: filters.provider || undefined, 
    status: filters.status || undefined,
    tat: filters.tat || undefined,
    from: filters.from || undefined,
    to: filters.to || undefined,
  }), [debounceAwb, filters, page]);

  const { data, isLoading, isFetching } = useConsignments(normalizedFilters);
  const { data: events, isLoading: isEventsLoading } = useConsignmentEvents(selectedAwb?.awb);
  const { data: summary, isLoading: isSummaryLoading } = useConsignmentsSummary(filters.clientId ? Number(filters.clientId) : undefined);

  const totalRecords = data?.meta?.total || 0;
  const totalPages = data?.meta?.pages || 1;

  const safePage = Math.min(page, totalPages || 1);

  const startRange = totalRecords === 0 ? 0 : (safePage - 1) * limit + 1;
  const endRange = Math.min(safePage * limit, totalRecords);

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
    <div className="p-2 space-y-2 bg-[#f8fafc] min-h-screen font-sans">
      {/* ───────────────── HEADER: FLAT & SEMANTIC ───────────────── */}
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-300 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 bg-green-600 items-center justify-center rounded-xl text-white shadow-lg shadow-slate-200">
            <Box size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Shipment Ledger</h1>
            <p className="text-sm text-slate-500 font-medium">Operational control and logistics tracking</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4 lg:mt-0">
          <div className="flex bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <SummaryMini label="Total" value={summary?.total} loading={isSummaryLoading} color="text-slate-900" />
            <SummaryMini label="Delivered" value={summary?.delivered} loading={isSummaryLoading} color="text-emerald-600" />
            <SummaryMini label="In Transit" value={summary?.pending} loading={isSummaryLoading} color="text-amber-600" />
            <SummaryMini label="NDR" value={summary?.ndr} loading={isSummaryLoading} color="text-rose-600" />
            <SummaryMini label="RTO" value={summary?.rto} loading={isSummaryLoading} color="text-indigo-600" />
          </div>
          
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-black transition-all"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* ───────────────── FILTERS: CLEAN GRID ───────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 bg-white p-3 border border-slate-200 rounded-lg">
        <div className="xl:col-span-3 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            placeholder="Search AWB or Reference..."
            value={filters.awb}
            onChange={e => setFilters(f => ({ ...f, awb: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-4 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:border-slate-400 transition-all"
          />
        </div>

        <div className="xl:col-span-9 flex flex-wrap gap-2">
          <SelectFilter 
            value={filters.clientId} 
            onChange={(v: string) => setFilters(f => ({ ...f, clientId: v }))}
            options={clients || []}
            labelKey="company_name"
            placeholder="All Clients"
          />
          
          <select 
            value={filters.provider} 
            onChange={e => setFilters(f => ({ ...f, provider: e.target.value }))}
            className="bg-white border border-slate-200 rounded-md px-3 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-slate-400 min-w-[140px]"
          >
            <option value="">All Carriers</option>
            {providers?.map((p: ProviderOption) => (
              <option key={p.id || p.name} value={p.name}>{p.name}</option>
            ))}
          </select>

          <select 
            value={filters.status} 
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
            className="bg-white border border-slate-200 rounded-md px-3 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-slate-400"
          >
            <option value="">Status: All</option>
            <option value="delivered">Delivered</option>
            <option value="in_transit">In Transit</option>
            <option value="rto">RTO</option>
            <option value="ndr">NDR</option>
          </select>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5">
            <Calendar size={14} className="text-slate-400" />
            <input type="date" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value}))} className="bg-transparent text-[11px] font-bold outline-none text-slate-600" />
            <span className="text-slate-300">→</span>
            <input type="date" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value}))} className="bg-transparent text-[11px] font-bold outline-none text-slate-600" />
          </div>
        </div>
      </div>

      {/* ───────────────── TABLE: PERFORMANCE OPTIMIZED ───────────────── */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden relative">
        {isFetching && !isLoading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 overflow-hidden">
            <div className="h-full bg-slate-900 animate-progress origin-left" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500">
              <tr>
                <Th className="pl-6">AWB Identity</Th>
                <Th>Client & Carrier</Th>
                <Th className="text-center">Lifecycle</Th>
                <Th>Timestamps</Th>
                <Th>Route</Th>
                <Th>TAT / Movement</Th>
                <Th>Live Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={7} className="p-20 text-center text-xs font-bold text-slate-400 animate-pulse">Initializing Data Stream...</td></tr>
              ) : data?.data?.map((c: { id: string; awb: string; client: string; provider: string; status: string; bookedAt: string; lastUpdatedAt: string; origin: string; destination: string; tat: string; movement: string }) => (
                <tr key={c.id} className="group hover:bg-slate-50/80 transition-colors">
                  <Td className="pl-6 font-mono font-bold text-slate-900">{c.awb}</Td>
                  <Td>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-sm">{c.client}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{c.provider}</span>
                    </div>
                  </Td>
                  <Td className="text-center"><StatusBadge status={c.status} /></Td>
                  <Td>
                    <div className="text-[10px] space-y-0.5">
                      <div className="flex gap-2"><span className="text-slate-400 font-bold w-10">BOOK:</span> <span className="text-slate-600 font-medium">{formatDateTime(c.bookedAt)}</span></div>
                      <div className="flex gap-2 text-blue-600"><span className="font-bold w-10">UPDT:</span> <span className="font-bold">{formatDateTime(c.lastUpdatedAt)}</span></div>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <span className="truncate max-w-[80px]">{c.origin || 'N/A'}</span>
                      <ArrowRight size={12} className="text-slate-300" />
                      <span className="truncate max-w-[80px] text-slate-900">{c.destination || 'N/A'}</span>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex flex-col gap-1">
                      {tatBadgeUI(c.tat)}
                      {moveBadgeUI(c.movement)}
                    </div>
                  </Td>
                  <Td>
                    <button
                        onClick={() => liveSync.mutate(c.awb)}
                        className="p-2 rounded-md border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors"
                      >
                        <RefreshCw size={14} className={clsx(liveSync.isPending && liveSync.variables === c.awb && "animate-spin")} />
                      </button>
                  </Td>
                  <Td>
                    <button 
                        onClick={() => setSelectedAwb(c)} 
                        className="px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold hover:bg-slate-100 transition-colors"
                      >
                        Details
                      </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION: CLEAN & SOLID */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500">
            Showing <span className="text-slate-900 font-bold">{startRange}-{endRange}</span> of {totalRecords}
          </p>
          <div className="flex items-center gap-2">
            <PaginationBtn onClick={() => setPage(1)} disabled={safePage === 1} icon={ChevronsLeft} />
            <PaginationBtn onClick={() => setPage(p => p - 1)} disabled={safePage === 1} icon={ChevronLeft} />
            <span className="text-xs font-bold px-3 py-1 bg-white border border-slate-200 rounded-md text-slate-900">
              {safePage} / {totalPages}
            </span>
            <PaginationBtn onClick={() => setPage(p => p + 1)} disabled={safePage >= totalPages} icon={ChevronRight} />
            <PaginationBtn onClick={() => setPage(totalPages)} disabled={safePage >= totalPages} icon={ChevronsRight} />
          </div>
        </div>
      </div>

      {/* DETAILS DRAWER: NO BLUR */}
      <Sheet open={!!selectedAwb} onOpenChange={() => setSelectedAwb(null)}>
        <SheetContent className="sm:max-w-md w-full p-0 border-l border-slate-200 shadow-2xl bg-white">
          <SheetTitle className="sr-only">Consignment Details - {selectedAwb?.awb}</SheetTitle>
          <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Hash size={20} className="text-blue-400" />
              <h2 className="text-lg font-bold">{selectedAwb?.awb}</h2>
            </div>
            <button onClick={() => setSelectedAwb(null)} className="p-2 hover:bg-slate-800 rounded-md transition-colors"><X size={20} /></button>
          </div>
          <div className="p-6 overflow-y-auto h-[calc(100vh-80px)] space-y-8">
              <div className="grid grid-cols-2 gap-4">
                  <DrawerInfoBox label="Origin Hub" value={selectedAwb?.origin} icon={MapPin} />
                  <DrawerInfoBox label="Target Destination" value={selectedAwb?.destination} icon={Navigation} />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">History Log</h3>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{events?.length || 0} Events</span>
                </div>
                <ShipmentTimeline events={events || []} isLoading={isEventsLoading} />
              </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ───────────────── REFACTORED HELPERS ───────────────── */
function Th({ children, className }: TableCellProps) { 
  return <th className={clsx("px-4 py-3 text-[11px] font-bold uppercase tracking-wider", className)}>{children}</th>; 
}

function Td({ children, className }: TableCellProps) { 
  return <td className={clsx("px-4 py-4 text-xs", className)}>{children}</td>; 
}

function SummaryMini({ label, value, loading, color }: SummaryMiniProps) {
  return (
    <div className="px-4 border-r border-slate-200 last:border-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
      <p className={clsx("text-base font-bold mt-0.5", color)}>{loading ? '...' : (value || 0)}</p>
    </div>
  );
}

function SelectFilter({ value, onChange, options, labelKey, placeholder }: SelectFilterProps) {
  return (
    <select 
      value={value} 
      onChange={e => onChange(e.target.value)}
      className="bg-white border border-slate-200 rounded-md px-3 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-slate-400 max-w-[160px]"
    >
      <option value="">{placeholder}</option>
      {options?.map((opt: Record<string, string | number>) => (
        <option key={opt.id || opt[labelKey]} value={opt.id || opt[labelKey]}>{opt[labelKey]}</option>
      ))}
    </select>
  );
}

function PaginationBtn({ icon: Icon, onClick, disabled }: PaginationBtnProps) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className="p-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-colors text-slate-600"
    >
      <Icon size={14}/>
    </button>
  );
}

function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    'Delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'In Transit': 'bg-blue-100 text-blue-800 border-blue-200',
    'Out for Delivery': 'bg-amber-100 text-amber-800 border-amber-200',
    'RTO': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'NDR': 'bg-rose-100 text-rose-800 border-rose-200',
    'default': 'bg-slate-100 text-slate-600 border-slate-200'
  };
  return <span className={clsx("px-2.5 py-0.5 rounded-full border text-[10px] font-bold", styles[status] || styles.default)}>{status || 'Unknown'}</span>;
}

function DrawerInfoBox({ label, value, icon: Icon }: DrawerInfoBoxProps) {
  return (
    <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl">
      <div className="flex items-center gap-2 text-slate-400 mb-1.5">
        <Icon size={14} />
        <span className="text-[10px] font-bold uppercase">{label}</span>
      </div>
      <span className="text-sm font-bold text-slate-900 truncate block">{value || '---'}</span>
    </div>
  );
}

function ShipmentTimeline({ events, isLoading }: { events: Array<{ status: string; event_time: string; location?: string; remarks?: string }>, isLoading: boolean }) {
  if (isLoading) return <div className="py-20 text-center text-xs font-bold text-slate-400 animate-pulse">Syncing Audit Trail...</div>;
  if (!events?.length) return <div className="py-20 text-center text-slate-400 text-xs font-bold border border-dashed border-slate-200 rounded-xl">No Logs Recorded</div>;
  
  return (
    <div className="relative space-y-6 before:absolute before:inset-0 before:ml-[11px] before:w-0.5 before:bg-slate-100">
      {events.map((event, idx) => (
        <div key={idx} className="relative flex items-start gap-4 pl-0.5">
          <div className={clsx("h-5 w-5 shrink-0 rounded-full border-4 border-white z-10", idx === 0 ? "bg-blue-600" : "bg-slate-300")} />
          <div className="flex-1 pb-4 border-b border-slate-50 last:border-0">
            <div className="flex justify-between items-start mb-1">
              <span className={clsx("text-xs font-bold", idx === 0 ? "text-blue-600" : "text-slate-800")}>{event.status}</span>
              <span className="text-[10px] font-medium text-slate-400">{new Date(event.event_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <MapPin size={10} /> {event.location || 'Hub'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function tatBadgeUI(t: string) {
  const common = "text-[10px] font-bold px-2 py-0.5 rounded-md border text-center inline-block";
  if (t === "Sensitive") return <span className={clsx(common, "bg-rose-50 text-rose-700 border-rose-100")}>Sensitive</span>;
  if (t === "Critical") return <span className={clsx(common, "bg-amber-50 text-amber-700 border-amber-100")}>Critical</span>;
  return <span className={clsx(common, "bg-slate-50 text-slate-600 border-slate-100")}>Standard</span>;
}

function moveBadgeUI(t: string) { return tatBadgeUI(t); }

function formatDateTime(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}