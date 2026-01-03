'use client';

import {
  UserPlus, Search, ShieldCheck,
  Mail, Building2, CalendarDays,
  UserCog, Filter, Fingerprint, CheckCircle,
  Save, Shield, X, Power,
  ChevronRight,
  ChevronLeft,
  MoreVertical
} from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser } from '@/hooks/useUsers';

type User = {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: 'client' | 'super_admin' | 'public';
  company_name?: string | null;
  contact_person?: string | null;
  phone?: string | null;
  providers: string[];
  is_active: boolean;
  created_at: string;
};

export default function UsersPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response: any = await getUsers();
      // Handle both raw array and { data: [] } response formats
      const userArray = Array.isArray(response) ? response : (response?.data || []);
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

  // Filter Logic
  const filteredUsers = (users || []).filter((u) => {
    if (search) {
      const q = search.toLowerCase();
      const matches =
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        String(u.id).includes(q);
      if (!matches) return false;
    }
    if (filters.role !== 'all' && u.role !== filters.role) return false;
    if (filters.status !== 'all') {
      const isActiveFilter = filters.status === 'Active';
      if (u.is_active !== isActiveFilter) return false;
    }
    return true;
  });

  // Calculate Pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper to change page and handle bounds
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
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

        <button
          onClick={() => { 
            setSelectedUser(null); 
            setIsDrawerOpen(true); 
          }}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-md active:scale-95"
        >
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
        <div className="relative flex-1 min-w-[300px] group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
          <input
            placeholder="Search by name, email or ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset to page 1 on search
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500/40 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <SelectFilter
            icon={<ShieldCheck size={14}/>}
            value={filters.role}
            onChange={(v: string) => {
                setFilters({...filters, role: v});
                setCurrentPage(1);
            }}
            options={[
              { label: 'All Roles', value: 'all' },
              { label: 'Super Admin', value: 'super_admin' },
              { label: 'Client User', value: 'client' },
              { label: 'Public User', value: 'public'}
            ]}
          />

          <SelectFilter
            icon={<CheckCircle size={14}/>}
            value={filters.status}
            onChange={(v: string) => {
                setFilters({...filters, status: v});
                setCurrentPage(1);
            }}
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Active', value: 'Active' },
              { label: 'Disabled', value: 'Disabled' },
            ]}
          />

          <button
            onClick={() => {
              setFilters({ role: 'all', status: 'all' });
              setSearch('');
              setCurrentPage(1);
            }}
            className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
            title="Reset Filters"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* USERS TABLE */}
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
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><Td colSpan={6} className="text-center py-20 text-slate-400 font-medium">Loading user database...</Td></tr>
              ) : paginatedUsers.length === 0 ? (
                <tr><Td colSpan={6} className="text-center py-20 text-slate-400 font-medium">No users found matching your criteria.</Td></tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr key={u.id} className="group hover:bg-slate-50/80 transition-colors">
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold border-2 border-white shadow-sm overflow-hidden shrink-0 text-xs uppercase">
                          {u.username?.substring(0,2)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-900 truncate">{u.username}</span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Mail size={10} /> {u.email}
                          </span>
                        </div>
                      </div>
                    </Td>
                    <Td><RoleBadge role={u.role} /></Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-slate-300" />
                        <span className="text-xs font-semibold text-slate-600">
                          {u.company_name || (u.role === 'super_admin' ? 'Internal' : 'N/A')}
                        </span>
                      </div>
                    </Td>
                    <Td><StatusBadge status={u.is_active ? 'Active' : 'Disabled'} /></Td>
                    <Td>
                      <div className="flex items-center gap-2 text-slate-500">
                        <CalendarDays size={14} className="text-slate-300" />
                        <span className="text-xs font-medium">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </Td>
                    <Td className="text-right">
                      <button
                        onClick={() => {
                            setSelectedUser(u);
                            setIsDrawerOpen(true);
                        }}
                        className="text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg hover:bg-violet-600 hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        Edit Profile
                      </button>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-semibold">
            Showing <span className="text-slate-900">{paginatedUsers.length}</span> of <span className="text-slate-900">{filteredUsers.length}</span> users
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={clsx(
                    "h-8 w-8 rounded-lg text-xs font-bold transition-all",
                    currentPage === i + 1 
                      ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
                      : "text-slate-500 hover:bg-slate-200"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
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

      {/* FOOTER */}
      <div className="flex items-center justify-between px-2">
          <p className="text-xs text-slate-400 font-medium tracking-wide">Secure platform management</p>
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            <Fingerprint size={12} /> Auth Guard v2.4
          </div>
      </div>
    </div>
  );
}

/* COMPONENT PARTS */

function UserFormDrawer({ user, onClose, onSaved }: { user: User | null; onClose: () => void; onSaved: () => Promise<void>; }) {
  const [form, setForm] = useState({
    username: user?.username ?? '',
    email: user?.email ?? '',
    password_hash: user?.password_hash ?? '',
    role: user?.role ?? 'client',
    company_name: user?.company_name ?? '',
    is_active: user?.is_active ?? true,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
        if (user) {
          await updateUser(user.id, form);
        } else {
          await createUser({ ...form });
        }
        await onSaved();
        onClose();
    } catch (err) {
        console.error("Save failed", err);
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user ? 'Edit Profile' : 'New Account'}</h2>
            <p className="text-xs text-slate-500 font-medium">Define access level and credentials.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <SectionTitle icon={<Shield size={16} />} label="Security Details" />
          <div className="space-y-4">
            <Input label="Username" value={form.username} onChange={(e: any) => setForm({ ...form, username: e.target.value })} />
            <Input label="Email Address" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} />
            {!user && <Input label="Password" type="password" value={form.password_hash} onChange={(e: any) => setForm({ ...form, password_hash: e.target.value })} />}
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">System Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-violet-500/10 bg-slate-50/50 focus:border-violet-300 transition-all"
              >
                <option value="super_admin">Super Admin</option>
                <option value="client">Client User</option>
                <option value="public">Public User</option>
              </select>
            </div>

            <Input label="Company Name" value={form.company_name ?? ''} onChange={(e: any) => setForm({ ...form, company_name: e.target.value })} />
          </div>

          <SectionTitle icon={<Power size={16} />} label="Visibility & Access" />
          <div
            onClick={() => setForm({ ...form, is_active: !form.is_active })}
            className={clsx(
              "p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all",
              form.is_active ? "bg-emerald-50/50 border-emerald-100" : "bg-slate-50 border-slate-200"
            )}
          >
            <div className="flex items-center gap-3 pointer-events-none">
              <div className={clsx("h-10 w-10 rounded-xl flex items-center justify-center transition-all", 
                form.is_active ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500")}>
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Account {form.is_active ? 'Active' : 'Disabled'}</p>
                <p className="text-[11px] text-slate-500 font-medium">Status controls login ability.</p>
              </div>
            </div>
            <div className={clsx("w-10 h-5 rounded-full relative transition-colors", form.is_active ? "bg-emerald-500" : "bg-slate-300")}>
              <div className={clsx("absolute top-1 h-3 w-3 bg-white rounded-full transition-all", form.is_active ? "right-1" : "left-1")} />
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-white">
          <button
            disabled={saving}
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-violet-600 transition-all shadow-lg active:scale-95 disabled:bg-slate-400 disabled:scale-100"
          >
            {saving ? 'Processing...' : (
              <>
                <Save size={18} />
                {user ? 'Update Profile' : 'Create User Account'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* UI HELPERS */
function Th({ children, className }: any) {
  return <th className={clsx("px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-slate-400", className)}>{children}</th>;
}

function Td({ children, className, colSpan }: any) {
  return <td colSpan={colSpan} className={clsx("px-6 py-4 text-sm", className)}>{children}</td>;
}

function Input({ label, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <input className="w-full rounded-xl border border-slate-200 p-2.5 text-sm font-semibold outline-none focus:border-violet-400 transition-all bg-slate-50/30" {...props} />
    </div>
  );
}

function SectionTitle({ icon, label }: any) {
  return (
    <div className="flex items-center gap-2 text-violet-600 border-b border-slate-100 pb-2">
      {icon} <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}

function RoleBadge({ role }: { role: User['role'] }) {
  const configs = {
    'super_admin': 'bg-violet-50 text-violet-700 border-violet-100',
    'client': 'bg-blue-50 text-blue-700 border-blue-100',
    'public': 'bg-slate-50 text-slate-600 border-slate-100'
  };

  return (
    <span className={clsx(
      "inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-wider",
      configs[role] || configs['public']
    )}>
      {role?.replace('_', ' ') || 'unknown'}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'Active';
  return (
    <span className={clsx("inline-flex items-center gap-1.5 text-xs font-bold", isActive ? "text-emerald-600" : "text-slate-300")}>
      <span className={clsx("h-1.5 w-1.5 rounded-full", isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300")} />
      {status}
    </span>
  );
}

function SelectFilter({ icon, value, onChange, options }: any) {
  return (
    <div className="relative group">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 group-hover:border-violet-300 group-hover:text-violet-600 transition-all">
        {icon}
        <span>{options.find((o: any) => o.value === value)?.label}</span>
        <MoreVertical size={14} className="rotate-90 text-slate-400 group-hover:text-violet-400" />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer w-full"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}