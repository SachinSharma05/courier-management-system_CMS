'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ChevronLeft, ChevronRight, Package, Search, 
  MessageSquareWarning, Users, Truck, IndianRupee, UserCog, Shield, 
  AlertTriangle, ClipboardList, Settings, Menu, X, ChevronDown,
  BarChart3, PlusCircle, FileUp, Calculator, DollarSign, Edit3, Terminal,
  Hash, MapPin, MapPinCheckIcon, PackageSearch, Printer, XCircle, Warehouse
} from 'lucide-react';
import clsx from 'clsx';
import { Provider, ProviderDropdownProps, ProviderItem, SidebarLinkProps } from './layoutInterface';

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
      { label: 'Clients', href: '/admin/clients', icon: Users },
      { label: 'Pricing_Slabs', href: '/admin/pricing', icon: IndianRupee },
    ],
  },
  {
    title: 'Access_Protocol',
    items: [
      { label: 'Users', href: '/admin/users', icon: UserCog },
      { label: 'Employees', href: '/admin/employees', icon: Users },
      { label: 'Roles_Permission', href: '/admin/roles', icon: Shield },
    ],
  },
  // {
  //   title: 'System_Kernel',
  //   items: [
  //     { label: 'DLQ_Failures', href: '/admin/dlq', icon: AlertTriangle },
  //     { label: 'Audit_Registry', href: '/admin/audit', icon: ClipboardList },
  //     { label: 'Environment', href: '/admin/system', icon: Settings },
  //   ],
  // },
];

const PROVIDER_CONFIG: Provider[] = [
  {
    name: 'Delhivery',
    basePath: '/admin/providers/delhivery',
    items: [
      { key: '', label: 'Overview', icon: BarChart3 },
      { key: 'create', label: 'Create Shipment', icon: PlusCircle },
      { key: 'bulk', label: 'Bulk Create Shipment', icon: FileUp },
      { key: 'cost', label: 'Cost Calculator', icon: Calculator },
      { key: 'pincode', label: 'Pincode Serviceability', icon: MapPin },
      { key: 'label', label: 'Print Label', icon: Printer },
      { key: 'update', label: 'Update Shipment', icon: Edit3 },
      { key: 'ndr', label: 'NDR Reports', icon: AlertTriangle },
      { key: 'pickup', label: 'Pickup Shipment', icon: Warehouse},
      { key: 'cancel', label: 'Cancel Shipment', icon: XCircle },
    ]
  },
  {
    name: 'DTDC',
    basePath: '/admin/providers/dtdc',
    items: [
      { key: '', label: 'Overview', icon: BarChart3 },
      { key: 'create', label: 'Create Shipment', icon: PlusCircle },
      { key: 'bulk', label: 'Bulk Create Shipment', icon: FileUp },
      { key: 'cost', label: 'Cost Calculator', icon: Calculator },
      { key: 'pincode', label: 'Pincode Serviceability', icon: MapPin },
      { key: 'label', label: 'Print Label', icon: Printer },
      { key: 'ndr', label: 'NDR Reports', icon: AlertTriangle },
      { key: 'cancel', label: 'Cancel Shipment', icon: XCircle },
    ]
  },
  {
    name: 'Maruti',
    basePath: '/admin/providers/maruti',
    items: [
      { key: '', label: 'Overview', icon: BarChart3 },
      { key: 'create/ecomm', label: 'E-Comm Booking', icon: PlusCircle },
      { key: 'create/hyperlocal', label: 'Hyperlocal Booking', icon: PlusCircle },
      { key: 'label', label: 'Print Label Invoice', icon: Printer },
      { key: 'manifest', label: 'Manifest Shipping', icon: Hash },
      { key: 'tracking/ecomm', label: 'Track Ecomm', icon: MapPin },
      { key: 'tracking/hyperlocal', label: 'Track Hyperlocal', icon: MapPin },
      { key: 'pincode/ecomm', label: 'Pincode Serviceability Ecomm', icon: MapPinCheckIcon },
      { key: 'pincode/hyperlocal', label: 'Pincode Serviceability Hyperlocal', icon: MapPinCheckIcon },
      { key: 'cost', label: 'Cost Calculator', icon: DollarSign },
      { key: 'cancel', label: 'Cancel Shipment', icon: XCircle },
      { key: 'drs', label: 'DRS Console', icon: Truck },
      { key: 'prs', label: 'PRS Manager', icon: PackageSearch },
    ]
  }
];

