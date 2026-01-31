'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ChevronLeft, ChevronRight, Package, Search, 
  MessageSquareWarning, Users, Truck, IndianRupee, UserCog, Shield, 
  AlertTriangle, ClipboardList, Settings, Menu, X, Terminal, Activity
} from 'lucide-react';
import clsx from 'clsx';

const NAV_SECTIONS = [
  {
    title: 'Operations_Control',
    items: [
      { label: 'Consignments', href: '/admin/consignments', icon: Package },
      { label: 'Live_Tracking', href: '/admin/tracking', icon: Search },
      { label: 'Complaints_Desk', href: '/admin/complaints', icon: MessageSquareWarning },
    ],
  },
  {
    title: 'Entity_Management',
    items: [
      { label: 'Client_Nodes', href: '/admin/clients', icon: Users },
      { label: 'Provider_Matrix', href: '/admin/providers', icon: Truck },
      { label: 'Pricing_Slabs', href: '/admin/pricing', icon: IndianRupee },
    ],
  },
  {
    title: 'Access_Protocol',
    items: [
      { label: 'User_Index', href: '/admin/users', icon: UserCog },
      { label: 'Employee_Registry', href: '/admin/employees', icon: Users },
      { label: 'Security_Roles', href: '/admin/roles', icon: Shield },
    ],
  },
  {
    title: 'System_Kernel',
    items: [
      { label: 'DLQ_Failures', href: '/admin/dlq', icon: AlertTriangle },
      { label: 'Audit_Registry', href: '/admin/audit', icon: ClipboardList },
      { label: 'Environment', href: '/admin/system', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const [isLocked, setIsLocked] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const isOpen = isLocked || isHovered;

  return (
    <>
      {/* MOBILE TRIGGER */}
      <div className="lg:hidden fixed top-4 left-4 z-[70]">
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-slate-900 text-white shadow-lg border border-slate-700"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-[55] bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={clsx(
          "fixed inset-y-0 left-0 z-[60] flex flex-col bg-slate-950 text-slate-400 transition-all duration-300 ease-in-out border-r border-slate-800",
          "lg:sticky lg:top-0 lg:h-screen",
          isMobileOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0",
          isOpen ? "lg:w-64" : "lg:w-20"
        )}
      >
        {/* DESKTOP LOCK TOGGLE */}
        <button 
          onClick={() => setIsLocked(!isLocked)}
          className="absolute -right-3 top-12 z-[70] hidden lg:flex h-6 w-6 items-center justify-center bg-slate-900 border border-slate-700 text-white hover:bg-indigo-600 transition-colors shadow-xl"
        >
          {isLocked ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>

        {/* LOGO NODE */}
        <div className="flex h-16 shrink-0 items-center px-5 border-b border-slate-900 bg-slate-950">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-indigo-600 rounded-sm font-black text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            CMS
          </div>
          <div className={clsx(
            "ml-3 transition-all duration-300 flex flex-col",
            (isOpen || isMobileOpen) ? "opacity-100" : "lg:opacity-0 lg:invisible"
          )}>
            <span className="text-xs font-black text-white uppercase tracking-[0.2em] leading-none">Command_Center</span>
            <span className="text-[9px] font-bold text-slate-600 uppercase mt-1">Platform_Node_v1.0.4</span>
          </div>
        </div>

        {/* NAVIGATION TERMINAL */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-2 py-6 space-y-8">
          <div className="space-y-1">
            <SidebarLink 
                href="/admin" 
                icon={LayoutDashboard} 
                label="Primary_Dashboard" 
                active={pathname === '/admin'} 
                isOpen={isOpen || isMobileOpen}
                onClick={() => setIsMobileOpen(false)}
            />
          </div>

          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-2">
              <div className={clsx(
                "px-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 transition-opacity flex items-center gap-2",
                (isOpen || isMobileOpen) ? "opacity-100" : "lg:opacity-0"
              )}>
                <div className="h-px w-2 bg-slate-800" /> {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                    <SidebarLink 
                    key={item.href} 
                    {...item} 
                    isOpen={isOpen || isMobileOpen}
                    active={pathname.startsWith(item.href)}
                    onClick={() => setIsMobileOpen(false)}
                    />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* OPERATOR STATUS FOOTER */}
        <div className="mt-auto border-t border-slate-900 p-4 bg-slate-950/50">
          <div className={clsx(
            "flex items-center gap-3 transition-all duration-300 bg-slate-900/50 p-2 border border-slate-800/50 rounded-sm",
            (isOpen || isMobileOpen) ? "opacity-100" : "lg:opacity-0 lg:invisible"
          )}>
            <div className="h-8 w-8 bg-slate-800 flex items-center justify-center text-[10px] font-black text-indigo-400 border border-slate-700">SA</div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white uppercase tracking-tight">Super_Admin</span>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">Status: Online</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ href, icon: Icon, label, active, isOpen, onClick }: any) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        'group relative flex items-center gap-4 px-3 py-2.5 transition-all duration-200 border-l-2',
        active 
            ? 'bg-indigo-600/10 border-indigo-600 text-white shadow-[inset_4px_0_10px_rgba(79,70,229,0.1)]' 
            : 'border-transparent hover:bg-slate-900/50 hover:text-slate-200'
      )}
    >
      <Icon className={clsx("h-4 w-4 shrink-0 transition-colors", active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
      <span className={clsx(
        "truncate text-[11px] font-black uppercase tracking-widest transition-all duration-300",
        isOpen ? "opacity-100 translate-x-0" : "lg:opacity-0 lg:-translate-x-4 lg:invisible"
      )}>
        {label}
      </span>
      {active && isOpen && (
          <div className="absolute right-2">
            <Activity size={10} className="text-indigo-500/50 animate-pulse" />
          </div>
      )}
    </Link>
  );
}