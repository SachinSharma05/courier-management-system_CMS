'use client';

import React, { useState } from 'react';
import { 
  PackageX, Hash, Loader2, Search, RefreshCcw, 
  Trash2, Info, ArrowRight, CheckCircle2, 
  User, MapPin, Lock, Undo2, AlertTriangle,
  Ban, Terminal, Database, Activity, Cpu
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { clsx } from 'clsx';
import { api } from '@/lib/api/axios';

// export default function CancelDTDCShipment() {
//   // 1. Core Logic (Preserved from original)
//   const [awb, setAwb] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isFetched, setIsFetched] = useState(false);
//   const [details, setDetails] = useState<any>(null);
//   const [result, setResult] = useState<any>(null);

//   const isCancellable = (status: string) => {
//     const s = status?.toLowerCase() || "";
//     const forbidden = ["delivered", "out for delivery", "returned", "rto"];
//     return !forbidden.some(keyword => s.includes(keyword));
//   };

//   const getOutcome = (status: string) => {
//     const s = status?.toLowerCase() || "";
//     if (s.includes("booked") || s.includes("manifested")) 
//         return { label: "VOID_CONSIGNMENT", desc: "The booking will be invalidated and removed from active manifest." };
//     if (s.includes("in transit")) 
//         return { label: "HUB_INTERCEPTION", desc: "Broadcasting halt signal to current node for immediate return." };
//     return { label: "STANDARD_TERMINATION", desc: "Shipment will be flagged as cancelled in tracking registry." };
//   };

//   // 2. Handlers
//   async function fetchDetails() {
//     if (!awb) return;
//     setLoading(true);
//     setResult(null);
//     try {
//       const { data } = await api.get('/providers/dtdc/shipment', { params: { waybill: awb } });
//       setDetails(data);
//       setIsFetched(true);
//     } catch (e) {
//       console.error("Fetch Error:", e);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleCancel() {
//     setLoading(true);
//     try {
//       const payload = { consignment_no: awb, reason: "SYSTEM_TERMINATION_REQUEST" };
//       const res = await api.post("/providers/dtdc/cancel", payload);
//       setResult(res.data);
//     } catch (e) {
//       setResult({ success: false, message: "TERMINATION_FAILURE" });
//     } finally {
//       setLoading(false);
//     }
//   }

//   const outcome = details ? getOutcome(details.status) : null;
//   const canCancel = details && isCancellable(details.status);

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
      
//       {/* ───────────────── ERP HEADER ───────────────── */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
//         <div className="flex items-center gap-4">
//           <div className="h-12 w-12 bg-rose-600 flex items-center justify-center text-white rounded-sm shadow-md">
//             <Ban size={24} />
//           </div>
//           <div>
//             <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Terminal_ID_Revocation</h1>
//             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
//               <Terminal size={12} className="text-rose-500" /> SYSTEM: DTDC_VOID_PROTOCOL // STATUS: AUTHORIZED
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
//         {/* ───────────────── LEFT: COMMAND WORKSPACE ───────────────── */}
//         <div className="lg:col-span-4 space-y-6">
//           <Card className="p-8 border border-slate-200 shadow-sm rounded-sm bg-white space-y-6">
//             <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
//               <Activity size={14} className="text-blue-600" />
//               <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Query_Parameters</h2>
//             </div>
            
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Consignment_Number</Label>
//                 <div className="relative">
//                   <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
//                   <Input 
//                     value={awb}
//                     onChange={(e) => setAwb(e.target.value)}
//                     placeholder="EX: D12345678"
//                     disabled={isFetched && loading}
//                     className="pl-12 h-14 rounded-sm border-slate-200 bg-slate-50/50 font-mono font-bold text-xs uppercase"
//                   />
//                 </div>
//               </div>

//               {!isFetched ? (
//                 <Button onClick={fetchDetails} disabled={loading || !awb} className="w-full h-16 rounded-sm bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-100">
//                   {loading ? <Loader2 className="animate-spin mr-2" /> : <Search size={18} className="mr-2" />}
//                   Verify_Node_Status
//                 </Button>
//               ) : (
//                 <div className="space-y-4 pt-2">
//                     <Button onClick={() => { setIsFetched(false); setDetails(null); }} variant="outline" className="w-full h-12 rounded-sm border-slate-200 font-black text-[10px] uppercase tracking-widest bg-slate-50">
//                         <RefreshCcw size={14} className="mr-2" /> New_Search_Session
//                     </Button>
                    
//                     <Button 
//                       onClick={handleCancel} 
//                       disabled={loading || !canCancel}
//                       className={clsx(
//                         "w-full h-16 rounded-sm font-black text-[11px] uppercase tracking-[0.3em] shadow-xl transition-all",
//                         canCancel ? "bg-slate-900 hover:bg-black text-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"
//                       )}
//                     >
//                       {loading ? <Loader2 className="animate-spin mr-2" /> : <PackageX size={18} className="mr-2" />}
//                       Execute_Termination
//                     </Button>
//                 </div>
//               )}
//             </div>
//           </Card>

//           <div className="p-6 bg-slate-900 rounded-sm border border-slate-800 text-white relative overflow-hidden">
//              <Database size={80} className="absolute -right-4 -bottom-4 opacity-[0.05] pointer-events-none" />
//              <div className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase mb-3 tracking-widest">
//                <AlertTriangle size={14} /> DTDC_POLICY_ENGINE
//              </div>
//              <ul className="space-y-3 text-[9px] font-bold opacity-70 uppercase tracking-tight leading-relaxed">
//                 <li className="flex gap-2"><ArrowRight size={10} className="shrink-0 text-rose-500"/> Booked units void immediately at source.</li>
//                 <li className="flex gap-2"><ArrowRight size={10} className="shrink-0 text-rose-500"/> In-transit node requires signal 0x04 (Interception).</li>
//                 <li className="flex gap-2"><ArrowRight size={10} className="shrink-0 text-rose-500"/> Out-for-delivery status locks termination.</li>
//              </ul>
//           </div>
//         </div>

//         {/* ───────────────── RIGHT: TELEMETRY VIEW ───────────────── */}
//         <div className="lg:col-span-8">
//           {result ? (
//             <Card className="p-8 border border-slate-200 shadow-sm rounded-sm bg-white animate-in zoom-in-95">
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-sm flex items-center justify-center">
//                   <CheckCircle2 size={24} />
//                 </div>
//                 <div>
//                   <h2 className="text-sm font-black uppercase tracking-widest">Signal_Broadcasting_Confirmed</h2>
//                   <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Consignment_Ref: {awb}</p>
//                 </div>
//               </div>
//               <div className="bg-slate-950 rounded-sm p-6 overflow-hidden">
//                 <pre className="text-blue-400 font-mono text-[11px] leading-relaxed">{JSON.stringify(result, null, 2)}</pre>
//               </div>
//             </Card>
//           ) : details ? (
//             <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
//               <Card className="border border-slate-200 shadow-sm rounded-sm bg-white overflow-hidden relative">
//                 <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start">
//                   <div>
//                     <div className="flex items-center gap-2 mb-2">
//                        <Badge className={clsx("rounded-sm font-black text-[9px] px-2 py-0.5 border-none", canCancel ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500")}>
//                         {canCancel ? "NODE_ACTIONABLE" : "NODE_LOCKED"}
//                        </Badge>
//                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">NODE_UID: {awb}</span>
//                     </div>
//                     <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{details.status}</h2>
//                     <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Origin_Hub: {details.origin_city}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service_Tier</p>
//                     <p className="text-sm font-black text-blue-600 uppercase tracking-tighter">{details.service_type || "EXPRESS"}</p>
//                   </div>
//                 </div>

//                 <div className="p-8 space-y-6">
//                   <div className="grid grid-cols-2 gap-4">
//                      <DetailBox label="Receiver_Entity" value={details.receiver_name} icon={<User size={14}/>} />
//                      <DetailBox label="Destination_Node" value={details.destination_city} icon={<MapPin size={14}/>} />
//                   </div>

//                   {canCancel ? (
//                     <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-sm">
//                       <div className="flex items-center gap-2 text-blue-700 font-black text-[9px] uppercase tracking-[0.2em] mb-2">
//                         <Undo2 size={14} /> Expected_Recovery_Protocol
//                       </div>
//                       <p className="text-lg font-black text-blue-900 tracking-tighter">{outcome?.label}</p>
//                       <p className="text-[10px] font-bold text-blue-700/70 uppercase tracking-tight mt-1 leading-relaxed max-w-md">{outcome?.desc}</p>
//                     </div>
//                   ) : (
//                     <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm flex gap-4 items-center">
//                       <Lock className="text-slate-400 shrink-0" size={20} />
//                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
//                         Security_Lock: Consignment has transitioned to out-for-delivery or delivered. Termination protocol aborted by remote carrier.
//                       </p>
//                     </div>
//                   )}
//                 </div>
                
//                 <Cpu size={200} className="absolute -bottom-16 -right-16 opacity-[0.02] text-slate-900 pointer-events-none" />
//               </Card>
//             </div>
//           ) : (
//             <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center text-center p-12 bg-slate-50/50">
//               <div className="w-20 h-20 bg-white border border-slate-200 rounded-sm shadow-sm flex items-center justify-center text-slate-200 mb-6">
//                 <PackageX size={40} />
//               </div>
//               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Awaiting_Consignment_ID</h3>
//               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-xs mt-3 leading-relaxed">
//                 Synchronize with DTDC servers to identify active shipments available for revocation or interception.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ───────────────── SUB-COMPONENTS ─────────────────

// function DetailBox({ label, value, icon }: any) {
//   return (
//     <div className="p-4 bg-slate-50 border border-slate-100 rounded-sm flex items-center gap-4">
//       <div className="p-2 bg-white border border-slate-100 rounded-sm text-blue-600 shadow-sm">
//         {icon}
//       </div>
//       <div>
//         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
//         <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{value}</p>
//       </div>
//     </div>
//   );
// }
export default function CancelDTDCShipment() {
  // 1. Core Logic (Preserved)
  const [awb, setAwb] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const [result, setResult] = useState<any>(null);

  const isCancellable = (status: string) => {
    const s = status?.toLowerCase() || "";
    const forbidden = ["delivered", "out for delivery", "returned", "rto"];
    return !forbidden.some(keyword => s.includes(keyword));
  };

  const getOutcome = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("booked") || s.includes("manifested")) 
        return { label: "VOID_CONSIGNMENT", desc: "The booking will be invalidated and removed from active manifest." };
    if (s.includes("in transit")) 
        return { label: "HUB_INTERCEPTION", desc: "Broadcasting halt signal to current node for immediate return." };
    return { label: "STANDARD_TERMINATION", desc: "Shipment will be flagged as cancelled in tracking registry." };
  };

  // 2. Handlers (Preserved)
  async function fetchDetails() {
    if (!awb) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.get('/providers/dtdc/shipment', { params: { waybill: awb } });
      setDetails(data);
      setIsFetched(true);
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    setLoading(true);
    try {
      const payload = { consignment_no: awb, reason: "SYSTEM_TERMINATION_REQUEST" };
      const res = await api.post("/providers/dtdc/cancel", payload);
      setResult(res.data);
    } catch (e) {
      setResult({ success: false, message: "TERMINATION_FAILURE" });
    } finally {
      setLoading(false);
    }
  }

  const outcome = details ? getOutcome(details.status) : null;
  const canCancel = details && isCancellable(details.status);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* ───────────────── MODERN ERP HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 bg-rose-600 flex items-center justify-center text-white rounded-2xl shadow-xl shadow-rose-100">
            <Ban size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight italic">Terminal ID Revocation</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] flex items-center gap-2 mt-1">
              <Terminal size={12} className="text-rose-500" /> SYSTEM: DTDC_VOID_PROTOCOL <span className="text-slate-200">|</span> STATUS: AUTHORIZED
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ───────────────── LEFT: COMMAND WORKSPACE ───────────────── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
              <Activity size={16} className="text-blue-600" />
              <h2 className="text-xs font-black uppercase tracking-[0.15em] text-slate-800">Query Parameters</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2 group">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-blue-500 transition-colors">Consignment Number</Label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <Input 
                    value={awb}
                    onChange={(e) => setAwb(e.target.value)}
                    placeholder="EX: D12345678"
                    disabled={isFetched && loading}
                    className="pl-12 h-14 rounded-xl border-slate-100 bg-slate-50/50 font-mono font-bold text-[13px] uppercase tracking-widest transition-all focus:bg-white"
                  />
                </div>
              </div>

              {!isFetched ? (
                <Button 
                    onClick={fetchDetails} 
                    disabled={loading || !awb} 
                    className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-100 active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin mr-3" size={18} /> : <Search size={18} className="mr-3" />}
                  Verify Node Status
                </Button>
              ) : (
                <div className="space-y-4 pt-2 animate-in slide-in-from-top-4">
                    <Button 
                        onClick={() => { setIsFetched(false); setDetails(null); }} 
                        variant="outline" 
                        className="w-full h-12 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest bg-slate-50/50 hover:bg-slate-50 transition-all"
                    >
                        <RefreshCcw size={14} className="mr-2" /> New Search Session
                    </Button>
                    
                    <Button 
                      onClick={handleCancel} 
                      disabled={loading || !canCancel}
                      className={clsx(
                        "w-full h-16 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95",
                        canCancel ? "bg-[#0F172A] hover:bg-black text-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      )}
                    >
                      {loading ? <Loader2 className="animate-spin mr-3" size={18} /> : <PackageX size={18} className="mr-3" />}
                      Execute Termination
                    </Button>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 bg-[#0F172A] rounded-[2rem] text-white relative overflow-hidden shadow-2xl shadow-slate-200">
             <Database size={100} className="absolute -right-6 -bottom-6 opacity-[0.05] pointer-events-none" />
             <div className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase mb-4 tracking-[0.2em]">
               <AlertTriangle size={14} /> DTDC Policy Engine
             </div>
             <ul className="space-y-3 text-[10px] font-bold opacity-60 uppercase tracking-tight leading-relaxed">
                <li className="flex gap-3 items-start"><ArrowRight size={12} className="shrink-0 text-rose-500 mt-0.5"/> Booked units void immediately at source.</li>
                <li className="flex gap-3 items-start"><ArrowRight size={12} className="shrink-0 text-rose-500 mt-0.5"/> In-transit node requires signal 0x04.</li>
                <li className="flex gap-3 items-start"><ArrowRight size={12} className="shrink-0 text-rose-500 mt-0.5"/> Out-for-delivery status locks terminal.</li>
             </ul>
          </div>
        </div>

        {/* ───────────────── RIGHT: TELEMETRY VIEW ───────────────── */}
        <div className="lg:col-span-8">
          {result ? (
            <div className="p-10 bg-white border border-slate-100 shadow-sm rounded-[2.5rem] animate-in zoom-in-95 duration-500">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl flex items-center justify-center shadow-sm shadow-emerald-50">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Signal Broadcasting Confirmed</h2>
                  <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">Consignment_Ref: {awb}</p>
                </div>
              </div>
              <div className="bg-[#0F172A] rounded-[2rem] p-8 overflow-hidden shadow-inner">
                <pre className="text-blue-400 font-mono text-[12px] leading-relaxed overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          ) : details ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-700">
              <div className="bg-white border border-slate-100 shadow-sm rounded-[2.5rem] overflow-hidden relative">
                <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-start bg-slate-50/30">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                       <Badge className={clsx("rounded-lg font-black text-[10px] px-3 py-1 border-none tracking-widest", canCancel ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700")}>
                        {canCancel ? "NODE_ACTIONABLE" : "NODE_LOCKED"}
                       </Badge>
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest font-mono">NODE_UID: {awb}</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">{details.status}</h2>
                    <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={14} className="text-blue-500" /> Origin_Hub: {details.origin_city}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service_Tier</p>
                    <p className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg tracking-tighter">{details.service_type || "EXPRESS"}</p>
                  </div>
                </div>

                <div className="p-10 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                     <DetailBox label="Receiver Entity" value={details.receiver_name} icon={<User size={16}/>} />
                     <DetailBox label="Destination Node" value={details.destination_city} icon={<MapPin size={16}/>} />
                  </div>

                  {canCancel ? (
                    <div className="p-8 bg-blue-50/50 border border-blue-100 rounded-[2rem] shadow-sm animate-in fade-in duration-1000">
                      <div className="flex items-center gap-3 text-blue-700 font-black text-[10px] uppercase tracking-[0.2em] mb-3 opacity-80">
                        <Undo2 size={16} /> Expected Recovery Protocol
                      </div>
                      <p className="text-2xl font-black text-blue-950 tracking-tighter italic">{outcome?.label}</p>
                      <p className="text-[11px] font-bold text-blue-700/60 uppercase tracking-tight mt-2 leading-relaxed max-w-md italic">{outcome?.desc}</p>
                    </div>
                  ) : (
                    <div className="p-8 bg-rose-50/50 border border-rose-100 rounded-[2rem] flex gap-5 items-center">
                      <Lock className="text-rose-400 shrink-0" size={24} />
                      <p className="text-[11px] font-black text-rose-800 uppercase tracking-widest leading-relaxed opacity-70">
                        Security_Lock: Consignment has transitioned to out-for-delivery or delivered. Termination protocol aborted by remote carrier.
                      </p>
                    </div>
                  )}
                </div>
                
                <Cpu size={250} className="absolute -bottom-20 -right-20 opacity-[0.02] text-slate-900 pointer-events-none" />
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[600px] border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 bg-slate-50/30 relative overflow-hidden group">
               <PackageX size={300} className="absolute opacity-[0.02] text-slate-900 group-hover:scale-110 transition-transform duration-1000" />
               <div className="w-24 h-24 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center justify-center text-rose-500 mb-10 animate-pulse relative z-10">
                <PackageX size={44} />
              </div>
              <div className="relative z-10">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Awaiting_Consignment_ID</h3>
                <p className="text-slate-400 max-w-xs mt-4 text-[11px] font-bold uppercase tracking-widest leading-relaxed opacity-60">
                  Synchronize with DTDC servers to identify active shipments available for revocation or interception.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ───────────────── SUB-COMPONENTS ─────────────────

function DetailBox({ label, value, icon }: any) {
  return (
    <div className="p-6 bg-slate-50/50 border border-slate-50 rounded-[1.5rem] flex items-center gap-5 hover:bg-white hover:shadow-sm transition-all duration-300 group">
      <div className="p-3 bg-white border border-slate-100 rounded-xl text-blue-600 shadow-sm group-hover:rotate-6 transition-transform">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-[12px] font-black text-slate-800 uppercase tracking-tight italic">{value}</p>
      </div>
    </div>
  );
}