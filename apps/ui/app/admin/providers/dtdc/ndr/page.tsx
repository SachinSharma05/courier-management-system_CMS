'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, Search, Loader2, PackageSearch, 
  Truck, Calendar, Info, ArrowRight, 
  CheckCircle2, History, AlertCircle, Clock,
  XCircle, RotateCcw, MapPin, Terminal, Database, Activity, Hash
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { clsx } from 'clsx';
import { api } from '@/lib/api/axios';

// DTDC typically allows Re-attempt, Return to Origin, or Address Update
// type DTDCAction = "RE_ATTEMPT" | "RTO" | "ADDRESS_UPDATE";

// export default function DTDCNDRPage() {
//   const [awb, setAwb] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [shipment, setShipment] = useState<any>(null);
//   const [action, setAction] = useState<DTDCAction | null>(null);
//   const [result, setResult] = useState<any>(null);
//   const [confirmOpen, setConfirmOpen] = useState(false);

//   // 1. Business Logic
//   const isOptimalTime = new Date().getHours() <= 10 || new Date().getHours() >= 18;

//   const checkEligibility = (act: DTDCAction) => {
//     if (!shipment) return false;
//     const isUndelivered = shipment.status_code === "UD" || shipment.status?.toLowerCase().includes("failed");
//     const attempts = shipment.attempt_count || 0;

//     if (act === "RE_ATTEMPT") return isUndelivered && attempts < 3;
//     if (act === "RTO") return isUndelivered;
//     if (act === "ADDRESS_UPDATE") return isUndelivered;
//     return false;
//   };

//   // 2. Action Handlers
//   async function fetchShipmentDetails() {
//     if (!awb) return;
//     setLoading(true);
//     setResult(null);
//     try {
//       const { data } = await api.get(`/providers/dtdc/shipment`, { params: { waybill: awb } });
//       setShipment(data);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function executeAction() {
//     setLoading(true);
//     try {
//       const payload = { waybill: awb, action_code: action };
//       const { data } = await api.post("/providers/dtdc/ndr", payload);
//       setResult(data); 
//     } catch (e) {
//       setResult({ success: false, message: "DTDC NDR Service Unavailable" });
//     } finally {
//       setLoading(false);
//       setConfirmOpen(false);
//     }
//   }

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
      
//       {/* ───────────────── ERP HEADER ───────────────── */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
//         <div className="flex items-center gap-4">
//           <div className="h-12 w-12 bg-blue-600 flex items-center justify-center text-white rounded-sm shadow-md">
//             <ShieldAlert size={24} />
//           </div>
//           <div>
//             <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">NDR_Action_Terminal</h1>
//             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
//               <Terminal size={12} className="text-blue-500" /> DTDC_RESOLUTION_HUB // NODE: STABLE
//             </p>
//           </div>
//         </div>
//         {isOptimalTime && (
//           <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-sm flex items-center gap-3">
//              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
//              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Priority_Sync_Window_Open</span>
//           </div>
//         )}
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
//                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
//                    <Input 
//                     value={awb}
//                     onChange={(e) => { setAwb(e.target.value); setShipment(null); }}
//                     className="h-14 rounded-sm border-slate-200 bg-slate-50/50 pl-12 font-bold uppercase focus:bg-white text-xs"
//                     placeholder="Enter AWB..."
//                   />
//                 </div>
//               </div>

