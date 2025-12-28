"use client";

import { 
  Plus, Upload, XCircle, Printer, Calculator, 
  MapPin, AlertTriangle, ChevronRight,
  TrendingUp, TrendingDown, Package, CheckCircle2,
  Truck, RotateCcw, RefreshCw
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';

export default function ProviderOperationsPage() {
  const [provider, setProvider] = useState('Delhivery');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState("12:05 PM");

  const { data, isLoading } = useQuery({
    queryKey: ['provider-stats', provider],
    queryFn: () => api.get(`/admin/providers/stats/${provider}/stats`).then(r => r.data),
    enabled: !!provider,
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Provider Operations</h1>
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-tight">
                Last Sync: {lastSync}
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium">Manage logistics execution for {provider}</p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw size={14} className={clsx(isRefreshing && "animate-spin text-indigo-600")} />
            Refresh Now
          </button>
          
          <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block" />

          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {['Delhivery', 'DTDC', 'Maruti'].map((p) => (
              <button
                key={p}
                onClick={() => setProvider(p)}
                className={clsx(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  provider === p 
                    ? "bg-white shadow-sm text-slate-900 border border-slate-200/50" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ───────────────── STATS ROW ───────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard label="Total Shipments" value={data?.total} isLoading={isLoading} icon={<Package className="text-indigo-600" size={20} />} trend="+12%" trendType="up" />
        <StatCard label="Delivered" value={data?.delivered} isLoading={isLoading} icon={<CheckCircle2 className="text-emerald-600" size={20} />} trend="+5.4%" trendType="up" />
        <StatCard label="In-Transit" value={data?.inTransit} isLoading={isLoading} icon={<Truck className="text-amber-600" size={20} />} trend="-2.1%" trendType="down" />
        <StatCard label="RTO / Returns" value={data?.rto} isLoading={isLoading} icon={<RotateCcw className="text-rose-600" size={20} />} trend="+0.5%" trendType="neutral" isWarning />
        <StatCard label="NDR" value={data?.ndr} isLoading={isLoading} icon={<AlertTriangle className="text-red-600" size={20} />} trend="+0.2%" trendType="up" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* LEFT: STATUS DISTRIBUTION & OPS */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* New Distribution Widget */}
          {!isLoading && data && <StatusDistributionWidget data={data} />}
          {isLoading && <div className="h-64 bg-slate-50 rounded-[2.5rem] animate-pulse" />}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <OpCard title="Create Shipment" desc="Manual single entry" icon={<Plus size={24}/>} isPrimary />
            <OpCard title="Bulk Upload" desc="CSV / Manifest file" icon={<Upload size={24}/>} />
            <OpCard title="Print Center" desc="Labels & Invoices" icon={<Printer size={24}/>} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6">
                <Calculator size={18} className="text-indigo-600" /> Cost Estimator
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Origin" className="bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 ring-indigo-500/20 outline-none" />
                  <input placeholder="Dest" className="bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 ring-indigo-500/20 outline-none" />
                </div>
                <button className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">Calculate Freight</button>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6">
                <MapPin size={18} className="text-emerald-600" /> Serviceability
              </h3>
              <div className="space-y-4">
                <input placeholder="Check Pincode TAT" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm outline-none focus:ring-2 ring-emerald-500/20" />
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[10px] font-bold text-emerald-700 uppercase">
                  Serviceable: Est 48hrs
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: NDR & CANCELLATION */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-rose-50/20">
              <h3 className="font-bold text-rose-700 flex items-center gap-2">
                <AlertTriangle size={18} /> NDR Actions
              </h3>
              <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">12 URGENT</span>
            </div>
            <div className="divide-y divide-slate-50">
              <NDRItem awb="AWB-923841" reason="Door Locked" />
              <NDRItem awb="AWB-923112" reason="Refused by Cust" />
            </div>
          </div>

          <div className="bg-slate-950 rounded-[2rem] p-8 text-white">
            <h4 className="font-bold flex items-center gap-2 mb-4"><XCircle className="text-rose-500" size={18} /> Cancel Order</h4>
            <div className="flex gap-2">
              <input placeholder="AWB No." className="bg-slate-900 border-slate-800 rounded-xl px-4 py-2 text-xs w-full" />
              <button className="bg-rose-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, trend, trendType, isWarning, isLoading }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
        {!isLoading && (
          <div className={clsx(
            "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg",
            trendType === 'up' ? "bg-emerald-50 text-emerald-600" : 
            trendType === 'down' ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-500"
          )}>
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        {isLoading ? (
          <div className="h-8 w-20 bg-slate-100 animate-pulse rounded-lg mt-1" />
        ) : (
          <h3 className={clsx("text-2xl font-black mt-1", isWarning ? "text-rose-600" : "text-slate-900")}>
            {value?.toLocaleString() || 0}
          </h3>
        )}
      </div>
    </div>
  );
}

function StatusDistributionWidget({ data }: { data: any }) {
  const getWidth = (val: number) => data.total > 0 ? (val / data.total) * 100 : 0;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Status Distribution</h3>
          <p className="text-xs text-slate-400 font-medium">Detailed breakdown of {data.provider} lifecycle</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-indigo-600">{data.total?.toLocaleString()}</span>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Units</p>
        </div>
      </div>

      <div className="h-4 w-full flex rounded-full overflow-hidden bg-slate-100 mb-8">
        <div style={{ width: `${getWidth(data.delivered)}%` }} className="bg-emerald-500 h-full transition-all duration-500" />
        <div style={{ width: `${getWidth(data.inTransit)}%` }} className="bg-amber-500 h-full transition-all duration-500" />
        <div style={{ width: `${getWidth(data.ndr)}%` }} className="bg-rose-500 h-full transition-all duration-500" />
        <div style={{ width: `${getWidth(data.rto)}%` }} className="bg-slate-800 h-full transition-all duration-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {data.breakdown?.map((item: any, idx: number) => (
          <div key={idx} className="flex justify-between items-center py-2.5 border-b border-slate-50 group hover:bg-slate-50 px-2 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className={clsx(
                "h-2 w-2 rounded-full",
                item.group === 'delivered' ? "bg-emerald-500" :
                item.group === 'ndr' ? "bg-rose-500" :
                item.group === 'rto' ? "bg-slate-800" : "bg-amber-500"
              )} />
              <span className="text-xs font-bold text-slate-600 truncate max-w-[180px]">{item.label}</span>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-xs font-black text-slate-900">{item.value?.toLocaleString()}</span>
               <span className="text-[10px] font-bold text-slate-300 w-8">{Math.round(getWidth(item.value))}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OpCard({ title, desc, icon, isPrimary }: any) {
  return (
    <div className={clsx(
      "p-6 rounded-[2rem] border cursor-pointer transition-all hover:translate-y-[-4px] active:scale-95 group shadow-sm",
      isPrimary ? "bg-indigo-600 border-transparent text-white shadow-xl shadow-indigo-100" : "bg-white border-slate-100"
    )}>
      <div className={clsx("h-12 w-12 rounded-xl flex items-center justify-center mb-4", isPrimary ? "bg-white/20" : "bg-slate-50 text-slate-400 group-hover:text-indigo-600")}>
        {icon}
      </div>
      <h4 className="font-bold tracking-tight">{title}</h4>
      <p className={clsx("text-[10px] font-medium mt-1", isPrimary ? "text-indigo-100" : "text-slate-400")}>{desc}</p>
    </div>
  );
}

function NDRItem({ awb, reason }: any) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
      <div>
        <p className="text-xs font-bold text-slate-900">{awb}</p>
        <p className="text-[10px] font-bold text-rose-500 uppercase">{reason}</p>
      </div>
      <ChevronRight size={14} className="text-slate-200 group-hover:text-indigo-600" />
    </div>
  );
}