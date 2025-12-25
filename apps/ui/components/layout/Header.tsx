'use client';
import { useState } from 'react';
import { Bell, Search, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import clsx from 'clsx'
import Link from 'next/link';

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="text-sm font-medium">Pages</span>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-semibold text-slate-900">Dashboard</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-1.5 border border-transparent focus-within:border-indigo-300 transition-all">
          <Search size={16} className="text-slate-400" />
          <input type="text" placeholder="Search..." className="bg-transparent border-none focus:ring-0 text-sm w-40" />
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-100 transition-all"
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-sm font-bold text-xs">
              SA
            </div>
            <div className="hidden text-left lg:block">
              <p className="text-xs font-bold text-slate-900 leading-tight">Super Admin</p>
              <p className="text-[10px] text-slate-500">Administrator</p>
            </div>
            <ChevronDown size={14} className={clsx("text-slate-400 transition-transform", isProfileOpen && "rotate-180")} />
          </button>

          {/* Actual Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95">
              <Link href="/admin/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                <User size={16} /> Profile
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                <Settings size={16} /> Settings
              </Link>
              <div className="my-1 h-[1px] bg-slate-100" />
              <button 
                onClick={() => console.log("Logout")}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}