//               {!shipment ? (
//                 <Button 
//                   onClick={fetchShipmentDetails} 
//                   disabled={!awb || loading}
//                   className="w-full h-16 rounded-sm bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-blue-100 transition-all"
//                 >
//                   {loading ? <Loader2 className="animate-spin mr-2" /> : <PackageSearch size={18} className="mr-2" />}
//                   Identify_Node
//                 </Button>
//               ) : (
//                 <div className="space-y-3 animate-in slide-in-from-top-2">
//                   <div className="pt-2">
//                     <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">Available_Protocols</Label>
//                     <div className="space-y-2">
//                       <ActionToggle 
//                         active={action === "RE_ATTEMPT"} 
//                         disabled={!checkEligibility("RE_ATTEMPT")}
//                         onClick={() => setAction("RE_ATTEMPT")}
//                         title="RE_ATTEMPT_SYNC"
//                         icon={<RotateCcw size={16}/>}
//                       />
//                       <ActionToggle 
//                         active={action === "ADDRESS_UPDATE"} 
//                         disabled={!checkEligibility("ADDRESS_UPDATE")}
//                         onClick={() => setAction("ADDRESS_UPDATE")}
//                         title="PATCH_ADDRESS"
//                         icon={<MapPin size={16}/>}
//                       />
//                       <ActionToggle 
//                         active={action === "RTO"} 
//                         disabled={!checkEligibility("RTO")}
//                         onClick={() => setAction("RTO")}
//                         title="TERMINATE_RTO"
//                         icon={<XCircle size={16}/>}
//                       />
//                     </div>
//                   </div>
                  
//                   <Button 
//                     onClick={() => setConfirmOpen(true)}
//                     disabled={!action}
//                     className="w-full h-16 rounded-sm bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-[0.3em] mt-4 shadow-xl"
//                   >
//                     Commit_Instruction
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </Card>

//           <div className="p-6 bg-slate-900 rounded-sm border border-slate-800 text-white relative overflow-hidden">
//              <Database size={80} className="absolute -right-4 -bottom-4 opacity-[0.05] pointer-events-none" />
//              <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase mb-3 tracking-widest">
//                <Info size={14} /> Documentation_Ref
//              </div>
//              <ul className="space-y-2 text-[9px] font-bold opacity-70 uppercase tracking-tight">
//                 <li className="flex gap-2">● Re-attempts capped at 3 cycles per AWB.</li>
//                 <li className="flex gap-2">● Address patches require 24h sync delay.</li>
//                 <li className="flex gap-2">● RTO status is immutable once committed.</li>
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
//                   <h2 className="text-sm font-black uppercase tracking-widest">Transmission_Successful</h2>
//                   <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Log_ID: {result.reference_id || 'LOCAL_BUFFER'}</p>
//                 </div>
//               </div>
//               <div className="bg-slate-950 rounded-sm p-6 overflow-hidden">
//                 <pre className="text-blue-400 font-mono text-[11px] leading-relaxed">{JSON.stringify(result, null, 2)}</pre>
//               </div>
//             </Card>
//           ) : shipment ? (
//             <Card className="border border-slate-200 shadow-sm rounded-sm bg-white overflow-hidden relative animate-in slide-in-from-right-4">
//               <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center gap-2 mb-2">
//                     <Badge className="rounded-sm bg-blue-50 text-blue-600 border-blue-100 font-black text-[9px] px-2">NDR_QUEUE</Badge>
//                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">NODE_UID: {awb}</span>
//                   </div>
//                   <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{shipment.status}</h2>
//                   <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Last_Known_Loc: {shipment.last_location}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason_Code</p>
//                   <p className="text-2xl font-black text-blue-600 font-mono">{shipment.reason_code || "0x00"}</p>
//                 </div>
//               </div>

//               <div className="p-8">
//                 <div className="grid grid-cols-2 gap-6">
//                   <DetailBox label="Cycle_Count" value={`${shipment.attempt_count || 0} / 3`} />
//                   <DetailBox label="Fault_Description" value={shipment.reason_description || "RECIPIENT_UNAVAILABLE"} />
//                 </div>

//                 {!checkEligibility("RE_ATTEMPT") && (
//                   <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-sm flex gap-4">
//                     <AlertCircle className="text-amber-600 shrink-0" size={20} />
//                     <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest leading-relaxed">
//                       Error: Critical re-attempt threshold reached. Node locked for standard delivery. Request RTO or initiate manual branch intervention.
//                     </p>
//                   </div>
//                 )}
//               </div>
              
