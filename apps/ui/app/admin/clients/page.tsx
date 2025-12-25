'use client';

import axios from 'axios';
import { useState } from 'react';
import { 
  Users, Mail, Calendar, Shield, 
  Settings2, Key, History, X, Save, 
  ChevronRight, ExternalLink, Activity
} from 'lucide-react';
import clsx from 'clsx';

// ... (Types and MOCK_CLIENTS remain the same)
type Client = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
};

const MOCK_CLIENTS: Client[] = [

  {
    id: 1,
    name: 'Client A',
    email: 'clienta@example.com',
    isActive: true,
    createdAt: '2025-01-10',
  },
  {
    id: 2,
    name: 'Client B',
    email: 'clientb@example.com',
    isActive: false,
    createdAt: '2025-01-15',
  },
];

export default function ClientsPage() {
  const [selected, setSelected] = useState<Client | null>(null);

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
      </div>

      {/* ───────────────── CLIENTS TABLE ───────────────── */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <Th>Client ID</Th>
                <Th>Name & Contact</Th>
                <Th>Status</Th>
                <Th>Created On</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_CLIENTS.map((c) => (
                <tr key={c.id} className="group hover:bg-slate-50/80 transition-colors">
                  <Td className="font-mono text-xs font-bold text-slate-400">#{c.id.toString().padStart(3, '0')}</Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                        {c.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                        <span className="text-xs text-slate-500">{c.email}</span>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <span className={clsx(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                      c.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"
                    )}>
                      <span className={clsx("h-1 w-1 rounded-full", c.isActive ? "bg-emerald-500" : "bg-slate-400")} />
                      {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </Td>
                  <Td className="text-xs font-medium text-slate-500">{c.createdAt}</Td>
                  <Td className="text-right">
                    <button
                      onClick={() => setSelected(c)}
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

      {/* ───────────────── DRAWER ───────────────── */}
      {selected && (
        <ClientDrawer client={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

/* ───────────────── DRAWER COMPONENT ───────────────── */

function ClientDrawer({ client, onClose }: { client: Client; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
      {/* Overlay with blur */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

      {/* Panel with slide animation */}
      <div className="relative w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-500 ease-out border-l border-slate-200">
        <div className="flex h-full flex-col">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md tracking-widest uppercase">
                Client Configuration
              </span>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all text-slate-400 hover:text-slate-600 shadow-sm border border-transparent hover:border-slate-100">
                <X size={18} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-xl">
                {client.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{client.name}</h2>
                <p className="text-xs text-slate-500 font-medium">ID: #{client.id}</p>
              </div>
            </div>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-3">
               <QuickLink icon={<Activity size={14}/>} label="Audit Logs" />
               <QuickLink icon={<ExternalLink size={14}/>} label="View Store" />
            </div>

            <Section title="Basic Information" icon={<Settings2 size={16} />}>
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
                <Row label="Email Address" value={client.email} />
                <Row label="Account Status" value={client.isActive ? 'Active' : 'Inactive'} />
                <Row label="Member Since" value={client.createdAt} />
              </div>
            </Section>

            <RateLimitSection clientId={client.id} />

            <CredentialsSection clientId={client.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── DRAWER SUB-COMPONENTS ───────────────── */

function RateLimitSection({ clientId }: { clientId: number }) {
  const [rpm, setRpm] = useState<number>(60);
  const [saving, setSaving] = useState(false);

  return (
    <Section title="API Rate Limits" icon={<Shield size={16} />}>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="number"
            value={rpm}
            onChange={(e) => setRpm(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">RPM</span>
        </div>
        <button 
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <Save size={14} /> Save
        </button>
      </div>
    </Section>
  );
}

function CredentialsSection({ clientId }: { clientId: number }) {
  const providers = [{ id: 1, name: 'DTDC' }, { id: 2, name: 'Delhivery' }, { id: 3, name: 'Maruti' }];
  return (
    <Section title="Courier Credentials" icon={<Key size={16} />}>
      <div className="space-y-2">
        {providers.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 hover:border-indigo-200 transition-all group">
            <span className="text-xs font-bold text-slate-700">{p.name}</span>
            <button className="text-[10px] font-bold text-indigo-600 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-all">
              Configure Key
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
}

function QuickLink({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-100 py-3 px-4 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
      {icon} {label}
    </button>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-400 px-1">
        {icon}
        <h3 className="text-xs font-bold uppercase tracking-widest">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}

function Th({ children, className }: any) {
  return <th className={clsx("px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400", className)}>{children}</th>;
}

function Td({ children, className }: any) {
  return <td className={clsx("px-6 py-4 text-sm text-slate-600", className)}>{children}</td>;
}