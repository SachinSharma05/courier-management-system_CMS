"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, User, Settings, LogOut, Terminal, ShieldCheck, Activity } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [awbSearch, setAwbSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!awbSearch.trim()) return;
    router.push(`/admin/tracking?awb=${encodeURIComponent(awbSearch.trim())}`);
    setAwbSearch('');
  };

  const logout = async () => {
    try {
      router.replace('/login');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      {/* ───────────────── ERP NAVIGATION PATH ───────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2 py-1 bg-slate-900 rounded-sm">
          <Terminal size={12} className="text-indigo-400" />
          <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Root</span>
        </div>
        <span className="text-slate-300 font-mono text-xs">/</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pages</span>
          <span className="text-slate-300 font-mono text-xs">/</span>
          <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-b-2 border-indigo-600 pb-0.5">Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* ───────────────── COMMAND SEARCH INTERFACE ───────────────── */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-sm px-3 py-1.5 transition-all w-72 focus-within:border-slate-400 focus-within:bg-white"
        >
          <span className="text-[9px] font-black text-slate-400 uppercase mr-2 tracking-tighter shrink-0">Search_AWB:</span>
          <input 
            type="text" 
            placeholder="INPUT_ID..." 
            value={awbSearch}
            onChange={(e) => setAwbSearch(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-[11px] w-full font-mono font-bold text-slate-700 placeholder:text-slate-300 uppercase" 
          />
          <Search size={14} className="text-slate-400 ml-2" />
        </form>

        <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden md:block" />

        {/* ───────────────── USER NODE DROPDOWN ───────────────── */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1 rounded-sm border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all"
          >
            <div className="h-8 w-8 bg-slate-900 flex items-center justify-center text-white rounded-sm shadow-md font-black text-[10px] tracking-tighter">
              SA
            </div>
            <div className="hidden text-left lg:block leading-none">
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Super_Admin</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Node_Active</p>
              </div>
            </div>
            <ChevronDown size={12} className={clsx("text-slate-400 transition-transform", isProfileOpen && "rotate-180")} />
          </button>

          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-sm shadow-xl py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Session_Identity</p>
                  <p className="text-[10px] font-bold text-slate-900 truncate">admin@terminal-core.sys</p>
                </div>
                
                <div className="p-1">
                  <HeaderLink href="/admin/profile" icon={<User size={14} />} label="View_Profile_Data" />
                  <HeaderLink href="/admin/settings" icon={<Settings size={14} />} label="System_Configs" />
                  <HeaderLink href="/admin/audit" icon={<Activity size={14} />} label="Security_Audit" />
                </div>

                <div className="p-1 mt-1 border-t border-slate-100">
                  <button 
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 transition-colors rounded-sm"
                  >
                    <LogOut size={14} /> Terminate_Session
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function HeaderLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all rounded-sm"
    >
      <span className="text-slate-400">{icon}</span>
      {label}
    </Link>
  );
}