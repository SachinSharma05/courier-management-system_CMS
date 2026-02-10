"use client";

import React, { ReactNode } from 'react';
import { 
  Settings, Bell, Moon, Globe, 
  Terminal, LayoutDashboard, Mail, Smartphone,
  Save, RefreshCw, Zap, Monitor, 
  Clock, Calendar, Cpu, ShieldAlert,
  Database, HardDrive,
  List
} from 'lucide-react';
import clsx from 'clsx';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 font-sans selection:bg-indigo-100">
      
      {/* IDENTICAL SYSTEM HEADER */}
      <div className="mb-6 flex flex-col gap-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:flex-row lg:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F172A] text-white shadow-lg shadow-slate-200">
            <Settings size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">System Configurations</h1>
            <p className="mt-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" /> 
              Environment: v2.4.0
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden border-r border-slate-100 pr-6 text-right sm:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Sync Success</p>
            <p className="mt-1 text-xs font-bold text-slate-700">30-JAN-2024 18:45</p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700">
            <Save size={18} /> DEPLOY CHANGES
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        
        {/* LEFT MODULES: UI & LOCALIZATION */}
        <div className="space-y-6 xl:col-span-8">
          
          <SettingsModule title="Interface & Logic" icon={<LayoutDashboard size={16}/>}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Interface Theme</p>
                    <div className="grid grid-cols-2 gap-3">
                        <ThemeOption label="Light" active icon={<Monitor size={20}/>} />
                        <ThemeOption label="Dark" active={false} icon={<Moon size={20}/>} />
                    </div>
                </div>
                <div className="space-y-5">
                    <SelectGroup label="Startup Node" icon={<List size={14}/>} options={['Operations Overview', 'Shipment Tracking', 'Financial Summary']} />
                    <div className="h-px bg-slate-50" />
                    <ToggleItem title="Compact Data Density" description="Maximize row count for logistics auditing." defaultChecked={false} />
                    <ToggleItem title="Auto Refresh Stream" description="Fetch telemetry every 60s." defaultChecked />
                </div>
            </div>
          </SettingsModule>

          <SettingsModule title="Regional Params" icon={<Globe size={16}/>}>
             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <SelectGroup label="System Timezone" icon={<Clock size={14}/>} options={['(GMT+05:30) IST', '(GMT+00:00) UTC']} />
                <SelectGroup label="Date Protocol" icon={<Calendar size={14}/>} options={['DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY']} />
             </div>
          </SettingsModule>

          <SettingsModule title="Persistence" icon={<Database size={16}/>}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatMetric label="Current Cache" value="456 MB" icon={<HardDrive size={16}/>} />
                <StatMetric label="DB Latency" value="24 ms" icon={<Zap size={16}/>} />
                <StatMetric label="Core Load" value="12%" icon={<Cpu size={16}/>} />
            </div>
          </SettingsModule>
        </div>

        {/* RIGHT MODULES: COMMUNICATIONS & CORE */}
        <div className="space-y-6 xl:col-span-4">
          
          <SettingsModule title="Communications" icon={<Bell size={16}/>}>
            <div className="space-y-3">
                <NotificationToggle title="Email Dispatch" icon={<Mail size={16}/>} defaultChecked />
                <NotificationToggle title="Push Telemetry" icon={<Smartphone size={16}/>} defaultChecked />
                <NotificationToggle title="Slack Webhook" icon={<Zap size={16}/>} defaultChecked={false} />
            </div>
          </SettingsModule>

          {/* KERNEL DEBUG PANEL */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0F172A] shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-800/50 px-5 py-4">
                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
                    <Terminal size={16} className="text-indigo-400" /> System Kernel Debug
                </h3>
            </div>
            <div className="space-y-6 p-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-tight text-slate-500">L1 Cache State</span>
                        <button className="flex items-center gap-1.5 text-[10px] font-black uppercase text-indigo-400 transition-colors hover:text-white">
                            <RefreshCw size={12}/> Flush Cache
                        </button>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800 border border-slate-700">
                        <div className="h-full w-[45%] bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all" />
                    </div>
                    <div className="flex justify-between font-mono text-[10px] font-bold text-slate-500">
                        <span>Status: Operational</span>
                        <span>Usage: 45.2%</span>
                    </div>
                </div>
                
                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                    <p className="text-[11px] font-bold leading-relaxed uppercase tracking-tight text-indigo-300/80">
                        Warning: Flush sequence forces re-sync of provider manifests. Degraded performance expected.
                    </p>
                </div>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-6">
             <div className="mb-3 flex items-center gap-2 text-rose-700">
                <ShieldAlert size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Danger Zone</span>
             </div>
             <p className="mb-5 text-[11px] font-bold leading-tight uppercase text-rose-600/70">
                Workspace reset reverts platform to factory defaults.
             </p>
             <button className="w-full rounded-xl border border-rose-200 bg-white py-3 text-[10px] font-black uppercase tracking-widest text-rose-600 shadow-sm transition-all hover:bg-rose-600 hover:text-white">
                FACTORY RESET PROTOCOL
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ───────────────── UI COMPONENTS ───────────────── */

