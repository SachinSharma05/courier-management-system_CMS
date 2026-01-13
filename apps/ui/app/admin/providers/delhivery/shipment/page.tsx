'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  FileUp, 
  Download, 
  MoreHorizontal, 
  Eye, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Calendar,
  PlusCircle,
  XCircle,
  Printer,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useProviderShipments } from '@/hooks/useProvidersDetails';

export default function ShipmentsListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [isExporting, setIsExporting] = useState(false);

  const router = useRouter();

  const { data, isLoading } = useProviderShipments({
    provider: 'delhivery',
    page,
    limit: 20,
    status,
    search,
  });

  if (!data) return null;

  const handleExport = async () => {
    setIsExporting(true);
    
    // Artificial delay for UX feel, or you could fetch ALL data here
    await new Promise(res => setTimeout(res, 800)); 
    
    exportToCSV(data?.data || []);
    setIsExporting(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Shipment Log</h1>
          <p className="text-slate-500 font-medium">Manage and track all outgoing orders</p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={handleExport}
            disabled={isExporting || !data?.data.length}
            variant="outline" 
            className="h-12 px-6 rounded-2xl border-slate-200 hover:bg-slate-900 hover:text-white transition-all gap-2 font-bold shadow-sm">
            {isExporting ? (
            <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
            {isExporting ? "Preparing File..." : "Export CSV"}
          </Button>
          <Button 
            onClick={() => router.push("/admin/providers/delhivery/shipment/create/bulk")}
            className="rounded-xl bg-slate-900 hover:bg-black text-white gap-2 h-11 font-bold shadow-lg shadow-slate-200">
            <FileUp size={18} />
            Bulk Upload
          </Button>

          <Button 
            onClick={() => router.push("/admin/providers/delhivery/shipment/create")}
            className="rounded-xl bg-slate-900 hover:bg-black text-white gap-2 h-11 font-bold shadow-lg shadow-slate-200">
            <PlusCircle size={18} />
            Create Shipment
          </Button>
        </div>
      </div>

      {/* --- FILTER & SEARCH BAR --- */}
      <Card className="p-2 border-none shadow-xl shadow-slate-200/50 rounded-[1.5rem] bg-white">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search AWB, Customer, or Order ID..." 
              className="pl-12 h-12 border-none bg-transparent focus-visible:ring-0 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="h-10 w-px bg-slate-100 hidden md:block self-center" />
          <div className="flex items-center gap-2 p-1">
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="p-2 border rounded-xl"
            >
              <option value="all">All Statuses</option>
              <option value="delivered">Delivered</option>
              <option value="in_transit">In Transit</option>
            </select>
            <FilterButton label="Provider" />
            <FilterButton label="Date Range" icon={<Calendar size={14} />} />
          </div>
        </div>
      </Card>

      {/* --- SHIPMENT TABLE --- */}
      <Card className="border-none shadow-2xl shadow-slate-200/40 rounded-[2rem] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2 px-4">
            <thead>
              <tr className="text-slate-400">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Order Identity</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Shipping Route</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Timeline</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Live Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((s) => (
                <tr 
                  key={s.awb} 
                  className="group bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200"
                >
                  {/* ORDER IDENTITY */}
                  <td className="px-6 py-4 first:rounded-l-[1.5rem]">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono font-bold text-slate-900 tracking-tighter text-base">
                        {s.awb}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          REF: {s.reference_number}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* SHIPPING ROUTE */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-700 uppercase">{s.origin}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Pickup</span>
                      </div>
                      <div className="flex flex-col items-center px-2 opacity-30">
                        <div className="h-px w-8 bg-slate-400 relative">
                          <ChevronRight size={10} className="absolute -right-1 -top-[5px]" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900 uppercase">{s.destination}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Drop</span>
                      </div>
                    </div>
                  </td>

                  {/* TIMELINE */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">
                        {new Date(s.booked_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(s.booked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>

                  {/* LIVE STATUS */}
                  <td className="px-6 py-4">
                    <StatusBadge status={s.current_status} />
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-right last:rounded-r-[1.5rem]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="h-10 w-10 p-0 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-none"
                        >
                          <MoreHorizontal size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2 rounded-[1.2rem] shadow-2xl border-slate-100">
                        <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 px-3 py-2">Shipment Options</DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-lg gap-3 py-2.5 cursor-pointer font-bold">
                          <Eye size={16} className="text-slate-400" /> View Tracking
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg gap-3 py-2.5 cursor-pointer font-bold text-indigo-600 bg-indigo-50/50">
                          <Printer size={16} /> Print Label
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-50" />
                        <DropdownMenuItem className="rounded-lg gap-3 py-2.5 cursor-pointer font-bold text-rose-600">
                          <XCircle size={16} /> Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400">Showing {data?.meta.total} shipments</p>
          <div className="flex gap-2">
            <Button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              variant="outline" 
              size="sm" 
              className="rounded-lg h-8 px-3 font-bold">Prev</Button>
            <span className='h-8 px-3 font-bold'>{page}</span>
            <Button 
              onClick={() => setPage(p => p + 1)}
              variant="outline" 
              size="sm" 
              className="rounded-lg h-8 px-3 font-bold bg-white shadow-sm">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* --- SUB-COMPONENTS --- */

function FilterButton({ label, icon = <Filter size={14} /> }: { label: string, icon?: any }) {
  return (
    <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-xl transition-all text-sm font-bold text-slate-600">
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
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${config.class}`}>
      {config.icon}
      {status}
    </div>
  );
}

export function exportToCSV(shipments: any[]) {
  if (!shipments || shipments.length === 0) return;

  // 1. Define headers
  const headers = ["AWB", "Reference", "Origin", "Destination", "Status", "Booked At"];

  // 2. Map data to rows
  const csvRows = shipments.map(s => [
    s.awb,
    s.reference_number,
    s.origin,
    s.destination,
    s.current_status,
    new Date(s.booked_at).toLocaleString()
  ].map(value => `"${value}"`).join(",")); // Wrap in quotes to handle commas in addresses

  // 3. Combine headers and rows
  const csvContent = [headers.join(","), ...csvRows].join("\n");

  // 4. Create download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `shipments_export_${new Date().toISOString().split('T')[0]}.csv`);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}