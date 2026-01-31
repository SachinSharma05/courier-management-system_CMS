'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { 
  Users, Plus, ChevronRight, X, Settings2, 
  Building2, Mail, UserIcon, Shield, Phone, Save, Key
} from 'lucide-react';
import clsx from 'clsx';

// ✅ Logic Imports Preserved
import { getClients, createClient, updateClient } from '@/lib/api/clients.api';
import { useCreateCredential, useCredentials, useUpdateCredential } from '@/hooks/useCredentials';

/* ================= STRICT TYPES ================= */

interface Client {
  id: number;
  company_name: string;
  email: string;
  phone: string;
  contact_person: string;
  is_active: boolean;
  created_at: string;
}

interface ClientFormData {
  username: string;
  email: string;
  password: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  isActive: boolean;
}

type DrawerMode = 'create' | 'edit' | 'manage' | null;

/* ================= MAIN PAGE ================= */

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const refresh = async () => {
    setIsLoading(true);
    try {
      const data = await getClients();
      setClients((data as unknown as Client[]) || []);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => { refresh(); }, []);

  const closeDrawer = () => {
    setDrawerMode(null);
    setSelectedClient(null);
  };

  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-screen">
      
      {/* HEADER: ERP Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 border border-slate-200 rounded-sm shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-emerald-600 flex items-center justify-center text-white rounded-sm">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-none uppercase tracking-tight">CLIENT_REGISTRY</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Manage partner credentials and API limits</p>
          </div>
        </div>

        <button 
          onClick={() => setDrawerMode('create')}
          className="flex items-center gap-2 rounded-sm bg-slate-900 px-6 py-2.5 text-xs font-black text-white hover:bg-black transition-all"
        >
          <Plus size={16} /> REGISTER NEW CLIENT
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
            <thead>
              <tr className="bg-slate-900 text-white">
                <Th className="w-20">ID</Th>
                <Th className="w-64">COMPANY_DETAILS</Th>
                <Th>CONTACT_PERSON</Th>
                <Th>PHONE_NO</Th>
                <Th className="w-32">STATUS</Th>
                <Th className="w-40">JOINED_DATE</Th>
                <Th className="text-right pr-6 w-48">ACTIONS</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-xs font-bold text-slate-400 animate-pulse uppercase tracking-widest">
                    Syncing_Client_Data...
                  </td>
                </tr>
              )}
              {!isLoading && clients.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                  <Td className="font-mono text-[11px] font-bold text-slate-400">#{c.id}</Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 border border-slate-200 rounded-sm">
                        {c.company_name?.charAt(0) || 'C'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-xs uppercase tracking-tight">{c.company_name}</span>
                        <span className="text-[10px] text-slate-500 font-bold">{c.email}</span>
                      </div>
                    </div>
                  </Td>
                  <Td className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{c.contact_person}</Td>
                  <Td className="text-xs font-bold text-slate-600 font-mono tracking-tighter">{c.phone}</Td>
                  <Td>
                    <span className={clsx(
                      "inline-flex items-center px-2 py-0.5 text-[9px] font-black border rounded-sm",
                      c.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
                    )}>
                      {c.is_active ? '● ACTIVE' : '○ INACTIVE'}
                    </span>
                  </Td>
                  <Td className="text-[11px] font-bold text-slate-500">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB') : 'N/A'}
                  </Td>
                  <Td className="text-right pr-6 space-x-2">
                    <button 
                      onClick={() => { setSelectedClient(c); setDrawerMode('edit'); }}
                      className="text-[10px] font-black text-slate-600 hover:text-slate-900 uppercase border-b border-transparent hover:border-slate-900 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => { setSelectedClient(c); setDrawerMode('manage'); }}
                      className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase bg-indigo-50 px-3 py-1.5 rounded-sm border border-indigo-100 transition-all"
                    >
                      Manage <ChevronRight size={12} />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {drawerMode && (
        <ClientDrawer 
          mode={drawerMode} 
          client={selectedClient} 
          onClose={closeDrawer} 
          onRefresh={refresh}
        />
      )}
    </div>
  );
}

/* ───────────────── DRAWER COMPONENT ───────────────── */

function ClientDrawer({ mode, client, onClose, onRefresh }: { 
  mode: 'create' | 'edit' | 'manage'; 
  client: Client | null; 
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300 border-l border-slate-200 flex flex-col">
        
        {mode === 'manage' && client && (
          <>
            {!activeProvider ? (
              <div className="flex h-full flex-col">
                <div className="p-6 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-sm border border-indigo-100 tracking-widest uppercase">Configuration_Engine</span>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-sm transition-all text-slate-400 hover:text-slate-900"><X size={18} /></button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-slate-900 text-white flex items-center justify-center font-black text-xl rounded-sm">
                      {client.company_name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{client.company_name}</h2>
                      <p className="text-[10px] text-slate-500 font-bold">SYSTEM_UUID: {client.id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                  <Section title="Basic Entity Info" icon={<Settings2 size={16} />}>
                    <div className="rounded-sm border border-slate-200 p-4 space-y-2 bg-slate-50/30 text-xs">
                      <Row label="Primary Email" value={client.email} />
                      <Row label="Account Status" value={client.is_active ? 'ACTIVE' : 'INACTIVE'} />
                    </div>
                  </Section>
                  
                  <CredentialsSection clientId={client.id} onConfigure={(p) => setActiveProvider(p)} />
                </div>
              </div>
            ) : (
              <CredentialFormView 
                clientId={client.id} 
                provider={activeProvider} 
                onBack={() => setActiveProvider(null)} 
              />
            )}
          </>
        )}

        {(mode === 'create' || mode === 'edit') && (
          <ClientFormView client={client} mode={mode} onClose={onClose} onRefresh={onRefresh} />
        )}

      </div>
    </div>
  );
}

/* ───────────────── FORM VIEW (CREATE/EDIT) ───────────────── */
interface ClientFormData {
  username: string;
  email: string;
  password: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  isActive: boolean;
}

interface ClientPayload {
  email: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  isActive: boolean;
  role: 'client';
  username?: string;
  password?: string;
}

function ClientFormView({ client, mode, onClose, onRefresh }: {
    client: Client | null;
    mode: 'create' | 'edit';
    onClose: () => void;
    onRefresh: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    username: '', email: '', password: '',
    companyName: '', contactPerson: '', phone: '',
    isActive: true,
  });

  useEffect(() => {
    if (client && mode === 'edit') {
      setFormData({
        username: '', 
        email: client.email || '', 
        password: '',
        companyName: client.company_name || '',
        contactPerson: client.contact_person || '',
        phone: client.phone || '',
        isActive: client.is_active,
      });
    }
  }, [client, mode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Manually map Form Data (camelCase) to Payload (snake_case)
      const payload: ClientPayload = {
        email: formData.email,
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        isActive: formData.isActive,
        role: 'client',
      };

      // Add optional fields only if they exist
      if (formData.username) payload.username = formData.username;
      if (formData.password) payload.password = formData.password;

      if (mode === 'edit' && client) {
        // TypeScript is now happy because payload is explicitly ClientPayload
        await updateClient(client.id, payload);
      } else {
        await createClient(payload);
      }

      onRefresh();
      onClose();
    } catch (err) {
      alert("CRITICAL_ERROR: Failed to update client record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col bg-white">
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
          {mode === 'edit' ? 'MODIFY_ENTITY' : 'REGISTER_ENTITY'}
        </h2>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Entity parameters and security credentials</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar">
        <FormField label="Legal Company Name" icon={<Building2 size={16}/>} value={formData.companyName} onChange={(v: string) => setFormData({...formData, companyName: v})} />
        <FormField label="System Communication Email" icon={<Mail size={16}/>} value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} />
        
        {mode === 'create' && (
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Access Username" icon={<UserIcon size={16}/>} value={formData.username} onChange={(v: string) => setFormData({...formData, username: v})} />
            <FormField label="Initial Password" type="password" icon={<Shield size={16}/>} value={formData.password} onChange={(v: string) => setFormData({...formData, password: v})} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Point of Contact" value={formData.contactPerson} onChange={(v: string) => setFormData({...formData, contactPerson: v})} />
          <FormField label="Emergency Phone" icon={<Phone size={16}/>} value={formData.phone} onChange={(v: string) => setFormData({...formData, phone: v})} />
        </div>

        <div className="p-4 rounded-sm border border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 uppercase">Status: Enable Account</span>
          <input 
            type="checkbox" 
            checked={formData.isActive} 
            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
            className="w-4 h-4 accent-slate-900"
          />
        </div>
      </div>

      <div className="p-6 border-t border-slate-200">
        <button 
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-sm text-xs font-black hover:bg-black disabled:opacity-50 transition-all uppercase tracking-widest"
        >
          {loading ? "SYNCING..." : <><Save size={16}/> {mode === 'edit' ? 'Commit Changes' : 'Complete Registration'}</>}
        </button>
      </div>
    </form>
  );
}

/* ───────────────── CREDENTIAL FORM VIEW ───────────────── */
interface CredentialItem {
  id: number;
  key: string;      // Matches "key" in your JSON
  provider: string;
  createdAt: string;
}

function CredentialFormView({ clientId, provider, onBack }: { clientId: number; provider: string; onBack: () => void; }) {
  const { data: creds } = useCredentials(clientId, provider);
  const createMutation = useCreateCredential();
  const updateMutation = useUpdateCredential(clientId, provider);

  const [formData, setFormData] = useState({
    customerCode: '',
    username: '',
    password: '',
    apiToken: '',
    apiKey: '',
  });

  useEffect(() => {
    if (!creds) return;
    const map: Record<string, CredentialItem> = {};
    creds.forEach((c: CredentialItem) => { map[c.key] = c; });

    setFormData((prev) => ({
      ...prev,
      customerCode: map.DTDC_CUSTOMER_CODE ? '••••••••' : prev.customerCode,
      username: map.username ? '••••••••' : prev.username,
      password: map.password ? '••••••••' : prev.password,
      apiToken: map.api_token ? '••••••••' : prev.apiToken,
      apiKey: map.api_key ? '••••••••' : prev.apiKey,
    }));
  }, [creds]);

  const saveField = async (key: string, value: string) => {
    if (!value || value === '••••••••') return;
    const existing = creds?.find((c: CredentialItem) => c.key === key);
    if (existing) {
      updateMutation.mutate({ id: existing.id, value });
    } else {
      createMutation.mutate({ clientId, provider, key, value });
    }
  };

  const handleSave = async () => {
    await Promise.all([
      saveField('DTDC_CUSTOMER_CODE', formData.customerCode),
      saveField('username', formData.username),
      saveField('password', formData.password),
      saveField('api_token', formData.apiToken),
      saveField('api_key', formData.apiKey),
    ]);
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{provider}_CREDENTIALS</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Secure API Authorization Bridge</p>
        </div>
        <button onClick={onBack} className="p-2 hover:bg-white rounded-sm border border-transparent hover:border-slate-200">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        <FormField label={`${provider.toUpperCase()} CUSTOMER CODE`} value={formData.customerCode} onChange={(v: string) => setFormData({ ...formData, customerCode: v })} />
        <FormField label="API_USERNAME" value={formData.username} onChange={(v: string) => setFormData({ ...formData, username: v })} />
        <FormField label="API_PASSWORD" type="password" showToggle value={formData.password} onChange={(v: string) => setFormData({ ...formData, password: v })} />
        <FormField label="AUTH_TOKEN" type="password" showToggle value={formData.apiToken} onChange={(v: string) => setFormData({ ...formData, apiToken: v })} />
        <FormField label="PRIVATE_API_KEY" type="password" showToggle value={formData.apiKey} onChange={(v: string) => setFormData({ ...formData, apiKey: v })} />
      </div>

      <div className="p-6 border-t border-slate-200 bg-slate-50">
        <button
          onClick={handleSave}
          className="w-full bg-slate-900 text-white py-4 rounded-sm text-xs font-black hover:bg-black transition-all uppercase tracking-[0.2em]"
        >
          UPDATE_CREDENTIALS
        </button>
      </div>
    </div>
  );
}

/* ───────────────── UI HELPERS ───────────────── */

function FormField({ label, value, onChange, type = "text", showToggle = false, icon }: any) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputType = showToggle ? (isPasswordVisible ? 'text' : 'password') : type;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
            {icon && <span className="text-slate-400">{icon}</span>}
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">{label}</label>
        </div>
        {showToggle && (
          <button 
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="text-[9px] font-black text-indigo-600 hover:text-indigo-800 uppercase"
          >
            {isPasswordVisible ? 'Mask' : 'Unhide'}
          </button>
        )}
      </div>
      <input 
        type={inputType}
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full border border-slate-200 bg-white rounded-sm py-2 px-3 text-xs font-bold text-slate-900 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300"
      />
    </div>
  );
}

function CredentialsSection({ onConfigure }: { clientId: number; onConfigure: (p: string) => void; }) {
  const providers = ['dtdc', 'delhivery', 'maruti'];

  return (
    <Section title="Carrier Credentials Bridge" icon={<Key size={16} />}>
      <div className="space-y-2">
        {providers.map((p) => (
          <div
            key={p}
            className="flex items-center justify-between rounded-sm border border-slate-200 bg-white p-3 group hover:border-slate-400 transition-all"
          >
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{p}</span>
            <button
              onClick={() => onConfigure(p)}
              className="text-[9px] font-black text-indigo-600 px-4 py-2 bg-indigo-50 rounded-sm hover:bg-indigo-600 hover:text-white transition-all uppercase"
            >
              Configure
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Section({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-400">
        <div className="p-1 bg-white border border-slate-100 rounded-sm">{icon}</div>
        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string, value: string }) {
  return <div className="flex justify-between py-1.5 border-b border-slate-100 last:border-0">
    <span className="text-[10px] text-slate-500 font-bold uppercase">{label}</span>
    <span className="text-[11px] font-black text-slate-900 tracking-tight">{value}</span>
  </div>;
}

function Th({ children, className }: { children: React.ReactNode, className?: string }) {
  return <th className={clsx("px-4 py-3 text-[10px] font-bold uppercase tracking-wider", className)}>{children}</th>;
}

function Td({ children, className }: { children: React.ReactNode, className?: string }) {
  return <td className={clsx("px-4 py-3 text-xs border-slate-100", className)}>{children}</td>;
}