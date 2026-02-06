'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
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
import { EditableRateCellProps, FormattedClient, RateRowProps, RateSlab, RawClient } from '../interface/adminInterface';

/* ================= STRICT TYPES ================= */
const ZONES = ['A', 'B', 'C1', 'C2', 'D1', 'D2', 'E', 'F'] as const;

/* ================= MAIN PAGE ================= */
export default function PricingPage() {
  const [provider, setProvider] = useState<string>('DTDC');
  const [clientId, setClientId] = useState<number | null>(null);
  const [service, setService] = useState<'Surface' | 'Express' | 'Priority'>('Surface');
  const [gstInclusive, setGstInclusive] = useState<boolean>(false);
  const [clients, setClients] = useState<FormattedClient[]>([]);

  // 1. Fetch Clients
  useEffect(() => {
    getClients().then((data: RawClient[]) => { 
      if (Array.isArray(data)) {
        const formatted: FormattedClient[] = data.map((c: RawClient) => ({
          id: c.id,
          company_name: c.company_name || c.name || 'Unknown Client'
        }));
        setClients(formatted);
      }
    });
  }, []);

  // 2. Data Fetching Hook
  const { data, isLoading, refetch } = useRateCard(provider, service, clientId);

  // Trigger refresh on control change
  useEffect(() => {
    refetch();
  }, [provider, service, clientId, refetch]);

  // 3. Memoized Rate Mapping
  const ratesBySlab = useMemo(() => {
    const map: Record<string, Partial<Record<string, number>>> = {};
    if (!data || !data.slabs) return map;

    data.slabs.forEach((s: RateSlab) => {
      const type = s.slab_type;
      if (!map[type]) map[type] = {};
      map[type][s.zone_code] = Number(s.rate);
    });
    return map;
  }, [data]);

  if (isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] space-y-4">
        <RefreshCw size={32} className="animate-spin text-indigo-500" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Syncing_Rate_Database...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* HEADER SECTION: Unified Command Center Style */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-amber-500 flex items-center justify-center text-white rounded-xl shadow-lg shadow-amber-100 shrink-0">
            <IndianRupee size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Pricing Authority</h1>
            <p className="text-sm text-slate-500 font-medium italic">Manage dynamic rate cards and zonal logistics costs</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <HeaderButton icon={<Download size={16}/>} label="EXPORT CSV" variant="secondary" />
          <HeaderButton icon={<Calculator size={16}/>} label="CALCULATOR" variant="primary" />
        </div>
      </div>

      {/* CONTROL FILTERS: Modern Rounded Selects */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        
        {/* Provider Select */}
        <div className="lg:col-span-2 relative group">
          <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
          <select 
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-8 py-2.5 text-xs font-bold text-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
          >
            <option value="DTDC">DTDC</option>
            <option value="Delhivery">DELHIVERY</option>
            <option value="Maruti">MARUTI</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Client Select */}
        <div className="lg:col-span-3 relative group">
          <select
            disabled={provider !== 'DTDC'}
            value={clientId ?? ''}
            onChange={(e) => setClientId(e.target.value ? Number(e.target.value) : null)}
            className={clsx(
              "w-full border py-2.5 px-4 text-xs font-bold rounded-lg outline-none appearance-none transition-all focus:ring-2 focus:ring-indigo-500/10",
              provider === 'DTDC' ? "bg-white border-slate-200 text-slate-700 cursor-pointer" : "bg-slate-100 border-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            <option value="">{provider === 'DTDC' ? "STANDARD (ALL CLIENTS)" : "N/A"}</option>
            {provider === 'DTDC' && clients.map((c) => (
              <option key={c.id} value={c.id}>{c.company_name.toUpperCase()}</option>
            ))}
          </select>
          {provider === 'DTDC' && <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
        </div>

        {/* Service Toggles */}
        <div className="lg:col-span-4 flex bg-slate-100 p-1.5 rounded-xl gap-1.5">
          {(['Surface', 'Express', 'Priority'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setService(s)}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase transition-all shadow-sm",
                service === s ? "bg-white text-indigo-600 border border-indigo-100" : "text-slate-500 hover:text-slate-700 border border-transparent"
              )}
            >
              {s === 'Surface' ? <Truck size={14} /> : s === 'Express' ? <Zap size={14} /> : <ShieldCheck size={14} />}
              {s}
            </button>
          ))}
        </div>

        {/* GST Switch */}
        <div className="lg:col-span-3 flex items-center justify-end px-4 border-l border-slate-100 h-full">
          <label className="flex items-center gap-3 cursor-pointer group">
            <span className="text-[10px] font-bold text-slate-400 uppercase group-hover:text-slate-600 transition-colors">Show with GST (18%)</span>
            <div 
              onClick={() => setGstInclusive(!gstInclusive)}
              className={clsx(
                "w-10 h-5 rounded-full relative transition-all",
                gstInclusive ? "bg-emerald-500" : "bg-slate-300"
              )}
            >
              <div className={clsx("absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all", gstInclusive ? "left-5.5" : "left-0.5")} />
            </div>
          </label>
        </div>
      </div>

      {/* DATA GRID: Rounded Ledger Style */}
      {data?.notConfigured ? (
        <div className="bg-white border-2 border-dashed border-slate-200 p-16 text-center rounded-2xl shadow-sm">
          <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-900">Configuration Not Found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto italic">No active pricing mapping found for {provider} {service} services.</p>
          <button
            onClick={async () => {
              await api.post('/admin/rate-cards/create', { provider, serviceType: service, clientId });
              refetch();
            }}
            className="mt-6 bg-[#0f172a] text-white px-8 py-3 rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg active:scale-95"
          >
            INITIALIZE NEW RATE CARD
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <Th className="w-[280px] pl-6 text-slate-500">WEIGHT_SLAB_TYPE</Th>
                  {ZONES.map((z) => (
                    <Th key={z} className="text-center text-slate-900 border-l border-slate-100">ZONE {z}</Th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <SectionRow label="Forward Logistics" icon={<ArrowUpRight size={14}/>} />
                <RateRow label="Base Fare (0 - 250g)" slabType="BASE" rates={ratesBySlab.BASE ?? {}} rateCardId={data?.rateCardId ?? 0} gst={gstInclusive} />
                <RateRow label="Addl. 250g (upto 500g)" slabType="ADD_250" rates={ratesBySlab.ADD_250 ?? {}} rateCardId={data?.rateCardId ?? 0} gst={gstInclusive} />
                <RateRow label="Addl. 500g (upto 5kg)" slabType="ADD_500" rates={ratesBySlab.ADD_500 ?? {}} rateCardId={data?.rateCardId ?? 0} gst={gstInclusive} />
                <RateRow label="Bulk Addl. 1kg" slabType="ADD_1KG" rates={ratesBySlab.ADD_1KG ?? {}} rateCardId={data?.rateCardId ?? 0} isHighlight gst={gstInclusive} />

                <SectionRow label="Return (RTO)" icon={<ArrowDownRight size={14}/>} />
                <RateRow label="RTO Base Fare" slabType="RTO_BASE" rates={ratesBySlab.RTO_BASE ?? {}} rateCardId={data?.rateCardId ?? 0} isHighlight gst={gstInclusive} />
                
                <SectionRow label="Reverse Pickup (DTO)" icon={<RefreshCw size={14}/>} />
                <RateRow label="DTO Base Fare" slabType="DTO_BASE" rates={ratesBySlab.DTO_BASE ?? {}} rateCardId={data?.rateCardId ?? 0} isHighlight gst={gstInclusive} />
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FOOTER LEGEND */}
      <div className="flex flex-wrap gap-4">
        <FooterNote icon={<Percent size={14}/>} text="Fuel Surcharge (DPH) of 15.5% applied on subtotal." color="indigo" />
        <FooterNote icon={<ShieldCheck size={14}/>} text="Contractual SLA locked until Dec 2025." color="emerald" />
      </div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */
function RateRow({ label, slabType, rates, rateCardId, isHighlight, gst }: RateRowProps) {
  return (
    <tr className={clsx("transition-colors group", isHighlight ? "bg-indigo-50/20" : "hover:bg-slate-50/50")}>
      <Td className="font-bold text-slate-700 pl-6 border-r border-slate-100 text-sm" colSpan={0}>{label}</Td>
      {ZONES.map((zone) => (
        <Td key={zone} className="text-center border-l border-slate-100 p-0" colSpan={0}>
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

function EditableRateCell({ initialValue, rateCardId, zoneCode, slabType, gstEnabled }: EditableRateCellProps) {
  const [val, setVal] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  useEffect(() => { setVal(initialValue); }, [initialValue]);

  const handleUpdate = async () => {
    if (val === initialValue) { setIsEditing(false); return; }
    setStatus('saving');
    try {
      await api.patch('/admin/rate-cards/rate', { rateCardId, zoneCode, slabType, rate: val });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      setVal(initialValue);
      setStatus('idle');
    }
    setIsEditing(false);
  };

  const displayValue = gstEnabled ? (val * 1.18).toFixed(2) : val;

  return (
    <div className="w-full h-14 relative flex items-center justify-center group/cell cursor-pointer">
      {isEditing ? (
        <input 
          autoFocus
          type="number"
          value={val}
          onChange={(e) => setVal(Number(e.target.value))}
          onBlur={handleUpdate}
          onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
          className="w-full h-full text-center text-sm font-bold bg-white ring-2 ring-indigo-500 outline-none shadow-inner"
        />
      ) : (
        <div 
          onClick={() => { setStatus('idle'); setIsEditing(true); }}
          className={clsx(
            "w-full h-full flex items-center justify-center text-sm font-bold transition-all",
            status === 'success' ? "text-emerald-600 bg-emerald-50" : "text-slate-900 group-hover/cell:bg-indigo-50/50"
          )}
        >
          <span className="text-slate-400 mr-1 font-medium text-[10px]">₹</span>
          {displayValue}
          {status === 'saving' && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><RefreshCw size={14} className="animate-spin text-indigo-500"/></div>}
          {status === 'success' && <Check size={14} className="absolute right-2 top-2 text-emerald-500" />}
        </div>
      )}
    </div>
  );
}

function SectionRow({ label, icon }: { label: string, icon: React.ReactNode }) {
  return (
    <tr className="bg-slate-50/80 border-y border-slate-100">
      <Td colSpan={ZONES.length + 1} className="py-2.5 px-6">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          {icon} {label}
        </div>
      </Td>
    </tr>
  );
}

function Th({ children, className }: { children: ReactNode, className?: string }) {
  return <th className={clsx("px-4 py-4 text-[10px] font-bold uppercase tracking-widest", className)}>{children}</th>;
}

function Td({ children, className, colSpan }: { children: ReactNode, className?: string, colSpan: number }) {
  return <td colSpan={colSpan} className={clsx("px-4 py-2", className)}>{children}</td>;
}

function HeaderButton({ icon, label, variant }: { icon: ReactNode, label: string, variant: string}) {
  return (
    <button className={clsx(
      "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95",
      variant === 'primary' ? "bg-[#0f172a] text-white hover:bg-slate-800" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
    )}>
      {icon} {label}
    </button>
  );
}

function FooterNote({ icon, text, color }: { icon: ReactNode, text: string, color: string }) {
  const styles = color === 'indigo' ? "bg-indigo-50 text-indigo-700 border-indigo-100" : "bg-emerald-50 text-emerald-700 border-emerald-100";
  return (
    <div className={clsx("flex items-center gap-2 px-4 py-2.5 border rounded-xl text-[11px] font-bold uppercase tracking-tight shadow-sm", styles)}>
      {icon} {text}
    </div>
  );
}