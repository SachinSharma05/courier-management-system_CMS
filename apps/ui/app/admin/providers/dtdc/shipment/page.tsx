'use client';

import { useState } from 'react';
import { 
  Search, Filter, FileUp, Download, MoreHorizontal, Eye, Truck, 
  CheckCircle2, Clock, AlertCircle, Calendar, PlusCircle, XCircle, 
  Printer, ChevronRight, Loader2, MapPin, CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useProviderShipments } from '@/hooks/useProvidersDetails';
import clsx from 'clsx';

export default function ShipmentsListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  const router = useRouter();

  const { data, isLoading, isPlaceholderData } = useProviderShipments({
    provider: 'dtdc',
    page,
    limit: 20,
    status,
    search,
  });

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise(res => setTimeout(res, 800)); 
    exportToCSV(data?.data || []);
    setIsExporting(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Shipment Console</h1>
          <p className="text-slate-500 font-medium">Provider: <span className="text-indigo-600 font-bold">DTDC Express</span></p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleExport} disabled={isExporting || !data?.data.length} variant="outline" className="h-11 px-5 rounded-xl border-slate-200 gap-2 font-bold shadow-sm">
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Export
          </Button>
          <Button onClick={() => router.push("/admin/providers/dtdc/shipment/create")} className="rounded-xl bg-slate-900 hover:bg-black text-white gap-2 h-11 font-bold shadow-lg">
            <PlusCircle size={16} /> Create Shipment
          </Button>
        </div>
      </div>

      {/* --- SEARCH & FILTERS --- */}
      <Card className="p-2 border-none shadow-xl shadow-slate-200/50 rounded-2xl bg-white flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Search AWB or Reference..." 
            className="pl-12 h-12 border-none bg-transparent focus-visible:ring-0 font-medium"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex items-center gap-2 p-1">
          <select 
            value={status} 
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="h-10 px-3 bg-slate-50 rounded-lg text-xs font-bold text-slate-600 outline-none border-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Delivered">Delivered</option>
            <option value="In-Transit">In Transit</option>
          </select>
        </div>
      </Card>

      {/* --- SHIPMENT TABLE --- */}
      <Card className="border-none shadow-2xl shadow-slate-200/40 rounded-[2rem] overflow-hidden bg-white relative">
        {isLoading && !data && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        )}

        <div className={clsx("overflow-x-auto", isPlaceholderData && "opacity-40")}>
          <table className="w-full text-left border-separate border-spacing-y-2 px-4">
            <thead>
              <tr className="text-slate-400">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em]">Identity</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em]">Client</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em]">Route (Origin → Drop)</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-center">TAT / Move</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em]">Timelines</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em]">Live Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((s: any) => (
                <tr key={s.id} className="group bg-white border border-slate-100 shadow-sm hover:border-indigo-100 transition-all duration-200">
                  {/* IDENTITY */}
                  <td className="px-6 py-4 first:rounded-l-[1.5rem]">
                    <div className="flex flex-col">
                      <span className="font-mono font-bold text-slate-900 text-sm tracking-tighter">{s.awb}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">REF: {s.reference_number}</span>
                    </div>
                  </td>

                  {/* CLIENT */}
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-slate-900 text-sm tracking-tighter">{s.client}</span>
                  </td>
                  {/* ROUTE (ORIGIN & DESTINATION) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-700">{s.origin}</span>
                        <span className="text-[9px] font-bold text-slate-400">{s.origin_pincode}</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-300" />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-indigo-600">{s.destination}</span>
                        <span className="text-[9px] font-bold text-slate-400">{s.destination_pincode}</span>
                      </div>
                    </div>
                  </td>

                  {/* TAT & MOVEMENT */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-1">
                      {tatBadgeUI(s.tat_status)}
                      {moveBadgeUI(s.movement_status)}
                    </div>
                  </td>

                  {/* TIMELINES (BOOKED & LAST STATUS) */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-500 uppercase leading-none">Booked</span>
                          <span className="text-[10px] font-bold text-slate-700 mt-0.5">{formatDateTime(s.bookedAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-indigo-500" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-indigo-500 uppercase leading-none">Last Event</span>
                          <span className="text-[10px] font-bold text-slate-700 mt-0.5">{formatDateTime(s.lastUpdatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* LIVE STATUS */}
                  <td className="px-6 py-4">
                    <StatusBadge status={s.status} />
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-right last:rounded-r-[1.5rem]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-9 w-9 p-0 rounded-lg hover:bg-slate-900 hover:text-white transition-all">
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl shadow-2xl border-slate-100 font-bold">
                        <DropdownMenuItem className="rounded-lg gap-2 py-2 cursor-pointer"><Eye size={14} /> View Details</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg gap-2 py-2 cursor-pointer text-indigo-600"><Printer size={14} /> Print Label</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="rounded-lg gap-2 py-2 cursor-pointer text-rose-600"><XCircle size={14} /> Cancel</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION --- */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total: {data?.meta.total || 0} Ships</span>
          <div className="flex gap-2">
            <Button disabled={page === 1} onClick={() => setPage(p => p - 1)} variant="outline" size="sm" className="rounded-lg h-8 px-3 font-bold bg-white">Prev</Button>
            <div className="h-8 px-3 flex items-center bg-white border rounded-lg font-black text-[10px] text-slate-600">PAGE {page}</div>
            <Button disabled={page >= (data?.meta.totalPages || 1)} onClick={() => setPage(p => p + 1)} variant="outline" size="sm" className="rounded-lg h-8 px-3 font-bold bg-white">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* --- HELPERS --- */

function formatDateTime(dateStr: string) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function tatBadgeUI(t: string) {
  const styles: any = {
    "Delivered": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Sensitive": "bg-rose-600 text-white border-rose-700",
    "Critical": "bg-rose-100 text-rose-800 border-rose-200",
    "Warning": "bg-amber-100 text-amber-800 border-amber-200",
  };
  const style = styles[t] || "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span className={clsx("text-[8px] font-black uppercase px-2 py-0.5 rounded border tracking-tighter w-full text-center", style)}>
      {t || 'On Time'}
    </span>
  );
}

function moveBadgeUI(t: string) {
  return tatBadgeUI(t); // Identical styling rules
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    'Delivered': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'In-Transit': 'bg-indigo-50 text-indigo-600 border-indigo-100',
    'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
  };
  return (
    <div className={clsx("inline-flex items-center px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider", configs[status] || 'bg-slate-50 text-slate-500 border-slate-100')}>
      {status}
    </div>
  );
}

export function exportToCSV(shipments: any[]) {
  if (!shipments.length) return;
  const headers = ["AWB", "Origin", "Destination", "Status", "TAT", "Move", "Booked", "Last Update"];
  const rows = shipments.map(s => [
    s.awb, s.origin, s.destination, s.current_status, s.tat_status, s.movement_status, s.booked_at, s.last_status_at
  ].join(","));
  const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "shipment_log.csv";
  a.click();
}