//               <Truck size={200} className="absolute -bottom-12 -right-12 opacity-[0.02] text-slate-900 pointer-events-none" />
//             </Card>
//           ) : (
//             <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center text-center p-12 bg-slate-50/50">
//               <div className="w-20 h-20 bg-white border border-slate-200 rounded-sm shadow-sm flex items-center justify-center text-slate-200 mb-6">
//                 <PackageSearch size={40} />
//               </div>
//               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Awaiting_Telemetry_Data</h3>
//               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-xs mt-3 leading-relaxed">
//                 Provide DTDC Consignment ID to fetch current failure logs and available resolution protocols.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ───────────────── MODAL: COMMIT CONFIRMATION ───────────────── */}
//       {confirmOpen && (
//         <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <Card className="p-8 rounded-sm w-full max-w-md shadow-2xl animate-in zoom-in-95 border-none bg-white">
//             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Commit_Instruction?</h3>
//             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed mb-6">
//               This will broadcast a <span className="text-blue-600 font-black">{action?.replace('_', ' ')}</span> protocol for node {awb}. Activity is logged in the permanent audit trail.
//             </p>
//             <div className="grid grid-cols-2 gap-3">
//               <Button variant="outline" onClick={() => setConfirmOpen(false)} className="rounded-sm font-black text-[10px] uppercase tracking-widest h-12">Abort</Button>
//               <Button onClick={executeAction} disabled={loading} className="rounded-sm bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest h-12">
//                 {loading ? "Syncing..." : "Execute_Sync"} 
//               </Button>
//             </div>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// }

// // ───────────────── SUB-COMPONENTS ─────────────────

// function ActionToggle({ active, disabled, onClick, title, icon }: any) {
//   return (
//     <button
//       disabled={disabled}
//       onClick={onClick}
//       className={clsx(
//         "w-full p-4 rounded-sm flex items-center justify-between border transition-all uppercase tracking-widest",
//         disabled ? "opacity-30 grayscale cursor-not-allowed border-slate-100 bg-slate-50" :
//         active ? "border-blue-600 bg-blue-50 text-blue-900" : "border-slate-200 hover:border-slate-400 bg-white text-slate-500"
//       )}
//     >
//       <div className="flex items-center gap-3">
//         <div className={clsx("p-2 rounded-sm", active ? "bg-blue-600 text-white" : "bg-slate-100")}>{icon}</div>
//         <span className="font-black text-[10px]">{title}</span>
//       </div>
//       {active && <CheckCircle2 size={16} className="text-blue-600" />}
//     </button>
//   );
// }

// function DetailBox({ label, value }: any) {
//   return (
//     <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm">
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
//       <p className="text-[11px] font-black text-slate-700 mt-1 uppercase tracking-tight">{value}</p>
//     </div>
//   );
// }
type DTDCAction = "RE_ATTEMPT" | "RTO" | "ADDRESS_UPDATE";

