"use client";

import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Truck, 
  Plane, 
  CheckCircle2, 
  XCircle, 
  ArrowRightLeft,
  Loader2,
  Zap,
  Radar,
  Activity,
  ShieldCheck
} from 'lucide-react';
import clsx from 'clsx';
import { useMaruti } from '@/hooks/useMaruti';

// export default function MarutiServiceability() {
//   const { checkEcommServiceability } = useMaruti();
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);
//   const [form, setForm] = useState({
//     fromPincode: 0,
//     toPincode: 0,
//     isCodOrder: false,
//     deliveryMode: "AIR" as "AIR" | "Surface"
//   });

//   const handleCheck = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setResult(null);
//     try {
//       const res = await checkEcommServiceability(form);
//       setResult(res.data);
//     } catch (err) {
//       setResult({ status: 'FAILED', message: 'ROUTE_NOT_SERVICEABLE' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto space-y-6">
//       {/* HEADER */}
//       <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
//         <div>
//           <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Serviceability_Matrix</h1>
//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Maruti_Air // Route_Availability_Engine</p>
//         </div>
//         <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
//           <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
//           <span className="text-[9px] font-black uppercase text-slate-600">Network_Live</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//         {/* INPUT FORM */}
//         <div className="lg:col-span-4 space-y-4">
//           <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
//             <form onSubmit={handleCheck} className="space-y-5">
//               <div className="space-y-4">
//                 <Input 
//                   label="Origin_Pincode" 
//                   placeholder="380051"
//                   value={form.fromPincode}
//                   onChange={(v: number) => setForm({...form, fromPincode: v})}
//                 />
//                 <div className="flex justify-center -my-2 opacity-30">
//                   <ArrowRightLeft size={16} className="rotate-90" />
//                 </div>
//                 <Input 
//                   label="Destination_Pincode" 
//                   placeholder="440010"
//                   value={form.toPincode}
//                   onChange={(v: number) => setForm({...form, toPincode: v})}
//                 />
//               </div>

//               <div className="space-y-3 pt-2">
//                 <p className="text-[9px] font-black text-slate-400 uppercase">Preferences</p>
//                 <div className="flex gap-2">
//                   <button 
//                     type="button"
//                     onClick={() => setForm({...form, deliveryMode: 'AIR'})}
//                     className={clsx(
//                       "flex-1 py-2 text-[10px] font-black uppercase border flex items-center justify-center gap-2 transition-all",
//                       form.deliveryMode === 'AIR' ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-200 text-slate-400"
//                     )}
//                   >
//                     <Plane size={14}/> Air
//                   </button>
//                   <button 
//                     type="button"
//                     onClick={() => setForm({...form, deliveryMode: 'Surface'})}
//                     className={clsx(
//                       "flex-1 py-2 text-[10px] font-black uppercase border flex items-center justify-center gap-2 transition-all",
//                       form.deliveryMode === 'Surface' ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-200 text-slate-400"
//                     )}
//                   >
//                     <Truck size={14}/> Surface
//                   </button>
//                 </div>

//                 <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 cursor-pointer">
//                   <input 
//                     type="checkbox" 
//                     checked={form.isCodOrder}
//                     onChange={(e) => setForm({...form, isCodOrder: e.target.checked})}
//                     className="h-4 w-4 accent-indigo-600"
//                   />
//                   <span className="text-[10px] font-black text-slate-600 uppercase">Check_COD_Support</span>
//                 </label>
//               </div>

//               <button 
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-slate-900 text-white py-3 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-50"
//               >
//                 {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Verify_Route"}
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* RESULTS PANEL */}
//         <div className="lg:col-span-8">
//           <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-sm p-8 flex flex-col items-center justify-center text-center">
//             {!result && !loading && (
//               <div className="opacity-20 flex flex-col items-center gap-4">
//                 <Search size={64} strokeWidth={1}/>
//                 <p className="text-xs font-black uppercase tracking-[0.2em]">Ready_To_Query_Network</p>
//               </div>
//             )}

//             {result && result.status === 'SUCCESS' && (
//               <div className="w-full max-w-md space-y-6 animate-in zoom-in-95 duration-300">
//                 <div className="bg-white border border-emerald-500/30 p-8 rounded-sm shadow-xl relative overflow-hidden">
//                   <div className="absolute top-0 right-0 p-2">
//                     <CheckCircle2 size={40} className="text-emerald-500 opacity-20" />
//                   </div>
                  
