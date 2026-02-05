'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ChevronLeft, ChevronRight, Package, Search, 
  MessageSquareWarning, Users, Truck, IndianRupee, UserCog, Shield, 
  AlertTriangle, ClipboardList, Settings, Menu, X, 
  BarChart3,
  PlusCircle,
  FileUp,
  Calculator,
  DollarSign,
  Edit3,
  Hash,
  MapPin,
  MapPinCheckIcon,
  PackageSearch,
  Printer,
  XCircle,
  ChevronDown,
  Terminal,
  SearchIcon,
  Warehouse
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
  {
    title: 'System_Kernel',
    items: [
      { label: 'DLQ_Failures', href: '/admin/dlq', icon: AlertTriangle },
      { label: 'Audit_Registry', href: '/admin/audit', icon: ClipboardList },
      { label: 'Environment', href: '/admin/system', icon: Settings },
    ],
  },
];

const PROVIDER_CONFIG = [
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

// export function Sidebar() {
//   const [isLocked, setIsLocked] = useState(true);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
//   const pathname = usePathname();

//   const isOpen = isLocked || isHovered;

//   return (
//     <>
//       {/* MOBILE TRIGGER */}
//       <div className="lg:hidden fixed top-4 left-4 z-[70]">
//         <button 
//           onClick={() => setIsMobileOpen(!isMobileOpen)}
//           className="p-2 bg-[#172b58] text-white shadow-lg border border-slate-700 rounded-sm"
//         >
//           {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
//         </button>
//       </div>

//       {isMobileOpen && (
//         <div 
//           className="fixed inset-0 z-[55] bg-slate-950/80 backdrop-blur-sm lg:hidden"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}

//       <aside 
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         className={clsx(
//           "fixed inset-y-0 left-0 z-[60] flex flex-col bg-[#0f172a] text-slate-400 transition-all duration-300 ease-in-out border-r border-slate-800",
//           "lg:sticky lg:top-0 lg:h-screen",
//           isMobileOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0",
//           isOpen ? "lg:w-64" : "lg:w-20"
//         )}
//       >
//         {/* DESKTOP LOCK TOGGLE */}
//         <button 
//           onClick={() => setIsLocked(!isLocked)}
//           className="absolute -right-3 top-12 z-[70] hidden lg:flex h-6 w-6 items-center justify-center bg-slate-800 border border-slate-700 text-white hover:bg-indigo-600 transition-all shadow-xl rounded-full"
//         >
//           {isLocked ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
//         </button>

//         {/* LOGO NODE */}
//         <div className="flex h-20 shrink-0 items-center px-6">
//           <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-indigo-600 rounded-xl font-black text-white shadow-sm">
//             <Terminal size={20} />
//           </div>
//           <div className={clsx(
//             "ml-3 transition-all duration-300 flex flex-col",
//             (isOpen || isMobileOpen) ? "opacity-100" : "lg:opacity-0 lg:invisible"
//           )}>
//             <span className="text-lg font-bold text-white-900 tracking-tight leading-none">CMS_Pro</span>
//             <span className="text-[10px] font-medium text-slate-400 mt-1">v1.0.4 • Stable</span>
//           </div>
//         </div>

//         {/* NAVIGATION TERMINAL */}
//         <nav className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-2 py-6 space-y-8">
//           <div className="space-y-1">
//             <SidebarLink 
//                 href="/admin" 
//                 icon={LayoutDashboard} 
//                 label="Dashboard" 
//                 active={pathname === '/admin'} 
//                 isOpen={isOpen || isMobileOpen}
//                 onClick={() => setIsMobileOpen(false)}
//             />
//           </div>

//           {/* PROVIDER DROPDOWN SECTION */}
//           <div className="space-y-2">
//              <div className={clsx(
//                 "px-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2 mb-2",
//                 !isOpen && "lg:justify-center lg:px-0"
//              )}>
//                <div className="h-px w-2 bg-slate-700" /> {isOpen && "Provider_Stack"}
//              </div>
             
//              {PROVIDER_CONFIG.map((provider) => (
//                <ProviderDropdown 
//                   key={provider.name}
//                   provider={provider}
//                   isOpen={isOpen || isMobileOpen}
//                   isExpanded={expandedProvider === provider.name}
//                   onToggle={() => setExpandedProvider(expandedProvider === provider.name ? null : provider.name)}
//                   pathname={pathname}
//                />
//              ))}
//           </div>

//           {NAV_SECTIONS.map((section) => (
//             <div key={section.title} className="space-y-2">
//               <div className={clsx(
//                 "px-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 transition-opacity flex items-center gap-2",
//                 (isOpen || isMobileOpen) ? "opacity-100" : "lg:opacity-0"
//               )}>
//                 <div className="h-px w-2 bg-slate-700" /> {section.title}
//               </div>
//               <div className="space-y-1">
//                 {section.items.map((item) => (
//                     <SidebarLink 
//                     key={item.href} 
//                     {...item} 
//                     isOpen={isOpen || isMobileOpen}
//                     active={pathname.startsWith(item.href)}
//                     onClick={() => setIsMobileOpen(false)}
//                     />
//                 ))}
//               </div>
//             </div>
//           ))}
//         </nav>

//         {/* OPERATOR STATUS FOOTER (MAX READABILITY) */}
//         <div className="mt-auto border-t border-slate-800 p-4 bg-slate-900/30">
//           <div className={clsx(
//             "flex items-center gap-3 transition-all duration-300 bg-slate-900/50 p-2 border border-slate-800 rounded-sm",
//             (isOpen || isMobileOpen) ? "opacity-100" : "lg:opacity-0 lg:invisible"
//           )}>
//             <div className="h-9 w-9 bg-slate-800 flex items-center justify-center text-[11px] font-black text-white border border-slate-700 rounded-sm shadow-inner">
//               SA
//             </div>
//             <div className="flex flex-col">
//               <span className="text-[10px] font-black text-white uppercase tracking-tight leading-none">Super_Admin</span>
//               <div className="flex items-center gap-1.5 mt-1">
//                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
//                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Online</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }

// function ProviderDropdown({ provider, isOpen, isExpanded, onToggle, pathname }: any) {
//   const isActive = pathname.startsWith(provider.basePath);

//   return (
//     <div className="space-y-1">
//       <button 
//         onClick={onToggle}
//         className={clsx(
//           "w-full flex items-center gap-4 px-3 py-2.5 transition-all duration-200 border-l-2 group",
//           isActive ? "text-white border-indigo-500 bg-indigo-500/10" : "border-transparent hover:bg-slate-800 text-slate-400 hover:text-white"
//         )}
//       >
//         <Truck size={16} className={clsx(isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
//         {isOpen && (
//           <>
//             <span className="flex-1 text-left text-[11px] font-black uppercase tracking-widest leading-none">{provider.name}</span>
//             <ChevronDown size={12} className={clsx("transition-transform duration-200", isExpanded && "rotate-180")} />
//           </>
//         )}
//       </button>

//       {isExpanded && isOpen && (
//         <div className="ml-4 border-l border-slate-800 space-y-0.5 mt-1 animate-in slide-in-from-top-2 duration-200">
//           {provider.items.map((item: any) => {
//             const fullPath = `${provider.basePath}${item.key ? `/${item.key}` : ''}`;
//             const isCurrent = pathname === fullPath;
//             return (
//               <Link
//                 key={item.label}
//                 href={fullPath}
//                 className={clsx(
//                   "flex items-center gap-3 pl-6 pr-3 py-2 text-[10px] font-bold uppercase transition-all",
//                   isCurrent 
//                     ? "text-indigo-400 bg-indigo-500/10" 
//                     : "text-slate-400 hover:text-white hover:bg-white/5"
//                 )}
//               >
//                 <item.icon size={12} className={isCurrent ? "text-indigo-400" : "text-slate-500"} />
//                 <span className="truncate tracking-wide">{item.label}</span>
//               </Link>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// function SidebarLink({ href, icon: Icon, label, active, isOpen, onClick }: any) {
//   return (
//     <Link
//       href={href}
//       onClick={onClick}
//       className={clsx(
//         'group relative flex items-center gap-4 px-3 py-2.5 transition-all duration-200 border-l-2',
//         active 
//             ? 'bg-indigo-600/10 border-indigo-600 text-white shadow-[inset_4px_0_10px_rgba(79,70,229,0.1)]' 
//             : 'border-transparent hover:bg-slate-800/50 text-slate-400 hover:text-white'
//       )}
//     >
//       <Icon className={clsx("h-4 w-4 shrink-0 transition-colors", active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
//       <span className={clsx(
//         "truncate text-[11px] font-bold uppercase tracking-widest transition-all duration-300",
//         isOpen ? "opacity-100 translate-x-0" : "lg:opacity-0 lg:-translate-x-4 lg:invisible"
//       )}>
//         {label}
//       </span>
//       {active && isOpen && (
//           <div className="absolute right-3">
//             <div className="h-1 w-1 rounded-full bg-indigo-500 animate-ping" />
//           </div>
//       )}
//     </Link>
//   );
// }

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
          className="p-2 bg-white text-slate-600 shadow-sm border border-slate-200 rounded-lg"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <aside 
        className={clsx(
          "fixed inset-y-0 left-0 z-[60] flex flex-col bg-[#F8FAFC] border-r border-slate-200 transition-[width] duration-200 ease-in-out",
          "lg:sticky lg:top-0 lg:h-screen",
          isMobileOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0",
          isOpen ? "w-64" : "w-20"
        )}
      >
        {/* LOGO AREA - Clean & Minimal */}
        <div className="flex h-14 items-center px-6 border-b border-slate-100">
          <div className="h-7 w-7 bg-slate-900 rounded flex items-center justify-center text-white shrink-0">
            <Terminal size={14} />
          </div>
          {isOpen && <span className="ml-3 text-sm font-bold text-slate-900">CMS_PRO</span>}
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
        <div className="p-4 border-t border-slate-200 bg-white-50">
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

function SidebarLink({ href, icon: Icon, label, active, isOpen }: any) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
        active 
          ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
      )}
    >
      <Icon size={18} className={clsx(active ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600")} />
      {isOpen && <span className="text-sm font-medium tracking-tight">{label}</span>}
    </Link>
  );
}

function ProviderDropdown({ provider, isOpen, isExpanded, onToggle, pathname }: any) {
  const isActive = pathname.startsWith(provider.basePath);
  return (
    <div className="mb-1">
      <button 
        onClick={onToggle}
        className={clsx(
          "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all",
          isActive ? "text-slate-900 font-semibold" : "text-slate-500 hover:bg-slate-100"
        )}
      >
        <Truck size={18} className={isActive ? "text-slate-900" : "text-slate-400"} />
        {isOpen && (
          <>
            <span className="flex-1 text-left text-sm font-medium">{provider.name}</span>
            <ChevronDown size={14} className={clsx("transition-transform", isExpanded && "rotate-180")} />
          </>
        )}
      </button>
      {isExpanded && isOpen && (
        <div className="ml-7 mt-1 space-y-1 border-l border-slate-200 pl-2">
          {provider.items.map((item: any) => (
            <Link
              key={item.label}
              href={`${provider.basePath}${item.key ? `/${item.key}` : ''}`}
              className={clsx(
                "block py-1.5 px-3 text-xs rounded-md transition-all",
                pathname.includes(item.key) ? "text-indigo-600 bg-indigo-50 font-medium" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}