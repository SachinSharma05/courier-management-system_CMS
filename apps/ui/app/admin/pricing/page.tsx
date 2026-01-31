'use client';

import { useEffect, useMemo, useState } from 'react';
import { 
  IndianRupee, Calculator, 
  Layers, ArrowDownRight, ArrowUpRight, 
  Zap, Truck, ShieldCheck, Download, 
  Percent, ChevronDown,
  RefreshCw,
  AlertCircle,
  Check
} from 'lucide-react';
import clsx from 'clsx';
// import { EditableRateCell } from '@/components/ui/EditableRateCell';
import { useRateCard } from '@/hooks/useRateCard';
import { getClients } from '@/lib/api/clients.api';
import { api } from '@/lib/api/axios';

/* ================= STRICT TYPES ================= */

const ZONES = ['A', 'B', 'C1', 'C2', 'D1', 'D2', 'E', 'F'] as const;
type ZoneCode = typeof ZONES[number];

interface ClientOption {
  id: number;
  company_name: string;
}

interface Slab {
  id: number;
  slab_type: string;
  zone_code: ZoneCode;
  rate: string | number;
}

interface RateCardData {
  rateCardId: number;
  notConfigured?: boolean;
  slabs: Slab[];
}

type ServiceType = 'Surface' | 'Express' | 'Priority';

/* ================= MAIN COMPONENT ================= */

