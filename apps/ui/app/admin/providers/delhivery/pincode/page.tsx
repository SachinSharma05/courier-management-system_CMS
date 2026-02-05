"use client";

import { useState } from "react";
import { 
  Search, 
  MapPin, 
  Clock, 
  Building2, 
  XCircle, 
  Loader2, 
  Navigation,
  CheckCircle2,
  Calendar,
  Globe,
  Terminal,
  Activity,
  Database,
  Hash,
  MapIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { api } from "@/lib/api/axios";

// const DEFAULT_PICKUP_PIN = "452010";

// export default function DelhiveryServiceability() {
//   const [pin, setPin] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<any>(null);

//   const [tatOrigin, setTatOrigin] = useState("");
//   const [tatDest, setTatDest] = useState("");
//   const [tatResult, setTatResult] = useState<number | null>(null);
//   const [tatLoading, setTatLoading] = useState(false);

//   // ───────────────── CORE LOGIC (PRESERVED) ─────────────────
//   async function check() {
//     if (!pin) return;
//     setLoading(true);
//     setData(null);
//     try {
//       const r = await api.get(`/providers/delhivery/pincode?pin=${pin}`).then(r => r.data);
//       setData(r);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function checkTat() {
//     if (!tatOrigin || !tatDest) return;
//     setTatLoading(true);
//     try {
//       const r = await api.get('/providers/delhivery/tat', {
//         params: {
//           origin_pin: DEFAULT_PICKUP_PIN,
//           destination_pin: pin,
//           mot: 'S',
//         },
//       }).then(r => r.data);
//       if (r.success) setTatResult(r.data?.tat ?? null);
//       else setTatResult(null);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setTatLoading(false);
//     }
//   }

//   const postal = data?.delivery_codes?.[0]?.postal_code;

//   return (
//     <div className="space-y-6">
//       {/* ───────────────── HEADER ───────────────── */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
//         <div className="flex items-center gap-4">
//           <div className="h-12 w-12 bg-slate-900 flex items-center justify-center text-white rounded-sm shadow-md">
//             <Navigation size={24} className="text-indigo-400" />
//           </div>
//           <div>
//             <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Network_Intelligence_V4</h1>
//             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
//               <Globe size={12} className="text-indigo-600" /> Infrastructure_Status: OPTIMAL
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-sm border border-slate-100">
//             <Activity size={16} className="text-emerald-500" />
//             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Real_Time_Network_Active</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
//         {/* ───────────────── LEFT: PARAMETER COMMAND ───────────────── */}
//         <div className="lg:col-span-4 space-y-6">
//           {/* Pincode Lookup */}
//           <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
//             <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
//               <Search size={14} className="text-slate-400" />
//               <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Node_Lookup</h2>
//             </div>
//             <div className="p-5 space-y-4">
//               <div className="space-y-2">
//                 <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pin_Address</Label>
//                 <div className="relative">
//                   <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
//                   <Input 
//                     value={pin}
//                     onChange={(e) => setPin(e.target.value)}
//                     placeholder="ENTER 6-DIGIT PIN"
//                     className="pl-12 h-12 rounded-sm border-slate-200 bg-slate-50/50 focus:bg-white font-mono font-black text-xs transition-all uppercase"
//                   />
//                 </div>
//               </div>
//               <Button 
//                 onClick={check} 
//                 disabled={loading}
//                 className="w-full h-12 rounded-sm bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-slate-200"
//               >
//                 {loading ? <Loader2 className="animate-spin" size={18} /> : "EXECUTE_LOOKUP"}
//               </Button>
//             </div>
//           </div>

//           {/* TAT Estimator */}
//           <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
//             <div className="px-4 py-3 border-b border-slate-100 bg-indigo-600 flex items-center gap-3">
//               <Clock size={14} className="text-indigo-200" />
//               <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Transit_Computation</h2>
//             </div>
//             <div className="p-5 space-y-4">
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="space-y-1">
//                     <Label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Origin_Pin</Label>
//                     <Input 
//                         placeholder="452010" 
//                         value={tatOrigin}
//                         onChange={(e) => setTatOrigin(e.target.value)}
//                         className="h-10 rounded-sm border-slate-200 bg-slate-50 font-mono font-bold text-xs"
//                     />
//                 </div>
//                 <div className="space-y-1">
//                     <Label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Dest_Pin</Label>
//                     <Input 
//                         placeholder="DESTINATION" 
//                         value={tatDest}
//                         onChange={(e) => setTatDest(e.target.value)}
//                         className="h-10 rounded-sm border-slate-200 bg-slate-50 font-mono font-bold text-xs"
//                     />
//                 </div>
//               </div>
//               <Button 
//                 onClick={checkTat} 
//                 disabled={tatLoading}
//                 className="w-full h-11 rounded-sm border-2 border-slate-900 bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all gap-2"
//               >
//                 {tatLoading ? <Loader2 className="animate-spin" size={16} /> : <>CALC_TRANSIT_TIME</>}
//               </Button>

//               {tatResult !== null && (
//                 <div className="p-4 bg-slate-900 rounded-sm text-white flex items-center justify-between border-l-4 border-indigo-500 animate-in slide-in-from-top-2">
//                   <div>
//                     <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">ETA_WINDOW</p>
//                     <p className="text-2xl font-mono font-black italic tracking-tighter">{tatResult === 0 ? "SAME_DAY" : `${tatResult}_DAYS`}</p>
//                   </div>
//                   <Calendar className="text-slate-700" size={32} />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ───────────────── RIGHT: NETWORK TOPOLOGY VIEW ───────────────── */}
//         <div className="lg:col-span-8">
//           {postal ? (
//             <div className="space-y-6 animate-in fade-in duration-500">
//               {/* Location Header Card */}
//               <div className="p-8 border border-slate-200 rounded-sm shadow-sm bg-white relative overflow-hidden">
//                 <div className="absolute top-0 right-0 p-8 text-slate-50"><Building2 size={160} /></div>
//                 <div className="relative z-10">
//                   <div className="flex items-center gap-2 mb-4">
//                       <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//                       <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active_Operational_Node</span>
//                   </div>
//                   <h2 className="text-5xl font-mono font-black text-slate-900 tracking-tighter uppercase italic">{postal.city}</h2>
//                   <div className="flex items-center gap-4 mt-2">
//                     <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
//                       {postal.district} // {postal.state_code} // <span className="text-indigo-600 font-mono font-black">{pin}</span>
//                     </p>
//                   </div>

//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
//                     <StatusItem label="COD_ACTIVE" active={postal.cod === "Y"} />
//                     <StatusItem label="PREPAID_V3" active={postal.pre_paid === "Y"} />
//                     <StatusItem label="REVERSE_HUB" active={postal.pickup === "Y"} />
//                     <StatusItem label="ODA_SURCHARGE" active={postal.is_oda === "Y"} negative />
//                   </div>
//                 </div>
//               </div>

//               {/* Hubs / Centers List */}
//               <div className="border border-slate-200 rounded-sm shadow-sm bg-white overflow-hidden">
//                 <div className="px-5 py-4 border-b border-slate-100 bg-slate-900 flex justify-between items-center">
//                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-3">
//                     <Database size={14} className="text-indigo-400" /> Associated_Logistics_Centers
//                   </h3>
//                   <div className="px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-mono font-bold rounded-sm border border-slate-700 uppercase">
//                     Count: {postal.center?.length || 0}
//                   </div>
//                 </div>
//                 <div className="max-h-[350px] overflow-auto divide-y divide-slate-100 custom-scrollbar">
//                   {postal.center?.map((c: any, idx: number) => (
//                     <div key={idx} className="p-5 hover:bg-slate-50 transition-colors flex justify-between items-center group">
//                       <div className="space-y-1">
//                         <p className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{c.cn}</p>
//                         <div className="flex items-center gap-3">
//                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
//                                 <Hash size={12} /> {c.sort_code}
//                             </span>
//                             <span className="h-1 w-1 bg-slate-300 rounded-full" />
//                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Routing_Active</span>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Last_Node_Sync</p>
//                         <p className="text-xs font-mono font-black text-slate-500">{c.ud?.split("T")[0]}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="h-full min-h-[550px] border border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center text-center p-12 bg-slate-50/30">
//               {data && !postal ? (
//                 <div className="space-y-4 animate-in zoom-in-95">
//                   <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-sm flex items-center justify-center text-rose-500 mx-auto shadow-sm">
//                     <XCircle size={40} />
//                   </div>
//                   <div>
//                     <p className="text-xs font-black text-rose-600 uppercase tracking-[0.3em]">Node_Unserviceable</p>
//                     <p className="text-[11px] text-slate-400 font-bold uppercase mt-2 max-w-[280px] mx-auto leading-relaxed italic">
//                       SYSTEM ERROR: DELHI-NET HAS NO RECORD OF PINCODE {pin}. AREA OUTSIDE LOGISTICS REACH.
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <div className="w-20 h-20 bg-white border border-slate-100 rounded-sm flex items-center justify-center text-slate-300 mx-auto shadow-sm">
//                     <Terminal size={40} />
//                   </div>
//                   <div>
//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Query_Awaiting</p>
//                     <p className="text-[11px] text-slate-400 font-bold uppercase mt-2">Inject pincode parameter for network topography analysis.</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ───────────────── ERP SUB-COMPONENTS ───────────────── */

// function StatusItem({ label, active, negative = false }: { label: string, active: boolean, negative?: boolean }) {
//   const isGood = negative ? !active : active;
  
//   return (
//     <div className={clsx(
//       "p-4 rounded-sm border flex flex-col items-center justify-center gap-2 transition-all shadow-sm",
//       isGood 
//         ? "bg-white border-slate-200" 
//         : "bg-rose-50 border-rose-100 grayscale-[0.5]"
//     )}>
//       {isGood ? (
//         <CheckCircle2 size={16} className="text-emerald-500" />
//       ) : (
//         <XCircle size={16} className="text-rose-500" />
//       )}
//       <p className={clsx(
//         "text-[9px] font-black uppercase tracking-[0.15em]",
//         isGood ? "text-slate-600" : "text-rose-700"
//       )}>{label}</p>
//     </div>
//   );
// }
const DEFAULT_PICKUP_PIN = "452010";

export default function DelhiveryServiceability() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const [tatOrigin, setTatOrigin] = useState("");
  const [tatDest, setTatDest] = useState("");
  const [tatResult, setTatResult] = useState<number | null>(null);
  const [tatLoading, setTatLoading] = useState(false);

  // ───────────────── CORE LOGIC (PRESERVED) ─────────────────
  async function check() {
    if (!pin) return;
    setLoading(true);
    setData(null);
    try {
      const r = await api.get(`/providers/delhivery/pincode?pin=${pin}`).then(r => r.data);
      setData(r);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function checkTat() {
    if (!tatOrigin || !tatDest) return;
    setTatLoading(true);
    try {
      const r = await api.get('/providers/delhivery/tat', {
        params: {
          origin_pin: DEFAULT_PICKUP_PIN,
          destination_pin: pin,
          mot: 'S',
        },
      }).then(r => r.data);
      if (r.success) setTatResult(r.data?.tat ?? null);
      else setTatResult(null);
    } catch (e) {
      console.error(e);
    } finally {
      setTatLoading(false);
    }
  }

  const postal = data?.delivery_codes?.[0]?.postal_code;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 bg-[#0F172A] flex items-center justify-center text-white rounded-2xl shadow-xl shadow-indigo-100">
            <Navigation size={28} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Network Intelligence V4</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
              <Globe size={12} className="text-indigo-500" /> Infrastructure_Status: <span className="text-emerald-500">OPTIMAL</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-slate-100 shadow-sm">
            <Activity size={16} className="text-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-Time Network Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ───────────────── LEFT: PARAMETER COMMAND ───────────────── */}
        <div className="lg:col-span-4 space-y-8">
          {/* Pincode Lookup */}
          <SectionContainer icon={<Search size={18} />} title="Node Lookup">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pin Address</Label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <Input 
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="ENTER 6-DIGIT PIN"
                    className="pl-12 h-14 rounded-xl border-slate-100 bg-slate-50/50 focus-visible:bg-white focus-visible:ring-indigo-500 font-mono font-bold text-sm transition-all uppercase"
                  />
                </div>
              </div>
              <Button 
                onClick={check} 
                disabled={loading}
                className="w-full h-14 rounded-xl bg-[#0F172A] hover:bg-black text-white font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Execute Lookup"}
              </Button>
            </div>
          </SectionContainer>

          {/* TAT Estimator */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden group hover:border-indigo-100 transition-all">
            <div className="px-6 py-5 border-b border-indigo-500 bg-indigo-600 flex items-center gap-4">
              <Clock size={18} className="text-indigo-200" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Transit Computation</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Origin</Label>
                    <Input 
                        placeholder="452010" 
                        value={tatOrigin}
                        onChange={(e) => setTatOrigin(e.target.value)}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50/50 font-mono font-bold text-xs text-center"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Dest</Label>
                    <Input 
                        placeholder="PINCODE" 
                        value={tatDest}
                        onChange={(e) => setTatDest(e.target.value)}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50/50 font-mono font-bold text-xs text-center"
                    />
                </div>
              </div>
              <Button 
                onClick={checkTat} 
                disabled={tatLoading}
                className="w-full h-12 rounded-xl border-2 border-[#0F172A] bg-white text-[#0F172A] font-bold text-[11px] uppercase tracking-widest hover:bg-[#0F172A] hover:text-white transition-all flex items-center gap-3"
              >
                {tatLoading ? <Loader2 className="animate-spin" size={18} /> : <>Calc Transit Time</>}
              </Button>

              {tatResult !== null && (
                <div className="p-6 bg-[#0F172A] rounded-2xl text-white flex items-center justify-between border-l-4 border-indigo-500 animate-in slide-in-from-top-4 shadow-2xl">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">ETA Window</p>
                    <p className="text-3xl font-mono font-black italic tracking-tighter">
                        {tatResult === 0 ? "SAME DAY" : `${tatResult} DAYS`}
                    </p>
                  </div>
                  <Calendar className="text-slate-700/50" size={40} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ───────────────── RIGHT: NETWORK TOPOLOGY VIEW ───────────────── */}
        <div className="lg:col-span-8">
          {postal ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Location Header Card */}
              <div className="p-10 border border-slate-100 rounded-2xl shadow-sm bg-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 text-slate-50 transition-transform group-hover:scale-110 duration-700">
                    <Building2 size={200} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="h-6 w-6 bg-emerald-500/10 rounded-full flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Active Operational Node</span>
                  </div>
                  <h2 className="text-6xl font-mono font-black text-slate-900 tracking-tighter uppercase italic drop-shadow-sm">{postal.city}</h2>
                  <div className="flex items-center gap-4 mt-4">
                    <p className="text-slate-400 font-bold uppercase tracking-[0.25em] text-[11px] bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                      {postal.district} <span className="mx-2 text-slate-200">|</span> {postal.state_code} <span className="mx-2 text-slate-200">|</span> <span className="text-indigo-600 font-mono font-black">{pin}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                    <StatusItem label="COD Active" active={postal.cod === "Y"} />
                    <StatusItem label="Prepaid V3" active={postal.pre_paid === "Y"} />
                    <StatusItem label="Reverse Hub" active={postal.pickup === "Y"} />
                    <StatusItem label="ODA Surcharge" active={postal.is_oda === "Y"} negative />
                  </div>
                </div>
              </div>

              {/* Hubs / Centers List */}
              <div className="border border-slate-100 rounded-2xl shadow-sm bg-white overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 bg-[#0F172A] flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-4">
                    <Database size={18} className="text-indigo-400" /> Associated Logistics Centers
                  </h3>
                  <div className="px-4 py-1.5 bg-slate-800/50 text-indigo-400 text-[11px] font-mono font-black rounded-full border border-slate-700 uppercase tracking-tighter">
                    Capacity Nodes: {postal.center?.length || 0}
                  </div>
                </div>
                <div className="max-h-[400px] overflow-auto divide-y divide-slate-50 custom-scrollbar">
                  {postal.center?.map((c: any, idx: number) => (
                    <div key={idx} className="p-7 hover:bg-slate-50/80 transition-all flex justify-between items-center group cursor-default">
                      <div className="space-y-2">
                        <p className="text-md font-bold text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{c.cn}</p>
                        <div className="flex items-center gap-4">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 bg-white px-2 py-0.5 rounded border border-slate-100">
                                <Hash size={12} className="text-indigo-500"/> {c.sort_code}
                            </span>
                            <span className="h-1 w-1 bg-slate-300 rounded-full" />
                            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">Routing Active</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1.5">Last Node Sync</p>
                        <p className="text-sm font-mono font-black text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{c.ud?.split("T")[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[600px] border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center p-16 bg-slate-50/30">
              {data && !postal ? (
                <div className="space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-500 mx-auto shadow-xl shadow-rose-100">
                    <XCircle size={48} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-black text-rose-600 uppercase tracking-[0.3em]">Node Unserviceable</p>
                    <p className="text-[13px] text-slate-400 font-bold uppercase max-w-[320px] mx-auto leading-relaxed italic opacity-70">
                      System error: Delhi-Net has no record of pincode {pin}. Area outside logistics reach.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-24 h-24 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-200 mx-auto shadow-sm">
                    <MapIcon size={48} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Query Awaiting</p>
                    <p className="text-[13px] text-slate-300 font-bold uppercase max-w-xs tracking-widest">Inject pincode parameter for network topology analysis.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────── MODERN ERP COMPONENTS ───────────────── */

function SectionContainer({ icon, title, children }: any) {
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

function StatusItem({ label, active, negative = false }: { label: string, active: boolean, negative?: boolean }) {
  const isGood = negative ? !active : active;
  
  return (
    <div className={clsx(
      "p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all shadow-sm",
      isGood 
        ? "bg-white border-slate-50 group-hover:border-indigo-50" 
        : "bg-rose-50 border-rose-100/50 grayscale-[0.5]"
    )}>
      {isGood ? (
        <CheckCircle2 size={20} className="text-emerald-500" />
      ) : (
        <XCircle size={20} className="text-rose-500" />
      )}
      <p className={clsx(
        "text-[10px] font-black uppercase tracking-widest text-center",
        isGood ? "text-slate-500" : "text-rose-700"
      )}>{label}</p>
    </div>
  );
}