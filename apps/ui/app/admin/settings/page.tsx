'use client';

import { useState } from 'react';
import { 
  Settings, Bell, Moon, Globe, 
  Terminal, Sliders, Database, 
  LayoutDashboard, Mail, Smartphone,
  Save, RefreshCcw, HardDrive, Zap
} from 'lucide-react';
import clsx from 'clsx';

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 border border-slate-200">
            <Settings size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Workspace Settings</h1>
            <p className="text-sm text-slate-500 font-medium">Configure your platform environment and preferences.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          <Save size={18} /> Save Configurations
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* ───────────────── LEFT COLUMN: UI & LOCALE ───────────────── */}
        <div className="md:col-span-7 space-y-6">
          <SettingsSection title="Appearance & Interface" icon={<LayoutDashboard size={18}/>}>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <ThemeOption label="Light Mode" active icon={<Moon className="rotate-180" size={20}/>} />
                <ThemeOption label="Dark Mode" icon={<Moon size={20}/>} />
            </div>
            <div className="space-y-4">
                <SelectGroup label="Default Dashboard View" options={['Operations Overview', 'Shipment Tracking', 'Financial Summary']} />
                <ToggleItem title="Compact Mode" description="Reduce whitespace in tables to show more data rows." />
                <ToggleItem title="Auto-refresh Data" description="Automatically fetch new logs every 60 seconds." defaultChecked />
            </div>
          </SettingsSection>

          <SettingsSection title="Localization" icon={<Globe size={18}/>}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectGroup label="Timezone" options={['(GMT+05:30) India Standard Time', '(GMT+00:00) UTC']} />
                <SelectGroup label="Date Format" options={['DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY']} />
             </div>
          </SettingsSection>
        </div>

        {/* ───────────────── RIGHT COLUMN: NOTIFICATIONS & DEV ───────────────── */}
        <div className="md:col-span-5 space-y-6">
          <SettingsSection title="Notification Channels" icon={<Bell size={18}/>}>
            <div className="space-y-4">
                <NotificationToggle title="Email Alerts" icon={<Mail size={16}/>} defaultChecked />
                <NotificationToggle title="Push Notifications" icon={<Smartphone size={16}/>} defaultChecked />
                <NotificationToggle title="Slack Webhooks" icon={<Zap size={16}/>} />
            </div>
          </SettingsSection>

          <SettingsSection title="Developer & System" icon={<Terminal size={18}/>}>
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-300 space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">API Cache State</span>
                    <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                        <RefreshCcw size={10}/> Clear Cache
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[45%]" />
                    </div>
                    <span className="text-xs font-mono font-bold">45%</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                    Clearing cache will force the platform to re-sync all carrier manifests from the origin servers.
                </p>
            </div>
          </SettingsSection>
        </div>

      </div>
    </div>
  );
}

/* ───────────────── COMPONENTS ───────────────── */

function SettingsSection({ title, icon, children }: any) {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3">
                <div className="text-indigo-600">{icon}</div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{title}</h3>
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
            "flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all",
            active ? "bg-indigo-50 border-indigo-600 text-indigo-600 shadow-md shadow-indigo-50" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
        )}>
            {icon}
            <span className="text-xs font-bold">{label}</span>
        </button>
    )
}

function SelectGroup({ label, options }: { label: string, options: string[] }) {
    return (
        <div className="space-y-1.5 flex-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-tight ml-1">{label}</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all">
                {options.map(opt => <option key={opt}>{opt}</option>)}
            </select>
        </div>
    )
}

function ToggleItem({ title, description, defaultChecked }: any) {
    return (
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
                <p className="text-sm font-bold text-slate-800">{title}</p>
                <p className="text-xs text-slate-400 font-medium">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
        </div>
    )
}

function NotificationToggle({ title, icon, defaultChecked }: any) {
    return (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50">
            <div className="flex items-center gap-3">
                <div className="text-slate-400">{icon}</div>
                <span className="text-xs font-bold text-slate-700">{title}</span>
            </div>
            <input type="checkbox" className="accent-indigo-600 h-4 w-4" defaultChecked={defaultChecked} />
        </div>
    )
}