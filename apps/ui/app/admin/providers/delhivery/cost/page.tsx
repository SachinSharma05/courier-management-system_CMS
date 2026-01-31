"use client";

import { useState } from "react";
import { 
  Calculator, 
  MapPin, 
  Weight, 
  Banknote, 
  Zap, 
  ArrowRight, 
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

export default function CostCalculator() {
  const [payload, setPayload] = useState({
    originPin: "",
    destinationPin: "",
    weight: "",
    paymentType: "prepaid",
    codAmount: 0,
    serviceType: "standard",
  });

  const [cost, setCost] = useState<any>(null);
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
    <div className="space-y-6">
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-slate-900 flex items-center justify-center text-white rounded-sm shadow-md">
            <Calculator size={24} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Freight_Engine_V2</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
              <Terminal size={12} className="text-indigo-600" /> Rate_Card: DELHI_B2C_2024
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System_Status</p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase">Live_Nodes_Active</p>
            </div>
            <Activity size={20} className="text-slate-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ───────────────── LEFT: PARAMETER INPUT ───────────────── */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <Database size={14} className="text-slate-400" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Input_Parameters</h2>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FloatingInput 
                  label="Origin_Pin" 
                  value={payload.originPin}
                  onChange={(v: string) => setPayload({ ...payload, originPin: v })}
                />
                <FloatingInput 
                  label="Dest_Pin" 
                  value={payload.destinationPin}
                  onChange={(v: string) => setPayload({ ...payload, destinationPin: v })}
                />
              </div>

              <FloatingInput 
                label="Chargeable_Weight_(KG)" 
                value={payload.weight}
                onChange={(v: string) => setPayload({ ...payload, weight: v })}
              />

              <FloatingInput 
                label="COD_Value_(INR)" 
                value={payload.codAmount}
                onChange={(v: number) => setPayload({ ...payload, codAmount: Number(v) || 0 })}
              />

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Service_Class</Label>
                <div className="flex gap-2">
                  {['standard', 'express'].map(mode => (
                    <button 
                      key={mode}
                      onClick={() => setPayload({ ...payload, serviceType: mode })}
                      className={clsx(
                        "flex-1 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest transition-all border",
                        payload.serviceType === mode 
                          ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                          : "bg-white text-slate-400 border-slate-200 hover:border-slate-400"
                      )}
                    >
                      {mode === 'express' && <Zap size={12} className="inline mr-2 text-amber-400 fill-amber-400" />}
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={calculate} 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-sm h-14 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <ShieldCheck className="mr-2" size={18} />}
                Execute_Calculation
              </Button>
            </div>
          </div>
          
          <div className="p-4 bg-slate-900 rounded-sm border border-slate-800">
             <div className="flex items-center gap-3 text-indigo-400 mb-2">
                <Info size={14} />
                <p className="text-[10px] font-black uppercase tracking-widest">Logistics_Notice</p>
             </div>
             <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase">
                Rates are derived from the master agreement v4.2. Volumetric weight will be applied if (L*B*H)/5000 exceeds dead weight.
             </p>
          </div>
        </div>

        {/* ───────────────── RIGHT: TELEMETRY RESULTS ───────────────── */}
        <div className="lg:col-span-7">
          {cost ? (
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-500">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Receipt size={14} className="text-indigo-400" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Freight_Telemetry_Output</h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase">Computed_Success</span>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Routing_Zone</p>
                    <h3 className="text-3xl font-mono font-black text-slate-900 tracking-tighter">ZONE_{cost.zone}</h3>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied_Slab</p>
                    <p className="text-lg font-mono font-black text-indigo-600 uppercase">{cost.slab}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 border-y border-slate-100 py-8">
                  <SummaryRow label="Base_Freight" value={cost.base_charge} />
                  <SummaryRow label="Fuel_Surcharge_(FSC)" value={cost.fsc} />
                  <SummaryRow label="COD_Service_Fee" value={cost.cod_charge} />
                  <SummaryRow label="CGST_System_Tax_(9%)" value={cost.taxes.cgst.toFixed(2)} />
                  <SummaryRow label="SGST_System_Tax_(9%)" value={cost.taxes.sgst.toFixed(2)} />
                  <div className="flex justify-between items-center group">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Node_Serviceability</span>
                    <span className="text-[10px] font-mono font-black text-emerald-600 uppercase">PROVISIONED</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
                  <div>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <Timer size={12}/> Total_Estimated_Payable
                    </p>
                    <p className="text-6xl font-mono font-black text-slate-900 tracking-tighter italic">
                      ₹{cost.total.toFixed(2)}
                    </p>
                  </div>
                  <div className="max-w-[200px] p-3 bg-slate-50 border border-slate-100 rounded-sm">
                    <p className="text-[9px] font-bold text-slate-500 leading-tight uppercase">
                      Final billing subject to physical audit at gateway ingestion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center text-center p-12 bg-slate-50/30">
              <div className="w-16 h-16 bg-white border border-slate-100 rounded-sm flex items-center justify-center text-slate-300 shadow-sm mb-4">
                <Activity size={32} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Engine_Idle</p>
                <p className="text-xs text-slate-400 font-bold uppercase mt-2">Awaiting payload parameters for freight computation...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ───────────────── ERP SUB-COMPONENTS ─────────────────

function FloatingInput({ label, value, onChange }: any) {
  return (
    <div className="space-y-1.5 group">
      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors">
        {label}
      </Label>
      <Input 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-sm border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-0 font-mono font-black text-xs text-slate-900 uppercase tracking-tight"
      />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string, value: any }) {
  const numericValue = Number(value) || 0;
  return (
    <div className="flex justify-between items-center group py-1 border-b border-transparent hover:border-slate-100 transition-all">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">
        {label}
      </span>
      <span className="text-xs font-mono font-black text-slate-900 group-hover:text-indigo-600">
        ₹{numericValue.toFixed(2)}
      </span>
    </div>
  );
}

// ───────────────── LOGIC CORE (PRESERVED) ─────────────────

function simplifyCost(r: any) {
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