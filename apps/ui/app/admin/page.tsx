"use client";

import React, { useEffect, useRef, useState } from 'react';
import { 
  Package, Users, Activity, Download, Zap, Truck, Server, RefreshCw, PieChart, BarChart3, ShieldCheck,
  ClipboardCheck,
  MessageSquareWarning,
  UserCheck
} from 'lucide-react';
import clsx from 'clsx';
import { getDashboardSummary, getProviderPerformance } from '@/lib/api/dashboard.api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    Promise.all([
      getDashboardSummary(),
      getProviderPerformance(),
    ])
      .then(([summary, performanceData]) => {
        setStats(summary);
        // ───────────────── FORCE ALL CARRIERS TO SHOW ─────────────────
        const carrierList = ['DTDC', 'Delhivery', 'Maruti'];
        const mappedProviders = carrierList.map(name => {
          const existing = performanceData.find((p: any) => 
            p.name.toLowerCase() === name.toLowerCase()
          );
          return existing || { 
            name, 
            activeShipments: 0, 
            tat: 0, 
            rto: 0, 
            healthScore: 0,
            statusMix: { delivered: 0, transit: 0, rto: 0, ndr: 0 } 
          };
        });
        setProviders(mappedProviders);
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
            <h1 className="text-lg font-black text-slate-900 leading-none uppercase tracking-tight">Executive_Terminal</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" /> Telemetry: Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 lg:mt-0">
          <button className="flex items-center gap-2 rounded-sm bg-white border border-slate-200 px-4 py-2 text-[10px] font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest">
            <Download size={14} /> System_Snapshot
          </button>
        </div>
      </div>

      {/* ───────────────── 1. UPDATED EXECUTIVE KPI GRID ───────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <KPICard label="Total_Volume" value={stats.totalShipments} icon={Package} color="border-slate-900" />
        <KPICard label="Total_Clients" value={stats.activeClients} icon={Users} color="border-blue-600" />
        <KPICard label="Total_Delivered" value={stats.delivered || 0} icon={Truck} color="border-orange-500" />
        <KPICard label="Total_InTransit" value={stats.inTransit || 0} icon={Zap} color="border-amber-400" />
        <KPICard label="Total_RTO" value={stats.rto || 0} icon={ShieldCheck} color="border-indigo-600" />
      </section>

      

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        
        {/* ───────────────── 2. CARRIER PERFORMANCE MATRIX ───────────────── */}
        <section className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between bg-slate-900 p-3 rounded-t-sm">
            <h2 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} /> Carrier_Performance_Matrix
            </h2>
            <span className="text-[9px] font-black text-slate-400 uppercase font-mono">Status: Live_Stream</span>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-b-sm shadow-sm overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <Th className="pl-6">Carrier_Entity</Th>
                        <Th>Load_Volume</Th>
                        <Th>Avg_TAT</Th>
                        <Th>RTO_Rate</Th>
                        <Th className="w-40">Node_Health</Th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {providers.map((p, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors group">
                            <Td className="pl-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-slate-100 rounded-sm flex items-center justify-center font-black text-slate-900 border border-slate-200 text-[10px]">
                                        {p.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="font-black text-slate-900 uppercase tracking-tight text-xs">{p.name}</span>
                                </div>
                            </Td>
                            <Td><span className="font-mono font-bold text-slate-600">{p.activeShipments?.toLocaleString()}</span></Td>
                            <Td><span className="font-mono font-black text-slate-900 text-xs">{p.tat} Days</span></Td>
                            <Td>
                                <span className={clsx(
                                    "font-mono font-black text-[10px] px-2 py-0.5 rounded-sm border",
                                    p.rto > 10 ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                )}>
                                    {p.rto}%
                                </span>
                            </Td>
                            <Td>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className={clsx("h-full", p.healthScore > 80 ? "bg-emerald-500" : "bg-amber-500")}
                                      style={{ width: `${p.healthScore}%` }}
                                    />
                                  </div>
                                  <span className="text-[9px] font-mono font-black">{Math.round(p.healthScore)}%</span>
                                </div>
                            </Td>
                        </tr>
                    ))}
                </tbody>
             </table>
          </div>

          {/* ───────────────── 2. DAILY OPERATIONAL PULSE (New Section) ───────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <OpsPulseCard 
                label="Yesterday_Shipments" 
                value={stats.yesterdayCount || 0} 
                sub="Finalized_Close" 
                icon={ClipboardCheck} 
                trend="+5.2%"
            />
            <OpsPulseCard 
                label="Open_Complaints" 
                value={stats.complaintCount || 0} 
                sub="SLA_At_Risk" 
                icon={MessageSquareWarning} 
                isCritical={stats.complaintCount > 5}
            />
            <OpsPulseCard 
                label="Field_Staff_Active" 
                value={stats.activeStaff || 0} 
                sub="Node_Occupancy" 
                icon={UserCheck} 
            />
          </div>
        </section>

        {/* ───────────────── 3. PROVIDER ANALYTICS (Charts Substitute) ───────────────── */}
        <section className="lg:col-span-4 space-y-3">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
            <PieChart size={14} /> Node_Status_Distribution
          </h2>
          
          <div className="grid grid-cols-1 gap-3">
            {providers.map((p, i) => (
              <ProviderMiniChart key={i} provider={p} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

/* ───────────────── UI COMPONENTS ───────────────── */
function OpsPulseCard({ label, value, sub, icon: Icon, trend, isCritical }: any) {
  return (
    <div className="bg-slate-900 p-4 rounded-sm shadow-xl flex items-center justify-between border-t-2 border-indigo-500">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <h4 className="text-xl font-mono font-black text-white">{value}</h4>
          {trend && <span className="text-[9px] text-emerald-400 font-bold">{trend}</span>}
        </div>
        <p className={clsx(
          "text-[9px] font-bold uppercase mt-1",
          isCritical ? "text-rose-500 animate-pulse" : "text-slate-500"
        )}>
          {sub}
        </p>
      </div>
      <div className={clsx(
        "p-3 rounded-sm",
        isCritical ? "bg-rose-500/20 text-rose-500" : "bg-slate-800 text-slate-400"
      )}>
        <Icon size={20} />
      </div>
    </div>
  );
}

function ProviderMiniChart({ provider }: { provider: any }) {
  // Suggestion: Using a percentage-based bar to show status mix
  // Since we don't have a library, we visualize the data via CSS proportions
  const stats = provider.statusMix || { delivered: 60, transit: 25, rto: 10, ndr: 5 };

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm group">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{provider.name}_ANALYTICS</span>
        <BarChart3 size={12} className="text-slate-300" />
      </div>
      
      {/* Visual Proportional Bar */}
      <div className="flex h-4 w-full rounded-sm overflow-hidden mb-4 border border-slate-100">
        <div style={{ width: `${stats.delivered}%` }} className="bg-emerald-500 h-full" title="Delivered" />
        <div style={{ width: `${stats.transit}%` }} className="bg-blue-500 h-full" title="In Transit" />
        <div style={{ width: `${stats.ndr}%` }} className="bg-amber-500 h-full" title="NDR" />
        <div style={{ width: `${stats.rto}%` }} className="bg-rose-500 h-full" title="RTO" />
      </div>

      <div className="grid grid-cols-2 gap-y-2">
        <StatusLabel color="bg-emerald-500" label="Delivered" value={`${stats.delivered}%`} />
        <StatusLabel color="bg-blue-500" label="Transit" value={`${stats.transit}%`} />
        <StatusLabel color="bg-amber-500" label="NDR_Issue" value={`${stats.ndr}%`} />
        <StatusLabel color="bg-rose-500" label="RTO_Return" value={`${stats.rto}%`} />
      </div>
    </div>
  );
}

function StatusLabel({ color, label, value }: any) {
  return (
    <div className="flex items-center gap-2">
      <div className={clsx("h-1.5 w-1.5 rounded-full", color)} />
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{label}:</span>
      <span className="text-[9px] font-black text-slate-900 font-mono">{value}</span>
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

function Th({ children, className }: any) {
  return <th className={clsx("px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400", className)}>{children}</th>;
}

function Td({ children, className }: any) {
  return <td className={clsx("px-4 py-3 text-sm", className)}>{children}</td>;
}