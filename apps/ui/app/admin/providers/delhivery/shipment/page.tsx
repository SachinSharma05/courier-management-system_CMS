'use client';

import { useState } from 'react';
import { 
  Search, Download, FileUp, PlusCircle, MoreHorizontal, Eye, 
  Printer, XCircle, ChevronRight, Loader2, Calendar, Filter,
  ChevronsLeft, ChevronLeft, ChevronRight as ChevronRightIcon, ChevronsRight,
  CheckCircle2, Truck, Clock, AlertCircle
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

export default function DelhiveryShipmentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  const router = useRouter();

  const { data, isLoading, isPlaceholderData } = useProviderShipments({
    provider: 'delhivery',
    page,
    limit: 50,
    status,
    search,
  });

  // --- Pagination Logic ---
  const totalRecords = data?.meta.total || 0;
  const totalPages = data?.meta.totalPages || 1;
  const startRange = (page - 1) * 50 + 1;
  const endRange = Math.min(page * 50, totalRecords);

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise(res => setTimeout(res, 800)); 
    exportToCSV(data?.data || []);
    setIsExporting(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Delhivery Console</h1>
          <p className="text-xs text-slate-500 font-medium">Manage and track Delhivery network shipments</p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleExport} disabled={isExporting || !totalRecords} variant="outline" className="h-10 rounded-xl border-slate-200 gap-2 font-bold text-xs shadow-sm">
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Export
          </Button>
          <Button onClick={() => router.push("/admin/providers/delhivery/shipment/create/bulk")} className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 gap-2 h-10 text-xs font-bold">
            <FileUp size={14} /> Bulk
          </Button>
          <Button onClick={() => router.push("/admin/providers/delhivery/shipment/create")} className="rounded-xl bg-slate-900 hover:bg-black text-white gap-2 h-10 text-xs font-bold shadow-lg shadow-slate-200">
            <PlusCircle size={14} /> Create Shipment
          </Button>
        </div>
      </div>

      {/* --- SEARCH & FILTERS --- */}
      <Card className="p-1.5 border-none shadow-sm rounded-xl bg-white flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Search AWB, Customer, or Order ID..." 
            className="pl-10 h-10 border-none bg-transparent focus-visible:ring-0 text-sm font-medium"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex items-center gap-2 pr-2">
            <select 
            value={status} 
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="h-9 px-3 bg-slate-50 rounded-lg text-[10px] font-black text-slate-600 outline-none border-none cursor-pointer uppercase tracking-tight"
            >
                <option value="all">All Statuses</option>
                <option value="delivered">Delivered</option>
                <option value="in_transit">In Transit</option>
            </select>
            <div className="h-6 w-px bg-slate-200 mx-1" />
            <FilterButton label="Date Range" icon={<Calendar size={14} />} />
        </div>
      </Card>

      {/* --- SHIPMENT TABLE --- */}
      <Card className="border border-slate-100 shadow-2xl shadow-slate-200/40 rounded-2xl overflow-hidden bg-white relative">
        {isLoading && !data && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        )}
        
        <div className={clsx(
            "overflow-auto h-[600px] scrollbar-hide transition-opacity duration-300", 
            isPlaceholderData && "opacity-40"
        )}>
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-100">
              <tr className="text-slate-400">
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest">Order Identity</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest">Shipping Route</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest">Timeline</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-center">Live Status</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data?.data.map((s: any) => (
                <tr key={s.awb} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-mono font-bold text-slate-900 text-sm tracking-tighter">{s.awb}</span>
                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 w-fit px-1.5 rounded mt-1">REF: {s.reference_number}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-700 uppercase">{s.origin}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Pickup</span>
                      </div>
                      <ChevronRight size={12} className="text-slate-300 opacity-50" />
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-indigo-600 uppercase">{s.destination}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Drop</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-700">
                        {new Date(s.booked_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(s.booked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={s.current_status} />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <ShipmentActions />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- OPTIMIZED PAGINATION --- */}
        <div className="p-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-tight">
            Showing <span className="text-slate-900 font-black">{totalRecords === 0 ? 0 : startRange}–{endRange}</span> of <span className="text-slate-900 font-black">{totalRecords}</span> Ships
          </div>
          
          <div className="flex items-center gap-1">
            <PaginationButton 
              onClick={() => setPage(1)} 
              disabled={page === 1} 
              icon={<ChevronsLeft size={16} />} 
            />
            <PaginationButton 
              onClick={() => setPage(p => p - 1)} 
              disabled={page === 1} 
              icon={<ChevronLeft size={16} />} 
            />
            
            <div className="px-4 py-1.5 mx-1 bg-slate-900 text-white rounded-lg text-[11px] font-black shadow-lg flex items-center gap-2">
              <span className="opacity-50 font-medium">PAGE</span> {page} / {totalPages}
            </div>

            <PaginationButton 
              onClick={() => setPage(p => p + 1)} 
              disabled={page >= totalPages} 
              icon={<ChevronRightIcon size={16} />} 
            />
            <PaginationButton 
              onClick={() => setPage(totalPages)} 
              disabled={page >= totalPages} 
              icon={<ChevronsRight size={16} />} 
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

/* --- UI COMPONENTS --- */

function PaginationButton({ onClick, disabled, icon }: any) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      disabled={disabled}
      onClick={onClick}
      className="h-9 w-9 p-0 rounded-lg border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all"
    >
      {icon}
    </Button>
  );
}

function FilterButton({ label, icon = <Filter size={14} /> }: { label: string, icon?: any }) {
    return (
      <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-all text-[11px] font-black text-slate-600 uppercase tracking-tight">
        {icon}
        {label}
      </button>
    );
}

function StatusBadge({ status }: { status: string }) {
    const configs: any = {
      'Delivered': { class: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <CheckCircle2 size={12} /> },
      'In-Transit': { class: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: <Truck size={12} /> },
      'Pending': { class: 'bg-amber-50 text-amber-600 border-amber-100', icon: <Clock size={12} /> },
      'RTO': { class: 'bg-rose-50 text-rose-600 border-rose-100', icon: <AlertCircle size={12} /> },
    };
  
    const config = configs[status] || configs['Pending'];
  
    return (
      <div className={clsx(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider",
        config.class
      )}>
        {config.icon}
        {status}
      </div>
    );
}

function ShipmentActions() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-none">
            <MoreHorizontal size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-2 rounded-[1.2rem] shadow-2xl border-slate-100">
          <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 px-3 py-2 tracking-widest">Options</DropdownMenuLabel>
          <DropdownMenuItem className="rounded-lg gap-3 py-2.5 cursor-pointer font-bold text-xs"><Eye size={16} /> View Tracking</DropdownMenuItem>
          <DropdownMenuItem className="rounded-lg gap-3 py-2.5 cursor-pointer font-bold text-xs text-indigo-600"><Printer size={16} /> Print Label</DropdownMenuItem>
          <DropdownMenuSeparator className="bg-slate-50" />
          <DropdownMenuItem className="rounded-lg gap-3 py-2.5 cursor-pointer font-bold text-xs text-rose-600"><XCircle size={16} /> Cancel Order</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}

export function exportToCSV(shipments: any[]) {
    if (!shipments || shipments.length === 0) return;
    const headers = ["AWB", "Reference", "Origin", "Destination", "Status", "Booked At"];
    const csvRows = shipments.map(s => [
      s.awb, s.reference_number, s.origin, s.destination, s.current_status, new Date(s.booked_at).toLocaleString()
    ].map(value => `"${value}"`).join(","));
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `delhivery_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}