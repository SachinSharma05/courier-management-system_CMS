'use client';

import { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Key, Save, 
  Search, ChevronRight, Lock, 
  Settings, History
} from 'lucide-react';
import clsx from 'clsx';

// ... (ROLES and PERMISSIONS constants remain same)
const ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'OPS',
  'SUPPORT',
  'FINANCE',
  'CLIENT_ADMIN',
  'CLIENT_USER',
];

const PERMISSIONS = [
  'VIEW_DASHBOARD',
  'VIEW_CONSIGNMENTS',
  'TRACK_SHIPMENTS',
  'MANAGE_CLIENTS',
  'MANAGE_USERS',
  'MANAGE_EMPLOYEES',
  'MANAGE_PROVIDERS',
  'MANAGE_PRICING',
  'RETRY_DLQ',
  'VIEW_AUDIT_LOGS',
  'VIEW_SYSTEM',
];

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState('SUPER_ADMIN');

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Access Control (RBAC)</h1>
            <p className="text-sm text-slate-500 font-medium">Define granular permissions for platform roles.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95">
          <Save size={18} /> Save Matrix
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* ───────────────── ROLE SELECTOR ───────────────── */}
        <div className="w-full lg:w-72 shrink-0 space-y-4">
          <div className="rounded-3xl border border-slate-100 bg-white p-2 shadow-sm">
            <div className="px-4 py-3 mb-2">
              <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">System Roles</p>
            </div>
            <div className="space-y-1">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={clsx(
                    "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group",
                    selectedRole === role
                      ? "bg-slate-900 text-white shadow-lg"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Key size={14} className={selectedRole === role ? "text-indigo-400" : "text-slate-300"} />
                    {role.replace('_', ' ')}
                  </div>
                  <ChevronRight size={14} className={clsx(
                    "transition-transform",
                    selectedRole === role ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                  )} />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
            <div className="flex gap-3 text-amber-800">
               <ShieldAlert size={18} className="shrink-0" />
               <p className="text-[11px] font-medium leading-relaxed">
                 Roles marked as <strong>System Default</strong> cannot be deleted. Changes to permissions sync across all associated users.
               </p>
            </div>
          </div>
        </div>

        {/* ───────────────── PERMISSIONS MATRIX ───────────────── */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-900">
                    <Settings size={16} />
                </div>
                <h2 className="font-bold text-slate-900 underline decoration-indigo-500 decoration-2 underline-offset-4">
                  {selectedRole.replace('_', ' ')} Permissions
                </h2>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  placeholder="Search permissions..." 
                  className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <Th className="w-2/3">Capability</Th>
                    <Th className="text-center">Read</Th>
                    <Th className="text-center">Write</Th>
                    <Th className="text-center">Full Access</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {PERMISSIONS.map((perm) => (
                    <tr key={perm} className="group hover:bg-slate-50/50 transition-colors">
                      <Td>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-slate-200 group-hover:bg-indigo-500 transition-colors" />
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-700 text-sm">{perm.replace(/_/g, ' ')}</span>
                                <span className="text-[10px] text-slate-400 font-medium">Scope: platform.auth.{perm.toLowerCase()}</span>
                            </div>
                        </div>
                      </Td>
                      <Td className="text-center"><PermissionCheck /></Td>
                      <Td className="text-center"><PermissionCheck /></Td>
                      <Td className="text-center"><PermissionCheck /></Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1"><History size={12}/> Last modified 2h ago</div>
                <div className="flex items-center gap-1"><Lock size={12}/> End-to-end Encrypted</div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              * Active sessions refresh every 15 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── MINI COMPONENTS ───────────────── */

function PermissionCheck() {
    return (
        <div className="flex justify-center">
            <label className="relative flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-9 h-5 bg-slate-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
        </div>
    );
}

function Th({ children, className }: any) {
  return <th className={clsx("px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-slate-400", className)}>{children}</th>;
}

function Td({ children, className }: any) {
  return <td className={clsx("px-6 py-4 text-sm", className)}>{children}</td>;
}