"use client";

import React, { Activity, useState } from 'react';
import { 
  Zap, Navigation, MapPin, LocateFixed, 
  CheckCircle, XCircle, Loader2, ArrowDown,
  Info, Compass,
  ShieldCheck,
  Globe
} from 'lucide-react';
import clsx from 'clsx';
import { useMaruti } from '@/hooks/useMaruti';

// export default function HyperlocalServiceability() {
//   const { checkHyperlocalServiceability } = useMaruti();
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);

//   const [form, setForm] = useState({
//     orderType: "HYPERLOCAL",
//     pickupAddress: { 
//       name: '', 
//       phone: '', 
//       address1: '', 
//       city: '', 
//       state: '', 
//       country: '', 
//       zip: '', 
//       latitude: 0, 
//       longitude: 0 
//     },
//     shippingAddress: { 
//       name: '', 
//       phone: '', 
//       address1: '', 
//       city: '', 
//       state: '', 
//       country: '', 
//       zip: '', 
//       latitude: 0, 
//       longitude: 0 
//     }
//   });

//   const handleCheck = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await checkHyperlocalServiceability(form);
//       setResult(res.data);
//     } catch (err) {
//       setResult({ status: 'OUT_OF_RANGE', message: 'MAX_RADIUS_EXCEEDED' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto space-y-6">
//       {/* HEADER */}
//       <div className="flex items-center justify-between border-b-2 border-amber-500/20 pb-4">
//         <div className="flex items-center gap-3">
//           <div className="bg-amber-500 p-2 rounded-sm text-white">
//             <Compass size={20} />
//           </div>
//           <div>
//             <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Hyperlocal_Radius_Check</h1>
//             <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-1 italic underline decoration-amber-200">Point_To_Point_Verification</p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//         {/* INPUT: COORDINATE MATRIX */}
//         <div className="lg:col-span-7 space-y-6">
//           <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
//             <div className="p-6 space-y-8">
              
//               {/* PICKUP NODE */}
//               <div className="space-y-4">
//                 <SectionHeader icon={<Navigation size={14}/>} title="01_Pickup_Origin_Node" />
//                 <div className="grid grid-cols-2 gap-4">
//                   <Input label="Name" value={form.pickupAddress.name} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, name: v}})} />
//                   <Input label="Phone" value={form.pickupAddress.phone} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, phone: v}})} />
//                   <Input label="Address1" value={form.pickupAddress.address1} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, address1: v}})} />
//                   <Input label="City" value={form.pickupAddress.city} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, city: v}})} />
//                   <Input label="State" value={form.pickupAddress.state} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, state: v}})} />
//                   <Input label="Country" value={form.pickupAddress.country} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, country: v}})} />
//                   <Input label="Zip_Code" value={form.pickupAddress.zip} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, zip: v}})} />
//                   <Input label="Latitude" value={form.pickupAddress.latitude} onChange={(v: number) => setForm({...form, pickupAddress: {...form.pickupAddress, latitude: v}})} />
//                   <Input label="Longitude" value={form.pickupAddress.longitude} onChange={(v: number) => setForm({...form, pickupAddress: {...form.pickupAddress, longitude: v}})} />
//                 </div>
//               </div>

//               <div className="flex justify-center">
//                 <div className="h-8 w-px bg-slate-100 relative">
//                   <ArrowDown size={14} className="absolute -bottom-2 -left-[6px] text-slate-300" />
//                 </div>
//               </div>

