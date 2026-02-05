"use client";

import { useState } from "react";
import { 
  PackageX, Hash, Search, Loader2, CheckCircle2, 
  Lock, RefreshCcw, Info, Trash2,
  Undo2, MapPin, User, ArrowRight,
  PackageOpen, Terminal, ShieldAlert, Activity, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api/axios";
import clsx from "clsx";

// export default function CancelDelhiveryShipment() {
//   const [awb, setAwb] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isFetched, setIsFetched] = useState(false);
//   const [details, setDetails] = useState<any>(null);
//   const [result, setResult] = useState<any>(null);

//   // ───────────────── CORE BUSINESS LOGIC (PRESERVED) ─────────────────
//   const isCancellable = (status: string) => {
//     const s = status?.toLowerCase() || "";
//     const allowed = ["manifested", "in transit", "pending", "scheduled"];
//     return allowed.some(keyword => s.includes(keyword));
//   };

//   const getOutcome = (status: string) => {
//     const s = status?.toLowerCase() || "";
//     if (s.includes("manifested")) return { type: "UD", label: "Manifested (Undelivered)", desc: "Status stays Manifested, Type becomes UD." };
//     if (s.includes("in transit") || s.includes("pending")) return { type: "RT", label: "Return to Origin", desc: "Status stays In Transit, Type becomes RT." };
//     if (s.includes("scheduled")) return { type: "CN", label: "Cancelled", desc: "Status updates to Cancelled (CN)." };
//     return null;
//   };

//   async function fetchDetails() {
//     if (!awb) return;
//     setLoading(true);
//     setResult(null);
//     try {
//       const { data } = await api.get('/providers/delhivery/shipment', { params: { waybill: awb } });
//       setDetails(data);
//       setIsFetched(true);
//     } catch (e) {
//       alert("Shipment not found.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleCancel() {
//     setLoading(true);
//     try {
//       const payload = {
//         waybill: awb,
//         cancellation: "true"
//       };
//       const res = await api.post("/providers/delhivery/cancel", payload);
//       setResult(res.data);
//     } catch (e) {
//       setResult({ success: false, message: "Cancellation Request Failed" });
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
//             <PackageX size={24} />
//           </div>
//           <div>
//             <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter text-rose-600">Void_Shipment_Module</h1>
//             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
//               <Terminal size={12} className="text-rose-500" /> Provider: DELHI-NET // AUTH_KEY: LIVE_PROD
//             </p>
//           </div>
//         </div>
//         {isFetched && (
//           <Button 
//             variant="outline" 
//             onClick={() => { setIsFetched(false); setDetails(null); }} 
//             className="rounded-sm font-black text-[10px] uppercase tracking-widest border-slate-200 h-10 hover:bg-slate-50"
//           >
//             <RefreshCcw size={14} className="mr-2" /> RE_INITIALIZE_VALIDATION
//           </Button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
//         {/* ───────────────── LEFT: PROTOCOL MONITOR ───────────────── */}
//         <div className="lg:col-span-4 space-y-6">
//           <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
//              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
//                 <ShieldAlert size={14} className="text-rose-500" />
//                 <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Safety_Protocols</h2>
//              </div>
             
//              <div className="p-5 space-y-4">
//                <div className="p-4 bg-slate-900 rounded-sm border-l-2 border-rose-500">
//                  <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-2">Outcome_Projection_Matrix</p>
//                  <div className="space-y-3">
//                     <ProjectionRow code="UD" label="Manifested Shipments" desc="Status: Manifested / Type: UD" />
//                     <ProjectionRow code="RT" label="Transit/Pending" desc="Status: In Transit / Type: RT" />
//                     <ProjectionRow code="CN" label="Scheduled Pickups" desc="Status: Cancelled / Type: CN" />
//                  </div>
//                </div>

//                <div className="p-4 bg-rose-50 border border-rose-100 rounded-sm">
//                   <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-2">Irreversible_Action</p>
//                   <p className="text-[10px] font-bold text-slate-600 uppercase leading-tight tracking-tight">
//                     Triggering the void sequence will broadcast a cancellation packet to the Delhivery master node. This cannot be undone once committed.
//                   </p>
//                </div>
//              </div>
//           </div>

//           {isFetched && (
//             <div className={clsx(
//               "p-6 border rounded-sm shadow-sm transition-all duration-500",
//               canCancel ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"
//             )}>
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">State_Analysis</p>
//                   <h2 className="text-2xl font-mono font-black tracking-tighter uppercase italic">{details.status}</h2>
//                 </div>
//                 {canCancel ? <CheckCircle2 size={24} /> : <Lock size={24} />}
//               </div>
//               {!canCancel && (
//                 <div className="mt-4 pt-4 border-t border-white/10 text-[9px] font-bold uppercase tracking-tight opacity-60 leading-relaxed">
//                   CRITICAL: Sequence has reached a terminal state (Delivered/RTO). Cancellation packets rejected by provider node.
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* ───────────────── RIGHT: VOID WORKSPACE ───────────────── */}
//         <div className="lg:col-span-8 bg-white border border-slate-200 rounded-sm shadow-sm relative overflow-hidden">
//           {!isFetched ? (
//              <div className="py-24 text-center space-y-8 bg-slate-50/30">
//                 <div className="w-20 h-20 bg-white border border-slate-100 rounded-sm flex items-center justify-center mx-auto text-slate-200 shadow-sm animate-pulse">
//                   <Hash size={40} />
//                 </div>
//                 <div className="max-w-xs mx-auto space-y-4 px-6">
//                   <div className="space-y-2 text-center">
//                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sequence_Identifier</Label>
//                     <Input 
//                       value={awb} 
//                       onChange={(e) => setAwb(e.target.value)}
//                       placeholder="ENTER 14-DIGIT AWB"
//                       className="h-14 rounded-sm border-slate-200 bg-white text-center font-mono text-xl font-black text-slate-700 focus:border-rose-500 transition-all uppercase placeholder:opacity-20"
//                     />
//                   </div>
//                   <Button onClick={fetchDetails} disabled={loading || !awb} className="w-full h-12 rounded-sm bg-slate-900 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-black transition-all">
//                     {loading ? <Loader2 className="animate-spin" /> : "EXECUTE_PRE_CANCELLATION_CHECK"}
//                   </Button>
//                 </div>
//              </div>
//           ) : (
//             <div className={clsx("p-8 space-y-10 transition-all duration-500", !canCancel && "opacity-40 grayscale pointer-events-none")}>
              
