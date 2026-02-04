"use client";

import React, { useEffect, useRef, useState } from 'react';
import { 
  Package, Users, Activity, Download, Zap, Truck, Server, RefreshCw, PieChart, BarChart3, ShieldCheck,
  ClipboardCheck, MessageSquareWarning, UserCheck, 
  Clock,
  TrendingUp,
  AlertTriangle,
  Info,
  MapPin,
  X} from 'lucide-react';
import clsx from 'clsx';
import { 
  getDashboardSummary, 
  getProviderPerformance, 
  getShipmentAgeing, 
  getDailyBookingTrend, 
  getProviderShare, 
  getStuckShipments, 
  getYesterdayBookings, 
  StuckShipment
} from '@/lib/api/dashboard.api';

interface StuckDetailProps {
  shipment: StuckShipment;
  onClose: () => void;
}

export default function AdminDashboard() {
  const [data, setData] = useState<{
    summary: any;
    performance: any[];
    ageing: any;
    trends: any[];
    share: any[];
    stuck: any[];
    yesterday: any;
  } | null>(null);
  
  const fetchedRef = useRef(false);

  const [selectedStuck, setSelectedStuck] = useState<StuckShipment | null>(null);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    Promise.all([
      getDashboardSummary(),
      getProviderPerformance(),
      getShipmentAgeing(),
      getDailyBookingTrend(),
      getProviderShare(),
      getStuckShipments(),
      getYesterdayBookings()
    ])
    .then(([summary, performance, ageing, trends, share, stuck, yesterday]) => {
      setData({
        summary,
        performance,
        ageing,
        trends,
        share,
        stuck,
        yesterday
      });
    })
    .catch(console.error);
  }, []);

  if (!data) return <LoadingScreen />;

  return (
    <div className="p-4 space-y-4 bg-[#F8FAFC] min-h-screen font-sans">
      
      {/* ───────────────── HEADER: SYSTEM TELEMETRY ───────────────── */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between bg-white p-4 border border-slate-200 rounded-sm shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-slate-900 flex items-center justify-center text-white rounded-sm">
            <Server size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">Executive_Terminal</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" /> Node_Status: Active_Stream
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 lg:mt-0 text-[10px] font-bold text-slate-400 uppercase">
          <Clock size={12} /> Last_Sync: {new Date().toLocaleTimeString()}
        </div>
      </header>

      {/* ───────────────── 1. KPI GRID (Now includes Yesterday's Data) ───────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <KPICard label="Total_Volume" value={data.summary.totalShipments} icon={Package} color="border-slate-900" />
        <KPICard label="Yesterday" value={data.yesterday.total} icon={TrendingUp} color="border-emerald-500" trend="+4%" />
        <KPICard label="In_Transit" value={data.summary.inTransit} icon={Zap} color="border-amber-400" />
        <KPICard label="Delivered" value={data.summary.delivered} icon={Truck} color="border-blue-600" />
        <KPICard label="RTO_Volume" value={data.summary.rto} icon={ShieldCheck} color="border-rose-500" />
        <KPICard label="Active_Clients" value={data.summary.activeClients} icon={Users} color="border-indigo-600" />
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        
        {/* ───────────────── 2. CENTER STACK (Trends & Performance) ───────────────── */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* DAILY TREND MINI-CHART (Visual Representation) */}
          <div className="bg-white border border-slate-200 rounded-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <BarChart3 size={14} /> 7_Day_Booking_Trend
              </h2>
            </div>
            <div className="flex items-end gap-1 h-24">
              {data.trends.map((t, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div 
                    className="w-full bg-slate-100 group-hover:bg-indigo-500 transition-colors rounded-t-sm" 
                    style={{ height: `${(t.total / Math.max(...data.trends.map(x => x.total))) * 100}%` }}
                  />
                  <span className="text-[8px] font-bold text-slate-400">{t.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PERFORMANCE MATRIX */}
          <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
             <div className="bg-slate-900 p-3 flex justify-between">
                <h2 className="text-[10px] font-black text-white uppercase tracking-widest">Carrier_Performance_Matrix</h2>
                <span className="text-[9px] text-emerald-400 font-mono">LIVE_FEED</span>
             </div>
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-4 py-3">Carrier</th>
                    <th className="px-4 py-3">Vol</th>
                    <th className="px-4 py-3">Avg_TAT</th>
                    <th className="px-4 py-3">Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.performance.map((p, i) => (
                    <tr key={i} className="text-xs">
                      <td className="px-4 py-3 font-bold text-slate-900">{p.name}</td>
                      <td className="px-4 py-3 font-mono">{p.activeShipments}</td>
                      <td className="px-4 py-3 font-black">{p.tat || 0}d</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${p.healthScore}%` }} />
                          </div>
                          <span className="text-[9px] font-black">{p.healthScore}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>

        {/* ───────────────── 3. RIGHT STACK (Ageing & Alerts) ───────────────── */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* SHIPMENT AGEING WIDGET */}
          <div className="bg-white border border-slate-200 p-4 rounded-sm">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Inventory_Ageing</h2>
            <div className="space-y-4">
              <AgeingBar label="Fresh (< 24h)" value={data.ageing.fresh} color="bg-emerald-500" total={data.summary.totalShipments} />
              <AgeingBar label="24 - 48 Hours" value={data.ageing.aging_24_48} color="bg-amber-400" total={data.summary.totalShipments} />
              <AgeingBar label="Critical (48h+)" value={data.ageing.aging_48_plus} color="bg-rose-500" total={data.summary.totalShipments} />
            </div>
          </div>

          {/* STUCK SHIPMENTS ALERT BOX */}
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-700 flex items-center gap-2">
                <AlertTriangle size={14} /> Stuck_Shipments_Alert
              </h2>
              <span className="px-1.5 py-0.5 bg-rose-600 text-white text-[9px] font-black rounded-sm animate-pulse">
                {data.stuck.length}
              </span>
            </div>
            <div className="space-y-2 max-h-[250px] overflow-y-auto no-scrollbar">
              {data.stuck.map((s, i) => (
                <div 
                  key={i} 
                  // 1. Add the onClick event to set the selected shipment
                  onClick={() => setSelectedStuck(s)}
                  // 2. Add cursor-pointer and hover effects for better UX
                  className="bg-white p-2 border border-rose-100 rounded-sm flex justify-between items-center group cursor-pointer hover:border-rose-300 hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div>
                    <p className="text-[10px] font-black text-slate-900 group-hover:text-rose-600 transition-colors">
                      {s.awb}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">
                      {s.provider} • {s.current_status || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-500 uppercase">Last_Act</p>
                    <p className="text-[8px] font-bold text-rose-500">
                      {new Date(s.last_status_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 3. Render the Modal conditionally at the bottom of your component JSX */}
            {selectedStuck && (
              <StuckShipmentModal 
                shipment={selectedStuck} 
                onClose={() => setSelectedStuck(null)} 
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ───────────────── NEW SUB-COMPONENTS ───────────────── */

function AgeingBar({ label, value, color, total }: any) {
  const percentage = Math.round((value / total) * 100) || 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-[10px] font-black uppercase">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-900">{value} <span className="text-slate-400 font-mono">({percentage}%)</span></span>
      </div>
      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
        <div className={clsx("h-full transition-all duration-1000", color)} style={{ width: `${percentage}%` }} />
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

function KPICard({ label, value, icon: Icon, color }: any) {
  return (
    <div className={clsx("bg-white p-4 border-l-4 border rounded-sm shadow-sm", color)}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <Icon size={14} className="text-slate-300" />
      </div>
      <h3 className="text-2xl font-mono font-black text-slate-900 leading-none">{value}</h3>
    </div>
  );
}

export function StuckShipmentModal({ shipment, onClose }: StuckDetailProps) {
  // Mock detailed events - in a real app, you'd fetch this via getShipmentDetails(awb)
  const auditTrail = [
    { status: 'Arrived at Hub', location: 'Delhi_Main_Sorting', time: shipment.last_status_at },
    { status: 'In Transit', location: 'Enroute_to_Destination', time: '2024-03-20T10:00:00Z' },
    { status: 'Manifested', location: 'Origin_Warehouse', time: '2024-03-19T14:30:00Z' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="bg-rose-600 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-sm">
              <AlertTriangle className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xs font-black text-white uppercase tracking-widest">Investigation_Node</h2>
              <p className="text-[10px] text-rose-100 font-bold">AWB: {shipment.awb}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-rose-100 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* SHIPMENT METADATA */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase">Provider_Entity</p>
              <p className="text-xs font-bold text-slate-900">{shipment.provider}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase">Current_Status</p>
              <p className="text-xs font-bold text-rose-600">{shipment.current_status || 'STALL_DETECTED'}</p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* AUDIT TRAIL / TIMELINE */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} className="text-slate-400" /> Incident_Timeline
            </h3>
            
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:w-0.5 before:bg-slate-100">
              {auditTrail.map((event, idx) => (
                <div key={idx} className="relative pl-8 group">
                  <div className={clsx(
                    "absolute left-0 top-1 h-6 w-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm",
                    idx === 0 ? "bg-rose-500 animate-pulse" : "bg-slate-200"
                  )} />
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{event.status}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <MapPin size={10} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500">{event.location}</span>
                    </div>
                    <p className="text-[9px] font-mono text-slate-400 mt-1">
                      {new Date(event.time).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTION TOOLS */}
          <div className="pt-4 flex gap-2">
            <button className="flex-1 bg-slate-900 text-white py-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
              Escalate_to_{shipment.provider}
            </button>
            <button className="px-4 border border-slate-200 text-slate-600 rounded-sm hover:bg-slate-50">
              <Info size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}