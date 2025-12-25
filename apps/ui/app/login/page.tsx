'use client';

import { useState } from 'react';
import { 
  ShieldCheck, Mail, Lock, Eye, EyeOff, 
  ArrowRight, Truck, Globe 
} from 'lucide-react';
import clsx from 'clsx';
import { api } from '@/lib/api/axios';
import router from 'next/router';

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    const res = await api.post('/auth/login', { email, password });

    // if using header token
    localStorage.setItem('access_token', res.data.access_token);

    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-white flex">
      
      {/* ───────────────── LEFT SIDE: LOGIN FORM ───────────────── */}
      <div className="w-full lg:w-[480px] p-8 md:p-16 flex flex-col justify-center animate-in fade-in slide-in-from-left duration-700">
        
        <div className="mb-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
            <Truck size={22} fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">CMS LOGISTICS</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 font-medium mt-2">Enter your credentials to access the management portal.</p>
        </div>

        {/* Standard Form Inputs (Visual Only for now) */}
        <div className="space-y-4 mb-8">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                placeholder="admin@cms-logistics.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type={showPass ? 'text' : 'password'} 
                placeholder="••••••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 py-3.5 text-sm font-semibold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all"
              />
              <button 
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="text-xs font-bold text-indigo-600 hover:underline">Forgot Password?</button>
          </div>
        </div>

        {/* ───────────────── ACTION BUTTONS ───────────────── */}
        <div className="space-y-3">
          <LoginButton 
            onClick={submit}
            label="Sign in as Administrator"
            variant="primary"
          />
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[3px] text-slate-300 bg-white px-4">OR</div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-slate-400 font-medium">
          Protected by industry-standard encryption. <br />
          Need help? <span className="text-indigo-600 font-bold cursor-pointer">Contact System Admin</span>
        </p>
      </div>

      {/* ───────────────── RIGHT SIDE: BRANDING/VISUAL ───────────────── */}
      <div className="hidden lg:flex flex-1 bg-slate-900 relative items-center justify-center p-20 overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl -mr-96 -mt-96" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl -ml-64 -mb-64" />
        
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="h-1 bg-indigo-500 w-20 rounded-full" />
          <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
            Efficiency <br /> In Motion.
          </h2>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            The next generation of logistics management. Track shipments, manage carriers, and optimize your supply chain in one centralized dashboard.
          </p>
          
          <div className="grid grid-cols-2 gap-6 pt-8">
            <Stat label="Total Shipments" value="2.4M+" />
            <Stat label="Active Carriers" value="48" />
          </div>
        </div>

        {/* Visual Cue: Global Network */}
        <div className="absolute bottom-10 right-10 flex items-center gap-3 text-slate-500">
          <Globe size={20} className="animate-spin-slow" />
          <span className="text-[10px] font-black uppercase tracking-widest">Global Logistics Network</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── COMPONENTS ───────────────── */

function LoginButton({ label, onClick, isLoading, variant }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={isLoading}
      className={clsx(
        "w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-70",
        variant === 'primary' 
          ? "bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-slate-800" 
          : "bg-white border-2 border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200"
      )}
    >
      <div className="flex items-center gap-3">
        {isLoading ? (
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <ShieldCheck size={18} className={variant === 'primary' ? 'text-indigo-400' : 'text-slate-400'} />
        )}
        {label}
      </div>
      <ArrowRight size={18} className={clsx("transition-transform", isLoading ? "translate-x-4 opacity-0" : "group-hover:translate-x-1")} />
    </button>
  );
}

function Stat({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[2px]">{label}</p>
            <p className="text-3xl font-black text-white">{value}</p>
        </div>
    )
}