//               {!canCancel && (
//                 <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/5 backdrop-blur-[2px]">
//                   <div className="bg-white p-5 border border-slate-200 rounded-sm shadow-2xl flex flex-col items-center gap-3">
//                     <Lock className="text-slate-400" size={24} />
//                     <p className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em]">Module_Locked</p>
//                   </div>
//                 </div>
//               )}

//               {/* SHIPMENT PREVIEW */}
//               <div className="space-y-6">
//                 <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
//                   <Activity size={14} className="text-rose-600" />
//                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Sequence_Telemetry</span>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <DetailBox label="Target_Consignee" value={details.consignee?.name} icon={<User size={14}/>} />
//                   <DetailBox label="Target_Zone" value={details.consignee?.city} icon={<MapPin size={14}/>} />
//                   <DetailBox label="Order_Reference" value={`#${details.order_id}`} icon={<Hash size={14}/>} />
//                   <DetailBox label="Current_Status" value={details.status} icon={<Zap size={14}/>} />
//                 </div>
//               </div>

//               {/* OUTCOME PROJECTION */}
//               {canCancel && outcome && (
//                 <div className="p-6 bg-amber-50 border border-amber-200 rounded-sm space-y-4">
//                   <div className="flex items-center gap-2">
//                     <Undo2 size={14} className="text-amber-600" />
//                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Projected_Outcome</span>
//                   </div>
//                   <div>
//                     <h3 className="text-2xl font-black text-amber-900 tracking-tighter uppercase italic">{outcome.label}</h3>
//                     <p className="text-[10px] font-bold text-amber-700/70 uppercase tracking-widest mt-1">{outcome.desc}</p>
//                   </div>
//                 </div>
//               )}

