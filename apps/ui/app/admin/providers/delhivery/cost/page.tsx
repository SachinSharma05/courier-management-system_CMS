"use client";

import { useState } from "react";
import { useAuth } from '@/hooks/useAuth';
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
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  const { user } = useAuth();

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
      client_id: user?.id ?? undefined,
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Calculator className="text-indigo-600" size={32} />
          Cost Estimator
        </h1>
        <p className="text-slate-500 font-medium mt-1">Get instant B2C & C2C shipping rates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT: INPUT FORM --- */}
        <Card className="lg:col-span-5 p-8 border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FloatingInput 
                icon={<MapPin size={16} />} 
                label="Origin Pincode" 
                placeholder="Ex: 452010"
                value={payload.originPin}
                onChange={(v: string) => setPayload({ ...payload, originPin: v })}
              />
              <FloatingInput 
                icon={<MapPin size={16} />} 
                label="Destination" 
                placeholder="Ex: 110001"
                value={payload.destinationPin}
                onChange={(v: string) => setPayload({ ...payload, destinationPin: v })}
              />
            </div>

            <FloatingInput 
              icon={<Weight size={16} />} 
              label="Weight (kg)" 
              placeholder="0.5"
              value={payload.weight}
              onChange={(v: string) => setPayload({ ...payload, weight: v })}
            />

            <FloatingInput 
              icon={<Banknote size={16} />} 
              label="COD Amount (optional)" 
              placeholder="0.00"
              value={payload.codAmount}
              onChange={(v: number) => setPayload({ ...payload, codAmount: Number(v) || 0 })}
            />

            <div className="space-y-2 pt-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Shipping Mode</Label>
              <div className="flex gap-2">
                {['standard', 'express'].map(mode => (
                  <button 
                    key={mode}
                    onClick={() => setPayload({ ...payload, serviceType: mode })}
                    className={clsx(
                      "flex-1 py-3 rounded-xl font-bold text-sm capitalize transition-all border",
                      payload.serviceType === mode 
                        ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200" 
                        : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                    )}
                  >
                    {mode === 'express' && <Zap size={14} className="inline mr-1 text-amber-400" />}
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button 
            onClick={calculate} 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-14 font-black text-md shadow-lg shadow-indigo-100 transition-all"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <ArrowRight className="mr-2" />}
            Calculate Freight
          </Button>
        </Card>

        {/* --- RIGHT: RESULTS --- */}
        <div className="lg:col-span-7">
          {cost ? (
            <Card className="p-8 border-none shadow-2xl shadow-slate-200 rounded-[2.5rem] bg-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Receipt size={240} />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-end">
                  <div>
                    {/* Using cost.zone from your response */}
                    <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 mb-2 uppercase tracking-tighter">
                      Zone {cost.zone}
                    </Badge>
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Freight Breakdown</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Pricing Slab</p>
                    {/* Using slab_type from your response */}
                    <p className="text-lg font-black text-slate-900">{cost.slab}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <SummaryRow label="Base Freight" value={cost.base_charge} />
                  <SummaryRow label="Fuel Surcharge" value={cost.fsc} />
                  <SummaryRow label="COD Charges" value={cost.cod_charge} />
                  <SummaryRow label="CGST (9%)" value={cost.taxes.cgst.toFixed(2)} />
                  <SummaryRow label="SGST (9%)" value={cost.taxes.sgst.toFixed(2)} />
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Estimated Cost</p>
                    {/* formatted to 2 decimal places for money */}
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">₹{cost.total.toFixed(2)}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 max-w-[240px]">
                    <ShieldCheck className="text-emerald-600 shrink-0" size={20} />
                    <p className="text-[10px] font-bold text-emerald-800 leading-tight">
                      This is an estimated rate based on Zone {cost.zone}. Final billing depends on scanned weight.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                <Info size={32} />
              </div>
              <div>
                <p className="text-lg font-black text-slate-400">Ready to Calculate</p>
                <p className="text-sm text-slate-400 font-medium">Enter pincodes and weight to see the freight breakdown.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---
function FloatingInput({ label, icon, placeholder, value, onChange }: any) {
  return (
    <div className="space-y-2 group">
      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors">
        {label}
      </Label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
          {icon}
        </div>
        <Input 
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 pl-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all font-bold text-slate-700"
        />
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string, value: any }) {
  // Convert value to a number to ensure .toFixed works
  const numericValue = Number(value) || 0;

  return (
    <div className="flex justify-between items-center group cursor-default">
      <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
        {label}
      </span>
      <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
        ₹{numericValue.toFixed(2)}
      </span>
    </div>
  );
}

// ---- Simplifier (Keep your logic, just clean the values) ----
function simplifyCost(r: any) {
  if (!r) return null;
  
  // Tax logic: Calculate 9% for CGST/SGST from the total base
  const cgst = r.breakdown.total * 0.09;
  const sgst = r.breakdown.total * 0.09;

  return {
    zone: r.zone,
    slab: r.slab_type, // "ADD_500" etc.
    base_charge: r.breakdown.base,
    fsc: 0, // Set to 0 if your current backend doesn't calculate it yet
    cod_charge: 0, // Set to 0 or map if available
    taxes: {
      cgst: cgst,
      sgst: sgst,
      igst: 0,
    },
    total: r.breakdown.total + cgst + sgst, // Final amount including taxes
  };
}