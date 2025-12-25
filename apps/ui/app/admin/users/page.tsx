'use client';

import { 
  UserPlus, Search, ShieldCheck, UserCircle2, 
  MoreVertical, Mail, Building2, CalendarDays,
  UserCog, Filter, Fingerprint, Ban, CheckCircle
} from 'lucide-react';
import clsx from 'clsx';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'CLIENT_ADMIN' | 'CLIENT_USER';
  client: string;
  status: 'Active' | 'Disabled';
  createdAt: string;
};

// ... (MOCK_USERS stays the same)
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Sachin Sharma',
    email: 'admin@cms.com',
    role: 'SUPER_ADMIN',
    client: '-',
    status: 'Active',
    createdAt: '2025-01-10',
  },
  {
    id: '2',
    name: 'Rohit Verma',
    email: 'rohit@clienta.com',
    role: 'CLIENT_ADMIN',
    client: 'Client A',
    status: 'Active',
    createdAt: '2025-01-15',
  },
  {
    id: '3',
    name: 'Ankit Jain',
    email: 'ankit@clientb.com',
    role: 'CLIENT_USER',
    client: 'Client B',
    status: 'Disabled',
    createdAt: '2025-01-20',
  },
];

export default function UsersPage() {
  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-200">
            <UserCog size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Directory</h1>
            <p className="text-sm text-slate-500 font-medium">Manage access controls and platform permissions.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-md active:scale-95">
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      {/* ───────────────── SEARCH & FILTERS ───────────────── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
        <div className="relative flex-1 min-w-[300px] group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
          <input
            placeholder="Search by name, email or ID..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500/40 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <FilterChip label="All Roles" icon={<ShieldCheck size={14}/>} />
            <FilterChip label="Active Only" icon={<CheckCircle size={14}/>} />
            <FilterChip label="All Clients" icon={<Building2 size={14}/>} />
            <div className="h-6 w-[1px] bg-slate-200 mx-1" />
            <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200">
                <Filter size={18} />
            </button>
        </div>
      </div>

      {/* ───────────────── USERS TABLE ───────────────── */}
      <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <Th>User Profile</Th>
                <Th>Access Level</Th>
                <Th>Organization</Th>
                <Th>Status</Th>
                <Th>Joined Date</Th>
                <Th className="text-right"></Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_USERS.map((u) => (
                <tr key={u.id} className="group hover:bg-slate-50/80 transition-colors">
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm overflow-hidden shrink-0 group-hover:border-violet-200 transition-colors">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 truncate">{u.name}</span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Mail size={10} /> {u.email}
                        </span>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <RoleBadge role={u.role} />
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                            <Building2 size={12} />
                        </div>
                        <span className="text-sm font-semibold text-slate-600">{u.client === '-' ? 'Internal' : u.client}</span>
                    </div>
                  </Td>
                  <Td>
                    <StatusBadge status={u.status} />
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2 text-slate-500">
                        <CalendarDays size={14} className="text-slate-300" />
                        <span className="text-xs font-medium">{u.createdAt}</span>
                    </div>
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button className={clsx(
                            "p-2 rounded-lg transition-all",
                            u.status === 'Active' ? "text-slate-400 hover:text-red-600 hover:bg-red-50" : "text-emerald-600 hover:bg-emerald-50"
                        )} title={u.status === 'Active' ? 'Disable Access' : 'Enable Access'}>
                            {u.status === 'Active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between px-2">
          <p className="text-xs text-slate-400 font-medium">Showing {MOCK_USERS.length} active platform accounts</p>
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            <Fingerprint size={12} /> Secure Auth v2.4
          </div>
      </div>
    </div>
  );
}

/* ───────────────── COMPONENTS ───────────────── */

function RoleBadge({ role }: { role: User['role'] }) {
  const configs = {
    'SUPER_ADMIN': 'bg-violet-50 text-violet-700 border-violet-100 ring-violet-200/30',
    'CLIENT_ADMIN': 'bg-blue-50 text-blue-700 border-blue-100 ring-blue-200/30',
    'CLIENT_USER': 'bg-slate-50 text-slate-600 border-slate-100 ring-slate-200/30'
  };

  return (
    <span className={clsx(
      "inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-wider ring-2 ring-offset-1",
      configs[role]
    )}>
      {role.replace('_', ' ')}
    </span>
  );
}

function StatusBadge({ status }: { status: User['status'] }) {
  const isActive = status === 'Active';
  return (
    <span className={clsx(
      "inline-flex items-center gap-1.5 text-xs font-bold",
      isActive ? "text-emerald-600" : "text-slate-300"
    )}>
      <span className={clsx("h-1.5 w-1.5 rounded-full", isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300")} />
      {status}
    </span>
  );
}

function FilterChip({ label, icon }: { label: string, icon: React.ReactNode }) {
    return (
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:border-violet-300 hover:text-violet-600 transition-all whitespace-nowrap">
            {icon} {label}
            <ChevronDown size={12} className="text-slate-400" />
        </button>
    )
}

function Th({ children, className }: any) {
  return <th className={clsx("px-6 py-4 text-[11px] font-black uppercase tracking-[2px] text-slate-400", className)}>{children}</th>;
}

function Td({ children, className }: any) {
  return <td className={clsx("px-6 py-5 text-sm", className)}>{children}</td>;
}

function ChevronDown({ size, className }: { size: number, className?: string }) {
    return <MoreVertical size={size} className={clsx("rotate-90", className)} />;
}