"use client";

import { useState } from "react";
import { 
  Calculator,  
  Zap, 
  Loader2, 
  Receipt,
  Info,
  ShieldCheck,
  Terminal,
  Activity,
  Database,
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import clsx from 'clsx';
import { api } from "@/lib/api/axios";
import { FloatingInputProps, RawCostResponse, SimplifiedCost } from "@/app/admin/interface/adminInterface";

export default function CostCalculator() {
  const [payload, setPayload] = useState({
    originPin: "",
    destinationPin: "",
    weight: "",
    paymentType: "prepaid",
    codAmount: 0,
    serviceType: "standard",
  });

  const [cost, setCost] = useState<SimplifiedCost | null>(null);
  const [loading, setLoading] = useState(false);

  // ───────────────── CORE LOGIC (PRESERVED) ─────────────────
  async function calculate() {
    setLoading(true);
    setCost(null);

    const body = {
      originPin: payload.originPin,
      destinationPin: payload.destinationPin,
      weight: Number(payload.weight) * 1000, 
      serviceType: payload.serviceType === "express" ? "express" : "surface",
      paymentType: payload.paymentType === 'COD' ? "COD" : "PREPAID",
      codAmount: payload.codAmount ? Number(payload.codAmount) : undefined,
      provider: 'delhivery',
    };

    try {
      // Mocking the API response structure based on your logic
      const r = await api.post("/providers/delhivery/rate", body).then( r => r.data);
      if (r && r.zone) {
        setCost(simplifyCost(r));
      }
    } catch (err) {
      console.error("Calculation error", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 bg-[#0F172A] flex items-center justify-center text-white rounded-2xl shadow-xl shadow-indigo-100">
            <Calculator size={28} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Freight Engine V2</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
              <Terminal size={12} className="text-indigo-500" /> Rate_Card: DELHI_B2C_2024
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="text-right hidden md:block">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">System_Status</p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase mt-1">Live Nodes Active</p>
            </div>
            <Activity size={20} className="text-slate-300" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ───────────────── LEFT: PARAMETER INPUT ───────────────── */}
        <div className="lg:col-span-5 space-y-6">
          <SectionModule icon={<Database size={18}/>} title="Input Parameters">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FloatingInput 
                  label="Origin Pin" 
                  value={payload.originPin}
                  onChange={(v: string) => setPayload({ ...payload, originPin: v })}
                />
                <FloatingInput 
                  label="Dest Pin" 
                  value={payload.destinationPin}
                  onChange={(v: string) => setPayload({ ...payload, destinationPin: v })}
                />
              </div>

              <FloatingInput 
                label="Chargeable Weight (KG)" 
                value={payload.weight}
                onChange={(v: string) => setPayload({ ...payload, weight: v })}
              />

              <FloatingInput 
                label="COD Value (INR)" 
                value={payload.codAmount}
                onChange={(v: number) => setPayload({ ...payload, codAmount: Number(v) || 0 })}
              />

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Service Class</Label>
                <div className="flex gap-3">
                  {['standard', 'express'].map(mode => (
                    <button 
                      key={mode}
                      onClick={() => setPayload({ ...payload, serviceType: mode })}
                      className={clsx(
                        "flex-1 py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all border",
                        payload.serviceType === mode 
                          ? "bg-[#0F172A] text-white border-slate-900 shadow-lg shadow-indigo-100" 
                          : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                      )}
                    >
                      {mode === 'express' && <Zap size={14} className="inline mr-2 text-amber-400 fill-amber-400" />}
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={calculate} 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-14 font-bold text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all mt-4"
              >
                {loading ? <Loader2 className="animate-spin mr-3" /> : <ShieldCheck className="mr-3" size={20} />}
                Execute Calculation
              </Button>
            </div>
          </SectionModule>
          
          <div className="p-6 bg-[#0F172A] rounded-2xl border border-slate-800 shadow-xl">
             <div className="flex items-center gap-3 text-indigo-400 mb-3">
                <Info size={16} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Logistics Notice</p>
             </div>
             <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                Rates are derived from the <span className="text-slate-200">master agreement v4.2</span>. Volumetric weight will be applied if (L*B*H)/5000 exceeds dead weight.
             </p>
          </div>
        </div>

        {/* ───────────────── RIGHT: TELEMETRY RESULTS ───────────────── */}
        <div className="lg:col-span-7">
          {cost ? (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="px-6 py-5 border-b border-slate-50 bg-[#0F172A] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Receipt size={18} className="text-indigo-400" />
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Freight Telemetry Output</h2>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase">Computed Success</span>
                </div>
              </div>

              <div className="p-10 space-y-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Routing Zone</p>
                    <h3 className="text-4xl font-mono font-black text-slate-900 tracking-tighter">ZONE_{cost.zone}</h3>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Applied Slab</p>
                    <p className="text-xl font-mono font-black text-indigo-600 uppercase bg-indigo-50 px-4 py-1 rounded-lg inline-block">
                        {cost.slab}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 border-y border-slate-50 py-10">
                  <SummaryRow label="Base Freight" value={cost.base_charge} />
                  <SummaryRow label="Fuel Surcharge (FSC)" value={cost.fsc} />
                  <SummaryRow label="COD Service Fee" value={cost.cod_charge} />
                  <SummaryRow label="CGST System Tax (9%)" value={cost.taxes.cgst.toFixed(2)} />
                  <SummaryRow label="SGST System Tax (9%)" value={cost.taxes.sgst.toFixed(2)} />
                  <div className="flex justify-between items-center group">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-tight">Node Serviceability</span>
                    <span className="text-[11px] font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">Provisioned</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
                  <div>
                    <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                        <Timer size={14}/> Total Estimated Payable
                    </p>
                    <p className="text-7xl font-mono font-black text-slate-900 tracking-tighter">
                      ₹{cost.total.toFixed(2)}
                    </p>
                  </div>
                  <div className="max-w-[220px] p-5 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                      Final billing subject to physical audit at gateway ingestion. Computed at {new Date().toLocaleTimeString()}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[580px] border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center p-16 bg-slate-50/30">
              <div className="w-20 h-20 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-200 shadow-sm mb-6">
                <Activity size={40} />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Engine Idle</p>
                <p className="text-[13px] text-slate-300 font-bold uppercase tracking-widest max-w-xs">Awaiting payload parameters for freight computation...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────── MODERN ERP COMPONENTS ───────────────── */

function SectionModule({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transition-all hover:border-indigo-100">
      <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
        <div className="p-2.5 bg-white border border-slate-100 text-indigo-500 rounded-xl shadow-sm">{icon}</div>
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">{title}</h2>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
}

function FloatingInput<T extends string | number>({ 
  label, 
  value, 
  onChange, 
  type = "text" 
}: FloatingInputProps<T>) {
  return (
    <div className="space-y-2 group">
      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors">
        {label}
      </Label>
      <Input 
        type={type}
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          // If the type is number, convert the string value back to a Number
          const finalValue = type === "number" ? (Number(val) as T) : (val as T);
          onChange(finalValue);
        }}
        className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus-visible:bg-white focus-visible:ring-indigo-500 font-mono font-bold text-xs text-slate-900 uppercase tracking-tight transition-all"
      />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string, value: string | number }) {
  const numericValue = Number(value) || 0;
  return (
    <div className="flex justify-between items-center group py-2 border-b border-slate-50 hover:border-indigo-100 transition-all">
      <span className="text-[11px] font-black text-slate-400 uppercase tracking-tight group-hover:text-slate-600">
        {label}
      </span>
      <span className="text-sm font-mono font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
        ₹{numericValue.toFixed(2)}
      </span>
    </div>
  );
}

// ───────────────── LOGIC CORE (PRESERVED) ─────────────────
function simplifyCost(r: RawCostResponse | null | undefined): SimplifiedCost | null {
  if (!r) return null;
  const cgst = r.breakdown.total * 0.09;
  const sgst = r.breakdown.total * 0.09;

  return {
    zone: r.zone,
    slab: r.slab_type, 
    base_charge: r.breakdown.base,
    fsc: 0, 
    cod_charge: 0, 
    taxes: {
      cgst: cgst,
      sgst: sgst,
      igst: 0,
    },
    total: r.breakdown.total + cgst + sgst, 
  };
}