export default function DTDCNDRPage() {
  const [awb, setAwb] = useState("");
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<any>(null);
  const [action, setAction] = useState<DTDCAction | null>(null);
  const [result, setResult] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // 1. Business Logic (PRESERVED)
  const isOptimalTime = new Date().getHours() <= 10 || new Date().getHours() >= 18;

  const checkEligibility = (act: DTDCAction) => {
    if (!shipment) return false;
    const isUndelivered = shipment.status_code === "UD" || shipment.status?.toLowerCase().includes("failed");
    const attempts = shipment.attempt_count || 0;

    if (act === "RE_ATTEMPT") return isUndelivered && attempts < 3;
    if (act === "RTO") return isUndelivered;
    if (act === "ADDRESS_UPDATE") return isUndelivered;
    return false;
  };

  // 2. Action Handlers (PRESERVED)
  async function fetchShipmentDetails() {
    if (!awb) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.get(`/providers/dtdc/shipment`, { params: { waybill: awb } });
      setShipment(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function executeAction() {
    setLoading(true);
    try {
      const payload = { waybill: awb, action_code: action };
      const { data } = await api.post("/providers/dtdc/ndr", payload);
      setResult(data); 
    } catch (e) {
      setResult({ success: false, message: "DTDC NDR Service Unavailable" });
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* ───────────────── MODERN ERP HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 bg-[#0F172A] flex items-center justify-center text-blue-400 rounded-2xl shadow-xl shadow-blue-100">
            <ShieldAlert size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">NDR Action Terminal</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] flex items-center gap-2 mt-1">
              <Terminal size={12} className="text-blue-500" /> DTDC_RESOLUTION_HUB // NODE: STABLE
            </p>
          </div>
        </div>
        {isOptimalTime && (
          <div className="px-5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 shadow-sm shadow-emerald-50">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Priority Sync Window Open</span>
          </div>
        )}
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
                    onChange={(e) => { setAwb(e.target.value); setShipment(null); }}
                    className="h-14 rounded-xl border-slate-100 bg-slate-50/50 pl-12 font-bold uppercase focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-[13px] tracking-widest"
                    placeholder="Enter AWB..."
                  />
                </div>
              </div>

              {!shipment ? (
                <Button 
                  onClick={fetchShipmentDetails} 
                  disabled={!awb || loading}
                  className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-blue-100 transition-all active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin mr-3" size={18} /> : <PackageSearch size={18} className="mr-3" />}
                  Identify Node
                </Button>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                  <div className="pt-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 block">Available Protocols</Label>
                    <div className="space-y-3">
                      <ActionToggle 
                        active={action === "RE_ATTEMPT"} 
                        disabled={!checkEligibility("RE_ATTEMPT")}
                        onClick={() => setAction("RE_ATTEMPT")}
                        title="RE_ATTEMPT_SYNC"
                        icon={<RotateCcw size={16}/>}
                      />
                      <ActionToggle 
                        active={action === "ADDRESS_UPDATE"} 
                        disabled={!checkEligibility("ADDRESS_UPDATE")}
                        onClick={() => setAction("ADDRESS_UPDATE")}
                        title="PATCH_ADDRESS"
                        icon={<MapPin size={16}/>}
                      />
                      <ActionToggle 
                        active={action === "RTO"} 
                        disabled={!checkEligibility("RTO")}
                        onClick={() => setAction("RTO")}
                        title="TERMINATE_RTO"
                        icon={<XCircle size={16}/>}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setConfirmOpen(true)}
                    disabled={!action}
                    className="w-full h-16 rounded-2xl bg-[#0F172A] hover:bg-black text-white font-black text-[11px] uppercase tracking-[0.3em] mt-4 shadow-xl transition-all active:scale-95"
                  >
                    Commit Instruction
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 bg-[#0F172A] rounded-[2rem] text-white relative overflow-hidden shadow-2xl shadow-slate-200">
             <Database size={100} className="absolute -right-6 -bottom-6 opacity-[0.05] pointer-events-none" />
             <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase mb-4 tracking-[0.2em]">
               <Info size={14} /> Documentation Ref
             </div>
             <ul className="space-y-3 text-[10px] font-bold opacity-60 uppercase tracking-tight">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">●</span> Re-attempts capped at 3 cycles per AWB.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">●</span> Address patches require 24h sync delay.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">●</span> RTO status is immutable once committed.
                </li>
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
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Transmission Successful</h2>
                  <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">Log_ID: {result.reference_id || 'LOCAL_BUFFER'}</p>
                </div>
              </div>
              <div className="bg-[#0F172A] rounded-[2rem] p-8 overflow-hidden shadow-inner">
                <pre className="text-blue-400 font-mono text-[12px] leading-relaxed overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          ) : shipment ? (
            <div className="bg-white border border-slate-100 shadow-sm rounded-[2.5rem] overflow-hidden relative animate-in slide-in-from-right-4 duration-700">
              <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-start bg-slate-50/30">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="rounded-lg bg-blue-100 text-blue-700 border-none font-black text-[10px] px-3 py-1 tracking-widest">NDR_QUEUE</Badge>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest font-mono">NODE_UID: {awb}</span>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">{shipment.status}</h2>
                  <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.15em] mt-2 flex items-center gap-2">
                    <MapPin size={14} className="text-blue-500" />
                    Last_Known_Loc: {shipment.last_location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reason_Code</p>
                  <p className="text-3xl font-black text-blue-600 font-mono italic">{shipment.reason_code || "0x00"}</p>
                </div>
              </div>

              <div className="p-10">
                <div className="grid grid-cols-2 gap-8">
                  <DetailBox label="Cycle Count" value={`${shipment.attempt_count || 0} / 3`} />
                  <DetailBox label="Fault Description" value={shipment.reason_description || "RECIPIENT_UNAVAILABLE"} />
                </div>

                {!checkEligibility("RE_ATTEMPT") && (
                  <div className="mt-10 p-8 bg-amber-50/50 border border-amber-100 rounded-[2rem] flex gap-5">
                    <AlertCircle className="text-amber-600 shrink-0" size={24} />
                    <p className="text-[11px] font-black text-amber-800 uppercase tracking-widest leading-relaxed opacity-80">
                      Error: Critical re-attempt threshold reached. Node locked for standard delivery. Request RTO or initiate manual branch intervention.
                    </p>
                  </div>
                )}
              </div>
              
              <Truck size={240} className="absolute -bottom-16 -right-16 opacity-[0.02] text-slate-900 pointer-events-none" />
            </div>
          ) : (
            <div className="h-full min-h-[600px] border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 bg-slate-50/30 relative overflow-hidden group">
               <PackageSearch size={300} className="absolute opacity-[0.02] text-slate-900 group-hover:scale-110 transition-transform duration-1000" />
               <div className="w-24 h-24 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center justify-center text-blue-500 mb-10 animate-pulse relative z-10">
                <PackageSearch size={44} />
              </div>
              <div className="relative z-10">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Awaiting_Telemetry_Data</h3>
                <p className="text-slate-400 max-w-xs mt-4 text-[11px] font-bold uppercase tracking-widest leading-relaxed opacity-60">
                  Provide DTDC Consignment ID to fetch current failure logs and available resolution protocols.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ───────────────── MODAL: COMMIT CONFIRMATION ───────────────── */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 border border-slate-100 bg-white">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <ShieldAlert size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-3 italic">Commit Instruction?</h3>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed mb-8 opacity-70">
              This will broadcast a <span className="text-blue-600 font-black underline underline-offset-4">{action?.replace('_', ' ')}</span> protocol for node {awb}. Activity is logged in the permanent audit trail.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => setConfirmOpen(false)} className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-14 border-slate-100 hover:bg-slate-50">Abort</Button>
              <Button onClick={executeAction} disabled={loading} className="rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest h-14 shadow-lg shadow-blue-100">
                {loading ? <Loader2 className="animate-spin" /> : "Execute Sync"} 
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────── SUB-COMPONENTS ─────────────────

function ActionToggle({ active, disabled, onClick, title, icon }: any) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "w-full p-5 rounded-2xl flex items-center justify-between border transition-all uppercase tracking-widest group",
        disabled ? "opacity-30 grayscale cursor-not-allowed border-slate-50 bg-slate-50" :
        active ? "border-blue-500 bg-blue-50/50 text-blue-900 shadow-sm shadow-blue-50" : "border-slate-100 hover:border-blue-200 bg-white text-slate-500"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={clsx(
          "h-10 w-10 rounded-xl flex items-center justify-center transition-all", 
          active ? "bg-blue-600 text-white rotate-6" : "bg-slate-50 group-hover:bg-blue-50"
        )}>
          {icon}
        </div>
        <span className="font-black text-[11px] tracking-[0.1em]">{title}</span>
      </div>
      {active && <CheckCircle2 size={18} className="text-blue-600 animate-in zoom-in" />}
    </button>
  );
}

function DetailBox({ label, value }: any) {
  return (
    <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] hover:bg-white hover:shadow-sm transition-all duration-300">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
      <p className="text-[13px] font-black text-slate-800 uppercase tracking-tight italic">{value}</p>
    </div>
  );
}