//               <Button 
//                 onClick={handleCancel} 
//                 disabled={loading || !canCancel}
//                 className="w-full h-16 rounded-sm bg-rose-600 hover:bg-rose-700 text-white font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-rose-100"
//               >
//                 {loading ? <Loader2 className="animate-spin" /> : <Trash2 className="mr-3" size={18} />}
//                 {loading ? "BROADCASTING_VOID_PACKET..." : "COMMIT_VOID_SEQUENCE"}
//               </Button>
//             </div>
//           )}

//           {result && (
//             <div className="mt-8 p-6 bg-slate-900 border-t border-slate-800 animate-in slide-in-from-bottom-4 duration-300">
//                <div className="flex items-center justify-between mb-4">
//                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">Server_Response_Output</p>
//                  <Badge className="bg-slate-800 text-slate-400 border border-slate-700 text-[8px] font-mono">VOID_TX_OK</Badge>
//                </div>
//                <pre className="text-emerald-400 font-mono text-[10px] leading-relaxed overflow-auto max-h-[300px] scrollbar-hide">
//                  {JSON.stringify(result, null, 2)}
//                </pre>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ───────────────── ERP SUB-COMPONENTS ─────────────────

// function ProjectionRow({ code, label, desc }: any) {
//   return (
//     <div className="flex items-start gap-3">
//       <div className="text-[10px] font-mono font-black text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded-sm">{code}</div>
//       <div>
//         <p className="text-[10px] font-black text-slate-300 uppercase tracking-tight">{label}</p>
//         <p className="text-[9px] font-bold text-slate-500 uppercase italic">{desc}</p>
//       </div>
//     </div>
//   );
// }

