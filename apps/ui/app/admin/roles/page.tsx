'use client';

import React, { useState } from 'react';
import {
  ShieldCheck, Save, Eye, Edit3, Unlock, Loader2, Search, Info, Users
} from 'lucide-react';
import clsx from 'clsx';
import { useRoles, useUpdateRole } from '@/hooks/useRbac';
import toast from 'react-hot-toast';
import { PermissionMatrix, Role } from '../interface/adminInterface';

export default function RolesPage() {
  const { data: rolesData, isLoading } = useRoles();
  const updateRole = useUpdateRole();

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [matrix, setMatrix] = useState<PermissionMatrix[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadMatrix = (role: Role) => {
    if (!role?.permissions) return;
    setMatrix(role.permissions.map(p => ({ ...p })));
  };

  if (!rolesData?.length) return;
  if (!selectedRoleId) {
    const firstRole = rolesData[0];
    setSelectedRoleId(firstRole.id);
    loadMatrix(firstRole);
  }

  const onSelectRole = (role: Role) => {
    setSelectedRoleId(role.id);
    loadMatrix(role);
  };

  const toggle = (key: string, field: keyof Omit<PermissionMatrix, 'permissionKey'>) => {
    setMatrix(prev => prev.map(p => {
      if (p.permissionKey !== key) return p;
      const updated = { ...p, [field]: !p[field] };
      if (field === 'canFull' && updated.canFull) {
        updated.canRead = true;
        updated.canWrite = true;
      }
      if ((field === 'canRead' || field === 'canWrite') && !updated[field]) {
        updated.canFull = false;
      }
      return updated;
    }));
  };

  const onSave = async () => {
    if (!selectedRoleId) return;
    try {
      await updateRole.mutateAsync({
        roleId: selectedRoleId,
        permissions: matrix,
      });
      toast.success('Access policy synchronized');
    } catch (err) {
      toast.error('Sync failed');
    }
  };

  const filteredMatrix = matrix.filter(p => 
    p.permissionKey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-slate-400" size={24} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 font-sans">
      
      {/* IDENTICAL HEADER SECTION */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Access Control Center</h1>
            <p className="text-xs font-medium text-slate-500">Configure system-wide roles and granular resource permissions</p>
          </div>
        </div>
        <button 
          onClick={onSave}
          disabled={updateRole.isPending}
          className="flex items-center gap-2 rounded-lg bg-[#0F172A] px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50"
        >
          {updateRole.isPending ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
          COMMIT CHANGES
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* ROLE SELECTION CARD (Left) */}
        <div className="col-span-3 space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
             <h2 className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Available System Roles</h2>
             <div className="space-y-2">
                {rolesData?.map((role: Role) => {
                  const isActive = selectedRoleId === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => onSelectRole(role)}
                      className={clsx(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all border",
                        isActive ? "bg-indigo-50 border-indigo-100 text-indigo-700 font-bold" : "bg-white border-transparent text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Users size={16} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                        <span className="text-xs capitalize">{role.name.replace(/_/g, ' ')}</span>
                      </div>
                      {isActive && <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                    </button>
                  );
                })}
             </div>
          </div>
        </div>

        {/* PERMISSION MATRIX TABLE (Right) */}
        <div className="col-span-9 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          
          {/* IDENTICAL SEARCH BAR SECTION */}
          <div className="flex items-center justify-between border-b border-slate-50 p-4 bg-white">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                placeholder="Filter permissions by resource..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-tight">
              <Info size={12} /> Full Access inherits Read & Write
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Resource Module</th>
                  <th className="w-28 px-4 py-4 text-center text-[10px] font-black uppercase tracking-wider text-slate-400">Read</th>
                  <th className="w-28 px-4 py-4 text-center text-[10px] font-black uppercase tracking-wider text-slate-400">Write</th>
                  <th className="w-28 px-4 py-4 text-center text-[10px] font-black uppercase tracking-wider text-slate-400">Full Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredMatrix.map((p) => (
                  <tr key={p.permissionKey} className="group transition-colors hover:bg-slate-50/30">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800 capitalize">
                          {p.permissionKey.replace(/_/g, ' ').toLowerCase()}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{p.permissionKey}</span>
                      </div>
                    </td>
                    <PermissionCell active={p.canRead} onClick={() => toggle(p.permissionKey, 'canRead')} icon={<Eye size={14} />} />
                    <PermissionCell active={p.canWrite} onClick={() => toggle(p.permissionKey, 'canWrite')} icon={<Edit3 size={14} />} />
                    <PermissionCell active={p.canFull} onClick={() => toggle(p.permissionKey, 'canFull')} icon={<Unlock size={14} />} isFull />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function PermissionCell({ active, onClick, icon, isFull = false }: { active: boolean, onClick: () => void, icon: React.ReactNode, isFull?: boolean }) {
  return (
    <td className="px-4 py-4 text-center">
      <button
        onClick={onClick}
        className={clsx(
          "mx-auto h-9 w-9 rounded-xl flex items-center justify-center transition-all border",
          active 
            ? (isFull ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" : "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-100") 
            : "bg-white border-slate-200 text-slate-300 hover:border-slate-400"
        )}
      >
        {icon}
      </button>
    </td>
  );
}