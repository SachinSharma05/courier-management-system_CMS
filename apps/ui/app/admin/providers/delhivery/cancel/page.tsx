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
      const payload = {
        waybill: awb,
        cancellation: "true"
      };
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
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* ───────────────── ERP HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-rose-600 flex items-center justify-center text-white rounded-sm shadow-md">
            <PackageX size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter text-rose-600">Void_Shipment_Module</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
              <Terminal size={12} className="text-rose-500" /> Provider: DELHI-NET // AUTH_KEY: LIVE_PROD
            </p>
          </div>
        </div>
        {isFetched && (
          <Button 
            variant="outline" 
            onClick={() => { setIsFetched(false); setDetails(null); }} 
            className="rounded-sm font-black text-[10px] uppercase tracking-widest border-slate-200 h-10 hover:bg-slate-50"
          >
            <RefreshCcw size={14} className="mr-2" /> RE_INITIALIZE_VALIDATION
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ───────────────── LEFT: PROTOCOL MONITOR ───────────────── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
             <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <ShieldAlert size={14} className="text-rose-500" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Safety_Protocols</h2>
             </div>
             
             <div className="p-5 space-y-4">
               <div className="p-4 bg-slate-900 rounded-sm border-l-2 border-rose-500">
                 <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-2">Outcome_Projection_Matrix</p>
                 <div className="space-y-3">
                    <ProjectionRow code="UD" label="Manifested Shipments" desc="Status: Manifested / Type: UD" />
                    <ProjectionRow code="RT" label="Transit/Pending" desc="Status: In Transit / Type: RT" />
                    <ProjectionRow code="CN" label="Scheduled Pickups" desc="Status: Cancelled / Type: CN" />
                 </div>
               </div>

               <div className="p-4 bg-rose-50 border border-rose-100 rounded-sm">
                  <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-2">Irreversible_Action</p>
                  <p className="text-[10px] font-bold text-slate-600 uppercase leading-tight tracking-tight">
                    Triggering the void sequence will broadcast a cancellation packet to the Delhivery master node. This cannot be undone once committed.
                  </p>
               </div>
             </div>
          </div>

          {isFetched && (
            <div className={clsx(
              "p-6 border rounded-sm shadow-sm transition-all duration-500",
              canCancel ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"
            )}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">State_Analysis</p>
                  <h2 className="text-2xl font-mono font-black tracking-tighter uppercase italic">{details.status}</h2>
                </div>
                {canCancel ? <CheckCircle2 size={24} /> : <Lock size={24} />}
              </div>
              {!canCancel && (
                <div className="mt-4 pt-4 border-t border-white/10 text-[9px] font-bold uppercase tracking-tight opacity-60 leading-relaxed">
                  CRITICAL: Sequence has reached a terminal state (Delivered/RTO). Cancellation packets rejected by provider node.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ───────────────── RIGHT: VOID WORKSPACE ───────────────── */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-sm shadow-sm relative overflow-hidden">
          {!isFetched ? (
             <div className="py-24 text-center space-y-8 bg-slate-50/30">
                <div className="w-20 h-20 bg-white border border-slate-100 rounded-sm flex items-center justify-center mx-auto text-slate-200 shadow-sm animate-pulse">
                  <Hash size={40} />
                </div>
                <div className="max-w-xs mx-auto space-y-4 px-6">
                  <div className="space-y-2 text-center">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sequence_Identifier</Label>
                    <Input 
                      value={awb} 
                      onChange={(e) => setAwb(e.target.value)}
                      placeholder="ENTER 14-DIGIT AWB"
                      className="h-14 rounded-sm border-slate-200 bg-white text-center font-mono text-xl font-black text-slate-700 focus:border-rose-500 transition-all uppercase placeholder:opacity-20"
                    />
                  </div>
                  <Button onClick={fetchDetails} disabled={loading || !awb} className="w-full h-12 rounded-sm bg-slate-900 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-black transition-all">
                    {loading ? <Loader2 className="animate-spin" /> : "EXECUTE_PRE_CANCELLATION_CHECK"}
                  </Button>
                </div>
             </div>
          ) : (
            <div className={clsx("p-8 space-y-10 transition-all duration-500", !canCancel && "opacity-40 grayscale pointer-events-none")}>
              
              {!canCancel && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/5 backdrop-blur-[2px]">
                  <div className="bg-white p-5 border border-slate-200 rounded-sm shadow-2xl flex flex-col items-center gap-3">
                    <Lock className="text-slate-400" size={24} />
                    <p className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em]">Module_Locked</p>
                  </div>
                </div>
              )}

              {/* SHIPMENT PREVIEW */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Activity size={14} className="text-rose-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Sequence_Telemetry</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailBox label="Target_Consignee" value={details.consignee?.name} icon={<User size={14}/>} />
                  <DetailBox label="Target_Zone" value={details.consignee?.city} icon={<MapPin size={14}/>} />
                  <DetailBox label="Order_Reference" value={`#${details.order_id}`} icon={<Hash size={14}/>} />
                  <DetailBox label="Current_Status" value={details.status} icon={<Zap size={14}/>} />
                </div>
              </div>

              {/* OUTCOME PROJECTION */}
              {canCancel && outcome && (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <Undo2 size={14} className="text-amber-600" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Projected_Outcome</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-amber-900 tracking-tighter uppercase italic">{outcome.label}</h3>
                    <p className="text-[10px] font-bold text-amber-700/70 uppercase tracking-widest mt-1">{outcome.desc}</p>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleCancel} 
                disabled={loading || !canCancel}
                className="w-full h-16 rounded-sm bg-rose-600 hover:bg-rose-700 text-white font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-rose-100"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Trash2 className="mr-3" size={18} />}
                {loading ? "BROADCASTING_VOID_PACKET..." : "COMMIT_VOID_SEQUENCE"}
              </Button>
            </div>
          )}

          {result && (
            <div className="mt-8 p-6 bg-slate-900 border-t border-slate-800 animate-in slide-in-from-bottom-4 duration-300">
               <div className="flex items-center justify-between mb-4">
                 <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">Server_Response_Output</p>
                 <Badge className="bg-slate-800 text-slate-400 border border-slate-700 text-[8px] font-mono">VOID_TX_OK</Badge>
               </div>
               <pre className="text-emerald-400 font-mono text-[10px] leading-relaxed overflow-auto max-h-[300px] scrollbar-hide">
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
    <div className="flex items-start gap-3">
      <div className="text-[10px] font-mono font-black text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded-sm">{code}</div>
      <div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-tight">{label}</p>
        <p className="text-[9px] font-bold text-slate-500 uppercase italic">{desc}</p>
      </div>
    </div>
  );
}

function DetailBox({ label, value, icon }: any) {
  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
        {icon} {label}
      </p>
      <p className="text-xs font-black text-slate-700 uppercase tracking-tight truncate">{value}</p>
    </div>
  );
}