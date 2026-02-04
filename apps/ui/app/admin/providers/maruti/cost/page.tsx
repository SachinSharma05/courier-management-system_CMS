"use client";

import React, { useState } from 'react';
import { 
  Calculator, 
  Scale, 
  Box, 
  IndianRupee, 
  Zap, 
  ArrowRight,
  Loader2,
} from 'lucide-react';
import clsx from 'clsx';
import { useMaruti } from '@/hooks/useMaruti';

export default function MarutiRateCalculator() {
  const { calculateEcommRate } = useMaruti();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const [form, setForm] = useState({
    deliveryPromise: "SURFACE",
    fromPincode: "",
    toPincode: "",
    weight: 0,
    length: 0,
    width: 0,
    height: 0
  });

  // Derived State: Volumetric Calculation (Standard factor 5000 for Maruti)
  const volumetricWeight = (form.length * form.width * form.height) / 5000;
  const chargeableWeight = Math.max(form.weight / 1000, volumetricWeight);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await calculateEcommRate(form);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Rate_Estimation_Engine</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Maruti_Air // Dynamic_Pricing_Module</p>
        </div>
        <div className="bg-indigo-50 px-4 py-2 rounded-sm border border-indigo-100">
           <p className="text-[9px] font-black text-indigo-600 uppercase">Pricing_Protocol</p>
           <p className="text-[10px] font-bold text-slate-700 uppercase">Standard_Slab_v2.4</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT PANEL */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
            <form onSubmit={handleCalculate} className="space-y-6">
              
              {/* GEOGRAPHY SLAB */}
              <div className="grid grid-cols-2 gap-4">
                <Input label="Origin_Pincode" value={form.fromPincode} onChange={(v: string) => setForm({...form, fromPincode: v})} />
                <Input label="Destination_Pincode" value={form.toPincode} onChange={(v: string) => setForm({...form, toPincode: v})} />
              </div>

              {/* SERVICE TYPE */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase">Delivery_Promise</label>
                <div className="flex gap-2">
                  {['SURFACE', 'AIR'].map((mode) => (
                    <button 
                      key={mode}
                      type="button"
                      onClick={() => setForm({...form, deliveryPromise: mode})}
                      className={clsx(
                        "flex-1 py-2 text-[10px] font-black border transition-all",
                        form.deliveryPromise === mode ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-400 hover:border-indigo-300"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* DIMENSIONS & WEIGHT */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 border border-slate-100">
                <Input label="Weight (Grams)" type="number" value={form.weight} onChange={(v: string) => setForm({...form, weight: parseFloat(v) || 0})} />
                <Input label="Length (CM)" type="number" value={form.length} onChange={(v: string) => setForm({...form, length: parseFloat(v) || 0})} />
                <Input label="Width (CM)" type="number" value={form.width} onChange={(v: string) => setForm({...form, width: parseFloat(v) || 0})} />
                <Input label="Height (CM)" type="number" value={form.height} onChange={(v: string) => setForm({...form, height: parseFloat(v) || 0})} />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-sm font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Calculator size={18} />}
                Generate_Price_Quote
              </button>
            </form>
          </div>

          {/* REAL-TIME LOGIC BOX */}
          <div className="bg-slate-900 text-white p-4 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Box className="text-indigo-400" size={24} />
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase">Volumetric_Weight</p>
                <p className="text-lg font-mono font-black">{volumetricWeight.toFixed(2)} KG</p>
              </div>
            </div>
            <ArrowRight className="text-slate-700" />
            <div className="text-right">
              <p className="text-[9px] font-black text-indigo-400 uppercase">Chargeable_Weight</p>
              <p className="text-lg font-mono font-black text-emerald-400">{chargeableWeight.toFixed(2)} KG</p>
            </div>
          </div>
        </div>

        {/* RESULTS PANEL */}
        <div className="lg:col-span-5">
          <div className="h-full bg-white border border-slate-200 rounded-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-100">
              <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <IndianRupee size={14} className="text-emerald-600" /> Quotation_Breakdown
              </h3>
            </div>
            
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
              {!result && !loading && (
                <div className="opacity-20 flex flex-col items-center gap-4">
                  <Scale size={48} strokeWidth={1}/>
                  <p className="text-[10px] font-black uppercase tracking-widest">Awaiting_Input_Parameters</p>
                </div>
              )}

              {loading && (
                <div className="space-y-4">
                  <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-[10px] font-black text-indigo-600 uppercase animate-pulse">Consulting_Tariff_Nodes...</p>
                </div>
              )}

              {result && (
                <div className="w-full space-y-6 animate-in zoom-in-95">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Total_Freight_Charges</p>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
                      ₹{result.totalAmount || '450.00'}
                    </h2>
                  </div>

                  <div className="space-y-3 w-full border-t border-slate-100 pt-6">
                    <RateRow label="Base_Freight" value={`₹${result.basePrice || '380'}`} />
                    <RateRow label="Fuel_Surcharge" value={`₹${result.fuelSurcharge || '45'}`} />
                    <RateRow label="GST (18%)" value={`₹${result.gst || '25'}`} />
                    <RateRow label="Docket_Charge" value="₹0.00" />
                  </div>

                  <div className="bg-emerald-50 p-3 rounded-sm border border-emerald-100 flex items-center gap-2 mt-4">
                     <Zap size={14} className="text-emerald-600" />
                     <p className="text-[9px] font-black text-emerald-700 uppercase">Quote_Valid_For_24_Hours</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── UI ATOMS ───────────────── */

function Input({ label, type = "text", value, onChange }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-slate-200 px-3 py-2 text-xs font-mono font-black outline-none focus:border-indigo-500 transition-colors"
      />
    </div>
  );
}

function RateRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center text-[11px]">
      <span className="font-bold text-slate-400 uppercase tracking-tight">{label}</span>
      <span className="font-black text-slate-900 font-mono">{value}</span>
    </div>
  );
}