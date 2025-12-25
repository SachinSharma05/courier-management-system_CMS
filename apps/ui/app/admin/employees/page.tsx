'use client';

import { 
  Users2, UserPlus, Search, Briefcase, 
  Building, Mail, ShieldCheck, MoreHorizontal,
  BadgeCheck, Wallet, Headphones, Settings2,
  Lock, Unlock
} from 'lucide-react';
import clsx from 'clsx';

type Employee = {
  id: string;
  name: string;
  email: string;
  role: 'OPS' | 'SUPPORT' | 'FINANCE' | 'ADMIN';
  department: string;
  status: 'Active' | 'Disabled';
  createdAt: string;
};

// ... (MOCK_EMPLOYEES stays the same)
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'Amit Kumar',
    email: 'amit.ops@cms.com',
    role: 'OPS',
    department: 'Operations',
    status: 'Active',
    createdAt: '2025-01-05',
  },
  {
    id: '2',
    name: 'Neha Sharma',
    email: 'neha.support@cms.com',
    role: 'SUPPORT',
    department: 'Customer Support',
    status: 'Active',
    createdAt: '2025-01-12',
  },
  {
    id: '3',
    name: 'Rahul Mehta',
    email: 'rahul.finance@cms.com',
    role: 'FINANCE',
    department: 'Finance',
    status: 'Disabled',
    createdAt: '2025-01-20',
  },
];

export default function EmployeesPage() {
  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-cyan-600 flex items-center justify-center text-white shadow-lg shadow-cyan-200">
            <Users2 size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Directory</h1>
            <p className="text-sm text-slate-500 font-medium">Manage internal logistics staff and operational roles.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-md active:scale-95">
          <UserPlus size={18} /> Add Staff Member
        </button>
      </div>

      {/* ───────────────── QUICK DEPT SUMMARY ───────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DeptStat label="Operations" count={14} color="blue" icon={<Briefcase size={16}/>} />
        <DeptStat label="Support" count={8} color="green" icon={<Headphones size={16}/>} />
        <DeptStat label="Finance" count={4} color="amber" icon={<Wallet size={16}/>} />
        <DeptStat label="Management" count={3} color="purple" icon={<BadgeCheck size={16}/>} />
      </div>

      {/* ───────────────── FILTERS ───────────────── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            placeholder="Search staff by name or email..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/40 transition-all"
          />
        </div>
        <select className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 outline-none bg-white hover:border-slate-300">
          <option>All Departments</option>
          <option>Operations</option>
          <option>Customer Support</option>
          <option>Finance</option>
        </select>
        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all border border-slate-100">
          <Settings2 size={18} />
        </button>
      </div>

      {/* ───────────────── EMPLOYEES TABLE ───────────────── */}
      <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <Th>Staff Member</Th>
                <Th>Internal Role</Th>
                <Th>Department</Th>
                <Th>Status</Th>
                <Th>Onboarding</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_EMPLOYEES.map((e) => (
                <tr key={e.id} className="group hover:bg-slate-50/80 transition-colors">
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-700 font-black text-xs border border-white shadow-sm shrink-0">
                        {e.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-tight">{e.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{e.email}</span>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <RoleBadge role={e.role} />
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <Building size={14} className="text-slate-300" />
                      <span className="text-xs">{e.department}</span>
                    </div>
                  </Td>
                  <Td>
                    <StatusBadge status={e.status} />
                  </Td>
                  <Td>
                    <span className="text-xs font-medium text-slate-500">{e.createdAt}</span>
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        className={clsx(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border",
                          e.status === 'Active' 
                            ? "text-red-500 border-transparent hover:bg-red-50 hover:border-red-100" 
                            : "text-emerald-600 border-transparent hover:bg-emerald-50 hover:border-emerald-100"
                        )}
                      >
                        {e.status === 'Active' ? <Lock size={12}/> : <Unlock size={12}/>}
                        {e.status === 'Active' ? 'REVOKE' : 'GRANT'}
                      </button>
                      <button className="p-2 text-slate-300 hover:text-slate-600">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── COMPONENTS ───────────────── */

function RoleBadge({ role }: { role: Employee['role'] }) {
  const configs = {
    OPS: 'bg-blue-50 text-blue-700 border-blue-100',
    SUPPORT: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    FINANCE: 'bg-amber-50 text-amber-700 border-amber-100',
    ADMIN: 'bg-purple-50 text-purple-700 border-purple-100',
  };

  return (
    <span className={clsx(
      "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black border uppercase tracking-wider",
      configs[role]
    )}>
      {role}
    </span >
  );
}

function StatusBadge({ status }: { status: Employee['status'] }) {
  const isActive = status === 'Active';
  return (
    <div className={clsx(
      "flex items-center gap-1.5 px-2 py-1 rounded-full w-fit border",
      isActive ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-slate-50 border-slate-100 text-slate-400"
    )}>
      <div className={clsx("h-1 w-1 rounded-full", isActive ? "bg-emerald-500" : "bg-slate-300")} />
      <span className="text-[10px] font-bold uppercase tracking-tight">{status}</span>
    </div>
  );
}

function DeptStat({ label, count, color, icon }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    green: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
  };
  return (
    <div className={clsx("flex items-center justify-between p-3 rounded-2xl border shadow-sm", colors[color])}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/50">{icon}</div>
        <span className="text-xs font-bold">{label}</span>
      </div>
      <span className="text-lg font-black">{count}</span>
    </div>
  );
}

function Th({ children, className }: any) {
  return <th className={clsx("px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400", className)}>{children}</th>;
}

function Td({ children, className }: any) {
  return <td className={clsx("px-6 py-4 text-sm", className)}>{children}</td>;
}