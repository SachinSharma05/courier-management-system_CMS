"use client";

import React, { ReactNode, useState } from 'react';
import { 
  User, Lock, Shield, Mail, Briefcase, Building2, 
  KeyRound, Fingerprint, Eye, EyeOff,
  CheckCircle2, Save, Camera, Hash, MapPin, 
  Clock, LogOut, ShieldCheck, Activity
} from 'lucide-react';
import { clsx } from 'clsx';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 font-sans selection:bg-indigo-100">
      
      {/* IDENTICAL IDENTITY HEADER CARD */}
      <div className="mb-6 flex flex-col gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative shrink-0">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#0F172A] text-3xl font-black text-white shadow-xl shadow-slate-200">
              SS
            </div>
            <button className="absolute -bottom-2 -right-2 rounded-xl bg-white p-2 text-slate-500 shadow-md border border-slate-50 hover:text-indigo-600 transition-all">
              <Camera size={16} />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sachin Sharma</h1>
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-emerald-700">
                ACTIVE SESSION
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5">
              <p className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Shield size={14} className="text-indigo-500" /> Super Admin
              </p>
              <p className="flex items-center gap-2 font-mono text-[11px] font-bold text-slate-400">
                <Hash size={14} /> ID: 88291-X-CMS
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right xl:block pr-5 border-r border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Access Point</p>
            <p className="text-xs font-bold text-slate-700 mt-1">Indore, India (103.22.XX.X)</p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-[#0F172A] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800">
            <Activity size={16}/> SYSTEM AUDIT
          </button>
        </div>
      </div>

      {/* TABS SELECTOR (Pill Style) */}
      <div className="mb-6 flex w-fit gap-1 rounded-xl bg-slate-200/50 p-1">
        <TabButton 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')}
          icon={<User size={16}/>} 
          label="Profile Details" 
        />
        <TabButton 
          active={activeTab === 'security'} 
          onClick={() => setActiveTab('security')}
          icon={<Lock size={16}/>} 
          label="Security Protocol" 
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-8 space-y-6">
          {/* PROFILE SECTION */}
          <div className={clsx("space-y-6", activeTab !== 'profile' && 'hidden')}>
            <SectionCard title="General Information">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <InputGroup label="Full Name" value="Sachin Sharma" icon={<User size={16}/>} />
                <InputGroup label="Network Email" value="admin@cms.com" icon={<Mail size={16}/>} />
                <InputGroup label="Department" value="Platform Operations" icon={<Briefcase size={16}/>} />
                <InputGroup label="Organization" value="CMS Logistics HQ" icon={<Building2 size={16}/>} />
              </div>
              <div className="mt-8 border-t border-slate-50 pt-6">
                <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700">
                  <Save size={16}/> COMMIT CHANGES
                </button>
              </div>
            </SectionCard>

            <SectionCard title="Preferences">
              <div className="grid gap-3">
                <ToggleItem title="Critical DLQ Alerts" description="Daily failure summaries sent to admin mail." defaultChecked />
                <ToggleItem title="Two-Factor Protocol" description="Mandatory cryptographic verification for login." defaultChecked />
                <ToggleItem title="Public API Access" description="Allow external read-only tracking endpoints." defaultChecked={false} />
              </div>
            </SectionCard>
          </div>

          {/* SECURITY SECTION */}
          <div className={clsx("space-y-6", activeTab !== 'security' && 'hidden')}>
            <SectionCard title="Credential Update">
              <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-700">
                <ShieldCheck size={18} />
                <p className="text-xs font-bold uppercase tracking-tight">Security Req: 12+ chars, Alpha-Numeric, Symbols.</p>
              </div>
              <div className="max-w-xl space-y-5">
                <PasswordField label="Current Password" />
                <div className="h-px bg-slate-50" />
                <PasswordField label="New Password" />
                <PasswordField label="Confirm New Password" />
              </div>

              <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                <h4 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Entropy Analysis</h4>
                <div className="mb-3 flex gap-1.5">
                  <div className="h-2 flex-1 rounded-full bg-emerald-500" />
                  <div className="h-2 flex-1 rounded-full bg-emerald-500" />
                  <div className="h-2 flex-1 rounded-full bg-emerald-500" />
                  <div className="h-2 flex-1 rounded-full bg-slate-200" />
                </div>
                <p className="flex items-center gap-2 text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 size={14}/> High Entropy Detected
                </p>
              </div>

              <div className="mt-8">
                <button className="flex items-center gap-2 rounded-xl bg-[#0F172A] px-8 py-3 text-xs font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-black">
                  <KeyRound size={16}/> UPDATE CREDENTIALS
                </button>
              </div>
            </SectionCard>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl bg-[#0F172A] p-6 text-white shadow-xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white">
                <Fingerprint size={22}/>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest">Active Security</h3>
            </div>
            
            <div className="space-y-5 mb-8">
              <div className="flex items-start gap-4">
                <MapPin size={16} className="text-indigo-400 mt-1" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</p>
                  <p className="text-xs font-bold mt-1">Indore, India (IPv4: 103.22.XX.X)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock size={16} className="text-indigo-400 mt-1" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Auth</p>
                  <p className="text-xs font-mono font-bold mt-1 text-indigo-100">30-JAN-2024 17:12:04</p>
                </div>
              </div>
            </div>

            <div className="mb-8 rounded-xl bg-white/5 border border-white/10 p-4">
              <p className="text-[10px] font-black uppercase text-indigo-400 mb-1 tracking-widest">Advisory</p>
              <p className="text-[11px] font-medium leading-relaxed text-slate-300">
                Account is active on 2 external hardware nodes.
              </p>
            </div>

            <button className="w-full rounded-xl bg-white py-3 text-xs font-black uppercase tracking-widest text-slate-900 shadow-lg transition-all hover:bg-indigo-50 flex items-center justify-center gap-2">
              <LogOut size={16}/> Terminate Sessions
            </button>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Account Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Verification</span>
                <span className="text-[10px] font-black text-emerald-600 uppercase">Verified</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Storage Quota</span>
                <span className="text-xs font-black text-slate-900 uppercase">1.2GB / 5GB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── UI COMPONENTS ───────────────── */

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, label: string, icon: ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={clsx(
        "flex items-center gap-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg",
        active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
      )}
    >
      {icon} {label}
    </button>
  );
}

function SectionCard({ title, children }: { title: string, children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-6 w-1 rounded-full bg-indigo-500" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InputGroup({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>
        <input 
          defaultValue={value}
          className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 pl-11 text-xs font-bold text-slate-700 transition-all outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5"
        />
      </div>
    </div>
  );
}

function PasswordField({ label }: { label: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <div className="relative">
        <input 
          type={show ? 'text' : 'password'}
          placeholder="••••••••••••"
          className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 transition-all outline-none focus:bg-white focus:border-indigo-500"
        />
        <button 
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
        >
          {show ? <EyeOff size={18}/> : <Eye size={18}/>}
        </button>
      </div>
    </div>
  );
}

function ToggleItem({ title, description, defaultChecked= false }: { title: string, description: string, defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-50 bg-slate-50/30 p-5 transition-all hover:bg-white hover:border-slate-100 hover:shadow-sm">
      <div>
        <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">{title}</p>
        <p className="mt-0.5 text-[11px] font-medium text-slate-400">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
      </label>
    </div>
  );
}