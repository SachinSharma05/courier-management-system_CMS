"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Box, Package, CheckCircle2, Clock, Download, Search, 
  Calendar, ChevronRight, Eye, MapPin, Navigation, Truck,
  ChevronsLeft, ChevronLeft, ChevronsRight, Loader2,
  RefreshCw
} from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useDebounce } from '@/hooks/useDebounce';
import { useClients } from '@/hooks/useClients';
import { useProviders } from '@/hooks/useProviders';
import { useConsignments, useConsignmentsSummary, useConsignmentEvents } from '@/hooks/useConsignments';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';

export default function ConsignmentsPage() {
  const { data: clients } = useClients();
  const { data: providers } = useProviders();
  
  const [filters, setFilters] = useState({
    awb: '',
    clientId: '',
    provider: '',
    status: '',
    tat: '', // Added TAT
    from: '',
    to: '',
  });

  const [page, setPage] = useState(1);
  const [selectedAwb, setSelectedAwb] = useState<any>(null); 
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

  // Main List - Optimized with placeholderData in hook
  const { data, isLoading, isFetching } = useConsignments(normalizedFilters);

  // Detail Events - Only fetches when drawer opens
  const { data: events, isLoading: isEventsLoading } = useConsignmentEvents(selectedAwb?.awb);

  const selectedClientId = filters.clientId ? Number(filters.clientId) : undefined;
  const { data: summary, isLoading: isSummaryLoading } = useConsignmentsSummary(selectedClientId);

  // Reset to page 1 when any filter changes
  useEffect(() => { setPage(1); }, [debounceAwb, filters.clientId, filters.provider, filters.status, filters.tat, filters.from, filters.to]);

  const totalRecords = data?.meta?.total || 0;
  const totalPages = data?.meta?.pages || 1;
  const startRange = (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, totalRecords);

  // Inside your ConsignmentsPage function
  const queryClient = useQueryClient();

  const liveSync = useMutation({
    mutationFn: async (awb: string) => {
      const res = await api.post(`/admin/consignments/${awb}/sync`);
      return res.data;
    },
    onSuccess: (data, awb) => {
      toast.success(`AWB ${awb} Sync Complete`);
      queryClient.invalidateQueries({ queryKey: ['consignments'] });
      queryClient.invalidateQueries({ queryKey: ['consignment-events', awb] });
    },
  });

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] p-6 space-y-4 overflow-hidden bg-slate-50/50">
      
      {/* ───────────────── HEADER & SUMMARY ───────────────── */}
      <div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
            <Box size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Consignments</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-tight">Real-time Logistics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <StatusCard label="Total" value={summary?.total} icon={Package} variant="black" loading={isSummaryLoading} />
          <StatusCard label="Delivered" value={summary?.delivered} icon={CheckCircle2} variant="green" loading={isSummaryLoading} />
          <StatusCard label="In Transit" value={summary?.pending} icon={Clock} variant="yellow" loading={isSummaryLoading} />
          <StatusCard label="NDR" value={summary?.ndr} icon={Clock} variant="red" loading={isSummaryLoading} />
          <StatusCard label="RTO" value={summary?.rto} icon={Clock} variant="blue" loading={isSummaryLoading} />
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl px-6 shadow-lg shadow-indigo-100 gap-2 uppercase text-xs">
            <Download size={16} /> Export
          </Button>
        </div>
      </div>

      {/* ───────────────── FILTERS ───────────────── */}
      <div className="shrink-0 rounded-2xl bg-white p-2 shadow-sm border border-slate-200 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            placeholder="Search AWB or Reference..."
            value={filters.awb}
            onChange={e => setFilters(f => ({ ...f, awb: e.target.value }))}
            className="w-full rounded-xl border-none bg-slate-50 pl-11 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select 
            className="h-11 bg-slate-50 border-none rounded-xl px-4 text-xs font-black uppercase text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/10"
            value={filters.clientId} 
            onChange={e => setFilters(f => ({ ...f, clientId: e.target.value }))}
          >
            <option value="">All Clients</option>
            {/* Access .data and then .map */}
            {(clients as any[])?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company_name}
              </option>
            ))}
          </select>

          <select 
            className="h-11 bg-slate-50 border-none rounded-xl px-4 text-xs font-black uppercase text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/10"
            value={filters.provider} 
            onChange={e => setFilters(f => ({ ...f, provider: e.target.value }))}
          >
            <option value="">All Providers</option>
            {(providers as any[])?.map((p) => (
              <option key={p.id || p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          <select 
            className="h-11 bg-slate-50 border-none rounded-xl px-4 text-xs font-black uppercase text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/10"
            value={filters.status} 
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          >
            <option value="">Status</option>
            <option value="delivered">Delivered</option>
            <option value="in_transit">In Transit</option>
            <option value="rto">RTO</option>
            <option value="ndr">NDR</option>
            <option value="other">Other</option>
          </select>

          <select 
            className="h-11 bg-slate-50 border-none rounded-xl px-4 text-xs font-black uppercase text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/10"
            value={filters.tat} 
            onChange={e => setFilters(f => ({ ...f, tat: e.target.value }))}
          >
            <option value="">TAT Filter</option>
            <option value="On Time">On Time</option>
            <option value="Delayed">Delayed</option>
            <option value="Critical">Critical</option>
          </select>

          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 h-11 border border-slate-100">
            <Calendar size={14} className="text-slate-400" />
            <input type="date" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value}))} className="bg-transparent text-[11px] font-black outline-none text-slate-600 uppercase" />
            <div className="h-4 w-px bg-slate-200" />
            <input type="date" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value}))} className="bg-transparent text-[11px] font-black outline-none text-slate-600 uppercase" />
          </div>
        </div>
      </div>

      {/* ───────────────── TABLE AREA ───────────────── */}
      <div className="flex-1 min-h-0 flex flex-col rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl relative overflow-hidden">
        
        {/* BLUR EFFECT DURING FETCHING */}
        {(isFetching && !isLoading) && (
          <div className="absolute inset-0 z-30 bg-white/30 backdrop-blur-[2px] pointer-events-none flex items-center justify-center">
             <div className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                <Loader2 size={14} className="animate-spin" /> Updating List...
             </div>
          </div>
        )}

        <div className="flex-1 overflow-auto no-scrollbar relative">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="sticky top-0 z-20 bg-slate-50/90 backdrop-blur-md">
              <tr>
                <Th className="pl-8">AWB Identity</Th>
                <Th>Client & Provider</Th>
                <Th className="text-center">Live Status</Th>
                <Th>Timelines</Th>
                <Th>Route</Th>
                <Th>TAT / Movement</Th>
                <Th className="text-right pr-8">Actions</Th>
              </tr>
            </thead>
            <tbody className={clsx("divide-y divide-slate-50", isLoading ? "opacity-0" : "opacity-100")}>
              {data?.data?.map((c: any) => (
                <tr key={c.id} className="group hover:bg-slate-50/50 transition-colors">
                  {/* AWB Identity */}
                  <td className="px-6 py-4 align-middle pl-8">
                    <span className="font-mono font-black text-slate-900 text-sm tracking-tighter bg-slate-100 px-2.5 py-1.5 rounded-lg inline-block">
                      {c.awb}
                    </span>
                  </td>

                  {/* Client & Provider */}
                  <td className="px-6 py-4 align-middle">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 text-[13px] leading-tight truncate max-w-[180px]">
                        {c.client}
                      </span>
                      <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-0.5">
                        {c.provider}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 align-middle text-center">
                    <StatusBadge status={c.status} />
                  </td>

                  {/* Timelines */}
                  <td className="px-6 py-4 align-middle">
                    <div className="flex flex-col gap-1 text-[11px] font-bold text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-400" /> {new Date(c.bookedAt).toLocaleDateString()}
                      </span>
                      <span className="text-[9px] text-slate-400 uppercase font-black tracking-tight">
                        Tracked At: {new Date(c.lastUpdatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </td>

                  {/* Route */}
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter">
                      <span className="text-slate-600 truncate max-w-[100px]">{c.origin || '---'}</span>
                      <ChevronRight size={14} className="text-slate-300 shrink-0" />
                      <span className="text-indigo-600 truncate max-w-[100px]">{c.destination || '---'}</span>
                    </div>
                  </td>

                  {/* TAT / Movement */}
                  <td className="px-6 py-4 align-middle">
                    <div className="flex flex-col gap-1.5">
                      {tatBadgeUI(c.tat)}
                      {moveBadgeUI(c.movement)}
                    </div>
                  </td>

                  {/* Actions - FIXED ALIGNMENT */}
                  <td className="px-6 py-4 align-middle text-right pr-8">
                    <div className="flex items-center justify-end gap-2 min-w-[180px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          liveSync.mutate(c.awb);
                        }}
                        disabled={liveSync.isPending && liveSync.variables === c.awb}
                        className={clsx(
                          "flex items-center justify-center gap-2 px-3 h-9 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shrink-0",
                          liveSync.isPending && liveSync.variables === c.awb
                            ? "bg-slate-100 text-slate-400" 
                            : "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-100"
                        )}
                      >
                        {liveSync.isPending && liveSync.variables === c.awb ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <RefreshCw size={12} />
                        )}
                        <span className="hidden xl:inline">
                          {liveSync.isPending && liveSync.variables === c.awb ? "Syncing..." : "Live Sync"}
                        </span>
                      </button>

                      <Button 
                        onClick={() => setSelectedAwb(c)} 
                        variant="outline" 
                        className="h-9 px-4 rounded-xl border-slate-200 font-black text-[11px] uppercase tracking-tighter hover:bg-slate-900 hover:text-white transition-all gap-2 shrink-0 shadow-sm"
                      >
                        <Eye size={14} /> 
                        <span className="hidden xl:inline">Details</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ───────────────── PAGINATION ───────────────── */}
        <div className="shrink-0 border-t border-slate-100 px-8 py-4 flex items-center justify-between bg-white">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing <span className="text-slate-900">{startRange}–{endRange}</span> of {totalRecords} Records
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="rounded-lg h-9 w-9 p-0" onClick={() => setPage(1)} disabled={page === 1}><ChevronsLeft size={16}/></Button>
            <Button size="sm" variant="outline" className="rounded-lg h-9 w-9 p-0" onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft size={16}/></Button>
            <div className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[11px] font-black shadow-lg shadow-slate-200">{page} / {totalPages}</div>
            <Button size="sm" variant="outline" className="rounded-lg h-9 w-9 p-0" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}><ChevronRight size={16}/></Button>
            <Button size="sm" variant="outline" className="rounded-lg h-9 w-9 p-0" onClick={() => setPage(totalPages)} disabled={page >= totalPages}><ChevronsRight size={16}/></Button>
          </div>
        </div>
      </div>

      {/* ───────────────── SIDE DRAWER ───────────────── */}
      <Sheet open={!!selectedAwb} onOpenChange={() => setSelectedAwb(null)}>
        <SheetContent className="sm:max-w-md w-full p-0 border-l border-slate-100 shadow-2xl flex flex-col">
          <div className="h-full flex flex-col bg-slate-50/50">
            <SheetHeader className="p-6 bg-white border-b border-slate-100 shrink-0">
              <SheetTitle className="flex flex-col">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Shipment Identity</span>
                  <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter">{selectedAwb?.awb}</span>
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <DetailCard label="Origin" value={selectedAwb?.origin} icon={MapPin} />
                    <DetailCard label="Destination" value={selectedAwb?.destination} icon={Navigation} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking Timeline</h3>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase">
                        {isEventsLoading ? 'Syncing...' : `${events?.length || 0} Events`}
                    </span>
                  </div>
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm min-h-[300px]">
                      <ShipmentTimeline events={events || []} isLoading={isEventsLoading} />
                  </div>
                </div>
            </div>
            
            <div className="p-6 bg-white border-t border-slate-100 shrink-0">
                <Button onClick={() => setSelectedAwb(null)} className="w-full h-12 rounded-2xl bg-slate-100 text-slate-900 font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Close Drawer</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ───────────────── SUB-COMPONENTS ───────────────── */