function SettingsModule({ title, icon, children }: { title: string, icon: ReactNode, children: ReactNode }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-50 bg-slate-50/30 px-6 py-4">
                <div className="text-slate-400">{icon}</div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800">{title}</h3>
            </div>
            <div className="p-8">
                {children}
            </div>
        </div>
    )
}

function ThemeOption({ label, icon, active }: { label: string, icon: ReactNode, active: boolean }) {
    return (
        <button className={clsx(
            "flex w-full items-center gap-4 rounded-xl border p-4 transition-all",
            active 
              ? "border-indigo-600 bg-[#0F172A] text-white shadow-lg shadow-slate-200" 
              : "border-slate-100 bg-white text-slate-500 hover:border-slate-300"
        )}>
            {icon}
            <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
        </button>
    )
}

function SelectGroup({ label, options, icon }: { label: string, options: string[], icon: ReactNode}) {
    return (
        <div className="flex-1 space-y-2">
            <label className="ml-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                {icon} {label}
            </label>
            <select className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white uppercase tracking-tight">
                {options.map((opt: string) => <option key={opt}>{opt}</option>)}
            </select>
        </div>
    )
}

function ToggleItem({ title, description, defaultChecked }: { title: string, description: string, defaultChecked: boolean}) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-slate-50 bg-slate-50/50 p-4 transition-all hover:bg-white hover:border-slate-100">
            <div>
                <p className="text-xs font-bold uppercase tracking-tight text-slate-800">{title}</p>
                <p className="mt-0.5 text-[10px] font-medium text-slate-400">{description}</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
                <div className="h-6 w-11 rounded-full bg-slate-200 transition-all peer peer-checked:bg-indigo-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
            </label>
        </div>
    )
}

function NotificationToggle({ title, icon, defaultChecked = false }: { title: string, icon: ReactNode, defaultChecked?: boolean}) {
    return (
        <div className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 transition-all hover:border-indigo-500">
            <div className="flex items-center gap-4">
                <div className="text-slate-300 transition-colors group-hover:text-indigo-600">{icon}</div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-700">{title}</span>
            </div>
            <input type="checkbox" className="h-5 w-5 cursor-pointer rounded-lg accent-indigo-600" defaultChecked={defaultChecked} />
        </div>
    )
}

function StatMetric({ label, value, icon }: { label: string, value: string | number, icon: ReactNode}) {
    return (
        <div className="rounded-xl border border-slate-50 bg-slate-50/50 p-5 transition-all hover:bg-white hover:border-slate-100">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className="font-mono text-lg font-black text-slate-900 tracking-tight">{value}</p>
        </div>
    )
}