//                   <h3 className="text-emerald-600 text-xs font-black uppercase tracking-[0.3em] mb-6">Serviceable_Node_Confirmed</h3>
                  
//                   <div className="space-y-4">
//                     <ResultRow label="Route" value={`${form.fromPincode} → ${form.toPincode}`} />
//                     <ResultRow label="Est_Transit_Time" value={result.etd || "2-3 Days"} />
//                     <ResultRow 
//                       label="COD_Available" 
//                       value={form.isCodOrder ? "SUPPORTED" : "N/A"} 
//                       status={form.isCodOrder}
//                     />
//                     <ResultRow label="Transport" value={form.deliveryMode} />
//                   </div>

//                   <button className="mt-8 w-full border-2 border-slate-900 text-slate-900 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
//                     Proceed_To_Booking
//                   </button>
//                 </div>
//               </div>
//             )}

//             {result && result.status === 'FAILED' && (
//               <div className="flex flex-col items-center gap-4 text-rose-500 animate-in shake">
//                 <XCircle size={48} />
//                 <h3 className="text-xs font-black uppercase tracking-[0.2em]">UNSERVICEABLE_REGION</h3>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase">MARUTI_NETWORK_NOT_YET_EXPANDED_TO_THIS_ZONE</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ───────────────── UI ATOMS ───────────────── */

// function Input({ label, placeholder, value, onChange }: any) {
//   return (
//     <div className="space-y-1">
//       <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{label}</label>
//       <div className="relative">
//         <MapPin size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//         <input 
//           type="number"
//           placeholder={placeholder}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           className="w-full bg-slate-50 border border-slate-200 pl-8 pr-4 py-2 text-xs font-mono font-black outline-none focus:border-indigo-500"
//         />
//       </div>
//     </div>
//   );
// }

