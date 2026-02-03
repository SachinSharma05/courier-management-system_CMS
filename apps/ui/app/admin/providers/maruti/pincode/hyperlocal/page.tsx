"use client";

import React, { useState } from 'react';
import { 
  Zap, Navigation, MapPin, LocateFixed, 
  CheckCircle, XCircle, Loader2, ArrowDown,
  Info, Compass
} from 'lucide-react';
import clsx from 'clsx';
import { useMaruti } from '@/hooks/useMaruti';

export default function HyperlocalServiceability() {
  const { checkHyperlocalServiceability } = useMaruti();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [form, setForm] = useState({
    orderType: "HYPERLOCAL",
    pickupAddress: { city: '', zip: '', latitude: '', longitude: '' },
    shippingAddress: { city: '', zip: '', latitude: '', longitude: '' }
  });

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await checkHyperlocalServiceability(form);
      setResult(res.data);
    } catch (err) {
      setResult({ status: 'OUT_OF_RANGE', message: 'MAX_RADIUS_EXCEEDED' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b-2 border-amber-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 p-2 rounded-sm text-white">
            <Compass size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Hyperlocal_Radius_Check</h1>
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-1 italic underline decoration-amber-200">Point_To_Point_Verification</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT: COORDINATE MATRIX */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
            <div className="p-6 space-y-8">
              
              {/* PICKUP NODE */}
              <div className="space-y-4">
                <SectionHeader icon={<Navigation size={14}/>} title="01_Pickup_Origin_Node" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Latitude" value={form.pickupAddress.latitude} onChange={(v) => setForm({...form, pickupAddress: {...form.pickupAddress, latitude: v}})} />
                  <Input label="Longitude" value={form.pickupAddress.longitude} onChange={(v) => setForm({...form, pickupAddress: {...form.pickupAddress, longitude: v}})} />
                  <Input label="City" value={form.pickupAddress.city} onChange={(v) => setForm({...form, pickupAddress: {...form.pickupAddress, city: v}})} />
                  <Input label="Zip_Code" value={form.pickupAddress.zip} onChange={(v) => setForm({...form, pickupAddress: {...form.pickupAddress, zip: v}})} />
                </div>
              </div>

              <div className="flex justify-center">
                <div className="h-8 w-px bg-slate-100 relative">
                  <ArrowDown size={14} className="absolute -bottom-2 -left-[6px] text-slate-300" />
                </div>
              </div>

              {/* SHIPPING NODE */}
              <div className="space-y-4">
                <SectionHeader icon={<MapPin size={14}/>} title="02_Delivery_Destination_Node" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Latitude" value={form.shippingAddress.latitude} onChange={(v) => setForm({...form, shippingAddress: {...form.shippingAddress, latitude: v}})} />
                  <Input label="Longitude" value={form.shippingAddress.longitude} onChange={(v) => setForm({...form, shippingAddress: {...form.shippingAddress, longitude: v}})} />
                  <Input label="City" value={form.shippingAddress.city} onChange={(v) => setForm({...form, shippingAddress: {...form.shippingAddress, city: v}})} />
                  <Input label="Zip_Code" value={form.shippingAddress.zip} onChange={(v) => setForm({...form, shippingAddress: {...form.shippingAddress, zip: v}})} />
                </div>
              </div>

              <button 
                onClick={handleCheck}
                className="w-full bg-slate-900 text-white py-4 rounded-sm font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors"
              >
                {loading ? <Loader2 className="animate-spin" size={16}/> : <Zap size={16} fill="currentColor"/>}
                Calculate_Proximity_Service
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS: RADIUS ANALYSIS */}
        <div className="lg:col-span-5">
           <div className={clsx(
             "h-full min-h-[400px] border-2 border-dashed rounded-sm p-8 flex flex-col items-center justify-center text-center transition-all",
             result?.status === 'SUCCESS' ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"
           )}>
             {!result && !loading && (
               <div className="space-y-4 opacity-30">
                 <LocateFixed size={48} className="mx-auto" />
                 <p className="text-[10px] font-black uppercase tracking-widest">Awaiting_Geospatial_Data</p>
               </div>
             )}

             {result && result.status === 'SUCCESS' && (
               <div className="space-y-6 animate-in zoom-in-95">
                  <div className="bg-white p-6 rounded-sm shadow-xl border-t-4 border-emerald-500">
                    <CheckCircle size={40} className="text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-sm font-black uppercase tracking-tighter">Mission_Serviceable</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Route_Within_Operational_Threshold</p>
                    
                    <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                       <MetricRow label="Radial_Distance" value="4.2 KM" />
                       <MetricRow label="Est_Rider_Pickup" value="12 MINS" />
                       <MetricRow label="Zone_Status" value="High_Density" />
                    </div>
                  </div>
               </div>
             )}

             {result && result.status === 'OUT_OF_RANGE' && (
               <div className="text-rose-500 space-y-4 animate-in shake">
                 <XCircle size={48} className="mx-auto" />
                 <h3 className="text-sm font-black uppercase tracking-tighter">Out_Of_Operational_Bounds</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
                   The distance between nodes exceeds the hyperlocal limit (15km). <br/>
                   Switch to E-comm Surface mode?
                 </p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── UI COMPONENTS ───────────────── */

function SectionHeader({ icon, title }: any) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
      <span className="text-amber-500">{icon}</span>
      <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{title}</h4>
    </div>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{label}</label>
      <input 
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-50 border border-slate-200 px-3 py-2 text-[11px] font-mono font-bold outline-none focus:border-amber-500 transition-colors"
      />
    </div>
  );
}

function MetricRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center text-[11px]">
      <span className="font-bold text-slate-400 uppercase tracking-tight">{label}</span>
      <span className="font-black text-slate-900 font-mono">{value}</span>
    </div>
  );
}