//               {/* SHIPPING NODE */}
//               <div className="space-y-4">
//                 <SectionHeader icon={<MapPin size={14}/>} title="02_Delivery_Destination_Node" />
//                 <div className="grid grid-cols-2 gap-4">
//                   <Input label="Name" value={form.shippingAddress.name} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, name: v}})} />
//                   <Input label="Phone" value={form.shippingAddress.phone} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, phone: v}})} />
//                   <Input label="Address1" value={form.shippingAddress.address1} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, address1: v}})} />
//                   <Input label="City" value={form.shippingAddress.city} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, city: v}})} />
//                   <Input label="State" value={form.shippingAddress.state} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, state: v}})} />
//                   <Input label="Country" value={form.shippingAddress.country} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, country: v}})} />
//                   <Input label="Zip_Code" value={form.shippingAddress.zip} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, zip: v}})} />
//                   <Input label="Latitude" value={form.shippingAddress.latitude} onChange={(v: number) => setForm({...form, shippingAddress: {...form.shippingAddress, latitude: v}})} />
//                   <Input label="Longitude" value={form.shippingAddress.longitude} onChange={(v: number) => setForm({...form, shippingAddress: {...form.shippingAddress, longitude: v}})} />
//                 </div>
//               </div>

//               <button 
//                 onClick={handleCheck}
//                 className="w-full bg-slate-900 text-white py-4 rounded-sm font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors"
//               >
//                 {loading ? <Loader2 className="animate-spin" size={16}/> : <Zap size={16} fill="currentColor"/>}
//                 Calculate_Proximity_Service
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* RESULTS: RADIUS ANALYSIS */}
//         <div className="lg:col-span-5">
//            <div className={clsx(
//              "h-full min-h-[400px] border-2 border-dashed rounded-sm p-8 flex flex-col items-center justify-center text-center transition-all",
//              result?.status === 'SUCCESS' ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"
//            )}>
//              {!result && !loading && (
//                <div className="space-y-4 opacity-30">
//                  <LocateFixed size={48} className="mx-auto" />
//                  <p className="text-[10px] font-black uppercase tracking-widest">Awaiting_Geospatial_Data</p>
//                </div>
//              )}

//              {result && result.status === 'SUCCESS' && (
//                <div className="space-y-6 animate-in zoom-in-95">
//                   <div className="bg-white p-6 rounded-sm shadow-xl border-t-4 border-emerald-500">
//                     <CheckCircle size={40} className="text-emerald-500 mx-auto mb-4" />
//                     <h3 className="text-sm font-black uppercase tracking-tighter">Mission_Serviceable</h3>
//                     <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Route_Within_Operational_Threshold</p>
                    
//                     <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
//                        <MetricRow label="Radial_Distance" value="4.2 KM" />
//                        <MetricRow label="Est_Rider_Pickup" value="12 MINS" />
//                        <MetricRow label="Zone_Status" value="High_Density" />
//                     </div>
//                   </div>
//                </div>
//              )}

//              {result && result.status === 'OUT_OF_RANGE' && (
//                <div className="text-rose-500 space-y-4 animate-in shake">
//                  <XCircle size={48} className="mx-auto" />
//                  <h3 className="text-sm font-black uppercase tracking-tighter">Out_Of_Operational_Bounds</h3>
//                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
//                    The distance between nodes exceeds the hyperlocal limit (15km). <br/>
//                    Switch to E-comm Surface mode?
//                  </p>
//                </div>
//              )}
//            </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ───────────────── UI COMPONENTS ───────────────── */

// function SectionHeader({ icon, title }: any) {
//   return (
//     <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
//       <span className="text-amber-500">{icon}</span>
//       <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{title}</h4>
//     </div>
//   );
// }

// function Input({ label, value, onChange }: any) {
//   return (
//     <div className="flex flex-col gap-1">
//       <label className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{label}</label>
//       <input 
//         type="text"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="bg-slate-50 border border-slate-200 px-3 py-2 text-[11px] font-mono font-bold outline-none focus:border-amber-500 transition-colors"
//       />
//     </div>
//   );
// }

