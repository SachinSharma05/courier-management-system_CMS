'use client';

import React, { useEffect, useState } from 'react';
import {
  UserPlus, Search, ShieldCheck,
  Mail, Building2, CalendarDays,
  UserCog, Filter, Fingerprint, CheckCircle,
  Save, Shield, X, Power,
  ChevronRight,
  ChevronLeft,
  Phone,
  User as UserIcon
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

  const loadUsers = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getUsers();
      const userArray = Array.isArray(response) ? response : [];
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

  const filteredUsers = (users || []).filter((u) => {
    if (search) {
      const q = search.toLowerCase();
      return (
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        String(u.id).includes(q)
      );
    }
    if (filters.role !== 'all' && u.role !== filters.role) return false;
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
    <div className="p-4 space-y-4 bg-slate-50 min-h-screen font-sans">
      {/* ERP HEADER: Flat, No Shadows */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 border border-slate-200 rounded-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-slate-800 flex items-center justify-center text-white rounded-sm">
            <UserCog size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">User Administration</h1>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-1 font-semibold">Directory & Permissions</p>
          </div>
        </div>

        <button
          onClick={() => { setSelectedUser(null); setIsDrawerOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors rounded-sm"
        >
          <UserPlus size={14} /> NEW USER
        </button>
      </div>

      {/* COMPACT FILTER BAR */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 border border-slate-200 rounded-sm">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            placeholder="Search users..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        <SelectFilter
          icon={<ShieldCheck size={12}/>}
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
          icon={<CheckCircle size={12}/>}
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
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-sm"
        >
          <Filter size={16} />
        </button>
      </div>

      {/* DATA GRID: High Density */}
      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              <Th className="w-[25%]">User Identity</Th>
              <Th className="w-[15%]">Role</Th>
              <Th className="w-[20%]">Organization</Th>
              <Th className="w-[15%]">Contact</Th>
              <Th className="w-[10%]">Status</Th>
              <Th className="w-[15%] text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12 text-xs text-slate-400 font-mono">LOADING_DATA...</td></tr>
            ) : paginatedUsers.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-xs text-slate-400">NO_RECORDS_FOUND</td></tr>
            ) : (
              paginatedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
                  <Td>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 truncate">{u.username}</span>
                      <span className="text-[10px] text-slate-400 truncate">{u.email}</span>
                    </div>
                  </Td>
                  <Td><RoleBadge role={u.role} /></Td>
                  <Td className="text-xs font-semibold text-slate-600 truncate">
                    {u.company_name || '—'}
                  </Td>
                  <Td>
                    <div className="flex flex-col gap-0.5 text-[10px]">
                      <span className="text-slate-700 font-medium truncate">{u.contact_person || 'No Contact'}</span>
                      <span className="text-slate-400">{u.phone || 'No Phone'}</span>
                    </div>
                  </Td>
                  <Td><StatusBadge status={u.is_active ? 'Active' : 'Disabled'} /></Td>
                  <Td className="text-right">
                    <button
                      onClick={() => { setSelectedUser(u); setIsDrawerOpen(true); }}
                      className="text-[10px] font-bold text-blue-600 border border-blue-200 px-2 py-1 rounded-sm hover:bg-blue-600 hover:text-white transition-all"
                    >
                      EDIT
                    </button>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* COMPACT PAGINATION */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
            Displaying {paginatedUsers.length} of {filteredUsers.length} records
          </span>
          <div className="flex items-center gap-1">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-1 border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30 rounded-sm"
            ><ChevronLeft size={14}/></button>
            <span className="px-3 text-xs font-bold text-slate-700">{currentPage} / {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1 border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30 rounded-sm"
            ><ChevronRight size={14}/></button>
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

/* ================= COMPONENT PARTS (Strictly Typed) ================= */

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
      {/* Solid Black Overlay (No Blur) */}
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white border-l border-slate-300 flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{user ? 'Edit Record' : 'New Entry'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-sm"><X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <SectionHeader label="Identity & Access" />
            <Input label="Username" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} />
            <Input label="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
            {!user && <Input label="Initial Password" type="password" value={form.password_hash} onChange={(e) => setForm({...form, password_hash: e.target.value})} />}
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">System Role</label>
              <select 
                className="w-full border border-slate-300 p-2 text-xs font-semibold focus:border-blue-500 outline-none rounded-sm"
                value={form.role}
                onChange={(e) => setForm({...form, role: e.target.value as UserRole})}
              >
                <option value="super_admin">Super Admin</option>
                <option value="client">Client User</option>
                <option value="public">Public User</option>
              </select>
            </div>

            <SectionHeader label="Organizational Details" />
            <Input label="Company Name" value={form.company_name ?? ''} onChange={(e) => setForm({...form, company_name: e.target.value})} />
            <Input label="Contact Person" value={form.contact_person ?? ''} onChange={(e) => setForm({...form, contact_person: e.target.value})} />
            <Input label="Phone Number" value={form.phone ?? ''} onChange={(e) => setForm({...form, phone: e.target.value})} />
          </div>

          <div 
            onClick={() => setForm({...form, is_active: !form.is_active})}
            className={clsx(
              "p-3 border rounded-sm cursor-pointer flex items-center justify-between",
              form.is_active ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"
            )}
          >
            <div className="flex items-center gap-3">
              <Power size={16} className={form.is_active ? "text-emerald-600" : "text-slate-400"} />
              <span className="text-xs font-bold text-slate-700">ACCOUNT {form.is_active ? 'ENABLED' : 'DISABLED'}</span>
            </div>
            <div className={clsx("w-8 h-4 rounded-full relative transition-colors", form.is_active ? "bg-emerald-500" : "bg-slate-300")}>
              <div className={clsx("absolute top-0.5 h-3 w-3 bg-white rounded-full transition-all", form.is_active ? "right-0.5" : "left-0.5")} />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button 
            disabled={saving}
            onClick={handleSave}
            className="w-full bg-slate-900 text-white py-3 text-xs font-bold rounded-sm hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            <Save size={14} /> {saving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* HELPER COMPONENTS */

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={clsx("px-3 py-2 text-[10px] font-bold uppercase text-slate-500 tracking-tight", className)}>{children}</th>;
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={clsx("px-3 py-2 text-xs", className)}>{children}</td>;
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase">{label}</label>
      <input className="w-full border border-slate-300 p-2 text-xs focus:border-blue-500 outline-none rounded-sm bg-slate-50/50 focus:bg-white" {...props} />
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="text-[10px] font-black text-blue-600 uppercase border-b border-blue-100 pb-1 mt-2">
      {label}
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const styles: Record<UserRole, string> = {
    'super_admin': 'bg-purple-100 text-purple-800 border-purple-200',
    'client': 'bg-blue-100 text-blue-800 border-blue-200',
    'public': 'bg-slate-100 text-slate-700 border-slate-200'
  };
  return (
    <span className={clsx("inline-block px-1.5 py-0.5 text-[10px] font-bold border rounded-sm uppercase", styles[role])}>
      {role.replace('_', ' ')}
    </span>
  );
}

function StatusBadge({ status }: { status: 'Active' | 'Disabled' }) {
  const active = status === 'Active';
  return (
    <div className="flex items-center gap-1.5">
      <div className={clsx("h-2 w-2 rounded-full", active ? "bg-emerald-500" : "bg-slate-300")} />
      <span className={clsx("text-[10px] font-bold uppercase", active ? "text-emerald-700" : "text-slate-400")}>{status}</span>
    </div>
  );
}

function SelectFilter({ icon, value, onChange, options }: { 
  icon: React.ReactNode; 
  value: string; 
  onChange: (v: any) => void; 
  options: {label: string, value: string}[] 
}) {
  return (
    <div className="relative border border-slate-200 rounded-sm px-2 py-1 bg-white flex items-center gap-2 hover:border-slate-400 cursor-pointer">
      <span className="text-slate-400">{icon}</span>
      <span className="text-[10px] font-bold text-slate-600">
        {options.find(o => o.value === value)?.label}
      </span>
      <select 
        className="absolute inset-0 opacity-0 cursor-pointer w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}