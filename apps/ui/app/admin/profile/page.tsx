"use client";

import React, { useState } from 'react';
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
    <div className="p-4 space-y-4 bg-slate-50 min-h-screen font-sans">
      
      {/* ───────────────── ERP IDENTITY HEADER ───────────────── */}
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative shrink-0">
            <div className="h-20 w-20 bg-slate-900 flex items-center justify-center text-white text-2xl font-black rounded-sm shadow-md border-4 border-white ring-1 ring-slate-200">
              SS
            </div>
            <button className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-sm shadow-sm border border-slate-200 text-slate-500 hover:text-indigo-600 transition-all">
              <Camera size={14} />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Sachin Sharma</h1>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest">
                Active_Session
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Shield size={12} className="text-indigo-600" /> Clearance: Super_Admin
              </p>
              <p className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1.5">
                <Hash size={12} /> ID_NODE: 88291-X-CMS
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
            <div className="text-right hidden xl:block">
                <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Last_Access_Point</p>
                <p className="text-[10px] font-bold text-slate-700 mt-1 uppercase">Indore, India (103.22.XX.X)</p>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden xl:block" />
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-sm">
                <Activity size={14}/> System_Audit
            </button>
        </div>
      </div>

      {/* ───────────────── TERMINAL TABS ───────────────── */}
      <div className="flex bg-white border border-slate-200 rounded-sm p-1 shadow-sm w-fit">
        <TabButton 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')}
          icon={<User size={14}/>} 
          label="Identity_Profile" 
        />
        <TabButton 
          active={activeTab === 'security'} 
          onClick={() => setActiveTab('security')}
          icon={<Lock size={14}/>} 
          label="Security_Protocol" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ───────────────── PROFILE TERMINAL ───────────────── */}
        <div className={clsx("lg:col-span-8 space-y-4", activeTab !== 'profile' && 'hidden')}>
          <SectionCard title="General_Information_Matrix">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup label="Entity_Full_Name" value="Sachin Sharma" icon={<User size={14}/>} />
              <InputGroup label="Network_Email" value="admin@cms.com" icon={<Mail size={14}/>} />
              <InputGroup label="Department_Node" value="Platform Operations" icon={<Briefcase size={14}/>} />
              <InputGroup label="Parent_Organization" value="CMS Logistics HQ" icon={<Building2 size={14}/>} />
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
                <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md">
                    <Save size={14}/> Commit_Changes
                </button>
            </div>
          </SectionCard>

          <SectionCard title="Notification_&_Access_Preferences">
            <div className="space-y-2">
                <ToggleItem title="Critical DLQ Alerts" description="Automatic dispatch of daily failure summaries to admin mail." defaultChecked />
                <ToggleItem title="Two-Factor Protocol" description="Mandatory cryptographic verification for every login node." defaultChecked />
                <ToggleItem title="Public API Access" description="Allow external read-only access to tracking endpoints." />
            </div>
          </SectionCard>
        </div>

        {/* ───────────────── SECURITY TERMINAL ───────────────── */}
        <div className={clsx("lg:col-span-8 space-y-4", activeTab !== 'security' && 'hidden')}>
          <SectionCard title="Credential_Update_Sequence">
            <p className="text-[10px] text-slate-400 mb-6 font-bold uppercase tracking-tight flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" /> Min requirements: 12 chars, alpha-numeric, special symbols.
            </p>
            <div className="space-y-4 max-w-xl">
              <PasswordField label="Auth_Current_Password" />
              <div className="h-px bg-slate-100 my-2" />
              <PasswordField label="New_Password_String" />
              <PasswordField label="Confirm_New_String" />
            </div>

            <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-sm">
                 <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Entropy_Analysis</h4>
                 <div className="flex gap-1 mb-2">
                    <div className="h-1.5 flex-1 rounded-full bg-emerald-500" />
                    <div className="h-1.5 flex-1 rounded-full bg-emerald-500" />
                    <div className="h-1.5 flex-1 rounded-full bg-emerald-500" />
                    <div className="h-1.5 flex-1 rounded-full bg-slate-200" />
                 </div>
                 <p className="text-[10px] text-emerald-600 font-black uppercase flex items-center gap-1 tracking-tighter">
                    <CheckCircle2 size={12}/> Security_Status: High_Entropy_Pass
                 </p>
            </div>

            <div className="pt-6">
                 <button className="flex items-center justify-center gap-2 px-8 py-2.5 bg-slate-900 text-white rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                    <KeyRound size={16}/> Update_Credentials
                 </button>
            </div>
          </SectionCard>
        </div>

        {/* ───────────────── SESSION AUDIT SIDEBAR ───────────────── */}
        <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 p-5 rounded-sm shadow-xl text-white">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-600 rounded-sm text-white"><Fingerprint size={20}/></div>
                    <h3 className="text-xs font-black uppercase tracking-widest">Active_Node_Security</h3>
                </div>
                <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                        <MapPin size={14} className="text-indigo-400 mt-0.5" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Current_Location</p>
                            <p className="text-[11px] font-bold mt-1">Indore, India (IPv4: 103.22.XX.X)</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Clock size={14} className="text-indigo-400 mt-0.5" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Last_Auth_Timestamp</p>
                            <p className="text-[11px] font-bold mt-1 uppercase font-mono">30-JAN-2024 17:12:04</p>
                        </div>
                    </div>
                </div>
                <div className="p-3 bg-slate-800 border border-slate-700 rounded-sm mb-6">
                    <p className="text-[9px] font-black text-indigo-400 uppercase mb-1">Warning</p>
                    <p className="text-[10px] text-slate-300 font-medium leading-relaxed uppercase tracking-tighter">
                        Account is active on 2 external hardware nodes.
                    </p>
                </div>
                <button className="w-full py-2 bg-white text-slate-900 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                    <LogOut size={14}/> Terminate_All_Sessions
                </button>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Account_Health</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-600">Verification_Status</span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase">Verified</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-600">Storage_Quota</span>
                        <span className="text-[10px] font-black text-slate-900 uppercase">1.2GB / 5.0GB</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── ERP UI COMPONENTS ───────────────── */

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={clsx(
        "flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm",
        active ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-900"
      )}
    >
      {icon} {label}
    </button>
  );
}

function SectionCard({ title, children }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
        <div className="h-1 w-4 bg-indigo-600" /> {title}
      </h3>
      {children}
    </div>
  );
}

function InputGroup({ label, value, icon }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-tight ml-0.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
        <input 
          defaultValue={value}
          className="w-full bg-slate-50 border border-slate-200 rounded-sm pl-9 pr-4 py-2 text-xs font-bold text-slate-700 focus:bg-white focus:border-indigo-500 outline-none transition-all"
        />
      </div>
    </div>
  );
}

function PasswordField({ label }: { label: string }) {
    const [show, setShow] = useState(false);
    return (
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-tight ml-0.5">{label}</label>
          <div className="relative">
            <input 
              type={show ? 'text' : 'password'}
              placeholder="••••••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2 text-xs font-bold text-slate-700 focus:bg-white focus:border-indigo-500 outline-none transition-all"
            />
            <button 
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
            >
                {show ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>
        </div>
    );
}

function ToggleItem({ title, description, defaultChecked }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-sm group hover:border-slate-200 transition-all">
            <div className="space-y-0.5">
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{title}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter leading-tight">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-sm peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-sm after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
        </div>
    )
}