// function MetricRow({ label, value }: any) {
//   return (
//     <div className="flex justify-between items-center text-[11px]">
//       <span className="font-bold text-slate-400 uppercase tracking-tight">{label}</span>
//       <span className="font-black text-slate-900 font-mono">{value}</span>
//     </div>
//   );
// }
export default function HyperlocalServiceability() {
  const { checkHyperlocalServiceability } = useMaruti();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [form, setForm] = useState({
    orderType: "HYPERLOCAL",
    pickupAddress: { 
      name: '', phone: '', address1: '', city: '', state: '', country: '', zip: '', latitude: 0, longitude: 0 
    },
    shippingAddress: { 
      name: '', phone: '', address1: '', city: '', state: '', country: '', zip: '', latitude: 0, longitude: 0 
    }
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
    <div className="min-h-screen bg-slate-50/50 w-full pb-20">
      <div className="max-w-[1400px] mx-auto space-y-8 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* ───────────────── HEADER: GEOSPATIAL RADAR ───────────────── */}
        <div className="flex items-end justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-5">
            <div className="bg-amber-500 p-3 rounded-2xl shadow-lg shadow-amber-200 text-white rotate-3">
              <Compass size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Radius_Terminal</h1>
              <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                <span className="h-1 w-1 bg-amber-500 rounded-full animate-ping"/> Point_To_Point_Verification_Engine
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase">Operational_Limit</p>
              <p className="text-xs font-mono font-black text-slate-900">15.00 KM RADIUS</p>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <Globe size={20} className="text-slate-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ───────────────── COORDINATE INPUTS (COL-7) ───────────────── */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                <Navigation size={200} />
              </div>

              <div className="relative z-10 space-y-10">
                {/* PICKUP NODE */}
                <div className="space-y-6">
                  <SectionHeader icon={<Navigation size={18}/>} title="01_Pickup_Origin_Node" color="text-amber-500" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <Input label="Identity" placeholder="Sender Name" value={form.pickupAddress.name} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, name: v}})} />
                    <Input label="Comm_Link" placeholder="Phone Number" value={form.pickupAddress.phone} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, phone: v}})} />
                    <Input label="Geo_Code_Zip" placeholder="Zip Code" value={form.pickupAddress.zip} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, zip: v}})} />
                    <div className="md:col-span-2 lg:col-span-3">
                      <Input label="Physical_Address" placeholder="Full Address Details" value={form.pickupAddress.address1} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, address1: v}})} />
                    </div>
                    <Input label="Lat_Node" placeholder="0.0000" value={form.pickupAddress.latitude} onChange={(v: number) => setForm({...form, pickupAddress: {...form.pickupAddress, latitude: v}})} />
                    <Input label="Long_Node" placeholder="0.0000" value={form.pickupAddress.longitude} onChange={(v: number) => setForm({...form, pickupAddress: {...form.pickupAddress, longitude: v}})} />
                  </div>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-slate-50" />
                  <div className="bg-slate-50 p-2 rounded-full border border-slate-100">
                    <ArrowDown size={16} className="text-slate-300" />
                  </div>
                  <div className="flex-1 h-px bg-slate-50" />
                </div>

                {/* SHIPPING NODE */}
                <div className="space-y-6">
                  <SectionHeader icon={<MapPin size={18}/>} title="02_Delivery_Destination_Node" color="text-indigo-500" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <Input label="Identity" placeholder="Receiver Name" value={form.shippingAddress.name} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, name: v}})} />
                    <Input label="Comm_Link" placeholder="Phone Number" value={form.shippingAddress.phone} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, phone: v}})} />
                    <Input label="Geo_Code_Zip" placeholder="Zip Code" value={form.shippingAddress.zip} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, zip: v}})} />
                    <div className="md:col-span-2 lg:col-span-3">
                      <Input label="Physical_Address" placeholder="Full Address Details" value={form.shippingAddress.address1} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, address1: v}})} />
                    </div>
                    <Input label="Lat_Node" placeholder="0.0000" value={form.shippingAddress.latitude} onChange={(v: number) => setForm({...form, shippingAddress: {...form.shippingAddress, latitude: v}})} />
                    <Input label="Long_Node" placeholder="0.0000" value={form.shippingAddress.longitude} onChange={(v: number) => setForm({...form, shippingAddress: {...form.shippingAddress, longitude: v}})} />
                  </div>
                </div>

                <button 
                  onClick={handleCheck}
                  disabled={loading}
                  className="w-full bg-[#0F172A] hover:bg-black text-white h-16 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-xl transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Activity className="animate-spin text-amber-500" size={20}/> : <Zap size={20} className="text-amber-500" fill="currentColor"/>}
                  {loading ? 'Analyzing_Radius...' : 'Calculate_Proximity_Service'}
                </button>
              </div>
            </div>
          </div>

          {/* ───────────────── RADIUS ANALYSIS (COL-5) ───────────────── */}
          <div className="lg:col-span-5">
             <div className={clsx(
               "h-full min-h-[500px] border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center transition-all duration-500 backdrop-blur-sm",
               result?.status === 'SUCCESS' ? "bg-emerald-50/50 border-emerald-200" : "bg-white/40 border-slate-200"
             )}>
               
               {!result && !loading && (
                 <div className="space-y-6 opacity-30 animate-pulse">
                   <div className="bg-slate-100 p-8 rounded-[2rem] inline-block">
                     <LocateFixed size={64} className="text-slate-400" />
                   </div>
                   <div>
                     <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">Awaiting_Geospatial_Data</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 italic">Ready_To_Intercept_Nodes</p>
                   </div>
                 </div>
               )}

               {result && result.status === 'SUCCESS' && (
                 <div className="w-full space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-emerald-100 relative overflow-hidden text-left">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                        <CheckCircle size={140} className="text-emerald-500" />
                      </div>

                      <div className="flex items-center gap-4 mb-10">
                        <div className="bg-emerald-500 text-white p-3 rounded-2xl shadow-lg shadow-emerald-100">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">Mission_Serviceable</h3>
                          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-2">Within_Operational_Threshold</p>
                        </div>
                      </div>
                      
                      <div className="space-y-6 border-t border-slate-50 pt-8">
                         <MetricRow label="Radial_Distance" value="4.28 KM" />
                         <MetricRow label="Est_Rider_Pickup" value="12 MINS" />
                         <MetricRow label="Zone_Density" value="HIGH_AVAILABILITY" />
                         <MetricRow label="Transit_Node" value="MARUTI_PRIMARY_HUB" />
                      </div>

                      <button className="mt-12 w-full bg-[#0F172A] hover:bg-black text-white h-14 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-lg">
                        Initiate_Hyperlocal_Booking
                      </button>
                    </div>
                 </div>
               )}

               {result && result.status === 'OUT_OF_RANGE' && (
                 <div className="text-rose-500 space-y-6 animate-in shake duration-500 max-w-sm">
                   <div className="bg-rose-50 p-8 rounded-[2rem] border border-rose-100 inline-block shadow-sm">
                     <XCircle size={64} strokeWidth={1.5} />
                   </div>
                   <div className="space-y-3">
                     <h3 className="text-lg font-black uppercase tracking-tight italic">Radius_Exceeded</h3>
                     <p className="text-[11px] font-bold text-slate-500 uppercase leading-relaxed tracking-tight">
                       The distance between nodes exceeds the 15km hyperlocal threshold. <br/>
                       <span className="text-rose-400 mt-2 block">Recommendation: Switch to Maruti E-comm Surface Mode.</span>
                     </p>
                   </div>
                   <button onClick={() => setResult(null)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors underline underline-offset-4">
                     Recalibrate_Coordinates
                   </button>
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

function SectionHeader({ icon, title, color }: any) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
      <span className={clsx("transition-transform group-hover:rotate-12", color)}>{icon}</span>
      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">{title}</h4>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-tight ml-1">{label}</label>
      <input 
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-mono font-black outline-none focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/5 transition-all shadow-inner placeholder:text-slate-300"
      />
    </div>
  );
}

function MetricRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center group">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] group-hover:text-slate-600 transition-colors">{label}</span>
      <span className="text-sm font-black text-slate-900 font-mono italic tracking-tighter">{value}</span>
    </div>
  );
}