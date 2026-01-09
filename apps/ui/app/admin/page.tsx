"use client";

import { 
  Package, Users, AlertCircle, 
  Activity, Clock, 
  Download,
  TrendingUp,
  Zap,
  BarChart3,
  Timer,
  Truck,
} from 'lucide-react';
import clsx from 'clsx';
import { 
  getDashboardSummary,
  getProviderPerformance,
  getAlerts
 } from '@/lib/api/dashboard.api';
import { useEffect, useRef, useState } from 'react';
import WorkerStatsCard from '@/components/WorkerStatsCard'

interface StatCardProps {
  label: string;
  value: any;
  icon: any;
  color: string;
  bg?: string; // Icon background color (e.g., bg-blue-50)
  trend?: string;
  isLoading?: boolean;
  isDark?: boolean; // New prop to toggle theme
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [providers, setProviders] = useState<any[]>([]); // Renamed for clarity
  const [alerts, setAlerts] = useState<any>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    Promise.all([
      getDashboardSummary(),
      getProviderPerformance(), // New API call
      getAlerts(),
    ])
      .then(([summary, performanceData, alertsData]) => {
        setStats(summary);
        setProviders(performanceData);
        setAlerts(alertsData);
      })
      .catch(console.error);
  }, []);

  if (!stats) return null;

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
       {/* ... Header and StatCards as defined in previous messages ... */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">SuperAdmin Command Center</h1>
          <p className="text-sm text-slate-500 font-medium">Platform-wide performance and aggregator health metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
            <Download size={14} /> Export Report
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
            <Activity size={14} /> System Health
          </button>
        </div>
      </div>

      {/* ───────────────── EXECUTIVE STATS ───────────────── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Platform Volume" value={stats.totalShipments} icon={Package} color="text-blue-600" bg="bg-blue-50" trend="+14% vs LW" />
        <StatCard label="Client Base" value={stats.activeClients} icon={Users} color="text-purple-600" bg="bg-purple-50" />
        <StatCard label="Avg Delivery TAT" value={stats.avgTat} icon={Zap} color="text-amber-600" bg="bg-amber-50" trend="-0.2 days" />
        <StatCard label="Aggregator Margin" value={stats.margin} icon={TrendingUp} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Critical DLQ" value={stats.dlqCount} icon={AlertCircle} color="text-red-600" bg="bg-red-50" />
      </section>
      
      <WorkerStatsCard />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Weight Discrepancy Widget */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-slate-800 tracking-tight">Weight Discrepancies</h3>
            <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-1 rounded-lg">High Risk</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total Flagged AWBs</span>
              <span className="font-bold text-slate-900">142</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Potential Loss</span>
              <span className="font-bold text-rose-600">₹12,450</span>
            </div>
          </div>
        </div>

        {/* NDR Recovery Widget */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-800 tracking-tight mb-6">NDR Recovery Rate</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-indigo-600">64%</span>
            <span className="text-xs font-bold text-emerald-500 mb-2">↑ 4% this week</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">Out of 500 NDRs, 320 were successfully delivered.</p>
        </div>
      </section>

       <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* PROVIDER LEADERBOARD */}
          <section className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-black text-slate-800">Provider Performance</h2>
            <div className="grid grid-cols-1 gap-4">
              {providers.map((p, i) => (
                <ProviderRow key={i} provider={p} />
              ))}
            </div>
          </section>

          {/* SYSTEM ALERTS */}
          <section className="space-y-4">
            <h2 className="text-lg font-black text-slate-800">System Health</h2>
            {alerts?.map((a: any, i: number) => (
              <AlertItem key={i} alert={a} />
            ))}
          </section>
       </div>
    </div>
  );
}

