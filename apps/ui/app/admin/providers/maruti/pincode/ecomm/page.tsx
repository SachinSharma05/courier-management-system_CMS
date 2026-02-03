"use client";

import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Truck, 
  Plane, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ArrowRightLeft,
  Loader2,
  Info
} from 'lucide-react';
import clsx from 'clsx';
import { useMaruti } from '@/hooks/useMaruti';

export default function MarutiServiceability() {
  const { checkServiceability } = useMaruti();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({
    fromPincode: "",
    toPincode: "",
    isCodOrder: false,
    deliveryMode: "AIR" as "AIR" | "Surface"
  });

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await checkServiceability(form);
      setResult(res.data);
    } catch (err) {
      setResult({ status: 'FAILED', message: 'ROUTE_NOT_SERVICEABLE' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Serviceability_Matrix</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Maruti_Air // Route_Availability_Engine</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-black uppercase text-slate-600">Network_Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT FORM */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
            <form onSubmit={handleCheck} className="space-y-5">
              <div className="space-y-4">
                <Input 
                  label="Origin_Pincode" 
                  placeholder="380051"
                  value={form.fromPincode}
                  onChange={(v) => setForm({...form, fromPincode: v})}
                />
                <div className="flex justify-center -my-2 opacity-30">
                  <ArrowRightLeft size={16} className="rotate-90" />
                </div>
                <Input 
                  label="Destination_Pincode" 
                  placeholder="440010"
                  value={form.toPincode}
                  onChange={(v) => setForm({...form, toPincode: v})}
                />
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-[9px] font-black text-slate-400 uppercase">Preferences</p>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setForm({...form, deliveryMode: 'AIR'})}
                    className={clsx(
                      "flex-1 py-2 text-[10px] font-black uppercase border flex items-center justify-center gap-2 transition-all",
                      form.deliveryMode === 'AIR' ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-200 text-slate-400"
                    )}
                  >
                    <Plane size={14}/> Air
                  </button>
                  <button 
                    type="button"
                    onClick={() => setForm({...form, deliveryMode: 'Surface'})}
                    className={clsx(
                      "flex-1 py-2 text-[10px] font-black uppercase border flex items-center justify-center gap-2 transition-all",
                      form.deliveryMode === 'Surface' ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-200 text-slate-400"
                    )}
                  >
                    <Truck size={14}/> Surface
                  </button>
                </div>

                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={form.isCodOrder}
                    onChange={(e) => setForm({...form, isCodOrder: e.target.checked})}
                    className="h-4 w-4 accent-indigo-600"
                  />
                  <span className="text-[10px] font-black text-slate-600 uppercase">Check_COD_Support</span>
                </label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-3 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Verify_Route"}
              </button>
            </form>
          </div>
        </div>

        {/* RESULTS PANEL */}
        <div className="lg:col-span-8">
          <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-sm p-8 flex flex-col items-center justify-center text-center">
            {!result && !loading && (
              <div className="opacity-20 flex flex-col items-center gap-4">
                <Search size={64} strokeWidth={1}/>
                <p className="text-xs font-black uppercase tracking-[0.2em]">Ready_To_Query_Network</p>
              </div>
            )}

            {result && result.status === 'SUCCESS' && (
              <div className="w-full max-w-md space-y-6 animate-in zoom-in-95 duration-300">
                <div className="bg-white border border-emerald-500/30 p-8 rounded-sm shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2">
                    <CheckCircle2 size={40} className="text-emerald-500 opacity-20" />
                  </div>
                  
                  <h3 className="text-emerald-600 text-xs font-black uppercase tracking-[0.3em] mb-6">Serviceable_Node_Confirmed</h3>
                  
                  <div className="space-y-4">
                    <ResultRow label="Route" value={`${form.fromPincode} → ${form.toPincode}`} />
                    <ResultRow label="Est_Transit_Time" value={result.etd || "2-3 Days"} />
                    <ResultRow 
                      label="COD_Available" 
                      value={form.isCodOrder ? "SUPPORTED" : "N/A"} 
                      status={form.isCodOrder}
                    />
                    <ResultRow label="Transport" value={form.deliveryMode} />
                  </div>

                  <button className="mt-8 w-full border-2 border-slate-900 text-slate-900 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                    Proceed_To_Booking
                  </button>
                </div>
              </div>
            )}

            {result && result.status === 'FAILED' && (
              <div className="flex flex-col items-center gap-4 text-rose-500 animate-in shake">
                <XCircle size={48} />
                <h3 className="text-xs font-black uppercase tracking-[0.2em]">UNSERVICEABLE_REGION</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">MARUTI_NETWORK_NOT_YET_EXPANDED_TO_THIS_ZONE</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── UI ATOMS ───────────────── */

function Input({ label, placeholder, value, onChange }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{label}</label>
      <div className="relative">
        <MapPin size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="number"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 pl-8 pr-4 py-2 text-xs font-mono font-black outline-none focus:border-indigo-500"
        />
      </div>
    </div>
  );
}

function ResultRow({ label, value, status }: any) {
  return (
    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
      <span className="text-[10px] font-bold text-slate-400 uppercase">{label}</span>
      <span className={clsx(
        "text-[11px] font-black font-mono uppercase",
        status === true && "text-emerald-600",
        status === false && "text-rose-600"
      )}>{value}</span>
    </div>
  );
}