'use client';

import { useEffect, useState } from 'react';
import { 
  Users, Shield, Settings2, Key, X, Save, 
  ChevronRight, ExternalLink, Activity, Plus,
  Building2, User as UserIcon, Phone, Mail
} from 'lucide-react';
import clsx from 'clsx';
import { getClients, createClient, updateClient } from '@/lib/api/clients.api';
import { useCreateCredential, useCredentials, useUpdateCredential } from '@/hooks/useCredentials';

type Client = {
  id: number;
  company_name: string;
  email: string;
  phone: string;
  contact_person: string;
  is_active: boolean;
  created_at: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'manage' | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const refresh = () => getClients().then(setClients);
  
  useEffect(() => { refresh(); }, []);

  const closeDrawer = () => {
    setDrawerMode(null);
    setSelectedClient(null);
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Client Management</h1>
            <p className="text-sm text-slate-500 font-medium">Configure limits and credentials for your partners.</p>
          </div>
        </div>

        <button 
          onClick={() => setDrawerMode('create')}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all"
        >
          <Plus size={18} /> Create Client
        </button>
      </div>

      {/* ───────────────── CLIENTS TABLE ───────────────── */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <Th>Client ID</Th>
                <Th>Name & Contact</Th>
                <Th>Contact Person</Th>
                <Th>Contact No</Th>
                <Th>Status</Th>
                <Th>Created On</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {clients.map((c) => (
                <tr key={c.id} className="group hover:bg-slate-50/80 transition-colors">
                  <Td className="font-mono text-xs font-bold text-slate-400">#{c.id.toString().padStart(3, '0')}</Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                        {c.company_name?.charAt(0) || 'C'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">{c.company_name}</span>
                        <span className="text-xs text-slate-500">{c.email}</span>
                      </div>
                    </div>
                  </Td>
                  <Td className="text-xs font-medium text-slate-500">{c.contact_person}</Td>
                  <Td className="text-xs font-medium text-slate-500">{c.phone}</Td>
                  <Td>
                    <span className={clsx(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                      c.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"
                    )}>
                      <span className={clsx("h-1 w-1 rounded-full", c.is_active ? "bg-emerald-500" : "bg-slate-400")} />
                      {c.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </Td>
                  <Td className="text-xs font-medium text-slate-500">{new Date(c.created_at).toLocaleDateString()}</Td>
                  <Td className="text-right space-x-2">
                    <button 
                      onClick={() => { setSelectedClient(c); setDrawerMode('edit'); }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => { setSelectedClient(c); setDrawerMode('manage'); }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      Manage <ChevronRight size={14} />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ───────────────── SINGLE DRAWER CONTROLLER ───────────────── */}
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
  // New State for handling nested Credential Form
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-500 ease-out border-l border-slate-200 overflow-hidden">
        
        {/* VIEW: MANAGE MODE (Multi-Step) */}
        {mode === 'manage' && client && (
          <>
            {/* Step 1: Manage List */}
            {!activeProvider ? (
              <div className="flex h-full flex-col animate-in fade-in duration-300">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md tracking-widest uppercase">Configuration</span>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all text-slate-400 hover:text-slate-600"><X size={18} /></button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-xl">
                      {client.company_name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{client.company_name}</h2>
                      <p className="text-xs text-slate-500 font-medium">ID: #{client.id}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                  <div className="grid grid-cols-2 gap-3">
                    <QuickLink icon={<Activity size={14}/>} label="Audit Logs" />
                    <QuickLink icon={<ExternalLink size={14}/>} label="View Store" />
                  </div>
                  <Section title="Basic Info" icon={<Settings2 size={16} />}><div className="rounded-xl border p-4 space-y-2 bg-slate-50/50 text-xs"><Row label="Email" value={client.email} /><Row label="Status" value={client.is_active ? 'Active' : 'Inactive'} /></div></Section>
                  <RateLimitSection clientId={client.id} />
                  <CredentialsSection clientId={client.id} onConfigure={(p: string) => setActiveProvider(p)} />
                </div>
              </div>
            ) : (
              /* Step 2: Specific Credential Form */
              <CredentialFormView 
                clientId={client.id} 
                provider={activeProvider} 
                onBack={() => setActiveProvider(null)} 
              />
            )}
          </>
        )}

        {/* VIEW: CREATE / EDIT MODE */}
        {(mode === 'create' || mode === 'edit') && (
          <ClientFormView client={client} mode={mode} onClose={onClose} onRefresh={onRefresh} />
        )}

      </div>
    </div>
  );
}

/* ───────────────── FORM VIEW (CREATE/EDIT) ───────────────── */

function ClientFormView({ client, mode, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '', email: '', password: '',
    companyName: '', contactPerson: '', phone: '',
    isActive: true,
  });

  useEffect(() => {
    if (client && mode === 'edit') {
      setFormData({
        username: '', email: client.email || '', password: '',
        companyName: client.company_name || '',
        contactPerson: client.contact_person || '',
        phone: client.phone || '',
        isActive: client.is_active,
      });
    }
  }, [client, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'edit') await updateClient(client.id, formData);
      else await createClient(formData);
      onRefresh();
      onClose();
    } catch (err) {
      alert("Error saving client details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="p-6 border-b bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-900">{mode === 'edit' ? 'Edit Client' : 'New Client'}</h2>
        <p className="text-xs text-slate-500">Enter client credentials and company details.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar">
        <FormField label="Company Name" icon={<Building2 size={16}/>} value={formData.companyName} onChange={(v: any) => setFormData({...formData, companyName: v})} />
        <FormField label="Email Address" icon={<Mail size={16}/>} value={formData.email} onChange={(v: any) => setFormData({...formData, email: v})} />
        
        {mode === 'create' && (
          <>
            <FormField label="Login Username" icon={<UserIcon size={16}/>} value={formData.username} onChange={(v: any) => setFormData({...formData, username: v})} />
            <FormField label="Default Password" type="password" icon={<Shield size={16}/>} value={formData.password} onChange={(v: any) => setFormData({...formData, password: v})} />
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Contact Person" value={formData.contactPerson} onChange={(v: any) => setFormData({...formData, contactPerson: v})} />
          <FormField label="Phone" icon={<Phone size={16}/>} value={formData.phone} onChange={(v: any) => setFormData({...formData, phone: v})} />
        </div>

        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-700">Account Active</span>
          <input 
            type="checkbox" 
            checked={formData.isActive} 
            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
            className="w-5 h-5 accent-indigo-600 rounded"
          />
        </div>
      </div>

      <div className="p-6 border-t bg-white">
        <button 
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : <><Save size={18}/> {mode === 'edit' ? 'Update Client' : 'Register Client'}</>}
        </button>
      </div>
    </form>
  );
}

/* ───────────────── CREDENTIAL FORM VIEW ───────────────── */
function CredentialFormView({
  clientId,
  provider,
  onBack,
}: {
  clientId: number;
  provider: string;
  onBack: () => void;
}) {
  const { data: creds, isLoading } = useCredentials(clientId, provider);
  const createMutation = useCreateCredential();
  const updateMutation = useUpdateCredential(clientId, provider);

  const [formData, setFormData] = useState({
    customerCode: '',
    username: '',
    password: '',
    apiToken: '',
    apiKey: '',
  });

  /* ----------------------------------------
     Load existing credentials into form
  ---------------------------------------- */
  useEffect(() => {
    if (!creds) return;

    const map: any = {};
    for (const c of creds) {
      map[c.key] = c;
    }

    setFormData({
      customerCode: map.DTDC_CUSTOMER_CODE ? '••••••••' : '',
      username: map.username ? '••••••••' : '',
      password: map.password ? '••••••••' : '',
      apiToken: map.api_token ? '••••••••' : '',
      apiKey: map.api_key ? '••••••••' : '',
    });
  }, [creds]);

  /* ----------------------------------------
     Save logic
  ---------------------------------------- */
  const saveField = async (key: string, value: string) => {
    if (!value || value === '••••••••') return;

    const existing = creds?.find(c => c.key === key);

    if (existing) {
      updateMutation.mutate({ id: existing.id, value });
    } else {
      createMutation.mutate({
        clientId,
        provider,
        key,
        value,
      });
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

  /* ----------------------------------------
     UI
  ---------------------------------------- */
  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300 bg-white">
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">
          {provider} Credentials
        </h2>
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <FormField
          label={`${provider} Customer Code`}
          value={formData.customerCode}
          onChange={(v: string) => setFormData({ ...formData, customerCode: v })}
        />
        <FormField
          label="username"
          value={formData.username}
          onChange={(v: string) => setFormData({ ...formData, username: v })}
        />
        <FormField
          label="password"
          type="password"
          showToggle
          value={formData.password}
          onChange={(v: string) => setFormData({ ...formData, password: v })}
        />
        <FormField
          label="api_token"
          type="password"
          showToggle
          value={formData.apiToken}
          onChange={(v: string) => setFormData({ ...formData, apiToken: v })}
        />
        <FormField
          label="api_key"
          type="password"
          showToggle
          value={formData.apiKey}
          onChange={(v: string) => setFormData({ ...formData, apiKey: v })}
        />
      </div>

      <div className="p-6">
        <button
          onClick={handleSave}
          className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all"
        >
          Save
        </button>
      </div>
    </div>
  );
}

/* ───────────────── UI HELPERS ───────────────── */
function FormField({ label, value, onChange, type = "text", showToggle = false }: any) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputType = showToggle ? (isPasswordVisible ? 'text' : 'password') : type;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        {showToggle && (
          <button 
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-tight"
          >
            {isPasswordVisible ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      <input 
        type={inputType}
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
      />
    </div>
  );
}

function RateLimitSection({ clientId }: { clientId: number }) {
  return (
    <Section title="API Rate Limits" icon={<Shield size={16} />}>
      <div className="flex gap-2">
        <input type="number" defaultValue={60} className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold outline-none focus:border-indigo-300 transition-all" />
        <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black transition-all">Save</button>
      </div>
    </Section>
  );
}

function CredentialsSection({
  clientId,
  onConfigure,
}: {
  clientId: number;
  onConfigure: (p: string) => void;
}) {
  const providers = ['dtdc', 'delhivery', 'maruti'];

  return (
    <Section title="Courier Credentials" icon={<Key size={16} />}>
      <div className="space-y-2">
        {providers.map((p) => (
          <div
            key={p}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 hover:border-indigo-200 transition-all"
          >
            <span className="text-xs font-bold text-slate-700">{p}</span>
            <button
              onClick={() => onConfigure(p)}
              className="text-[10px] font-bold text-indigo-600 px-3 py-1.5 bg-indigo-50 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
            >
              Configure
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
}

function QuickLink({ icon, label }: any) {
  return (
    <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-100 py-3 px-4 text-xs font-bold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all">
      {icon} {label}
    </button>
  );
}

function Section({ title, icon, children }: any) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-400">
        <div className="p-1 bg-slate-100 rounded-md">{icon}</div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Row({ label, value }: any) {
  return <div className="flex justify-between py-1">
    <span className="text-slate-500 font-medium">{label}</span>
    <span className="font-bold text-slate-900">{value}</span>
  </div>;
}

function Th({ children, className }: any) {
  return <th className={clsx("px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400", className)}>{children}</th>;
}

function Td({ children, className }: any) {
  return <td className={clsx("px-6 py-4 text-sm text-slate-600 font-medium", className)}>{children}</td>;
}