export function Sidebar() {
  const [isLocked, setIsLocked] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  const pathname = usePathname();

  const isOpen = isLocked || isHovered;

  return (
    <>
      {/* MOBILE TRIGGER */}
      <div className="lg:hidden fixed top-4 left-4 z-[70]">
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-[#172b58] text-white shadow-lg border border-slate-700 rounded-sm"
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
          "fixed inset-y-0 left-0 z-[60] flex flex-col bg-[#0f172a] text-slate-400 transition-all duration-300 ease-in-out border-r border-slate-800",
          "lg:sticky lg:top-0 lg:h-screen",
          isMobileOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0",
          isOpen ? "w-64" : "w-20"
        )}
      >
        {/* DESKTOP LOCK TOGGLE */}
        <button 
          onClick={() => setIsLocked(!isLocked)}
          className="absolute -right-3 top-12 z-[70] hidden lg:flex h-6 w-6 items-center justify-center bg-slate-800 border border-slate-700 text-white hover:bg-indigo-600 transition-all shadow-xl rounded-full"
        >
          {isLocked ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>

        {/* LOGO AREA - Clean & Minimal */}
        <div className="flex h-20 shrink-0 items-center px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-indigo-600 rounded-xl font-black text-white shadow-sm">
            <Terminal size={14} />
          </div>
          <div className={clsx(
            "ml-3 transition-all duration-300 flex flex-col",
            (isOpen || isMobileOpen) ? "opacity-100" : "lg:opacity-0 lg:invisible"
          )}>
            <span className="text-lg font-bold text-white-900 tracking-tight leading-none">CMS_Pro</span>
            <span className="text-[10px] font-medium text-slate-400 mt-1">v1.0.4 • Stable</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 no-scrollbar">
          <SidebarLink 
            href="/admin" 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={pathname === '/admin'} 
            isOpen={isOpen}
          />

          <div className="pt-4 pb-2">
            {isOpen && <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Providers</p>}
            {PROVIDER_CONFIG.map((provider) => (
              <ProviderDropdown 
                key={provider.name}
                provider={provider}
                isOpen={isOpen}
                isExpanded={expandedProvider === provider.name}
                onToggle={() => setExpandedProvider(expandedProvider === provider.name ? null : provider.name)}
                pathname={pathname}
              />
            ))}
          </div>

          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="pt-2">
              {isOpen && <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">{section.title.replace('_', ' ')}</p>}
              {section.items.map((item) => (
                <SidebarLink 
                  key={item.href} 
                  {...item} 
                  isOpen={isOpen}
                  active={pathname.startsWith(item.href)}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* USER FOOTER - Minimalist profile */}
        <div className="p-4 border-t border-slate-600 bg-white-50">
          <div className={clsx("flex items-center gap-3", !isOpen && "justify-center")}>
            <div className="h-7 w-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600">
              SA
            </div>
            {isOpen && <span className="text-xs font-medium text-slate-700">Super Admin</span>}
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ href, icon: Icon, label, isOpen, active }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
        active 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
          : "text-slate-200 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon size={20} className={clsx(active ? "text-white" : "group-hover:scale-110 transition-transform")} />
      {isOpen && <span className="text-sm font-bold tracking-tight">{label}</span>}
      {!isOpen && active && <div className="absolute right-0 w-1 h-6 bg-indigo-500 rounded-l-full" />}
    </Link>
  );
}

function ProviderDropdown({ provider, isOpen, isExpanded, onToggle, pathname }: ProviderDropdownProps) {
  return (
    <div className="mb-2">
      <button 
        onClick={onToggle}
        className={clsx(
          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
          pathname.startsWith(provider.basePath) ? "text-white bg-white/5 border border-white/10" : "text-slate-200 hover:text-white hover:bg-white/5"
        )}
      >
        <Truck size={20} className={clsx(pathname.startsWith(provider.basePath) ? "text-indigo-400" : "group-hover:text-white")} />
        {isOpen && (
          <>
            <span className="flex-1 text-left text-sm font-bold tracking-tight">{provider.name}</span>
            <ChevronDown size={14} className={clsx("transition-transform duration-300", isExpanded && "rotate-180")} />
          </>
        )}
      </button>
      
      {isExpanded && isOpen && (
        <div className="ml-6 mt-2 space-y-1 border-l-2 border-slate-900 pl-4 animate-in slide-in-from-top-2 duration-300">
          {provider.items.map((item: ProviderItem) => {
            const fullPath = `${provider.basePath}${item.key ? `/${item.key}` : ''}`;
            // THE FIX: Check for exact match so multiple items don't light up
            const isSubItemActive = pathname === fullPath;

            return (
              <Link
                key={item.label}
                href={fullPath}
                className={clsx(
                  "block py-2 px-3 text-[12px] font-white tracking-widest rounded-lg transition-all",
                  isSubItemActive 
                    ? "text-indigo-400 bg-indigo-400/10 font-bold" 
                    : "text-slate-300 hover:text-slate-300 hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}