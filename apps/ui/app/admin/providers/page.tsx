'use client';

import { useState } from 'react';
import { 
  Server, Activity, Users, AlertTriangle, 
  RefreshCw, Power, Settings, X, 
  ExternalLink, Zap, ShieldCheck, Database
} from 'lucide-react';
import clsx from 'clsx';

// ... (Provider type and MOCK_PROVIDERS stay the same)
type Provider = {
  id: number;
  key: string;
  name: string;
  isActive: boolean;
  clients: number;
  failures: number;
  lastSync: string;
};

const MOCK_PROVIDERS: Provider[] = [
  {
    id: 1,
    key: 'dtdc',
    name: 'DTDC',
    isActive: true,
    clients: 12,
    failures: 3,
    lastSync: '2 min ago',
  },
  {
    id: 2,
    key: 'delhivery',
    name: 'Delhivery',
    isActive: true,
    clients: 8,
    failures: 0,
    lastSync: '5 min ago',
  },
  {
    id: 3,
    key: 'maruti',
    name: 'Maruti',
    isActive: false,
    clients: 2,
    failures: 0,
    lastSync: '—',
  },
];

export default function ProvidersPage() {
  const [selected, setSelected] = useState<Provider | null>(null);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
            <Server size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Carrier Integration</h1>
            <p className="text-sm text-slate-500 font-medium">Manage API connections and gateway health.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
          <RefreshCw size={16} className="text-indigo-500" />
          Sync All Gateways
        </button>
      </div>

      {/* ───────────────── PROVIDER GRID ───────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROVIDERS.map((p) => (
          <div 
            key={p.id} 
            className="relative group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden"
          >
            {/* Background Accent */}
            <div className={clsx(
                "absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700",
                p.isActive ? "bg-emerald-500" : "bg-slate-500"
            )} />

            <div className="flex justify-between items-start mb-6">
              <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 font-black text-xs shadow-inner uppercase">
                {p.key.substring(0, 3)}
              </div>
              <StatusBadge isActive={p.isActive} />
            </div>

            <div className="space-y-1 mb-6">
              <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
              <p className="text-xs font-mono text-slate-400">UUID: gateway_0x{p.id}4f2</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-slate-50 py-4 mb-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Active Clients</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Users size={14} className="text-indigo-500" />
                  <span className="font-bold text-slate-700">{p.clients}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Failures (24h)</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <AlertTriangle size={14} className={p.failures > 0 ? "text-red-500" : "text-slate-300"} />
                  <span className={clsx("font-bold", p.failures > 0 ? "text-red-600" : "text-slate-700")}>
                    {p.failures}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                <Activity size={12} className={p.isActive ? "text-emerald-500 animate-pulse" : ""} />
                Last Sync: {p.lastSync}
              </div>
              <button 
                onClick={() => setSelected(p)}
                className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
              >
                <Settings size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ───────────────── DRAWER ───────────────── */}
      {selected && (
        <ProviderDrawer provider={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

/* ───────────────── REFINED DRAWER ───────────────── */

function ProviderDrawer({ provider, onClose }: { provider: Provider; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-500 ease-out">
        <div className="flex h-full flex-col">
          
          <div className="p-8 border-b border-slate-100">
             <div className="flex justify-between items-center mb-6">
                <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                    <X size={20} className="text-slate-400" />
                </button>
                <StatusBadge isActive={provider.isActive} />
             </div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">{provider.name}</h2>
             <p className="text-slate-500 text-sm mt-1">Carrier API Gateway Configuration</p>
          </div>

          <div className="p-8 space-y-8 flex-1 overflow-y-auto no-scrollbar">
            
            <DrawerSection title="Core Infrastructure" icon={<Database size={16} />}>
               <div className="grid grid-cols-1 gap-3">
                  <DataCard label="Internal Key" value={provider.key} icon={<Zap size={14}/>} />
                  <DataCard label="Sync Frequency" value="Every 5 minutes" icon={<ClockIcon size={14}/>} />
               </div>
            </DrawerSection>

            <DrawerSection title="Health Metrics" icon={<Activity size={16} />}>
               <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
                  <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gateway Latency</p>
                        <p className="text-2xl font-black">24ms</p>
                    </div>
                    <div className="h-10 w-24 flex items-end gap-1 pb-1">
                        {[40, 70, 45, 90, 65, 80].map((h, i) => (
                            <div key={i} className="flex-1 bg-emerald-400 rounded-t-sm" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                  </div>
                  <div className="h-[1px] bg-slate-800 w-full" />
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase">
                     <span>DLQ Status: {provider.failures > 0 ? 'CRITICAL' : 'HEALTHY'}</span>
                     <span className="text-emerald-400">99.9% Uptime</span>
                  </div>
               </div>
            </DrawerSection>

            <DrawerSection title="Gateway Control" icon={<ShieldCheck size={16} />}>
               <div className="space-y-3">
                  <button className={clsx(
                    "w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all shadow-sm",
                    provider.isActive 
                        ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
                        : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200"
                  )}>
                    <Power size={18} />
                    {provider.isActive ? 'Deactivate Gateway' : 'Activate Gateway'}
                  </button>
                  <button className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all">
                    <ExternalLink size={18} />
                    View Documentation
                  </button>
               </div>
            </DrawerSection>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── MINI COMPONENTS ───────────────── */

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <div className={clsx(
      "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"
    )}>
      <span className={clsx("h-1.5 w-1.5 rounded-full", isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
      {isActive ? 'Operational' : 'Disabled'}
    </div>
  );
}

function DrawerSection({ title, icon, children }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-400 px-1">
        {icon}
        <h3 className="text-[11px] font-bold uppercase tracking-[2px]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function DataCard({ label, value, icon }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
      <div className="flex items-center gap-3">
        <div className="text-indigo-500">{icon}</div>
        <span className="text-xs font-bold text-slate-500">{label}</span>
      </div>
      <span className="text-xs font-mono font-bold text-slate-900">{value}</span>
    </div>
  );
}

function ClockIcon({ size }: { size: number }) {
    return <RefreshCw size={size} />;
}