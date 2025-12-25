'use client';

import { useState } from 'react';
import { 
  User, Lock, Shield, Bell, 
  Camera, Mail, Briefcase, Building2, 
  KeyRound, Fingerprint, Eye, EyeOff,
  CheckCircle2, AlertCircle, Save
} from 'lucide-react';
import clsx from 'clsx';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-100 ring-4 ring-white">
            SS
          </div>
          <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-slate-600 hover:text-indigo-600 transition-all">
            <Camera size={18} />
          </button>
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sachin Sharma</h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <Shield size={14} className="text-indigo-500" /> Super Administrator • <span className="text-slate-400 font-mono text-xs">ID: 88291-X</span>
          </p>
        </div>
      </div>

      {/* ───────────────── TABS ───────────────── */}
      <div className="flex border-b border-slate-200 gap-8">
        <TabButton 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')}
          icon={<User size={18}/>} 
          label="General Profile" 
        />
        <TabButton 
          active={activeTab === 'security'} 
          onClick={() => setActiveTab('security')}
          icon={<Lock size={18}/>} 
          label="Security & Password" 
        />
      </div>

      {/* ───────────────── CONTENT ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {activeTab === 'profile' ? (
          <>
            <div className="lg:col-span-2 space-y-6">
              <SectionCard title="Personal Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputGroup label="Full Name" value="Sachin Sharma" icon={<User size={16}/>} />
                  <InputGroup label="Email Address" value="admin@cms.com" icon={<Mail size={16}/>} />
                  <InputGroup label="Department" value="Platform Operations" icon={<Briefcase size={16}/>} />
                  <InputGroup label="Organization" value="CMS Logistics HQ" icon={<Building2 size={16}/>} />
                </div>
                <div className="pt-4">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
                        <Save size={18}/> Update Profile
                    </button>
                </div>
              </SectionCard>

              <SectionCard title="Preferences">
                <div className="space-y-4">
                    <ToggleItem title="Email Notifications" description="Receive daily summaries of failed DLQ jobs." defaultChecked />
                    <ToggleItem title="Two-Factor Authentication" description="Require a security code for every login attempt." defaultChecked />
                </div>
              </SectionCard>
            </div>

            <div className="space-y-6">
                <div className="rounded-3xl bg-indigo-600 p-6 text-white shadow-xl shadow-indigo-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-lg"><Fingerprint size={24}/></div>
                        <h3 className="font-bold">Session Security</h3>
                    </div>
                    <p className="text-xs text-indigo-100 mb-6 leading-relaxed">
                        Your account is currently active on 2 devices. Last login was 42 minutes ago from Indore, India.
                    </p>
                    <button className="w-full py-2 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all">
                        Log out all devices
                    </button>
                </div>
            </div>
          </>
        ) : (
          <div className="lg:col-span-2 max-w-2xl space-y-6">
            <SectionCard title="Update Password">
              <p className="text-xs text-slate-400 mb-6 font-medium">
                Use a strong password with at least 12 characters, including numbers and symbols.
              </p>
              <div className="space-y-4">
                <PasswordField label="Current Password" />
                <div className="h-[1px] bg-slate-100 my-2" />
                <PasswordField label="New Password" />
                <PasswordField label="Confirm New Password" />
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Password Strength</h4>
                 <div className="flex gap-1 mb-2">
                    <div className="h-1 flex-1 rounded-full bg-emerald-500" />
                    <div className="h-1 flex-1 rounded-full bg-emerald-500" />
                    <div className="h-1 flex-1 rounded-full bg-emerald-500" />
                    <div className="h-1 flex-1 rounded-full bg-slate-200" />
                 </div>
                 <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12}/> Secure: High Entropy
                 </p>
              </div>

              <div className="pt-6">
                 <button className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                    <KeyRound size={18}/> Change Password
                 </button>
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────────── COMPONENTS ───────────────── */

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={clsx(
        "flex items-center gap-2 pb-4 text-sm font-bold transition-all relative",
        active ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
      )}
    >
      {icon} {label}
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full animate-in fade-in zoom-in duration-300" />}
    </button>
  );
}

function SectionCard({ title, children }: any) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">{title}</h3>
      {children}
    </div>
  );
}

function InputGroup({ label, value, icon }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-tight ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
        <input 
          defaultValue={value}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all outline-none"
        />
      </div>
    </div>
  );
}

function PasswordField({ label }: { label: string }) {
    const [show, setShow] = useState(false);
    return (
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-tight ml-1">{label}</label>
          <div className="relative">
            <input 
              type={show ? 'text' : 'password'}
              placeholder="••••••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all outline-none"
            />
            <button 
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
            >
                {show ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>
        </div>
    );
}

function ToggleItem({ title, description, defaultChecked }: any) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
            <div className="space-y-0.5">
                <p className="text-sm font-bold text-slate-800">{title}</p>
                <p className="text-xs text-slate-400 font-medium">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
        </div>
    )
}