// function ResultRow({ label, value, status }: any) {
//   return (
//     <div className="flex justify-between items-center border-b border-slate-50 pb-2">
//       <span className="text-[10px] font-bold text-slate-400 uppercase">{label}</span>
//       <span className={clsx(
//         "text-[11px] font-black font-mono uppercase",
//         status === true && "text-emerald-600",
//         status === false && "text-rose-600"
//       )}>{value}</span>
//     </div>
//   );
// }
export default function MarutiServiceability() {
  const { checkEcommServiceability } = useMaruti();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({
    fromPincode: 0,
    toPincode: 0,
    isCodOrder: false,
    deliveryMode: "AIR" as "AIR" | "Surface"
  });

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await checkEcommServiceability(form);
      setResult(res.data);
    } catch (err) {
      setResult({ status: 'FAILED', message: 'ROUTE_NOT_SERVICEABLE' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 w-full pb-20">
      <div className="max-w-[1400px] mx-auto space-y-8 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* ───────────────── HEADER: NETWORK STATUS ───────────────── */}
        <div className="flex items-end justify-between border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.25em] flex items-center gap-2">
              <div className="h-1 w-4 bg-indigo-600 rounded-full" /> Network Analysis
            </h2>
            <h1 className="text-2xl font-bold text-slate-900 mt-2 uppercase tracking-tighter italic">Serviceability Matrix</h1>
            <p className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-tight opacity-70">
              Maruti_Air // Route_Availability_Engine
            </p>
          </div>
          
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Network_Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ───────────────── INPUT FORM (COL-4) ───────────────── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
              <form onSubmit={handleCheck} className="space-y-8">
                <div className="space-y-6">
                  <Input 
                    label="Origin_Pincode" 
                    placeholder="380051"
                    value={form.fromPincode}
                    onChange={(v: number) => setForm({...form, fromPincode: v})}
                  />
                  <div className="flex justify-center -my-2 opacity-20">
                    <div className="bg-slate-100 p-2 rounded-full">
                      <ArrowRightLeft size={16} className="rotate-90 text-slate-900" />
                    </div>
                  </div>
                  <Input 
                    label="Destination_Pincode" 
                    placeholder="440010"
                    value={form.toPincode}
                    onChange={(v: number) => setForm({...form, toPincode: v})}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transport_Preferences</p>
                  <div className="flex gap-3">
                    <ModeButton 
                      active={form.deliveryMode === 'AIR'} 
                      onClick={() => setForm({...form, deliveryMode: 'AIR'})}
                      icon={<Plane size={16}/>}
                      label="Air"
                    />
                    <ModeButton 
                      active={form.deliveryMode === 'Surface'} 
                      onClick={() => setForm({...form, deliveryMode: 'Surface'})}
                      icon={<Truck size={16}/>}
                      label="Surface"
                    />
                  </div>

                  <label className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-white hover:border-indigo-200 transition-all group">
                    <input 
                      type="checkbox" 
                      checked={form.isCodOrder}
                      onChange={(e) => setForm({...form, isCodOrder: e.target.checked})}
                      className="h-5 w-5 rounded-lg accent-indigo-600"
                    />
                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">Verify_COD_Support</span>
                  </label>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0F172A] hover:bg-black text-white h-16 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? <Activity size={18} className="animate-spin text-indigo-400" /> : <ShieldCheck size={18} className="text-indigo-400"/>}
                  {loading ? "Verifying_Matrix..." : "Verify_Route_Availability"}
                </button>
              </form>
            </div>
          </div>

          {/* ───────────────── RESULTS PANEL (COL-8) ───────────────── */}
          <div className="lg:col-span-8">
            <div className="h-full min-h-[500px] bg-white/40 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-sm">
              
              {!result && !loading && (
                <div className="opacity-30 flex flex-col items-center gap-6 animate-pulse">
                  <div className="p-6 bg-slate-100 rounded-[2rem]">
                    <Search size={64} strokeWidth={1} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">Waiting_For_Parameters</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 italic">Network_Ready_To_Query</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center gap-6">
                   <div className="relative">
                      <div className="h-20 w-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                      <Radar size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" />
                   </div>
                   <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Analyzing_Logistics_Nodes...</p>
                </div>
              )}

              {result && result.status === 'SUCCESS' && (
                <div className="w-full max-w-lg space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="bg-white border border-emerald-100 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden text-left">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                      <CheckCircle2 size={120} className="text-emerald-500" />
                    </div>
                    
                    <div className="flex items-center gap-3 mb-8">
                       <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                          <Zap size={18} fill="currentColor" />
                       </div>
                       <h3 className="text-emerald-600 text-[11px] font-black uppercase tracking-[0.3em]">Serviceable_Node_Confirmed</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <ResultRow label="Network_Path" value={`${form.fromPincode} ➔ ${form.toPincode}`} />
                      <ResultRow label="Estimated_Transit" value={result.etd || "2-3 Operational Days"} />
                      <ResultRow 
                        label="COD_Payment_Node" 
                        value={form.isCodOrder ? "ACTIVE_SUPPORTED" : "NOT_REQUESTED"} 
                        status={form.isCodOrder}
                      />
                      <ResultRow label="Transit_Protocol" value={form.deliveryMode} />
                    </div>

                    <button className="mt-12 w-full bg-[#0F172A] hover:bg-black text-white h-14 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95">
                      Proceed_To_Booking_Flow
                    </button>
                  </div>
                </div>
              )}

              {result && result.status === 'FAILED' && (
                <div className="flex flex-col items-center gap-6 text-rose-500 animate-in shake duration-500">
                  <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100">
                    <XCircle size={64} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em]">Unserviceable_Region</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase italic tracking-tighter">MARUTI_NETWORK_NOT_YET_EXPANDED_TO_THIS_ZONE</p>
                  </div>
                  <button onClick={() => setResult(null)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 underline underline-offset-4">
                    Modify_Parameters
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

/* ───────────────── UI COMPONENTS ───────────────── */

function Input({ label, placeholder, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">{label}</label>
      <div className="relative group">
        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
        <input 
          type="number"
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl h-14 pl-12 pr-6 text-sm font-mono font-black outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner"
        />
      </div>
    </div>
  );
}

function ModeButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={clsx(
        "flex-1 h-14 rounded-2xl text-[11px] font-black uppercase flex items-center justify-center gap-3 transition-all border shadow-sm",
        active 
          ? "bg-indigo-600 border-indigo-600 text-white shadow-indigo-100" 
          : "bg-white border-slate-100 text-slate-400 hover:border-indigo-200"
      )}
    >
      {icon} {label}
    </button>
  );
}

function ResultRow({ label, value, status }: any) {
  return (
    <div className="flex justify-between items-end border-b border-slate-50 pb-4 group">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">{label}</span>
      <span className={clsx(
        "text-[12px] font-black font-mono uppercase tracking-tighter",
        status === true && "text-emerald-600",
        status === false && "text-rose-600",
        status === undefined && "text-slate-900"
      )}>{value}</span>
    </div>
  );
}