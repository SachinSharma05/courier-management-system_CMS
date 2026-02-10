"use client";

import { useState } from "react";
import { Calendar, Truck, Search, ShieldAlert, Clock, AlertCircle, CheckCircle2, PackageSearch,
  History, ArrowRight, Loader2, Terminal, Activity, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api/axios";
import clsx from "clsx";

// ───────────────── CORE BUSINESS LOGIC (PRESERVED) ─────────────────
const REATTEMPT_NSL = ["EOD-74", "EOD-15", "EOD-104", "EOD-43", "EOD-86", "EOD-11", "EOD-69", "EOD-6"];
const RESCHEDULE_NSL = ["EOD-777", "EOD-21"];

export default function NDRPage() {
  const [awb, setAwb] = useState("");
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<any>(null);
  const [action, setAction] = useState<"RE-ATTEMPT" | "PICKUP_RESCHEDULE" | null>(null);
  const [result, setResult] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isOptimalTime = new Date().getHours() >= 21;

  const checkEligibility = (act: string) => {
    if (!shipment) return false;
    const nsl = shipment.nsl_code;
    const attempts = shipment.attempt_count || 0;

    if (act === "RE-ATTEMPT") {
      return REATTEMPT_NSL.includes(nsl) && attempts >= 1 && attempts <= 2;
    }
    if (act === "PICKUP_RESCHEDULE") {
      return RESCHEDULE_NSL.includes(nsl) && attempts >= 1 && attempts <= 2;
    }
    return false;
  };

  async function fetchShipmentDetails() {
    if (!awb) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.get(`/providers/delhivery/shipment`, { params: { waybill: awb } });
      setShipment(data);
    } catch (e) {
      alert("Shipment details not found or invalid AWB.");
    } finally {
      setLoading(false);
    }
  }

  async function executeAction() {
    setLoading(true);
    try {
      const payload = { waybill: awb, act: action };
      const { data } = await api.post("/providers/delhivery/ndr", payload);
      setResult(data);
    } catch (e) {
      setResult({ success: false, message: "NDR API Error" });
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 bg-rose-600 flex items-center justify-center text-white rounded-2xl shadow-xl shadow-rose-100">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">NDR Action Center V2</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
              <Terminal size={12} className="text-rose-500" /> Mode: <span className="text-rose-600 font-bold">ASYNCHRONOUS_PATCHING</span> --STATUS: {isOptimalTime ? 'OPTIMAL' : 'TIME_RESTRICTED'}
            </p>
          </div>
        </div>
        {!isOptimalTime && (
          <div className="flex items-center gap-4 px-5 py-3 bg-amber-50 border border-amber-100 rounded-2xl">
             <Clock size={18} className="text-amber-600" />
             <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">Recommended: Execute after 21:00 HRS</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ───────────────── LEFT: PARAMETER INJECTION ───────────────── */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden transition-all">
             <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
                <div className="p-2.5 bg-white border border-slate-100 text-slate-900 rounded-xl shadow-sm"><Activity size={18} /></div>
                <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-800">Sequence Validation</h2>
             </div>
             
             <div className="p-8 space-y-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Validate Waybill</Label>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                    <Input 
                      value={awb}
                      onChange={(e) => { setAwb(e.target.value); setShipment(null); }}
                      placeholder="SCAN OR ENTER AWB"
                      className="pl-12 h-14 rounded-2xl border-none bg-slate-50 focus-visible:ring-2 focus-visible:ring-rose-500 font-mono font-bold text-sm uppercase transition-all shadow-inner"
                    />
                  </div>
                </div>

                {!shipment ? (
                  <Button onClick={fetchShipmentDetails} disabled={!awb || loading} className="w-full h-14 rounded-2xl bg-[#0F172A] text-xs font-bold uppercase tracking-widest text-white hover:bg-black transition-all shadow-xl shadow-slate-100">
                    {loading ? <Loader2 className="animate-spin mr-3" size={18} /> : <PackageSearch className="mr-3" size={18} />}
                    Initiate Fetch
                  </Button>
                ) : (
                  <div className="space-y-4 animate-in slide-in-from-top-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Instruction Set</Label>
                    <ActionToggle 
                      active={action === "RE-ATTEMPT"} 
                      disabled={!checkEligibility("RE-ATTEMPT")}
                      onClick={() => setAction("RE-ATTEMPT")}
                      title="RE-ATTEMPT LOGISTICS"
                      icon={<Truck size={18}/>}
                    />
                    <ActionToggle 
                      active={action === "PICKUP_RESCHEDULE"} 
                      disabled={!checkEligibility("PICKUP_RESCHEDULE")}
                      onClick={() => setAction("PICKUP_RESCHEDULE")}
                      title="RESCHEDULE SEQUENCE"
                      icon={<Calendar size={18}/>}
                    />
                    
                    <Button 
                      onClick={() => setConfirmOpen(true)}
                      disabled={!action}
                      className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold uppercase tracking-[0.2em] text-white mt-4 shadow-2xl shadow-indigo-100 transition-all"
                    >
                      Execute NDR Instruction
                    </Button>
                  </div>
                )}
             </div>
          </div>

          <div className="bg-[#0F172A] rounded-3xl p-8 border border-slate-800 space-y-6">
             <div className="flex items-center gap-3 text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">
                <Zap size={16} /> Protocol Constraints
             </div>
             <ul className="space-y-4">
                {[
                  "Max 2 attempts per sequence.",
                  "Async UPL-ID generation.",
                  "NSL parity check required."
                ].map((text, i) => (
                  <li key={i} className="flex gap-4 text-xs font-bold text-slate-400 uppercase tracking-tight leading-relaxed">
                    <ArrowRight size={14} className="text-slate-600 shrink-0 mt-0.5"/> {text}
                  </li>
                ))}
             </ul>
          </div>
        </div>

        {/* ───────────────── RIGHT: RESPONSE & TELEMETRY ───────────────── */}
        <div className="lg:col-span-8 space-y-8">
          {result ? (
            <div className="bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-100">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Request Accepted</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">UPL_ID_GENERATED // ASYNC_NODE_PENDING</p>
                  </div>
                </div>
                <Badge className="bg-[#0F172A] text-white border-none rounded-xl px-4 py-2 text-[10px] font-black tracking-widest">HTTP 202</Badge>
              </div>
              <div className="bg-black/95 p-8">
                <pre className="text-emerald-400/90 font-mono text-xs leading-relaxed overflow-auto max-h-[400px] p-4 bg-white/5 rounded-xl">{JSON.stringify(result, null, 2)}</pre>
              </div>
              <div className="p-6 bg-slate-50 flex justify-end px-10">
                <Button variant="outline" className="h-12 rounded-2xl font-bold text-[10px] uppercase tracking-widest border-slate-200 px-8 transition-all hover:bg-white">
                  <History size={16} className="mr-3" /> Monitor UPL Status
                </Button>
              </div>
            </div>
          ) : shipment ? (
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm relative overflow-hidden transition-all duration-700">
              <div className="absolute top-0 right-0 p-12 text-slate-50/50 -mr-10 -mt-10 pointer-events-none transform rotate-12">
                <Truck size={240} strokeWidth={1} />
              </div>
              
              <div className="p-10 relative z-10 space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div>
                    <Badge className="bg-rose-600 text-white border-none rounded-xl px-4 py-1.5 text-[10px] font-black tracking-widest mb-4 shadow-lg shadow-rose-100">EXCEPTION STATE: NDR</Badge>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic drop-shadow-sm">{shipment.status}</h2>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl min-w-[160px] shadow-inner text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">System NSL Code</p>
                    <p className="text-2xl font-mono font-black text-indigo-600 tracking-wider">{shipment.nsl_code || "NULL"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DetailBox label="Attempt Counter" value={`${shipment.attempt_count} / 2`} color={shipment.attempt_count >= 2 ? "text-rose-600" : "text-emerald-600"} />
                  <DetailBox label="Telemetry Remark" value={shipment.latest_remark || "NO_REMARKS_IN_SEQUENCE"} color="text-slate-600" />
                </div>

                {!checkEligibility("RE-ATTEMPT") && !checkEligibility("PICKUP_RESCHEDULE") && (
                  <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl flex items-start gap-6 animate-in shake-1">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-rose-600"><AlertCircle size={28} /></div>
                    <div>
                      <p className="text-xs font-black text-rose-900 uppercase tracking-[0.2em] mb-2">Ineligible Sequence</p>
                      <p className="text-sm font-bold text-rose-700/70 leading-relaxed uppercase tracking-tight">
                        Constraint Violation: NSL code mismatch or attempt limit exceeded (Max 2). Instruction rejected.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[550px] border-2 border-dashed border-slate-100 bg-slate-50/20 rounded-[40px] flex flex-col items-center justify-center text-center p-16 transition-all">
              <div className="w-24 h-24 bg-white border border-slate-50 rounded-3xl flex items-center justify-center text-slate-100 shadow-xl mb-8 transform -rotate-6">
                <PackageSearch size={48} />
              </div>
              <p className="text-xs font-black text-slate-300 uppercase tracking-[0.4em]">Awaiting Validation Stream</p>
            </div>
          )}
        </div>
      </div>

      {/* ───────────────── MODAL: EXECUTION CONFIRMATION ───────────────── */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="bg-white border border-slate-100 rounded-[32px] w-full max-w-md shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center gap-4">
               <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600"><Zap size={20} /></div>
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Confirm NDR Injection</h3>
            </div>
            <div className="p-10 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">You are triggering <span className="text-indigo-600">{action}</span> for:</p>
              <span className="text-slate-900 text-3xl font-mono font-black tracking-wider bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 inline-block">{awb}</span>
            </div>
            <div className="p-8 bg-slate-50/50 flex gap-4">
              <Button variant="ghost" onClick={() => setConfirmOpen(false)} className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600">
                Abort Mission
              </Button>
              <Button 
                onClick={executeAction} 
                disabled={loading}
                className="flex-1 h-14 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
              >
                {loading ? "Patching..." : "Commit Changes"} 
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────── ERP SUB-COMPONENTS ─────────────────

function ActionToggle({ active, disabled, onClick, title, icon }: { active: boolean, disabled: boolean, onClick: () => void, title: string, icon: React.ReactNode }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "w-full p-6 rounded-2xl flex items-center justify-between border-2 transition-all text-left",
        disabled ? "opacity-30 grayscale cursor-not-allowed border-slate-100 bg-slate-50" :
        active ? "border-indigo-500 bg-indigo-50/50 shadow-inner" : "border-slate-50 hover:border-slate-200 bg-white shadow-sm"
      )}
    >
      <div className="flex items-center gap-5">
        <div className={clsx("p-3 rounded-xl transition-all shadow-sm", active ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400")}>{icon}</div>
        <span className={clsx("font-black text-[10px] uppercase tracking-[0.2em]", active ? "text-indigo-900" : "text-slate-500")}>{title}</span>
      </div>
      {active && <CheckCircle2 size={20} className="text-indigo-600" />}
    </button>
  );
}

function DetailBox({ label, value, color = "text-slate-700" }: { label: string, value: string, color: string }) {
  return (
    <div className="p-6 bg-slate-50/30 border border-slate-50 rounded-3xl shadow-sm group hover:bg-white hover:border-slate-100 transition-all">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-indigo-500 transition-colors">{label}</p>
      <p className={clsx("text-sm font-black uppercase tracking-tight truncate", color)}>{value}</p>
    </div>
  );
}