"use client";

import { 
  Package, Users, Truck, CheckCircle2, AlertCircle, 
  Activity, Clock, ArrowUpRight, 
  Download
} from 'lucide-react';
import clsx from 'clsx';
import { 
  getDashboardSummary,
  getLiveOps,
  getAlerts
 } from '@/lib/api/dashboard.api';
import { useEffect, useRef, useState } from 'react';

export default function AdminDashboard() {
  // const liveOps = getLiveOps();
  // const alerts = getAlerts();

  const [stats, setStats] = useState<any>(null);
  const [liveOps, setLiveOps] = useState<any>(null);
  const [alerts, setAlerts] = useState<any>(null);
  const [carrierData, setCarrierData] = useState<any>(null);
  const fetchedRef = useRef(false); // 🔑 prevents double-fetch in dev

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    Promise.all([
      getDashboardSummary(),
      getLiveOps(),
      getAlerts(),
    ])
      .then(([summary, liveOpsData, alertsData]) => {
        setStats(summary);
        setLiveOps(liveOpsData);
        setAlerts(alertsData);
      })
      .catch(console.error);
  }, []);

  if (!stats) {
    return null; // later replace with skeleton
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      {/* ───────────────── HEADER SECTION ───────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SuperAdmin Command Center</h1>
          <p className="text-sm text-slate-500">Aggregator metrics across all clients and courier partners.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
            <Activity size={16} /> Live Report
          </button>
        </div>
      </div>

      {/* ───────────────── STATS ROW ───────────────── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Shipments" value={stats.totalShipments} icon={Package} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Active Clients" value={stats.activeClients} icon={Users} color="text-purple-600" bg="bg-purple-50" />
        <StatCard label="In Transit" value={stats.inTransit} icon={Truck} color="text-amber-600" bg="bg-amber-50" />
        <StatCard label="Delivered" value={stats.delivered} icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Failed / RTO" value={stats.rto} icon={AlertCircle} color="text-red-600" bg="bg-red-50" />
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ───────────────── LIVE OPS TABLE (Takes 2 columns) ───────────────── */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Live Operations</h2>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full animate-pulse">Live Updates</span>
          </div>

          <TableContainer>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <Th>Provider</Th>
                  <Th>Client</Th>
                  <Th>Status Mix</Th>
                  <Th>Last Sync</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {liveOps.map((row, i) => (
                  <tr key={i} className="group hover:bg-slate-50 transition-colors">
                    <Td>
                      <span className="font-bold text-slate-900">{row.provider}</span>
                    </Td>
                    <Td>{row.client}</Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Badge color="blue" label={`${row.inTransit} Transit`} />
                        <Badge color="emerald" label={`${row.delivered} Done`} />
                        {row.failed > 0 && <Badge color="red" label={`${row.failed} RTO`} />}
                      </div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock size={12} />
                        {row.lastSync}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
        </section>

        {/* ───────────────── ALERTS SECTION (Takes 1 column) ───────────────── */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800">System Alerts</h2>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className={clsx(
                  "absolute left-0 top-0 h-full w-1",
                  a.type === 'DLQ' ? "bg-red-500" : "bg-amber-500"
                )} />
                <div className="flex justify-between items-start mb-1">
                  <span className={clsx(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                    a.type === 'DLQ' ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {a.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{a.time}</span>
                </div>
                <p className="text-sm font-bold text-slate-800">{a.entity}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{a.message}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ───────────────── REFINED COMPONENTS ───────────────── */

function StatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
      <div className={clsx("mb-4 inline-flex rounded-xl p-2.5 transition-colors", bg, color)}>
        <Icon size={20} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
        <ArrowUpRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
      </div>
    </div>
  );
}

function TableContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto no-scrollbar">
        {children}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-4 text-sm text-slate-600">{children}</td>;
}

function Badge({ color, label }: { color: 'blue' | 'emerald' | 'red'; label: string }) {
  const styles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    red: "bg-red-50 text-red-600 border-red-100"
  };
  return (
    <span className={clsx("rounded-full border px-2 py-0.5 text-[10px] font-bold", styles[color])}>
      {label}
    </span>
  );
}