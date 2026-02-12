"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, User, Settings, LogOut, Activity, Bell } from 'lucide-react';
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
    router.replace('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-indigo-900/60 px-6">

      {/* ───────────────── BREADCRUMBS: CLEAN & MINIMAL ───────────────── */}
      <div className="flex items-center gap-2 text-[14px] font-medium">
        <span className="text-white">Variable Instinct Services</span>
        <span className="text-white">/</span>
        <span className="text-white">Courier Management System</span>
      </div>

      <div className="flex items-center gap-4">
        {/* ───────────────── SEARCH: VERCEL-STYLE ───────────────── */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex items-center relative group"
        >
          <Search 
            size={15} 
            className="absolute left-3 text-slate-400" 
          />
          <input 
            type="text" 
            placeholder="Search AWB..." 
            value={awbSearch}
            onChange={(e) => setAwbSearch(e.target.value)}
            className="bg-[#f4f4f5] border-transparent rounded-md px-9 py-1.5 text-xs w-100 focus:bg-white focus:border-slate-300 focus:ring-0 transition-colors placeholder:text-slate-500"
          />
        </form>

        <div className="h-6 w-[1px] bg-slate-200" />

        {/* ───────────────── USER DROPDOWN ───────────────── */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded-md transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
              SA
            </div>
            <ChevronDown size={14} className={clsx("text-slate-400 transition-transform duration-200", isProfileOpen && "rotate-180")} />
          </button>

          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)} />
              <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">Super Admin</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">admin@terminal-core.sys</p>
                </div>
                
                <div className="p-1.5">
                  <HeaderLink href="/admin/profile" icon={<User size={15} />} label="Account Settings" />
                  <HeaderLink href="/admin/settings" icon={<Settings size={15} />} label="Team Config" />
                  <HeaderLink href="/admin/audit" icon={<Activity size={15} />} label="Security Log" />
                </div>

                <div className="p-1.5 mt-1 border-t border-slate-100">
                  <button 
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors rounded-lg"
                  >
                    <LogOut size={15} /> Sign out
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
      className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all rounded-lg"
    >
      <span className="text-slate-400">{icon}</span>
      {label}
    </Link>
  );
}