// function DetailBox({ label, value, icon }: any) {
//   return (
//     <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm">
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
//         {icon} {label}
//       </p>
//       <p className="text-xs font-black text-slate-700 uppercase tracking-tight truncate">{value}</p>
//     </div>
//   );
// }
export default function CancelDelhiveryShipment() {
  const [awb, setAwb] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const [result, setResult] = useState<any>(null);

  // ───────────────── CORE BUSINESS LOGIC (PRESERVED) ─────────────────
  const isCancellable = (status: string) => {
    const s = status?.toLowerCase() || "";
    const allowed = ["manifested", "in transit", "pending", "scheduled"];
    return allowed.some(keyword => s.includes(keyword));
  };

  const getOutcome = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("manifested")) return { type: "UD", label: "Manifested (Undelivered)", desc: "Status stays Manifested, Type becomes UD." };
    if (s.includes("in transit") || s.includes("pending")) return { type: "RT", label: "Return to Origin", desc: "Status stays In Transit, Type becomes RT." };
    if (s.includes("scheduled")) return { type: "CN", label: "Cancelled", desc: "Status updates to Cancelled (CN)." };
    return null;
  };

  async function fetchDetails() {
    if (!awb) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.get('/providers/delhivery/shipment', { params: { waybill: awb } });
      setDetails(data);
      setIsFetched(true);
    } catch (e) {
      alert("Shipment not found.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    setLoading(true);
    try {
      const payload = { waybill: awb, cancellation: "true" };
      const res = await api.post("/providers/delhivery/cancel", payload);
      setResult(res.data);
    } catch (e) {
      setResult({ success: false, message: "Cancellation Request Failed" });
    } finally {
      setLoading(false);
    }
  }

  const outcome = details ? getOutcome(details.status) : null;
  const canCancel = details && isCancellable(details.status);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 bg-rose-600 flex items-center justify-center text-white rounded-2xl shadow-xl shadow-rose-100">
            <PackageX size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Void Shipment Module</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
              <Terminal size={12} className="text-rose-500" /> Provider: <span className="text-rose-600 font-bold">DELHI-NET</span>
            </p>
          </div>
        </div>
        {isFetched && (
          <Button 
            variant="outline" 
            onClick={() => { setIsFetched(false); setDetails(null); }} 
            className="rounded-2xl font-bold text-[10px] uppercase tracking-widest border-slate-200 h-12 px-6 hover:bg-white transition-all shadow-sm"
          >
            <RefreshCcw size={14} className="mr-2" /> Re-Initialize Validation
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ───────────────── LEFT: PROTOCOL MONITOR ───────────────── */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
             <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
                <div className="p-2.5 bg-white border border-slate-100 text-rose-500 rounded-xl shadow-sm"><ShieldAlert size={18} /></div>
                <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-800">Safety Protocols</h2>
             </div>
             
             <div className="p-8 space-y-6">
                <div className="p-6 bg-[#0F172A] rounded-2xl border-l-4 border-rose-500 shadow-xl">
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-4">Outcome Projection Matrix</p>
                  <div className="space-y-4">
                     <ProjectionRow code="UD" label="Manifested Shipments" desc="Status: Manifested / Type: UD" />
                     <ProjectionRow code="RT" label="Transit/Pending" desc="Status: In Transit / Type: RT" />
                     <ProjectionRow code="CN" label="Scheduled Pickups" desc="Status: Cancelled / Type: CN" />
                  </div>
                </div>

                <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl">
                   <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <Lock size={12}/> Irreversible Action
                   </p>
                   <p className="text-xs font-bold text-slate-600 uppercase leading-relaxed tracking-tight">
                     Triggering the void sequence will broadcast a cancellation packet to the Delhivery master node. This cannot be undone once committed.
                   </p>
                </div>
             </div>
          </div>

          {isFetched && (
            <div className={clsx(
              "p-8 border rounded-3xl shadow-2xl transition-all duration-700 transform",
              canCancel ? "bg-emerald-600 border-emerald-500 text-white translate-y-0" : "bg-[#0F172A] border-slate-800 text-slate-400"
            )}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">State Analysis</p>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">{details.status}</h2>
                </div>
                <div className={clsx("p-3 rounded-2xl bg-white/10", canCancel ? "text-white" : "text-rose-500")}>
                  {canCancel ? <CheckCircle2 size={28} /> : <Lock size={28} />}
                </div>
              </div>
              {!canCancel && (
                <div className="mt-6 pt-6 border-t border-white/10 text-[10px] font-bold uppercase tracking-wide opacity-50 leading-relaxed">
                  CRITICAL: Sequence has reached a terminal state (Delivered/RTO). Cancellation packets rejected by provider node.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ───────────────── RIGHT: VOID WORKSPACE ───────────────── */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[40px] shadow-sm relative overflow-hidden">
          {!isFetched ? (
             <div className="py-32 text-center space-y-10 bg-slate-50/20">
                <div className="w-24 h-24 bg-white border border-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-100 shadow-xl animate-pulse transform -rotate-6">
                  <Hash size={48} />
                </div>
                <div className="max-w-sm mx-auto space-y-6 px-10">
                  <div className="space-y-3 text-center">
                    <Label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Sequence Identifier</Label>
                    <Input 
                      value={awb} 
                      onChange={(e) => setAwb(e.target.value)}
                      placeholder="ENTER 14-DIGIT AWB"
                      className="h-20 rounded-[24px] border-none bg-white text-center font-mono text-3xl font-black text-slate-800 focus-visible:ring-2 focus-visible:ring-rose-500 transition-all uppercase placeholder:opacity-10 shadow-2xl shadow-slate-100"
                    />
                  </div>
                  <Button onClick={fetchDetails} disabled={loading || !awb} className="w-full h-16 rounded-2xl bg-[#0F172A] text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-black transition-all shadow-xl shadow-slate-200">
                    {loading ? <Loader2 className="animate-spin" /> : "Execute Pre-Cancellation Check"}
                  </Button>
                </div>
             </div>
          ) : (
            <div className={clsx("p-12 space-y-12 transition-all duration-700", !canCancel && "opacity-30 grayscale pointer-events-none")}>
              
              {!canCancel && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                  <div className="bg-white p-8 border border-slate-100 rounded-[32px] shadow-2xl flex flex-col items-center gap-4 border-b-8 border-b-rose-500">
                    <div className="p-4 bg-rose-50 rounded-2xl text-rose-500"><Lock size={32} /></div>
                    <p className="font-black text-slate-400 text-xs uppercase tracking-[0.4em]">Module Locked</p>
                  </div>
                </div>
              )}

              {/* SHIPMENT PREVIEW */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <Activity size={18} className="text-rose-500" />
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Sequence Telemetry</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DetailBox label="Target Consignee" value={details.consignee?.name} icon={<User size={16}/>} />
                  <DetailBox label="Target Zone" value={details.consignee?.city} icon={<MapPin size={16}/>} />
                  <DetailBox label="Order Reference" value={`#${details.order_id}`} icon={<Hash size={16}/>} />
                  <DetailBox label="Current Status" value={details.status} icon={<Zap size={16}/>} />
                </div>
              </div>

              {/* OUTCOME PROJECTION */}
              {canCancel && outcome && (
                <div className="p-10 bg-amber-50 border border-amber-100 rounded-[32px] space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 text-amber-200/50 group-hover:scale-110 transition-transform">
                    <Undo2 size={100} />
                  </div>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-amber-600"><Undo2 size={16} /></div>
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-700">Projected Outcome</span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-black text-amber-900 tracking-tighter uppercase italic drop-shadow-sm">{outcome.label}</h3>
                    <p className="text-xs font-bold text-amber-700/60 uppercase tracking-[0.15em] mt-2">{outcome.desc}</p>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleCancel} 
                disabled={loading || !canCancel}
                className="w-full h-20 rounded-[24px] bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-[0.4em] transition-all shadow-2xl shadow-rose-200"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Trash2 className="mr-4" size={24} />}
                {loading ? "Broadcasting Void Packet..." : "Commit Void Sequence"}
              </Button>
            </div>
          )}

          {result && (
            <div className="mt-8 p-10 bg-[#0F172A] border-t border-slate-800 animate-in slide-in-from-bottom-8 duration-500">
               <div className="flex items-center justify-between mb-6">
                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">Server Response Output</p>
                 <Badge className="bg-slate-800 text-emerald-500 border border-emerald-500/20 text-[9px] font-mono px-4 py-1">VOID_TX_OK</Badge>
               </div>
               <pre className="text-emerald-400/80 font-mono text-xs leading-relaxed overflow-auto max-h-[400px] bg-white/5 p-6 rounded-2xl scrollbar-hide">
                 {JSON.stringify(result, null, 2)}
               </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ───────────────── ERP SUB-COMPONENTS ─────────────────

function ProjectionRow({ code, label, desc }: any) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="text-xs font-mono font-black text-rose-500 bg-rose-500/10 px-2 py-1 rounded-lg group-hover:bg-rose-500 group-hover:text-white transition-all">{code}</div>
      <div>
        <p className="text-[11px] font-black text-slate-300 uppercase tracking-wide">{label}</p>
        <p className="text-[10px] font-bold text-slate-500 uppercase italic opacity-60">{desc}</p>
      </div>
    </div>
  );
}

function DetailBox({ label, value, icon }: any) {
  return (
    <div className="p-6 bg-slate-50/50 border border-slate-50 rounded-[24px] shadow-sm hover:bg-white hover:border-slate-100 transition-all group">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2 group-hover:text-rose-500 transition-colors">
        {icon} {label}
      </p>
      <p className="text-sm font-black text-slate-800 uppercase tracking-tight truncate">{value}</p>
    </div>
  );
}