function Th({ children, className }: any) { 
    return <th className={clsx("px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400", className)}>{children}</th>; 
}

function DetailCard({ label, value, icon: Icon }: any) {
    return (
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <Icon size={14} className="text-slate-400 mb-1" />
            <span className="text-[9px] font-black text-slate-400 uppercase block">{label}</span>
            <span className="text-xs font-black text-slate-800 uppercase truncate">{value || '---'}</span>
        </div>
    );
}

function StatusCard({ label, value, icon: Icon, variant, loading }: any) {
    const themes: any = {
      black: "bg-slate-900 border-slate-900 text-white shadow-indigo-100",
      green: "bg-white border-slate-100 text-emerald-600 shadow-slate-200",
      yellow: "bg-white border-slate-100 text-amber-600 shadow-slate-200",
    };
    return (
      <div className={clsx("flex items-center gap-3 px-4 py-2 rounded-2xl border shadow-sm min-w-[130px] transition-all", themes[variant])}>
        <Icon size={18} />
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase opacity-60 tracking-widest">{label}</span>
          <span className="text-base font-black leading-none mt-1">{loading ? '...' : (value || 0)}</span>
        </div>
      </div>
    );
}

function StatusBadge({ status }: any) {
    const styles: any = {
      'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'In Transit': 'bg-blue-50 text-blue-700 border-blue-200',
      'Out for Delivery': 'bg-amber-50 text-amber-700 border-amber-200',
      'default': 'bg-slate-50 text-slate-600 border-slate-100'
    };
    return <span className={clsx("px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest", styles[status] || styles.default)}>{status || 'Unknown'}</span>;
}

