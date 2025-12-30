'use client';

import { 
  Search, Calendar, Download, Plus, 
  AlertCircle, Clock, CheckCircle2, Package,
  ChevronLeft, ChevronRight, Loader2,
  Box
} from 'lucide-react';
import clsx from 'clsx';
import { useConsignments } from '@/hooks/useConsignments';
import { useClients } from '@/hooks/useClients';
import { useProviders } from '@/hooks/useProviders';
import { useEffect, useState, useMemo } from 'react';
import { Select } from '@/components/Select';
import { useDebounce } from '@/hooks/useDebounce';
import { useConsignmentsSummary } from '@/hooks/useConsignmentsSummary';

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

  const exportCSV = () => {
    const params = new URLSearchParams();
    Object.entries(normalizedFilters).forEach(([key, val]) => {
      if (val) params.append(key, String(val));
    });
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/admin/consignments/export?${params.toString()}`, '_blank');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] p-6 space-y-4 overflow-hidden bg-slate-50/30">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Box size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Consignments</h1>
            <p className="text-sm text-slate-500 font-medium">Global shipment tracking & management.</p>
          </div>
        </div>
        
        {/* COMPACT STATS ROW */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <StatusCard label="Total" value={summary?.total} icon={Package} variant="black" loading={isSummaryLoading} />
          <StatusCard label="Delivered" value={summary?.delivered} icon={CheckCircle2} variant="green" loading={isSummaryLoading} />
          <StatusCard label="In Transit" value={summary?.pending} icon={Clock} variant="yellow" loading={isSummaryLoading} />
          <StatusCard label="RTO" value={summary?.rto} icon={AlertCircle} variant="red" loading={isSummaryLoading} />
          
          <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block" />
          
          <div className="flex items-center gap-1.5">
            <button onClick={exportCSV} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all"><Download size={15} /> Download Excel</button>
          </div>
        </div>
      </div>

      {/* ───────────────── FILTERS ───────────────── */}
      <div className="shrink-0 rounded-xl bg-white p-3 shadow-sm border border-slate-200/60 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            placeholder="Search AWB..."
            value={filters.awb}
            onChange={e => setFilters(f => ({ ...f, awb: e.target.value }))}
            className="w-full rounded-lg border-slate-200 bg-slate-50 pl-9 pr-4 py-1.5 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none border"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Select label="Client" value={filters.clientId} onChange={v => setFilters(f => ({ ...f, clientId: v }))}>
            <option value="">All Clients</option>
            {clients?.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
          </Select>
          <Select label="Provider" value={filters.provider} onChange={v => setFilters(f => ({ ...f, provider: v }))}>
            <option value="">All Providers</option>
            {providers?.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </Select>
          <Select label="Status" value={filters.status} onChange={v => setFilters(f => ({ ...f, status: v }))}>
            <option value="">Status</option>
            <option value="Delivered">Delivered</option>
            <option value="In Transit">In Transit</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="RTO In Transit">RTO</option>
          </Select>
          
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1.5 border border-slate-200">
            <Calendar size={13} className="text-slate-400" />
            <input type="date" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value}))} className="bg-transparent text-[10px] font-bold outline-none text-slate-600 w-24" />
            <div className="h-3 w-px bg-slate-300" />
            <input type="date" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value}))} className="bg-transparent text-[10px] font-bold outline-none text-slate-600 w-24" />
          </div>
        </div>
      </div>

      {/* ───────────────── TABLE AREA ───────────────── */}
      <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm relative overflow-hidden">
        
        {/* Anti-Flicker Progress Bar */}
        {(isLoading || isFetching) && (
          <div className="absolute top-0 left-0 w-full h-0.5 z-50 bg-indigo-50 overflow-hidden">
            <div className="h-full bg-indigo-500 animate-infinite-loading origin-left" />
          </div>
        )}

        <div className="flex-1 overflow-auto no-scrollbar relative">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="sticky top-0 z-20 bg-slate-50/90 backdrop-blur-md">
              <tr>
                <Th className="border-b">AWB Number</Th>
                <Th className="border-b">Details</Th>
                <Th className="border-b">Status</Th>
                <Th className="border-b">Timestamps</Th>
                <Th className="border-b">Route</Th>
                <Th className="border-b">TAT/Movement</Th>
              </tr>
            </thead>
            <tbody className={clsx(
              "divide-y divide-slate-100 transition-all duration-300",
              (isLoading || isFetching) ? "opacity-40 blur-[1px]" : "opacity-100"
            )}>
              {data?.data.map((c) => (
                <tr key={c.id} className="group hover:bg-slate-50/50 transition-colors">
                  <Td><span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-[10px] border border-indigo-100">{c.awb}</span></Td>
                  <Td>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-xs">{c.client}</span>
                      <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">{c.provider}</span>
                    </div>
                  </Td>
                  <Td><StatusBadge status={c.status} /></Td>
                  <Td>
                    <div className="flex flex-col text-[10px] text-slate-500 gap-0.5">
                      <span className="font-semibold text-slate-700">Booked: {new Date(c.bookedAt).toLocaleDateString()}</span>
                      <span>Update: {new Date(c.lastUpdatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2 text-[10px] font-bold">
                      <span className="text-slate-400">{c.origin}</span>
                      <div className="h-px w-3 bg-slate-300" />
                      <span className="text-indigo-500">{c.destination}</span>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex gap-1.5">
                      {tatBadgeUI(c.tat)}
                      {moveBadgeUI(c.movement)}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {data?.data.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Package size={40} className="opacity-20 mb-2" />
              <p className="text-sm font-medium">No results found for current filters</p>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="shrink-0 border-t border-slate-100 px-6 py-3 flex items-center justify-between bg-slate-50/50 backdrop-blur-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, data?.meta.total ?? 0)} of {data?.meta.total}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all"><ChevronLeft size={14} /></button>
            <div className="px-3 py-1 text-xs font-black bg-white border border-slate-200 rounded-md">{page}</div>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= (data?.meta.pages ?? 1)} className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── MINI COMPONENTS ───────────────── */

function StatusCard({ label, value, icon: Icon, variant, loading }: any) {
  const themes: any = {
    black: "bg-slate-900 border-slate-900 text-white",
    green: "bg-white border-slate-200 text-emerald-600",
    yellow: "bg-white border-slate-200 text-amber-600",
    red: "bg-white border-slate-200 text-red-600",
  };
  return (
    <div className={clsx("flex items-center gap-2.5 px-3 py-1.5 rounded-lg border shadow-sm min-w-[120px]", themes[variant])}>
      <Icon size={14} className={variant === 'black' ? 'text-slate-400' : 'text-current'} />
      <div className="flex flex-col">
        <span className={clsx("text-[9px] font-bold uppercase tracking-tighter opacity-70", variant === 'black' ? 'text-slate-400' : 'text-slate-500')}>{label}</span>
        <span className="text-sm font-black leading-none mt-0.5">
          {loading ? <Loader2 size={12} className="animate-spin" /> : (value ?? 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'In Transit': 'bg-blue-50 text-blue-700 border-blue-100',
    'default': 'bg-slate-50 text-slate-600 border-slate-100'
  };
  return (
    <span className={clsx("px-2 py-0.5 rounded-full border text-[10px] font-bold", colors[status] || colors.default)}>
      {status}
    </span>
  );
}

function Th({ children, className }: any) {
  return <th className={clsx("px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400", className)}>{children}</th>;
}

function Td({ children }: any) {
  return <td className="px-4 py-3 text-sm">{children}</td>;
}

// function tatBadgeUI(t: string) {
//   const styles: any = {
//     "Delivered": "bg-green-100 text-green-700",
//     "Sensitive": "bg-red-600 text-white",
//     "Critical": "bg-red-200 text-red-800",
//     "Warning": "bg-yellow-200 text-yellow-800",
//     "default": "bg-slate-100 text-slate-600"
//   };
//   return <span className={clsx("px-1.5 py-0.5 rounded text-[9px] font-bold", styles[t] || styles.default)}>{t || 'On Time'}</span>;
// }

// function moveBadgeUI(t: string) {
//   return <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">{t || 'Surface'}</span>;
// }

function tatBadgeUI(t: string) {
    switch (t) {
      case "Delivered":
        return <span className="text-[9px] px-2 py-0.5 bg-green-100 text-green-700 rounded">Delivered</span>;
      case "Sensitive":
        return <span className="text-[9px] px-2 py-0.5 bg-red-600 text-white rounded">Sensitive</span>;
      case "Critical":
        return <span className="text-[9px] px-2 py-0.5 bg-red-200 text-red-800 rounded">Critical</span>;
      case "Warning":
        return <span className="text-[9px] px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded">Warning</span>;
      default:
        return <span className="text-[9px] px-2 py-0.5 bg-slate-200 text-slate-800 rounded">On Time</span>;
    }
  }

  function moveBadgeUI(t: string) {
    return tatBadgeUI(t); // identical styling rules
  }