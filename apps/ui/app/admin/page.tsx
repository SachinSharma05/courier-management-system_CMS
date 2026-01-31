"use client";

import React, { useEffect, useRef, useState } from 'react';
import { 
  Package, Users, AlertCircle, Activity, Clock, Download,
  TrendingUp, Zap, BarChart3, Timer, Truck, ChevronRight,
  Server, ShieldCheck, Database, RefreshCw, ArrowUpRight,
  AlertTriangle, CheckCircle2
} from 'lucide-react';
import clsx from 'clsx';
import { 
  getDashboardSummary,
  getProviderPerformance,
  getAlerts
 } from '@/lib/api/dashboard.api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    Promise.all([
      getDashboardSummary(),
      getProviderPerformance(),
      getAlerts(),
    ])
      .then(([summary, performanceData, alertsData]) => {
        setStats(summary);
        setProviders(performanceData);
        setAlerts(alertsData);
      })
      .catch(console.error);
  }, []);

  if (!stats) return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
            <RefreshCw className="animate-spin text-slate-400" size={32} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Booting_System_Core...</p>
        </div>
    </div>
  );

  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-screen font-sans">
      
      {/* ───────────────── TOP COMMAND BAR ───────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between bg-white p-4 border border-slate-200 rounded-sm shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-slate-900 flex items-center justify-center text-white rounded-sm shadow-lg">
            <Server size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-none uppercase tracking-tight">System_Command_Center</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" /> Platform_Node: 01-Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 lg:mt-0">
          <button className="flex items-center gap-2 rounded-sm bg-white border border-slate-200 px-4 py-2 text-[10px] font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest">
            <Download size={14} /> Export_Report
          </button>
          <button className="flex items-center gap-2 rounded-sm bg-indigo-600 px-4 py-2 text-[10px] font-black text-white shadow-md hover:bg-indigo-700 transition-all uppercase tracking-widest">
            <Activity size={14} /> System_Health
          </button>
        </div>
      </div>

      {/* ───────────────── EXECUTIVE KPI GRID ───────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <KPICard label="Total_Volume" value={stats.totalShipments} trend="+14.2%" icon={Package} color="border-blue-600" />
        <KPICard label="Active_Clients" value={stats.activeClients} icon={Users} color="border-purple-600" />
        <KPICard label="Avg_Delivery_SLA" value={`${stats.avgTat}d`} trend="-0.2d" icon={Zap} color="border-amber-600" />
        <KPICard label="Platform_Margin" value={`${stats.margin}%`} icon={TrendingUp} color="border-emerald-600" />
        <KPICard label="Critical_DLQ" value={stats.dlqCount} trend="High" icon={AlertCircle} color="border-rose-600" isWarning={stats.dlqCount > 0} />
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        
        {/* ───────────────── CARRIER PERFORMANCE TERMINAL ───────────────── */}
        <section className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between bg-slate-900 p-3 rounded-t-sm">
            <h2 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Truck size={14} /> Carrier_Performance_Matrix
            </h2>
            <span className="text-[9px] font-black text-slate-400 uppercase font-mono">Realtime_Update_Synced</span>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-b-sm shadow-sm overflow-hidden">
             <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <Th className="pl-6">Carrier_Entity</Th>
                        <Th>Load_Volume</Th>
                        <Th>Avg_TAT</Th>
                        <Th>RTO_Rate</Th>
                        <Th className="w-40">Node_Health</Th>
                        <Th className="pr-6"></Th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {providers.map((p, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors group">
                            <Td className="pl-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-slate-100 rounded-sm flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all text-xs">
                                        {p.name[0]}
                                    </div>
                                    <span className="font-black text-slate-900 uppercase tracking-tight text-xs">{p.name}</span>
                                </div>
                            </Td>
                            <Td><span className="font-mono font-bold text-slate-600">{p.activeShipments?.toLocaleString()}</span></Td>
                            <Td>
                                <div className="flex flex-col">
                                    <span className="font-mono font-black text-slate-900 text-xs">{p.tat}d</span>
                                    <span className="text-[9px] text-emerald-600 font-bold">-0.5 Target</span>
                                </div>
                            </Td>
                            <Td>
                                <span className={clsx(
                                    "font-mono font-black text-xs px-2 py-0.5 rounded-sm border",
                                    p.rto > 10 ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                )}>
                                    {p.rto}%
                                </span>
                            </Td>
                            <Td>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                                        <span>Status</span>
                                        <span>{Math.round(p.healthScore)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={clsx(
                                                "h-full transition-all",
                                                p.healthScore > 80 ? "bg-emerald-500" : "bg-amber-500"
                                            )}
                                            style={{ width: `${p.healthScore}%` }}
                                        />
                                    </div>
                                </div>
                            </Td>
                            <Td className="pr-6 text-right">
                                <button className="p-1.5 hover:bg-slate-100 rounded-sm text-slate-400 hover:text-slate-900 transition-all">
                                    <ArrowUpRight size={14} />
                                </button>
                            </Td>
                        </tr>
                    ))}
                </tbody>
             </table>
          </div>
        </section>

        {/* ───────────────── SYSTEM ALERTS AUDIT FEED ───────────────── */}
        <section className="lg:col-span-4 space-y-3">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
            <AlertTriangle size={14} /> Critical_Audit_Feed
          </h2>
          <div className="space-y-2">
            {alerts?.map((a: any, i: number) => (
              <AlertAuditItem key={i} alert={a} />
            ))}
          </div>
          <button className="w-full py-2 bg-white border border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 hover:bg-slate-50 transition-all rounded-sm">
            View_Full_Audit_Logs
          </button>
        </section>

      </div>
    </div>
  );
}

/* ───────────────── UI COMPONENTS ───────────────── */

function KPICard({ label, value, trend, icon: Icon, color, isWarning }: any) {
  return (
    <div className={clsx(
      "bg-white p-4 border-l-4 border rounded-sm shadow-sm transition-all hover:translate-y-[-2px]",
      color,
      isWarning ? "bg-rose-50/30 border-rose-500" : "border-slate-200"
    )}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <Icon size={14} className="text-slate-300" />
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-mono font-black text-slate-900 leading-none">{value}</h3>
        {trend && (
            <span className={clsx(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-sm",
                trend.includes('+') ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            )}>
                {trend}
            </span>
        )}
      </div>
    </div>
  );
}

function AlertAuditItem({ alert }: { alert: any }) {
  const isHigh = alert.type === 'DLQ' || alert.message.toLowerCase().includes('failed');
  return (
    <div className={clsx(
      "bg-white border p-3 rounded-sm relative group hover:shadow-md transition-all",
      isHigh ? "border-rose-100 bg-rose-50/20" : "border-slate-200"
    )}>
      <div className="flex justify-between items-center mb-2">
        <span className={clsx(
          "text-[8px] font-black uppercase px-2 py-0.5 rounded-sm border",
          isHigh ? "bg-rose-600 text-white border-rose-600" : "bg-slate-100 text-slate-600 border-slate-200"
        )}>
          {alert.type}
        </span>
        <span className="text-[9px] font-mono font-bold text-slate-400 flex items-center gap-1">
          <Clock size={10} /> {alert.time}
        </span>
      </div>
      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
        {alert.entity}
      </h4>
      <p className="text-[10px] text-slate-500 font-bold leading-tight uppercase tracking-tighter">
        {alert.message}
      </p>
    </div>
  );
}

function Th({ children, className }: any) {
  return <th className={clsx("px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400", className)}>{children}</th>;
}

function Td({ children, className }: any) {
  return <td className={clsx("px-4 py-3 text-sm", className)}>{children}</td>;
}