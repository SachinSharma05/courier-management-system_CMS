'use client';

import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Save,
  ChevronRight,
  Lock,
  Eye,
  Edit3,
  Unlock,
  Loader2,
  Search,
} from 'lucide-react';
import clsx from 'clsx';
import { useRoles, useUpdateRole } from '@/hooks/useRbac';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

type PermissionMatrix = {
  permissionKey: string;
  canRead: boolean;
  canWrite: boolean;
  canFull: boolean;
};

export default function RolesPage() {
  const { data: rolesData, isLoading } = useRoles();
  const updateRole = useUpdateRole();

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [matrix, setMatrix] = useState<PermissionMatrix[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fixed: Use permissionKey as per your API response
  const loadMatrix = (role: any) => {
    if (!role?.permissions) return;
    setMatrix(
      role.permissions.map((rp: any) => ({
        permissionKey: rp.permissionKey, 
        canRead: rp.canRead,
        canWrite: rp.canWrite,
        canFull: rp.canFull,
      }))
    );
  };

  useEffect(() => {
    if (!rolesData?.length) return;
    if (!selectedRoleId) {
      const firstRole = rolesData[0];
      setSelectedRoleId(firstRole.id);
      loadMatrix(firstRole);
    }
  }, [rolesData]);

  const onSelectRole = (role: any) => {
    setSelectedRoleId(role.id);
    loadMatrix(role);
  };

  // Fixed: toggle function ensures unique key matching
  const toggle = (key: string, field: keyof Omit<PermissionMatrix, 'permissionKey'>) => {
    setMatrix(prev =>
      prev.map(p => {
        if (p.permissionKey !== key) return p;

        // Create the updated object
        const updated = { ...p, [field]: !p[field] };

        // LOGIC: If Full Access is toggled ON, turn on Read and Write
        if (field === 'canFull' && updated.canFull) {
          updated.canRead = true;
          updated.canWrite = true;
        }

        // LOGIC: If Read or Write is toggled OFF, turn off Full Access
        if ((field === 'canRead' || field === 'canWrite') && !updated[field]) {
          updated.canFull = false;
        }

        return updated;
      })
    );
  };

  const onSave = async () => {
    if (!selectedRoleId) return;
    try {
      await updateRole.mutateAsync({
        roleId: selectedRoleId,
        permissions: matrix,
      });
      toast.success('Permissions updated successfully');
    } catch (err) {
      toast.error('Failed to update permissions');
    }
  };

  const filteredMatrix = matrix.filter(p => 
    p.permissionKey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ShieldCheck className="text-indigo-600" size={36} />
              Access Control
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Defining granular permissions for <span className="text-indigo-600">
                {rolesData?.find(r => r.id === selectedRoleId)?.name || 'Role'}
              </span>
            </p>
          </div>

          <Button 
            onClick={onSave} 
            disabled={updateRole.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 h-12 font-bold shadow-lg shadow-indigo-200 transition-all gap-2"
          >
            {updateRole.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Changes
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- SIDEBAR: ROLES --- */}
          <aside className="w-full lg:w-72 space-y-3">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4">
              Available Roles
            </h2>
            <div className="space-y-1">
              {rolesData?.map((role: any) => {
                const isActive = selectedRoleId === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => onSelectRole(role)}
                    className={clsx(
                      'w-full flex items-center justify-between px-5 py-4 rounded-[1.5rem] transition-all duration-200 group',
                      isActive 
                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 scale-[1.02]' 
                        : 'bg-white border border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        "p-2 rounded-xl transition-colors",
                        isActive ? "bg-slate-800" : "bg-slate-50 group-hover:bg-white"
                      )}>
                        <Lock size={16} className={isActive ? "text-indigo-400" : "text-slate-400"} />
                      </div>
                      <span className="font-bold text-sm tracking-tight capitalize">
                        {role.name.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <ChevronRight size={16} className={clsx("transition-transform", isActive ? "translate-x-1" : "opacity-0 group-hover:opacity-100")} />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <main className="flex-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Search permission modules..."
                className="pl-12 h-12 rounded-2xl border-none shadow-sm bg-white font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-widest text-slate-400">Resource Module</th>
                      <th className="px-6 py-6 text-center text-xs font-black uppercase tracking-widest text-slate-400">Read</th>
                      <th className="px-6 py-6 text-center text-xs font-black uppercase tracking-widest text-slate-400">Write</th>
                      <th className="px-6 py-6 text-center text-xs font-black uppercase tracking-widest text-slate-400">Full Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredMatrix.map((p) => (
                      <tr key={p.permissionKey} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-mono text-[10px] font-bold">
                              {p.permissionKey.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-bold text-slate-700 tracking-tight capitalize">
                              {p.permissionKey.replace(/_/g, ' ').toLowerCase()}
                            </span>
                          </div>
                        </td>
                        
                        <PermissionToggle 
                          active={p.canRead} 
                          icon={<Eye size={14} />}
                          onClick={() => toggle(p.permissionKey, 'canRead')} 
                        />
                        
                        <PermissionToggle 
                          active={p.canWrite} 
                          icon={<Edit3 size={14} />}
                          onClick={() => toggle(p.permissionKey, 'canWrite')} 
                        />
                        
                        <PermissionToggle 
                          active={p.canFull} 
                          icon={<Unlock size={14} />}
                          highlight
                          onClick={() => toggle(p.permissionKey, 'canFull')} 
                        />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}

function PermissionToggle({ active, onClick, icon, highlight = false }: any) {
  return (
    <td className="px-6 py-5 text-center">
      <button
        onClick={onClick}
        className={clsx(
          "relative inline-flex items-center justify-center w-12 h-6 rounded-full transition-all duration-300 shadow-inner",
          active 
            ? (highlight ? "bg-indigo-600" : "bg-emerald-500") 
            : "bg-slate-200"
        )}
      >
        <div className={clsx(
          "absolute w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm transition-all duration-300 transform",
          active ? "translate-x-3" : "-translate-x-3"
        )}>
          <span className={clsx(
            "scale-75",
            active ? (highlight ? "text-indigo-600" : "text-emerald-500") : "text-slate-400"
          )}>
            {icon}
          </span>
        </div>
      </button>
    </td>
  );
}