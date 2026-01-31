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

export default function CancelDTDCShipment() {
  // 1. Core Logic (Preserved from original)
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

  // 2. Handlers
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
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* ───────────────── ERP HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-rose-600 flex items-center justify-center text-white rounded-sm shadow-md">
            <Ban size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Terminal_ID_Revocation</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
              <Terminal size={12} className="text-rose-500" /> SYSTEM: DTDC_VOID_PROTOCOL // STATUS: AUTHORIZED
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ───────────────── LEFT: COMMAND WORKSPACE ───────────────── */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 border border-slate-200 shadow-sm rounded-sm bg-white space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Activity size={14} className="text-blue-600" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Query_Parameters</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Consignment_Number</Label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <Input 
                    value={awb}
                    onChange={(e) => setAwb(e.target.value)}
                    placeholder="EX: D12345678"
                    disabled={isFetched && loading}
                    className="pl-12 h-14 rounded-sm border-slate-200 bg-slate-50/50 font-mono font-bold text-xs uppercase"
                  />
                </div>
              </div>

              {!isFetched ? (
                <Button onClick={fetchDetails} disabled={loading || !awb} className="w-full h-16 rounded-sm bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-100">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <Search size={18} className="mr-2" />}
                  Verify_Node_Status
                </Button>
              ) : (
                <div className="space-y-4 pt-2">
                    <Button onClick={() => { setIsFetched(false); setDetails(null); }} variant="outline" className="w-full h-12 rounded-sm border-slate-200 font-black text-[10px] uppercase tracking-widest bg-slate-50">
                        <RefreshCcw size={14} className="mr-2" /> New_Search_Session
                    </Button>
                    
                    <Button 
                      onClick={handleCancel} 
                      disabled={loading || !canCancel}
                      className={clsx(
                        "w-full h-16 rounded-sm font-black text-[11px] uppercase tracking-[0.3em] shadow-xl transition-all",
                        canCancel ? "bg-slate-900 hover:bg-black text-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      )}
                    >
                      {loading ? <Loader2 className="animate-spin mr-2" /> : <PackageX size={18} className="mr-2" />}
                      Execute_Termination
                    </Button>
                </div>
              )}
            </div>
          </Card>

          <div className="p-6 bg-slate-900 rounded-sm border border-slate-800 text-white relative overflow-hidden">
             <Database size={80} className="absolute -right-4 -bottom-4 opacity-[0.05] pointer-events-none" />
             <div className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase mb-3 tracking-widest">
               <AlertTriangle size={14} /> DTDC_POLICY_ENGINE
             </div>
             <ul className="space-y-3 text-[9px] font-bold opacity-70 uppercase tracking-tight leading-relaxed">
                <li className="flex gap-2"><ArrowRight size={10} className="shrink-0 text-rose-500"/> Booked units void immediately at source.</li>
                <li className="flex gap-2"><ArrowRight size={10} className="shrink-0 text-rose-500"/> In-transit node requires signal 0x04 (Interception).</li>
                <li className="flex gap-2"><ArrowRight size={10} className="shrink-0 text-rose-500"/> Out-for-delivery status locks termination.</li>
             </ul>
          </div>
        </div>

        {/* ───────────────── RIGHT: TELEMETRY VIEW ───────────────── */}
        <div className="lg:col-span-8">
          {result ? (
            <Card className="p-8 border border-slate-200 shadow-sm rounded-sm bg-white animate-in zoom-in-95">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-sm flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest">Signal_Broadcasting_Confirmed</h2>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Consignment_Ref: {awb}</p>
                </div>
              </div>
              <div className="bg-slate-950 rounded-sm p-6 overflow-hidden">
                <pre className="text-blue-400 font-mono text-[11px] leading-relaxed">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </Card>
          ) : details ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <Card className="border border-slate-200 shadow-sm rounded-sm bg-white overflow-hidden relative">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <Badge className={clsx("rounded-sm font-black text-[9px] px-2 py-0.5 border-none", canCancel ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500")}>
                        {canCancel ? "NODE_ACTIONABLE" : "NODE_LOCKED"}
                       </Badge>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">NODE_UID: {awb}</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{details.status}</h2>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Origin_Hub: {details.origin_city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service_Tier</p>
                    <p className="text-sm font-black text-blue-600 uppercase tracking-tighter">{details.service_type || "EXPRESS"}</p>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <DetailBox label="Receiver_Entity" value={details.receiver_name} icon={<User size={14}/>} />
                     <DetailBox label="Destination_Node" value={details.destination_city} icon={<MapPin size={14}/>} />
                  </div>

                  {canCancel ? (
                    <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-sm">
                      <div className="flex items-center gap-2 text-blue-700 font-black text-[9px] uppercase tracking-[0.2em] mb-2">
                        <Undo2 size={14} /> Expected_Recovery_Protocol
                      </div>
                      <p className="text-lg font-black text-blue-900 tracking-tighter">{outcome?.label}</p>
                      <p className="text-[10px] font-bold text-blue-700/70 uppercase tracking-tight mt-1 leading-relaxed max-w-md">{outcome?.desc}</p>
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm flex gap-4 items-center">
                      <Lock className="text-slate-400 shrink-0" size={20} />
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                        Security_Lock: Consignment has transitioned to out-for-delivery or delivered. Termination protocol aborted by remote carrier.
                      </p>
                    </div>
                  )}
                </div>
                
                <Cpu size={200} className="absolute -bottom-16 -right-16 opacity-[0.02] text-slate-900 pointer-events-none" />
              </Card>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center text-center p-12 bg-slate-50/50">
              <div className="w-20 h-20 bg-white border border-slate-200 rounded-sm shadow-sm flex items-center justify-center text-slate-200 mb-6">
                <PackageX size={40} />
              </div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Awaiting_Consignment_ID</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-xs mt-3 leading-relaxed">
                Synchronize with DTDC servers to identify active shipments available for revocation or interception.
              </p>
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
    <div className="p-4 bg-slate-50 border border-slate-100 rounded-sm flex items-center gap-4">
      <div className="p-2 bg-white border border-slate-100 rounded-sm text-blue-600 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{value}</p>
      </div>
    </div>
  );
}