'use client';

import React, { useEffect, useState } from 'react';
import {
  UserPlus, Search, ShieldCheck,
  Mail, Building2, UserCog, Filter, CheckCircle,
  Save, X, Power, ChevronRight, ChevronLeft,
  Phone, User as UserIcon,
  RefreshCw
} from 'lucide-react';
import clsx from 'clsx';
import { getUsers, createUser, updateUser } from '@/hooks/useUsers';

/* ================= TYPES (Strictly Defined) ================= */

type UserRole = 'client' | 'super_admin' | 'public';

interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: UserRole;
  company_name?: string | null;
  company_address?: string | null;
  contact_person?: string | null;
  phone?: string | null;
  providers: string[];
  is_active: boolean;
  created_at: string;
}

interface UserFilters {
  role: UserRole | 'all';
  status: 'Active' | 'Disabled' | 'all';
}

type UserFormData = Omit<User, 'id' | 'created_at'>;

/* ================= MAIN COMPONENT ================= */

export default function UsersPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState<UserFilters>({
    role: 'all',
    status: 'all',
  });

  // --- LOGIC FIX: Handling the nested "data" property from your API response ---
  const loadUsers = async (): Promise<void> => {
    setLoading(true);
    try {
      const response: any = await getUsers();
      // If response has a .data property, use that, otherwise check if response itself is an array
      const userArray = response?.data && Array.isArray(response.data) 
        ? response.data 
        : Array.isArray(response) ? response : [];
      
      setUsers(userArray);
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // --- FILTER LOGIC: Robust checking ---
  const filteredUsers = (users || []).filter((u) => {
    // 1. Search Filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = 
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.company_name?.toLowerCase().includes(q) ||
        String(u.id).includes(q);
      
      if (!match) return false;
    }
    
    // 2. Role Filter
    if (filters.role !== 'all' && u.role !== filters.role) return false;
    
    // 3. Status Filter
    if (filters.status !== 'all') {
      const isActiveFilter = filters.status === 'Active';
      if (u.is_active !== isActiveFilter) return false;
    }
    
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 space-y-6 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      
      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-600 flex items-center justify-center text-white rounded-xl shadow-lg shadow-indigo-100 shrink-0">
            <UserCog size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">User Administration</h1>
            <p className="text-sm text-slate-500 font-medium italic">Directory, role management & access permissions</p>
          </div>
        </div>

        <button
          onClick={() => { setSelectedUser(null); setIsDrawerOpen(true); }}
          className="flex items-center gap-2 bg-[#0f172a] px-5 py-2.5 text-xs font-bold text-white hover:bg-black transition-all rounded-xl shadow-sm active:scale-95"
        >
          <UserPlus size={16} /> NEW USER
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[300px] group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
          <input
            placeholder="Search by username, email, company or ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 text-xs font-bold rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
            <SelectFilter
            icon={<ShieldCheck size={14}/>}
            value={filters.role}
            onChange={(v: UserRole | 'all') => { setFilters({...filters, role: v}); setCurrentPage(1); }}
            options={[
                { label: 'ALL ROLES', value: 'all' },
                { label: 'SUPER ADMIN', value: 'super_admin' },
                { label: 'CLIENT', value: 'client' },
                { label: 'PUBLIC', value: 'public'}
            ]}
            />

            <SelectFilter
            icon={<CheckCircle size={14}/>}
            value={filters.status}
            onChange={(v: 'Active' | 'Disabled' | 'all') => { setFilters({...filters, status: v}); setCurrentPage(1); }}
            options={[
                { label: 'ALL STATUS', value: 'all' },
                { label: 'ACTIVE', value: 'Active' },
                { label: 'DISABLED', value: 'Disabled' },
            ]}
            />

            <button
            onClick={() => { setFilters({ role: 'all', status: 'all' }); setSearch(''); setCurrentPage(1); }}
            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="Clear Filters"
            >
            <Filter size={18} />
            </button>
        </div>
      </div>

      {/* DATA GRID */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <Th className="w-[25%] pl-6">User Identity</Th>
                <Th className="w-[15%]">System Role</Th>
                <Th className="w-[20%]">Organization</Th>
                <Th className="w-[15%]">Contact Info</Th>
                <Th className="w-[10%]">Access</Th>
                <Th className="w-[15%] text-right pr-6">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-20 text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">Syncing_Records...</td></tr>
              ) : paginatedUsers.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-20 text-xs text-slate-400 font-medium italic">No administrative records found.</td></tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                    <Td className="pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 truncate">{u.username}</span>
                        <span className="text-[10px] text-slate-400 font-medium truncate flex items-center gap-1">
                            <Mail size={10} /> {u.email}
                        </span>
                      </div>
                    </Td>
                    <Td><RoleBadge role={u.role} /></Td>
                    <Td className="text-xs font-bold text-slate-600">
                      <div className="flex items-center gap-1.5 truncate">
                        <Building2 size={12} className="text-slate-300" />
                        {u.company_name || '—'}
                      </div>
                    </Td>
                    <Td>
                      <div className="flex flex-col gap-0.5 text-[10px]">
                        <span className="text-slate-700 font-bold truncate">{u.contact_person || 'No Contact'}</span>
                        <span className="text-slate-400 font-medium flex items-center gap-1"><Phone size={10}/> {u.phone || 'No Phone'}</span>
                      </div>
                    </Td>
                    <Td><StatusBadge status={u.is_active ? 'Active' : 'Disabled'} /></Td>
                    <Td className="text-right pr-6">
                      <button
                        onClick={() => { setSelectedUser(u); setIsDrawerOpen(true); }}
                        className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                      >
                        CONFIGURE
                      </button>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Showing {paginatedUsers.length} / {filteredUsers.length} Users
          </span>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 border border-slate-200 bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 disabled:opacity-30 rounded-lg transition-all"
            ><ChevronLeft size={16}/></button>
            <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
                {currentPage} <span className="text-slate-300 mx-1">/</span> {totalPages}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 border border-slate-200 bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 disabled:opacity-30 rounded-lg transition-all"
            ><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>

      {isDrawerOpen && (
        <UserFormDrawer 
          user={selectedUser} 
          onClose={() => setIsDrawerOpen(false)} 
          onSaved={loadUsers} 
        />
      )}
    </div>
  );
}

/* ================= DRAWER COMPONENT (Unchanged UI) ================= */

function UserFormDrawer({ user, onClose, onSaved }: { user: User | null; onClose: () => void; onSaved: () => Promise<void>; }) {
  const [form, setForm] = useState<UserFormData>({
    username: user?.username ?? '',
    email: user?.email ?? '',
    password_hash: user?.password_hash ?? '',
    role: user?.role ?? 'client',
    company_name: user?.company_name ?? '',
    company_address: user?.company_address ?? '',
    contact_person: user?.contact_person ?? '',
    phone: user?.phone ?? '',
    providers: user?.providers ?? [],
    is_active: user?.is_active ?? true,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const cleanedForm = {
        ...form,
        company_name: form.company_name ?? undefined,
        company_address: form.company_address ?? undefined,
        contact_person: form.contact_person ?? undefined,
        phone: form.phone ?? undefined,
      };
      if (user) {
        await updateUser(user.id, cleanedForm);
      } else {
        await createUser(cleanedForm);
      }
      await onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                <UserIcon size={18} />
             </div>
             <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{user ? 'Modify Profile' : 'Access Creation'}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400"/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <SectionHeader label="Identity & Permissions" />
            <Input label="Username" value={form.username} onChange={(e: any) => setForm({...form, username: e.target.value})} placeholder="e.g. admin_pro" />
            <Input label="Email Address" value={form.email} onChange={(e: any) => setForm({...form, email: e.target.value})} placeholder="email@organization.com" />
            {!user && <Input label="Secure Password" type="password" value={form.password_hash} onChange={(e: any) => setForm({...form, password_hash: e.target.value})} />}
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">System Privilege</label>
              <select 
                className="w-full border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
                value={form.role}
                onChange={(e) => setForm({...form, role: e.target.value as UserRole})}
              >
                <option value="super_admin">SUPER ADMIN</option>
                <option value="client">CLIENT USER</option>
                <option value="public">PUBLIC USER</option>
              </select>
            </div>

            <SectionHeader label="Organizational Metadata" />
            <Input label="Company Name" value={form.company_name ?? ''} onChange={(e: any) => setForm({...form, company_name: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
                <Input label="Contact Person" value={form.contact_person ?? ''} onChange={(e: any) => setForm({...form, contact_person: e.target.value})} />
                <Input label="Phone Number" value={form.phone ?? ''} onChange={(e: any) => setForm({...form, phone: e.target.value})} />
            </div>
          </div>

          <div 
            onClick={() => setForm({...form, is_active: !form.is_active})}
            className={clsx(
              "p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all",
              form.is_active ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-200"
            )}
          >
            <div className="flex items-center gap-3">
              <Power size={18} className={form.is_active ? "text-emerald-600" : "text-slate-400"} />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Login Access {form.is_active ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className={clsx("w-10 h-5 rounded-full relative transition-colors", form.is_active ? "bg-emerald-500" : "bg-slate-300")}>
              <div className={clsx("absolute top-0.5 h-4 w-4 bg-white rounded-full transition-all shadow-sm", form.is_active ? "right-0.5" : "left-0.5")} />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-white">
          <button 
            disabled={saving}
            onClick={handleSave}
            className="w-full bg-[#0f172a] text-white py-4 rounded-xl text-xs font-black shadow-lg shadow-slate-200 hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={16} />} 
            {saving ? 'UPDATING...' : 'COMMIT CHANGES'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS (Consistent UI) ================= */

function Th({ children, className }: any) {
  return <th className={clsx("px-4 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]", className)}>{children}</th>;
}

function Td({ children, className }: any) {
  return <td className={clsx("px-4 py-4 text-xs", className)}>{children}</td>;
}

function Input({ label, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">{label}</label>
      <input 
        className="w-full border border-slate-200 p-3 text-xs font-bold rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/10 bg-slate-50/50 focus:bg-white transition-all placeholder:text-slate-300" 
        {...props} 
      />
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 mt-4">
      {label}
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const styles: Record<UserRole, string> = {
    'super_admin': 'bg-purple-50 text-purple-700 border-purple-100',
    'client': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'public': 'bg-slate-50 text-slate-600 border-slate-100'
  };
  return (
    <span className={clsx("inline-block px-2.5 py-1 text-[10px] font-bold border rounded-lg uppercase tracking-tight shadow-sm", styles[role])}>
      {role.replace('_', ' ')}
    </span>
  );
}

function StatusBadge({ status }: { status: 'Active' | 'Disabled' }) {
  const active = status === 'Active';
  return (
    <div className="flex items-center gap-2">
      <div className={clsx("h-1.5 w-1.5 rounded-full", active ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
      <span className={clsx("text-[10px] font-bold uppercase", active ? "text-emerald-700" : "text-slate-400")}>{status}</span>
    </div>
  );
}

function SelectFilter({ icon, value, onChange, options }: any) {
  return (
    <div className="relative border border-slate-200 rounded-xl px-3 py-2 bg-white flex items-center gap-2 hover:border-indigo-400 transition-all cursor-pointer shadow-sm group">
      <span className="text-slate-400 group-hover:text-indigo-500">{icon}</span>
      <span className="text-[10px] font-bold text-slate-700 uppercase">
        {options.find((o: any) => o.value === value)?.label}
      </span>
      <select 
        className="absolute inset-0 opacity-0 cursor-pointer w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}