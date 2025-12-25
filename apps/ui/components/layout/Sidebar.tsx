'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ChevronLeft, ChevronRight, Package, Search, 
  MessageSquareWarning, Users, Truck, IndianRupee, UserCog, Shield, 
  AlertTriangle, ClipboardList, Settings, Menu, X 
} from 'lucide-react';
import clsx from 'clsx';

const NAV_SECTIONS = [
  {
    title: 'Operations',
    items: [
      { label: 'Consignments', href: '/admin/consignments', icon: Package },
      { label: 'Tracking', href: '/admin/tracking', icon: Search },
      { label: 'Complaints', href: '/admin/complaints', icon: MessageSquareWarning },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Clients', href: '/admin/clients', icon: Users },
      { label: 'Providers', href: '/admin/providers', icon: Truck },
      { label: 'Pricing', href: '/admin/pricing', icon: IndianRupee },
    ],
  },
  {
    title: 'People',
    items: [
      { label: 'Users', href: '/admin/users', icon: UserCog },
      { label: 'Employees', href: '/admin/employees', icon: Users },
      { label: 'Roles & Permissions', href: '/admin/roles', icon: Shield },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'DLQ / Failures', href: '/admin/dlq', icon: AlertTriangle },
      { label: 'Audit Logs', href: '/admin/audit', icon: ClipboardList },
      { label: 'System', href: '/admin/system', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const [isLocked, setIsLocked] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false); // New state for mobile
  const pathname = usePathname();

  const isOpen = isLocked || isHovered;

  return (
    <>
      {/* 1. MOBILE HAMBURGER (Visible only on small screens) */}
      <div className="lg:hidden fixed top-4 left-4 z-[70]">
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg bg-slate-900 text-white shadow-lg"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 2. MOBILE OVERLAY (Black backdrop when menu is open) */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 3. SIDEBAR MAIN */}
      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={clsx(
          // Mobile: absolute/fixed | Desktop: sticky
          "fixed inset-y-0 left-0 z-[60] flex flex-col bg-slate-950 text-slate-300 transition-all duration-300 ease-in-out border-r border-slate-800",
          // Desktop behavior
          "lg:sticky lg:top-0 lg:h-screen",
          // Responsive Width Logic
          isMobileOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0",
          isOpen ? "lg:w-64" : "lg:w-20"
        )}
      >
        {/* Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setIsLocked(!isLocked)}
          className="absolute -right-3 top-20 z-[70] hidden lg:flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-white shadow-md hover:bg-indigo-600 transition-colors"
        >
          {isLocked ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Logo Section (Shrink-0 prevents it from squishing) */}
        <div className="flex h-16 shrink-0 items-center px-5 border-b border-slate-900">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-lg">
            CMS
          </div>
          <span className={clsx(
            "ml-3 truncate text-lg font-bold text-white transition-all duration-300",
            (isOpen || isMobileOpen) ? "opacity-100" : "lg:opacity-0 lg:invisible"
          )}>
            Admin Panel
          </span>
        </div>

        {/* Navigation - Scrollable area */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-3 py-4 space-y-6">
          <SidebarLink 
            href="/admin" 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={pathname === '/admin'} 
            isOpen={isOpen || isMobileOpen}
            onClick={() => setIsMobileOpen(false)}
          />

          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className={clsx(
                "px-4 text-[10px] font-bold uppercase tracking-[2px] text-slate-500 transition-opacity",
                (isOpen || isMobileOpen) ? "opacity-100" : "lg:opacity-0"
              )}>
                {section.title}
              </p>
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
          ))}
        </nav>

        {/* Footer (Fixed at bottom) */}
        <div className="mt-auto border-t border-slate-900 p-4">
          <div className={clsx(
            "flex items-center gap-3 transition-all duration-300",
            (isOpen || isMobileOpen) ? "opacity-100" : "lg:opacity-0 lg:invisible"
          )}>
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">SA</div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Super Admin</span>
              <span className="text-[10px] text-slate-500">v1.0.4</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ href, icon: Icon, label, active, isOpen, color, onClick }: any) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        'group flex items-center gap-4 rounded-xl px-3 py-2.5 transition-all',
        active ? 'bg-indigo-600 text-white' : 'hover:bg-slate-900 hover:text-white'
      )}
    >
      <Icon className={clsx("h-5 w-5 shrink-0", active ? "text-white" : color)} />
      <span className={clsx(
        "truncate text-sm font-medium transition-all duration-300",
        isOpen ? "opacity-100 translate-x-0" : "lg:opacity-0 lg:-translate-x-4 lg:invisible"
      )}>
        {label}
      </span>
    </Link>
  );
}