"use client";

import React from 'react';
import { 
  Settings, Bell, Moon, Globe, 
  Terminal, LayoutDashboard, Mail, Smartphone,
  Save, RefreshCw, Zap, Monitor, 
  Clock, Calendar, Cpu, ShieldAlert,
  Database, HardDrive
} from 'lucide-react';
import clsx from 'clsx';

export default function SettingsPage() {
  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-screen font-sans">
      
      {/* ───────────────── SYSTEM HEADER ───────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between bg-white p-4 border border-slate-200 rounded-sm shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-slate-900 flex items-center justify-center text-white rounded-sm shadow-lg">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-none uppercase tracking-tight">System_Configurations</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-pulse" /> Core_Environment: v2.4.0
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <div className="text-right hidden sm:block px-4 border-r border-slate-100">
             <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Last_Sync_Success</p>
             <p className="text-[10px] font-bold text-slate-700 mt-1 uppercase">30-JAN-2024 18:45</p>
          </div>
          <button className="flex items-center gap-2 rounded-sm bg-indigo-600 px-5 py-2.5 text-[10px] font-black text-white hover:bg-indigo-700 transition-all uppercase tracking-[0.2em] shadow-md">
            <Save size={16} /> Deploy_Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* ───────────────── LEFT: UI & LOCALIZATION MODULES ───────────────── */}
        <div className="xl:col-span-8 space-y-4">
          
          <SettingsModule title="Appearance_&_Interface_Logic" icon={<LayoutDashboard size={14}/>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interface_Theme</p>
                    <div className="grid grid-cols-2 gap-2">
                        <ThemeOption label="Light_Mode" active icon={<Monitor size={18}/>} />
                        <ThemeOption label="Dark_Mode" icon={<Moon size={18}/>} />
                    </div>
                </div>
                <div className="space-y-4">
                    <SelectGroup label="Default_Startup_Node" options={['Operations_Overview', 'Shipment_Tracking', 'Financial_Summary']} />
                    <div className="h-px bg-slate-100 my-2" />
                    <ToggleItem title="Compact Data Density" description="Maximize row count for logistics auditing." />
                    <ToggleItem title="Auto_Refresh_Stream" description="Fetch telemetry every 60s." defaultChecked />
                </div>
            </div>
          </SettingsModule>

          <SettingsModule title="Regional_Localization_Params" icon={<Globe size={14}/>}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectGroup label="System_Timezone" icon={<Clock size={14}/>} options={['(GMT+05:30) India Standard Time', '(GMT+00:00) UTC']} />
                <SelectGroup label="Date_Protocol" icon={<Calendar size={14}/>} options={['DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY']} />
             </div>
          </SettingsModule>

          <SettingsModule title="Data_Storage_&_Persistence" icon={<Database size={14}/>}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatMetric label="Current_Cache" value="456 MB" icon={<HardDrive size={14}/>} />
                <StatMetric label="DB_Latency" value="24 ms" icon={<Zap size={14}/>} />
                <StatMetric label="Core_Load" value="12%" icon={<Cpu size={14}/>} />
            </div>
          </SettingsModule>
        </div>

        {/* ───────────────── RIGHT: NOTIFICATIONS & SYSTEM CORE ───────────────── */}
        <div className="xl:col-span-4 space-y-4">
          
          <SettingsModule title="Communication_Channels" icon={<Bell size={14}/>}>
            <div className="space-y-2">
                <NotificationToggle title="Email_Dispatch" icon={<Mail size={14}/>} defaultChecked />
                <NotificationToggle title="Push_Telemetry" icon={<Smartphone size={14}/>} defaultChecked />
                <NotificationToggle title="Slack_Webhook_Node" icon={<Zap size={14}/>} />
            </div>
          </SettingsModule>

          <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden shadow-xl">
            <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    <Terminal size={14} className="text-indigo-400" /> System_Kernel_Debug
                </h3>
            </div>
            <div className="p-5 space-y-5">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-500 font-mono tracking-tighter">L1_Cache_State</span>
                        <button className="text-[9px] font-black text-indigo-400 hover:text-white flex items-center gap-1 uppercase transition-colors">
                            <RefreshCw size={10}/> Flush_Cache
                        </button>
                    </div>
                    <div className="h-2 w-full bg-slate-800 border border-slate-700 rounded-sm overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[45%] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    </div>
                    <div className="flex justify-between font-mono text-[9px] font-bold text-slate-500">
                        <span>Status: Operational</span>
                        <span>Usage: 45.2%</span>
                    </div>
                </div>
                
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-sm">
                    <p className="text-[10px] text-indigo-300 leading-relaxed font-bold uppercase tracking-tighter italic">
                        Warning: Flushing the cache will force a complete re-sync of all provider manifests. 
                        System performance may degrade during the rebuild sequence.
                    </p>
                </div>
            </div>
          </div>

          <div className="p-4 bg-rose-50 border border-rose-200 rounded-sm">
             <div className="flex items-center gap-2 text-rose-700 mb-2">
                <ShieldAlert size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Danger_Zone</span>
             </div>
             <p className="text-[10px] text-rose-600 font-bold uppercase mb-4 leading-tight">
                Resetting all workspace settings will revert the platform to factory defaults.
             </p>
             <button className="w-full py-2 bg-white border border-rose-300 text-rose-600 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all rounded-sm">
                Factory_Reset_Protocol
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ───────────────── ERP UI COMPONENTS ───────────────── */

function SettingsModule({ title, icon, children }: any) {
    return (
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                <div className="text-slate-400">{icon}</div>
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">{title}</h3>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    )
}

function ThemeOption({ label, icon, active }: any) {
    return (
        <button className={clsx(
            "flex items-center gap-3 p-3 rounded-sm border transition-all w-full",
            active 
              ? "bg-slate-900 border-slate-900 text-white shadow-md" 
              : "bg-white border-slate-200 text-slate-500 hover:border-slate-400"
        )}>
            {icon}
            <span className="text-[10px] font-black uppercase tracking-tight">{label}</span>
        </button>
    )
}

function SelectGroup({ label, options, icon }: any) {
    return (
        <div className="space-y-1.5 flex-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                {icon} {label}
            </label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all uppercase">
                {options.map((opt: string) => <option key={opt}>{opt}</option>)}
            </select>
        </div>
    )
}

function ToggleItem({ title, description, defaultChecked }: any) {
    return (
        <div className="flex items-center justify-between p-3 border border-slate-100 rounded-sm bg-slate-50/30">
            <div className="space-y-0.5">
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{title}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-sm peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-sm after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
            </label>
        </div>
    )
}

function NotificationToggle({ title, icon, defaultChecked }: any) {
    return (
        <div className="flex items-center justify-between p-3 rounded-sm bg-white border border-slate-200 group hover:border-indigo-500 transition-all">
            <div className="flex items-center gap-3">
                <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">{icon}</div>
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{title}</span>
            </div>
            <input type="checkbox" className="accent-indigo-600 h-4 w-4 rounded-sm cursor-pointer" defaultChecked={defaultChecked} />
        </div>
    )
}

function StatMetric({ label, value, icon }: any) {
    return (
        <div className="p-4 border border-slate-100 rounded-sm bg-slate-50/50">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
                {icon}
                <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-sm font-mono font-black text-slate-900">{value}</p>
        </div>
    )
}