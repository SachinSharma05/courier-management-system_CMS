'use client';

import { useAwbStats } from '@/hooks/useAwbStats';
import clsx from 'clsx';
import { Activity, AlertCircle, CheckCircle, Clock, Timer } from 'lucide-react';

export default function WorkerStatsCard() {
  const { data, loading, error } = useAwbStats();

  if (loading) return <div>Loading worker stats…</div>;
  if (error) return <div>Failed to load worker stats</div>;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Activity size={18} className="text-indigo-400" />
          Background Worker
        </h3>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
          <span className={`h-2 w-2 rounded-full ${data.queue ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-[10px] font-black uppercase text-slate-300">
            {data.queue ? 'Worker Alive' : 'Worker Dead'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Active" value={data.jobs.active} icon={Activity} color="text-blue-500" bg="bg-blue-500/10" isDark />
        <StatCard label="Pending" value={data.jobs.waiting} icon={Clock} color="text-amber-500" bg="bg-amber-500/10" isDark />
        <StatCard label="Completed" value={data.jobs.completed} icon={CheckCircle} color="text-emerald-500" bg="bg-emerald-500/10" isDark />
        <StatCard label="Failed" value={data.jobs.failed} icon={AlertCircle} color="text-rose-500" bg="bg-rose-500/10" isDark />
        <StatCard label="Delayed" value={data.jobs.delayed} icon={Timer} color="text-slate-400" bg="bg-slate-400/10" isDark />
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Last Heartbeat</span>
        <span className="text-[10px] text-slate-400 font-mono">{new Date(data.updatedAt).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}

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