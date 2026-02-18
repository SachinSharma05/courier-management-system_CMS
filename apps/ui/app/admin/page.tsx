"use client";

import React, { useEffect, useState } from 'react';
import { 
  Package, Users, Zap, Truck, Server, RefreshCw, ShieldCheck,
  Clock, AlertTriangle, Info, X 
} from 'lucide-react';
import clsx from 'clsx';
import { 
  getDashboardSummary, 
  getProviderPerformance, 
  getShipmentAgeing, 
  getDailyBookingTrend, 
  getProviderShare, 
  getStuckShipments, 
  getYesterdayBookings,
} from '@/lib/api/dashboard.api';
import { DashboardData, StuckDetailProps, StuckShipment } from './interface/adminInterface';
import BookingTrendChart from '@/components/ui/BookingTrendChart';

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [range, setRange] = useState(7);
  const [selectedStuck, setSelectedStuck] = useState<StuckShipment | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getDashboardSummary(),
      getProviderPerformance(),
      getShipmentAgeing(),
      getDailyBookingTrend(range),
      getProviderShare(),
      getStuckShipments(),
      getYesterdayBookings(),
    ])
      .then(([summary, performance, ageing, trends, share, stuck, yesterday]) => {
        if (cancelled) return;
        setData({
          summary,
          performance,
          ageing,
          trends,
          share,
          stuck,
          yesterday,
        });
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, []); // ✅ run once

  useEffect(() => {
    if (!data) return;
    let cancelled = false;
    getDailyBookingTrend(range).then(trendData => {
      if (cancelled) return;
      setData(prev =>
        prev
          ? { ...prev, trends: trendData }
          : prev,
      );
    });

    return () => {
      cancelled = true;
    };
  }, [range]);

  if (!data) return <LoadingScreen />;

  return (
    <div className="p-2 space-y-2 bg-[#F8FAFC] min-h-screen text-slate-900">
      
      {/* ───────────────── HEADER: CLEAN & FLAT ───────────────── */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between bg-white p-5 border border-slate-200 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 rounded-lg">
            <Server size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Executive Overview</h1>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-1">
              <span className="h-2 w-2 bg-emerald-500 rounded-full" /> System Status: Operational
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 lg:mt-0 text-xs font-semibold text-slate-400">
          <Clock size={14} /> Refreshing in real-time • {new Date().toLocaleTimeString()}
        </div>
      </header>

      {/* ───────────────── 1. KPI GRID (FLAT DESIGN) ───────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard label="Total Volume" value={data.summary.totalShipments} icon={Package} color="border-slate-200" />
        <KPICard label="Delivered" value={data.summary.delivered} icon={Truck} color="border-blue-200" />
        <KPICard label="In Transit" value={data.summary.inTransit} icon={Zap} color="border-amber-200" />
        <KPICard label="RTO Volume" value={data.summary.rto} icon={ShieldCheck} color="border-rose-200" />
        <KPICard label="Active Clients" value={data.summary.activeClients} icon={Users} color="border-indigo-200" />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* ───────────────── 2. CENTER STACK (Trends & Performance) ───────────────── */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* DAILY TREND CHART (FLAT with Horizontal Scroll) */}
          <BookingTrendChart 
            data={data.trends} 
            range={range} 
            setRange={setRange} 
          />

          {/* PERFORMANCE TABLE (FLAT & MINIMAL) */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-sm font-bold text-slate-900">Carrier Performance Matrix</h2>
                <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded border border-emerald-100">LIVE</div>
             </div>
             <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase">
                  <tr>
                    <th className="px-5 py-3">Carrier</th>
                    <th className="px-5 py-3 text-right">Volume</th>
                    <th className="px-5 py-3 text-right">Avg TAT</th>
                    <th className="px-5 py-3 text-right">RTO</th>
                    <th className="px-5 py-3">Service Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.performance.map((p, i) => (
                    <tr key={i} className="text-sm hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-900">{p.name}</td>
                      <td className="px-5 py-4 text-right font-medium text-slate-600">{p.activeShipments}</td>
                      <td className="px-5 py-4 text-right font-bold text-slate-900">{p.tat || 0}d</td>
                      <td className="px-5 py-4 text-right font-bold text-slate-900">{p.rto || 0}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-24 bg-slate-100 rounded-full">
                            <div className="h-full bg-slate-900 rounded-full" style={{ width: `${p.healthScore}%` }} />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{p.healthScore}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>

        {/* ───────────────── 3. RIGHT STACK (Ageing & Alerts) ───────────────── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SHIPMENT AGEING (CLEAN BARS) */}
          <div className="bg-white border border-slate-200 p-5 rounded-lg">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Inventory Ageing</h2>
            <div className="space-y-6">
              <AgeingBar 
                label="Fresh (< 24h)" 
                value={data.ageing.fresh} 
                color="bg-emerald-500" 
                total={data.summary.totalShipments} />
              <AgeingBar 
                label="Pending (24 - 48h)" 
                value={data.ageing.aging_24_48} 
                color="bg-slate-300" 
                total={data.summary.totalShipments} />
              <AgeingBar 
                label="Critical (48h+)" 
                value={data.ageing.aging_48_plus} 
                color="bg-rose-500" 
                total={data.summary.totalShipments} />
            </div>
          </div>

          {/* STUCK SHIPMENTS ALERT (FLAT RED STYLE) */}
          <div className="bg-white border border-rose-200 p-5 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-rose-600 flex items-center gap-2">
                <AlertTriangle size={18} /> Stuck Shipments
              </h2>
              <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded">
                {data.stuck.length} Alerts
              </span>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {data.stuck.map((s, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedStuck(s)}
                  className="bg-white p-3 border border-slate-100 rounded-md flex justify-between items-center group cursor-pointer hover:border-rose-200 transition-all active:bg-slate-50"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                      {s.awb}
                    </p>
                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                      {s.provider} • {s.current_status || 'Stalled'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-rose-500">
                      {new Date(s.last_status_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL LAYER */}
      {selectedStuck && (
        <StuckShipmentModal shipment={selectedStuck} onClose={() => setSelectedStuck(null)} />
      )}
    </div>
  );
}

/* ───────────────── UPDATED SUB-COMPONENTS ───────────────── */

function KPICard({ label, value, icon: Icon, color }: { label: string, value: number, icon: React.ComponentType<{ size: number }>, color: string }) {
  return (
    <div className={clsx("bg-white p-5 border border-slate-200 rounded-xl hover:border-slate-400 transition-colors", color)}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-bold text-slate-400">{label}</p>
        <Icon size={16} />
      </div>
      <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value.toLocaleString()}</h3>
    </div>
  );
}

function AgeingBar({ label, value, color, total }: { label: string, value: number, color: string, total: number }) {
  const percentage = Math.round((value / total) * 100) || 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs font-bold">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-900">{value} <span className="text-slate-400 ml-1">({percentage}%)</span></span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={clsx("h-full", color)} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export function StuckShipmentModal({ shipment, onClose }: StuckDetailProps) {
  // Logic remains identical, UI flattened
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-white border-b border-slate-100 p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-rose-50 text-rose-600 flex items-center justify-center rounded-lg">
                <AlertTriangle size={20} />
             </div>
             <div>
               <h2 className="text-sm font-bold text-slate-900">Shipment Investigation</h2>
               <p className="text-xs text-slate-500">AWB: {shipment.awb}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Current Carrier</p>
              <p className="text-sm font-bold text-slate-900">{shipment.provider}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Last Known Status</p>
              <p className="text-sm font-bold text-rose-600">{shipment.current_status || 'No Response'}</p>
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button className="flex-1 bg-slate-900 text-white py-3 rounded-lg text-xs font-bold hover:bg-black transition-all">Escalate Issue</button>
            <button className="px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50"><Info size={20} className="text-slate-400" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
            <RefreshCw className="animate-spin text-indigo-500" size={32} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synchronizing_Core_Data...</p>
        </div>
    </div>
  );
}