// ───────────────── UPDATED STAT CARD ─────────────────
function StatCard({ 
  label, value, icon: Icon, color, bg, trend, isLoading, isDark = false 
}: StatCardProps) {
  return (
    <div className={clsx(
      "p-4 rounded-[2.5rem] border transition-all duration-300",
      // Switch background and border based on theme
      isDark 
        ? "bg-slate-950/50 border-slate-800 text-white" 
        : "bg-white border-slate-100 shadow-sm text-slate-900"
    )}>
      <div className="flex justify-between items-start mb-4">
        {/* Icon Container */}
        <div className={clsx(
          "p-3 rounded-2xl transition-transform hover:scale-110 duration-300",
          bg, // Background for the icon circle
          color // Text color for the icon
        )}>
          {Icon && <Icon size={20} />}
        </div>
        
        {/* Trend badge */}
        {trend && !isLoading && (
          <div className={clsx(
            "text-[10px] font-black px-2 py-1 rounded-lg",
            trend.includes('+') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {trend}
          </div>
        )}
      </div>
      
      <div>
        <p className={clsx(
          "text-[10px] font-bold uppercase tracking-widest",
          isDark ? "text-slate-500" : "text-slate-400"
        )}>
          {label}
        </p>
        
        {isLoading ? (
          <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-xl mt-1" />
        ) : (
          <h3 className="text-2xl font-black mt-1">
            {value?.toLocaleString() || 0}
          </h3>
        )}
      </div>
    </div>
  );
}

// ───────────────── ALERT ITEM COMPONENT ─────────────────
function AlertItem({ alert }: { alert: any }) {
  const isDLQ = alert.type === 'DLQ';
  
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all group">
      {/* Visual Indicator Bar */}
      <div className={clsx(
        "absolute left-0 top-0 h-full w-1.5 transition-colors",
        isDLQ ? "bg-rose-500" : "bg-amber-500"
      )} />
      
      <div className="flex justify-between items-start mb-2">
        <span className={clsx(
          "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg",
          isDLQ ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
        )}>
          {alert.type}
        </span>
        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
          <Clock size={10} /> {alert.time}
        </span>
      </div>
      
      <div>
        <h4 className="text-sm font-black text-slate-900 leading-tight">
          {alert.entity}
        </h4>
        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed group-hover:text-slate-700 transition-colors">
          {alert.message}
        </p>
      </div>
    </div>
  );
}

function ProviderRow({ provider }: { provider: any }) {
  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between group hover:border-indigo-200 transition-all gap-6">
      
      {/* 1. PROVIDER IDENTITY */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all duration-300">
          {provider.name[0]}
        </div>
        <div>
          <h4 className="font-black text-slate-900 text-lg tracking-tight">{provider.name}</h4>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <Truck size={12} className="text-slate-300" />
            {provider.activeShipments?.toLocaleString()} Active Shipments
          </div>
        </div>
      </div>

      {/* 2. PERFORMANCE METRICS */}
      <div className="flex flex-1 justify-around md:justify-end gap-8 lg:gap-16 items-center w-full">
        
        {/* AVG TAT */}
        <div className="text-center md:text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
            <Timer size={10} /> Avg TAT
          </p>
          <p className="text-sm font-black text-slate-900">
            {provider.tat} <span className="text-[10px] text-slate-400">Days</span>
          </p>
        </div>

        {/* RTO RATE */}
        <div className="text-center md:text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
            <BarChart3 size={10} /> RTO Rate
          </p>
          <p className={clsx(
            "text-sm font-black", 
            provider.rto > 10 ? "text-rose-600" : "text-emerald-600"
          )}>
            {provider.rto}%
          </p>
        </div>

        {/* HEALTH SCORE PROGRESS */}
        <div className="hidden sm:block w-32">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase">Health</span>
            <span className="text-[9px] font-black text-indigo-600">{Math.round(provider.healthScore)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className={clsx(
                "h-full rounded-full transition-all duration-1000 ease-out",
                provider.healthScore > 80 ? "bg-emerald-500" : 
                provider.healthScore > 50 ? "bg-indigo-500" : "bg-rose-500"
              )}
              style={{ width: `${provider.healthScore}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}