export default function PricingPage() {
  const [provider, setProvider] = useState<string>('DTDC');
  const [clientId, setClientId] = useState<number | null>(null);
  const [service, setService] = useState<ServiceType>('Surface');
  const [gstInclusive, setGstInclusive] = useState<boolean>(false);
  const [clients, setClients] = useState<ClientOption[]>([]);

  // 1. Fetch Clients
  useEffect(() => {
    getClients().then((data: unknown) => {
      if (Array.isArray(data)) {
        const formatted = data.map((c: any) => ({
          id: c.id,
          company_name: c.company_name || c.name || 'Unknown Client'
        }));
        setClients(formatted);
      }
    });
  }, []);

  // 2. Data Fetching Hook
  const { data, isLoading, refetch } = useRateCard(provider, service, clientId) as { 
    data: RateCardData | null, 
    isLoading: boolean, 
    refetch: () => void 
  };

  // Trigger refresh on control change
  useEffect(() => {
    refetch();
  }, [provider, service, clientId, refetch]);

  // 3. Memoized Rate Mapping
  const ratesBySlab = useMemo(() => {
    const map: Record<string, Partial<Record<ZoneCode, number>>> = {};
    if (!data || !data.slabs) return map;

    data.slabs.forEach((s) => {
      const type = s.slab_type;
      if (!map[type]) map[type] = {};
      map[type][s.zone_code] = Number(s.rate);
    });
    return map;
  }, [data]);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center gap-3 text-slate-400 font-mono text-[10px] uppercase">
        <RefreshCw size={14} className="animate-spin" /> Syncing_Rate_Database...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-screen font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 border border-slate-200 rounded-sm shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-amber-600 flex items-center justify-center text-white rounded-sm">
            <IndianRupee size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-none tracking-tight">PRICING_AUTHORITY</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Edit dynamic pricing slabs for courier partners</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <HeaderButton icon={<Download size={14}/>} label="EXPORT CSV" variant="secondary" />
          <HeaderButton icon={<Calculator size={14}/>} label="QUICK CALCULATOR" variant="primary" />
        </div>
      </div>

      {/* CONTROL FILTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 bg-white p-2 border border-slate-200 rounded-sm shadow-sm">
        <div className="lg:col-span-2 relative">
          <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <select 
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-8 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 appearance-none cursor-pointer"
          >
            <option value="DTDC">DTDC</option>
            <option value="Delhivery">DELHIVERY</option>
            <option value="Maruti">MARUTI</option>
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="lg:col-span-3 relative">
          <select
            disabled={provider !== 'DTDC'}
            value={clientId ?? ''}
            onChange={(e) => setClientId(e.target.value ? Number(e.target.value) : null)}
            className={clsx(
              "w-full border py-2 px-3 text-xs font-bold outline-none appearance-none transition-colors",
              provider === 'DTDC' ? "bg-white border-slate-200 text-slate-700 cursor-pointer" : "bg-slate-100 border-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            <option value="">{provider === 'DTDC' ? "STANDARD (ALL CLIENTS)" : "N/A"}</option>
            {provider === 'DTDC' && clients.map((c) => (
              <option key={c.id} value={c.id}>{c.company_name.toUpperCase()}</option>
            ))}
          </select>
          {provider === 'DTDC' && <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />}
        </div>

        <div className="lg:col-span-4 flex bg-slate-100 p-1 rounded-sm gap-1">
          {(['Surface', 'Express', 'Priority'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setService(s)}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-black uppercase transition-all",
                service === s ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {s === 'Surface' ? <Truck size={12} /> : s === 'Express' ? <Zap size={12} /> : <ShieldCheck size={12} />}
              {s}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 flex items-center justify-end px-4 border-l border-slate-100">
          <label className="flex items-center gap-3 cursor-pointer group">
            <span className="text-[10px] font-bold text-slate-500 uppercase group-hover:text-slate-900 transition-colors">Show with GST (18%)</span>
            <input 
              type="checkbox" 
              className="w-4 h-4 border-slate-300 rounded-sm text-blue-600 focus:ring-0 cursor-pointer" 
              checked={gstInclusive}
              onChange={() => setGstInclusive(!gstInclusive)}
            />
          </label>
        </div>
      </div>

      {/* DATA GRID */}
      {data?.notConfigured ? (
        <div className="bg-white border-2 border-dashed border-slate-200 p-12 text-center rounded-sm">
          <AlertCircle className="mx-auto text-amber-500 mb-2" size={32} />
          <h3 className="text-sm font-bold text-slate-900 uppercase">Configuration Not Found</h3>
          <p className="text-[10px] text-slate-500 uppercase mt-1">No mapping for {provider} - {service}</p>
          <button
            onClick={async () => {
              await api.post('/admin/rate-cards/create', { provider, serviceType: service, clientId });
              refetch();
            }}
            className="mt-4 bg-slate-900 text-white px-6 py-2 text-[10px] font-black hover:bg-black rounded-sm tracking-tighter"
          >
            INITIALIZE NEW RATE CARD
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <Th className="w-[280px]">WEIGHT_SLAB_TYPE</Th>
                  {ZONES.map((z) => (
                    <Th key={z} className="text-center border-l border-slate-800">ZONE_{z}</Th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <SectionRow label="Forward Logistics" icon={<ArrowUpRight size={12}/>} />
                <RateRow label="Base Fare (0 - 250g)" slabType="BASE" rates={ratesBySlab.BASE ?? {}} rateCardId={data?.rateCardId ?? 0} gst={gstInclusive} />
                <RateRow label="Addl. 250g (upto 500g)" slabType="ADD_250" rates={ratesBySlab.ADD_250 ?? {}} rateCardId={data?.rateCardId ?? 0} gst={gstInclusive} />
                <RateRow label="Addl. 500g (upto 5kg)" slabType="ADD_500" rates={ratesBySlab.ADD_500 ?? {}} rateCardId={data?.rateCardId ?? 0} gst={gstInclusive} />
                <RateRow label="Bulk Addl. 1kg" slabType="ADD_1KG" rates={ratesBySlab.ADD_1KG ?? {}} rateCardId={data?.rateCardId ?? 0} isHighlight gst={gstInclusive} />

                <SectionRow label="Return (RTO)" icon={<ArrowDownRight size={12}/>} />
                <RateRow label="RTO Base Fare" slabType="RTO_BASE" rates={ratesBySlab.RTO_BASE ?? {}} rateCardId={data?.rateCardId ?? 0} isHighlight gst={gstInclusive} />
                
                <SectionRow label="Reverse Pickup (DTO)" icon={<RefreshCw size={12}/>} />
                <RateRow label="DTO Base Fare" slabType="DTO_BASE" rates={ratesBySlab.DTO_BASE ?? {}} rateCardId={data?.rateCardId ?? 0} isHighlight gst={gstInclusive} />
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FOOTER LEGEND */}
      <div className="flex gap-4">
        <FooterNote icon={<Percent size={14}/>} text="Fuel Surcharge (DPH) of 15.5% applied on subtotal." color="indigo" />
        <FooterNote icon={<ShieldCheck size={14}/>} text="Contractual SLA locked until Dec 2025." color="emerald" />
      </div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function RateRow({ label, slabType, rates, rateCardId, isHighlight, gst }: {
  label: string; slabType: string; rates: Partial<Record<ZoneCode, number>>; rateCardId: number; isHighlight?: boolean; gst: boolean;
}) {
  return (
    <tr className={clsx("transition-colors", isHighlight ? "bg-blue-50/40" : "hover:bg-slate-50")}>
      <Td className="font-bold text-slate-700 bg-slate-50/30 border-r border-slate-100">{label}</Td>
      {ZONES.map((zone) => (
        <Td key={zone} className="text-center border-l border-slate-100 p-0">
          <EditableRateCell
            initialValue={rates[zone] ?? 0}
            rateCardId={rateCardId}
            zoneCode={zone}
            slabType={slabType}
            gstEnabled={gst}
          />
        </Td>
      ))}
    </tr>
  );
}

function EditableRateCell({ initialValue, rateCardId, zoneCode, slabType, gstEnabled }: {
  initialValue: number; rateCardId: number; zoneCode: string; slabType: string; gstEnabled: boolean;
}) {
  const [val, setVal] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  useEffect(() => { setVal(initialValue); }, [initialValue]);

  const handleUpdate = async () => {
    if (val === initialValue) { setIsEditing(false); return; }
    setStatus('saving');
    try {
      await api.patch('/admin/rate-cards/rate', {
        rateCardId,
        zoneCode,
        slabType,
        rate: val
      });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error("Update failed", err);
      setVal(initialValue);
      setStatus('idle');
    }
    setIsEditing(false);
  };

  const displayValue = gstEnabled ? (val * 1.18).toFixed(2) : val;

  return (
    <div className="w-full h-10 relative flex items-center justify-center group/cell">
      {isEditing ? (
        <input 
          autoFocus
          type="number"
          value={val}
          onChange={(e) => setVal(Number(e.target.value))}
          onBlur={handleUpdate}
          onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
          className="w-full h-full text-center text-xs font-black bg-white ring-2 ring-blue-500 outline-none"
        />
      ) : (
        <div 
          onClick={() => setStatus('idle') || setIsEditing(true)}
          className={clsx(
            "w-full h-full flex items-center justify-center text-xs font-black cursor-pointer transition-all",
            status === 'success' ? "text-emerald-600 bg-emerald-50" : "text-slate-900 group-hover/cell:bg-blue-50"
          )}
        >
          {displayValue}
          {status === 'saving' && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><RefreshCw size={10} className="animate-spin text-blue-500"/></div>}
          {status === 'success' && <Check size={10} className="absolute right-1 top-1 text-emerald-500" />}
        </div>
      )}
    </div>
  );
}

function SectionRow({ label, icon }: { label: string, icon: React.ReactNode }) {
  return (
    <tr className="bg-slate-100 border-y border-slate-200">
      <Td colSpan={ZONES.length + 1} className="py-1.5 px-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
          {icon} {label}
        </div>
      </Td>
    </tr>
  );
}

function Th({ children, className }: { children: React.ReactNode, className?: string }) {
  return <th className={clsx("px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-300", className)}>{children}</th>;
}

function Td({ children, className, colSpan }: { children: React.ReactNode, className?: string, colSpan?: number }) {
  return <td colSpan={colSpan} className={clsx("px-4 py-2 text-xs", className)}>{children}</td>;
}

function HeaderButton({ icon, label, variant }: { icon: React.ReactNode, label: string, variant: 'primary' | 'secondary' }) {
  return (
    <button className={clsx(
      "flex items-center gap-2 px-4 py-2 text-[10px] font-black rounded-sm border transition-all",
      variant === 'primary' ? "bg-slate-900 text-white border-slate-900 hover:bg-black" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
    )}>
      {icon} {label}
    </button>
  );
}

function FooterNote({ icon, text, color }: { icon: React.ReactNode, text: string, color: 'indigo' | 'emerald' }) {
  const styles = color === 'indigo' ? "bg-indigo-50 text-indigo-700 border-indigo-100" : "bg-emerald-50 text-emerald-700 border-emerald-100";
  return (
    <div className={clsx("flex items-center gap-2 px-3 py-2 border rounded-sm text-[10px] font-bold uppercase tracking-tighter", styles)}>
      {icon} {text}
    </div>
  );
}