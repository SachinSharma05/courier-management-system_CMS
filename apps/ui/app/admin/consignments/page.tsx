'use client';

import { 
  Search, Calendar, Download, 
  AlertCircle, Clock, CheckCircle2, Package,
  ChevronLeft, ChevronRight, Loader2,
  Box, Eye, ChevronsLeft, ChevronsRight,
  X, MapPin, Truck
} from 'lucide-react';
import clsx from 'clsx';
import { useConsignments } from '@/hooks/useConsignments';
import { useClients } from '@/hooks/useClients';
import { useProviders } from '@/hooks/useProviders';
import { useEffect, useState, useMemo } from 'react';
import { Select } from '@/components/Select';
import { useDebounce } from '@/hooks/useDebounce';
import { useConsignmentsSummary } from '@/hooks/useConsignmentsSummary';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function ConsignmentsPage() {
  const { data: clients } = useClients();
  const { data: providers } = useProviders();
  
  const [filters, setFilters] = useState({
    awb: '',
    clientId: '',
    provider: '',
    status: '',
    from: '',
    to: '',
  });

  const [page, setPage] = useState(1);
  const [selectedAwb, setSelectedAwb] = useState<any>(null); // Drawer State
  const limit = 50;

  const debounceAwb = useDebounce(filters.awb, 400);

  const normalizedFilters = useMemo(() => ({
    awb: debounceAwb.trim() || undefined,
    clientId: filters.clientId ? Number(filters.clientId) : undefined,
    provider: filters.provider || undefined,
    status: filters.status || undefined,
    from: filters.from || undefined,
    to: filters.to || undefined,
  }), [debounceAwb, filters]);

  const { data, isLoading, isFetching } = useConsignments({
    page,
    limit,
    ...normalizedFilters,
  });

  const selectedClientId = filters.clientId ? Number(filters.clientId) : undefined;
  const { data: summary, isLoading: isSummaryLoading } = useConsignmentsSummary(selectedClientId);

  useEffect(() => { setPage(1); }, [normalizedFilters]);

  // Pagination Helper Calculations
  const totalRecords = data?.meta.total || 0;
  const totalPages = data?.meta.pages || 1;
  const startRange = (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, totalRecords);

  const exportCSV = () => {
    const params = new URLSearchParams();
    Object.entries(normalizedFilters).forEach(([key, val]) => {
      if (val) params.append(key, String(val));
    });
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/admin/consignments/export?${params.toString()}`, '_blank');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] p-6 space-y-4 overflow-hidden bg-slate-50/50">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
            <Box size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Consignments</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-tight">Global Tracking Operations</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <StatusCard label="Total" value={summary?.total} icon={Package} variant="black" loading={isSummaryLoading} />
          <StatusCard label="Delivered" value={summary?.delivered} icon={CheckCircle2} variant="green" loading={isSummaryLoading} />
          <StatusCard label="In Transit" value={summary?.pending} icon={Clock} variant="yellow" loading={isSummaryLoading} />
          
          <div className="h-10 w-px bg-slate-200 mx-2 hidden md:block" />
          
          <Button onClick={exportCSV} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl px-6 shadow-lg shadow-indigo-100 gap-2 uppercase text-xs">
            <Download size={16} /> Export CSV
          </Button>
        </div>
      </div>

      {/* ───────────────── FILTERS ───────────────── */}
      <div className="shrink-0 rounded-2xl bg-white p-2 shadow-sm border border-slate-200 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            placeholder="Search AWB or Reference..."
            value={filters.awb}
            onChange={e => setFilters(f => ({ ...f, awb: e.target.value }))}
            className="w-full rounded-xl border-none bg-slate-50 pl-11 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 outline-none"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 pr-2">
          <Select value={filters.clientId} onChange={v => setFilters(f => ({ ...f, clientId: v }))} className="h-11 font-bold text-xs">
            <option value="">All Clients</option>
            {clients?.map(c => <option key={c.id} value={String(c.id)}>{c.company_name}</option>)}
          </Select>
          <Select value={filters.provider} onChange={v => setFilters(f => ({ ...f, provider: v }))} className="h-11 font-bold text-xs">
            <option value="">All Providers</option>
            {providers?.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </Select>
          <Select value={filters.status} onChange={v => setFilters(f => ({ ...f, status: v }))} className="h-11 font-bold text-xs">
            <option value="">Status</option>
            <option value="Delivered">Delivered</option>
            <option value="In Transit">In Transit</option>
          </Select>
          
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 h-11 border border-slate-100">
            <Calendar size={14} className="text-slate-400" />
            <input type="date" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value}))} className="bg-transparent text-[11px] font-black outline-none text-slate-600 uppercase" />
            <div className="h-4 w-px bg-slate-200" />
            <input type="date" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value}))} className="bg-transparent text-[11px] font-black outline-none text-slate-600 uppercase" />
          </div>
        </div>
      </div>

      {/* ───────────────── TABLE AREA ───────────────── */}
      <div className="flex-1 min-h-0 flex flex-col rounded-[2rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        
        <div className="flex-1 overflow-auto scrollbar-hide relative">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="sticky top-0 z-20 bg-slate-50/90 backdrop-blur-md">
              <tr>
                <Th>AWB Identity</Th>
                <Th>Client & Provider</Th>
                <Th className="text-center">Live Status</Th>
                <Th>Timelines</Th>
                <Th>Route</Th>
                <Th>Performance</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className={clsx(
              "divide-y divide-slate-50",
              (isLoading || isFetching) ? "opacity-40" : "opacity-100"
            )}>
              {data?.data.map((c) => (
                <tr key={c.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-black text-slate-900 text-sm tracking-tighter bg-slate-100 px-2.5 py-1 rounded-lg">
                        {c.awb}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 text-sm">{c.client}</span>
                      <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">{c.provider}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center"><StatusBadge status={c.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-400 w-10">BOOKED</span>
                        <span className="text-[11px] font-bold text-slate-700">{new Date(c.bookedAt).toLocaleDateString('en-GB', {day: '2-digit', month: 'short'})}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-indigo-400 w-10">UPDATE</span>
                        <span className="text-[11px] font-bold text-slate-700">{new Date(c.lastUpdatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-slate-600 uppercase">{c.origin}</span>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-[11px] font-black text-indigo-600 uppercase">{c.destination}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {tatBadgeUI(c.tat)}
                      {moveBadgeUI(c.movement)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      onClick={() => setSelectedAwb(c)}
                      variant="outline" 
                      className="h-9 px-4 rounded-xl border-slate-200 font-bold text-[11px] uppercase tracking-tighter hover:bg-slate-900 hover:text-white transition-all gap-2"
                    >
                      <Eye size={14} /> Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="shrink-0 border-t border-slate-100 px-8 py-4 flex items-center justify-between bg-white">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">
            Showing <span className="text-slate-900 font-black">{totalRecords === 0 ? 0 : startRange}–{endRange}</span> of <span className="text-slate-900 font-black">{totalRecords}</span> Shipments
          </span>
          
          <div className="flex items-center gap-1">
            <PaginationButton onClick={() => setPage(1)} disabled={page === 1} icon={<ChevronsLeft size={16} />} />
            <PaginationButton onClick={() => setPage(p => p - 1)} disabled={page === 1} icon={<ChevronLeft size={16} />} />
            
            <div className="px-5 py-1.5 mx-2 bg-slate-900 text-white rounded-xl text-[11px] font-black shadow-lg">
              {page} / {totalPages}
            </div>

            <PaginationButton onClick={() => setPage(p => p + 1)} disabled={page >= totalPages} icon={<ChevronRight size={16} />} />
            <PaginationButton onClick={() => setPage(totalPages)} disabled={page >= totalPages} icon={<ChevronsRight size={16} />} />
          </div>
        </div>
      </div>

      {/* ───────────────── SIDE DRAWER (DETAILS) ───────────────── */}
      <Sheet open={!!selectedAwb} onOpenChange={() => setSelectedAwb(null)}>
        <SheetContent className="sm:max-w-md w-full p-0 border-l border-slate-100 shadow-2xl">
          <div className="h-full flex flex-col bg-slate-50/50">
            <SheetHeader className="p-6 bg-white border-b border-slate-100">
              <SheetTitle className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Shipment Identity</span>
                  <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter">{selectedAwb?.awb}</span>
                </div>
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Status Section */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Current Progress</h3>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Truck size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black text-slate-900">{selectedAwb?.status}</span>
                            <span className="text-xs font-bold text-slate-500 uppercase">Last updated: {new Date(selectedAwb?.lastUpdatedAt).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Route Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-3xl border border-slate-100">
                        <MapPin size={16} className="text-slate-400 mb-2" />
                        <span className="text-[10px] font-black text-slate-400 uppercase block">Origin</span>
                        <span className="text-sm font-black text-slate-800">{selectedAwb?.origin}</span>
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-slate-100">
                        <MapPin size={16} className="text-indigo-500 mb-2" />
                        <span className="text-[10px] font-black text-slate-400 uppercase block">Destination</span>
                        <span className="text-sm font-black text-indigo-600">{selectedAwb?.destination}</span>
                    </div>
                </div>

                {/* Meta Data */}
                <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Client Name</span>
                        <span className="text-sm font-black">{selectedAwb?.client}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Carrier Provider</span>
                        <span className="text-sm font-black">{selectedAwb?.provider}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Booking Date</span>
                        <span className="text-sm font-black">{new Date(selectedAwb?.bookedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            
            <div className="p-6 bg-white border-t border-slate-100">
                <Button onClick={() => setSelectedAwb(null)} className="w-full h-12 rounded-2xl bg-slate-100 text-slate-900 font-black uppercase tracking-widest hover:bg-slate-200">
                    Close Details
                </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ───────────────── MINI COMPONENTS ───────────────── */

function PaginationButton({ onClick, disabled, icon }: any) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        disabled={disabled}
        onClick={onClick}
        className="h-9 w-9 p-0 rounded-lg border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-none"
      >
        {icon}
      </Button>
    );
}

function StatusCard({ label, value, icon: Icon, variant, loading }: any) {
  const themes: any = {
    black: "bg-slate-900 border-slate-900 text-white shadow-slate-200",
    green: "bg-white border-slate-100 text-emerald-600",
    yellow: "bg-white border-slate-100 text-amber-600",
  };
  return (
    <div className={clsx("flex items-center gap-3 px-4 py-2 rounded-2xl border shadow-sm min-w-[140px]", themes[variant])}>
      <Icon size={18} className={variant === 'black' ? 'text-slate-400' : 'text-current'} />
      <div className="flex flex-col">
        <span className={clsx("text-[9px] font-black uppercase tracking-widest opacity-60", variant === 'black' ? 'text-slate-400' : 'text-slate-500')}>{label}</span>
        <span className="text-base font-black leading-none mt-1">
          {loading ? <Loader2 size={14} className="animate-spin" /> : (value ?? 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'In Transit': 'bg-blue-50 text-blue-700 border-blue-200',
    'default': 'bg-slate-50 text-slate-600 border-slate-100'
  };
  return (
    <span className={clsx("px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider", colors[status] || colors.default)}>
      {status}
    </span>
  );
}

function Th({ children, className }: any) {
  return <th className={clsx("px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400", className)}>{children}</th>;
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