function ShipmentTimeline({ events, isLoading }: { events: any[], isLoading: boolean }) {
  if (isLoading) return <div className="py-20 text-center text-[10px] font-black animate-pulse text-slate-400 tracking-widest uppercase">Fetching Live Data...</div>;
  if (!events?.length) return <div className="py-20 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">No tracking updates recorded</div>;
  
  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
      {events.map((event, idx) => (
        <div key={idx} className="relative flex items-start gap-5">
          {/* Animated Dot for latest status */}
          <div className="relative flex items-center justify-center">
            <div className={clsx(
                "h-2.5 w-2.5 shrink-0 rounded-full border-2 border-white z-10 transition-all", 
                idx === 0 ? "bg-indigo-600 ring-4 ring-indigo-50" : "bg-slate-300"
            )} />
            {idx === 0 && <div className="absolute h-5 w-5 bg-indigo-400/20 rounded-full animate-ping" />}
          </div>

          <div className="flex flex-col flex-1 pb-6 border-b border-slate-50 last:border-0">
            <div className="flex justify-between items-start mb-1">
              <span className={clsx("text-xs font-black uppercase tracking-tight", idx === 0 ? "text-indigo-600" : "text-slate-800")}>
                {event.status}
              </span>
              <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                {new Date(event.event_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mb-2">
                <MapPin size={10} className="text-slate-300" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{event.location || 'Hub Center'}</span>
            </div>
            {event.remarks && <p className="text-[10px] text-slate-400 font-medium italic border-l-2 border-slate-100 pl-3 leading-relaxed">"{event.remarks}"</p>}
            <span className="text-[9px] font-black text-slate-300 uppercase mt-3">{new Date(event.event_time).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function tatBadgeUI(t: string) {
  const common = "text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-tighter text-center block w-20 border";
  switch (t) {
    case "Delivered":
      return <span className={clsx(common, "bg-green-50 text-green-700 border-green-100")}>Delivered</span>;
    case "Sensitive":
      return <span className={clsx(common, "bg-red-600 text-white border-red-700")}>Sensitive</span>;
    case "Critical":
      return <span className={clsx(common, "bg-red-50 text-red-800 border-red-100")}>Critical</span>;
    case "Warning":
      return <span className={clsx(common, "bg-yellow-50 text-yellow-800 border-yellow-100")}>Warning</span>;
    default:
      return <span className={clsx(common, "bg-slate-50 text-slate-600 border-slate-100")}>On Time</span>;
  }
}

function moveBadgeUI(t: string) { return tatBadgeUI(t); }