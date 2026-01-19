'use client';

import { useState } from 'react';
import { 
  Search, Download, FileUp, PlusCircle, MoreHorizontal, Eye, 
  Printer, XCircle, ChevronRight, Loader2,
  ChevronsLeft, ChevronLeft, ChevronRight as ChevronRightIcon, ChevronsRight
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
    limit: 50, // Updated to 50 records
    status,
    search,
  });

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise(res => setTimeout(res, 800)); 
    exportToCSV(data?.data || []);
    setIsExporting(false);
  };

  // --- Pagination Logic ---
  const totalRecords = data?.meta.total || 0;
  const totalPages = data?.meta.totalPages || 1;
  const startRange = (page - 1) * 50 + 1;
  const endRange = Math.min(page * 50, totalRecords);

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Shipment Log</h1>
          <p className="text-xs text-slate-500 font-medium">DTDC Express Network Tracking</p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleExport} disabled={isExporting || !totalRecords} variant="outline" className="h-10 rounded-xl border-slate-200 gap-2 font-bold text-xs shadow-sm">
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Export
          </Button>
          <Button onClick={() => router.push("/admin/providers/dtdc/shipment/create/bulk")} className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 gap-2 h-10 text-xs font-bold">
            <FileUp size={14} /> Bulk
          </Button>
          <Button onClick={() => router.push("/admin/providers/dtdc/shipment/create")} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-10 text-xs font-bold shadow-lg shadow-indigo-100">
            <PlusCircle size={14} /> Create Shipment
          </Button>
        </div>
      </div>

      {/* --- SEARCH & FILTERS --- */}
      <Card className="p-1.5 border-none shadow-sm rounded-xl bg-white flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Search AWB or Reference..." 
            className="pl-10 h-10 border-none bg-transparent focus-visible:ring-0 text-sm font-medium"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select 
          value={status} 
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="h-10 px-3 bg-slate-50 rounded-lg text-[11px] font-black text-slate-600 outline-none border-none cursor-pointer uppercase"
        >
          <option value="all">All Statuses</option>
          <option value="Delivered">Delivered</option>
          <option value="In-Transit">In Transit</option>
        </select>
      </Card>

      {/* --- SHIPMENT TABLE --- */}
      <Card className="border border-slate-100 shadow-2xl shadow-slate-200/40 rounded-2xl overflow-hidden bg-white relative">
        {isLoading && !data && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        )}

        {/* FIXED HEIGHT SCROLLABLE CONTAINER */}
        <div className={clsx(
            "overflow-auto h-[600px] scrollbar-hide transition-opacity duration-300", 
            isPlaceholderData && "opacity-40"
        )}>
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-100">
              <tr className="text-slate-400">
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest">Identity</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest">Client</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest">Route</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-center">Status Indicators</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest">Timelines</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest">Current Status</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data?.data.map((s: any) => (
                <tr key={s.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex flex-col">
                      <span className="font-mono font-bold text-slate-900 text-xs">{s.awb}</span>
                      <span className="text-[10px] font-bold text-slate-400">REF: {s.reference_number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-[11px] font-black text-slate-600 uppercase">
                    {s.client}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-700">{s.origin}</span>
                        <span className="text-[9px] font-bold text-slate-400">{s.origin_pincode}</span>
                      </div>
                      <ChevronRight size={12} className="text-slate-300" />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-indigo-600">{s.destination}</span>
                        <span className="text-[9px] font-bold text-slate-400">{s.destination_pincode}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col items-center gap-1">
                      {tatBadgeUI(s.tat_status)}
                      {moveBadgeUI(s.movement_status)}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-400 w-10">BOOKED:</span>
                        <span className="text-[10px] font-bold text-slate-700">{formatDateTime(s.bookedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-indigo-400 w-10">UPDATE:</span>
                        <span className="text-[10px] font-bold text-slate-700">{formatDateTime(s.lastUpdatedAt)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <ShipmentActions />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- OPTIMIZED PAGINATION --- */}
        <div className="p-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-slate-500">
            Showing <span className="text-slate-900 font-black">{totalRecords === 0 ? 0 : startRange}–{endRange}</span> of <span className="text-slate-900 font-black">{totalRecords}</span> records
          </div>
          
          <div className="flex items-center gap-1">
            <PaginationButton 
              onClick={() => setPage(1)} 
              disabled={page === 1} 
              icon={<ChevronsLeft size={16} />} 
              label="First"
            />
            <PaginationButton 
              onClick={() => setPage(p => p - 1)} 
              disabled={page === 1} 
              icon={<ChevronLeft size={16} />} 
              label="Prev"
            />
            
            <div className="px-4 py-1.5 mx-1 bg-slate-900 text-white rounded-lg text-[11px] font-black shadow-lg">
              {page} / {totalPages}
            </div>

            <PaginationButton 
              onClick={() => setPage(p => p + 1)} 
              disabled={page >= totalPages} 
              icon={<ChevronRightIcon size={16} />} 
              label="Next"
            />
            <PaginationButton 
              onClick={() => setPage(totalPages)} 
              disabled={page >= totalPages} 
              icon={<ChevronsRight size={16} />} 
              label="Last"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

/* --- COMPONENTS & HELPERS --- */

function PaginationButton({ onClick, disabled, icon, label }: any) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      disabled={disabled}
      onClick={onClick}
      className="h-9 px-2 rounded-lg border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all"
    >
      {icon}
    </Button>
  );
}

function formatDateTime(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function tatBadgeUI(t: string) {
  const styles: any = {
    "Delivered": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Sensitive": "bg-rose-600 text-white border-rose-700",
    "Critical": "bg-rose-100 text-rose-800 border-rose-200",
    "Warning": "bg-amber-100 text-amber-800 border-amber-200",
  };
  return (
    <span className={clsx("text-[8px] font-black uppercase px-2 py-0.5 rounded border tracking-tighter w-20 text-center inline-block", styles[t] || "bg-slate-100 text-slate-600 border-slate-200")}>
      {t || 'Normal'}
    </span>
  );
}

function moveBadgeUI(t: string) { return tatBadgeUI(t); }

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    'Delivered': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'In-Transit': 'bg-indigo-50 text-indigo-600 border-indigo-200',
    'Pending': 'bg-amber-50 text-amber-600 border-amber-200',
  };
  return (
    <div className={clsx("inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-widest", configs[status] || 'bg-slate-50 text-slate-500 border-slate-100')}>
      {status}
    </div>
  );
}

function ShipmentActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-slate-900 hover:text-white">
          <MoreHorizontal size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-xl font-bold">
        <DropdownMenuItem className="text-xs gap-2 py-2"><Eye size={14} /> View</DropdownMenuItem>
        <DropdownMenuItem className="text-xs gap-2 py-2 text-indigo-600"><Printer size={14} /> Label</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs gap-2 py-2 text-rose-600"><XCircle size={14} /> Void</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function exportToCSV(shipments: any[]) {
  if (!shipments.length) return;
  const headers = ["AWB", "Reference", "Origin", "Destination", "Status"];
  const rows = shipments.map(s => [s.awb, s.reference_number, s.origin, s.destination, s.current_status].join(","));
  const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `shipments_${new Date().toISOString()}.csv`;
  a.click();
}