"use client";

import { useState, useEffect } from "react";
import {
  RefreshCw, Calendar, Truck, Search, ShieldAlert, X,
  Clock, AlertCircle, Info, CheckCircle2, PackageSearch,
  History, ArrowRight, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api/axios";
import clsx from "clsx";

// Allowed NSL codes per documentation
const REATTEMPT_NSL = ["EOD-74", "EOD-15", "EOD-104", "EOD-43", "EOD-86", "EOD-11", "EOD-69", "EOD-6"];
const RESCHEDULE_NSL = ["EOD-777", "EOD-21"];

export default function NDRPage() {
  const [awb, setAwb] = useState("");
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<any>(null); // Fetched data
  const [action, setAction] = useState<"RE-ATTEMPT" | "PICKUP_RESCHEDULE" | null>(null);
  const [result, setResult] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Logic: Is it after 9 PM? (Recommended per docs)
  const isOptimalTime = new Date().getHours() >= 21;

  // Logic: Eligibility Checks
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
      // Fetching current status and NSL code
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
      const payload = { 
        waybill: awb, 
        act: action // RE-ATTEMPT or PICKUP_RESCHEDULE
      };
      const { data } = await api.post("/providers/delhivery/ndr", payload);
      setResult(data); // This provides the UPL ID
    } catch (e) {
      setResult({ success: false, message: "NDR API Error" });
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ShieldAlert className="text-rose-600" size={32} /> NDR Action Center
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage Undelivered Shipments (Asynchronous API)</p>
        </div>
        {!isOptimalTime && (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 gap-2 p-2 px-4 rounded-xl">
            <Clock size={14} /> Recommended: Apply after 9:00 PM
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT: SEARCH & ACTIONS --- */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Validate Waybill</Label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    value={awb}
                    onChange={(e) => { setAwb(e.target.value); setShipment(null); }}
                    placeholder="Enter AWB Number..."
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-mono font-bold"
                  />
                </div>
              </div>
              
              {!shipment ? (
                <Button onClick={fetchShipmentDetails} disabled={!awb || loading} className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <PackageSearch className="mr-2" size={18} />}
                  Fetch NDR Details
                </Button>
              ) : (
                <div className="space-y-3 animate-in slide-in-from-top-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Instruction</Label>
                  <ActionToggle 
                    active={action === "RE-ATTEMPT"} 
                    disabled={!checkEligibility("RE-ATTEMPT")}
                    onClick={() => setAction("RE-ATTEMPT")}
                    title="RE-ATTEMPT"
                    icon={<Truck size={18}/>}
                  />
                  <ActionToggle 
                    active={action === "PICKUP_RESCHEDULE"} 
                    disabled={!checkEligibility("PICKUP_RESCHEDULE")}
                    onClick={() => setAction("PICKUP_RESCHEDULE")}
                    title="PICKUP_RESCHEDULE"
                    icon={<Calendar size={18}/>}
                  />
                  
                  <Button 
                    onClick={() => setConfirmOpen(true)}
                    disabled={!action}
                    className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black mt-4 shadow-lg shadow-indigo-100"
                  >
                    Post NDR Instruction
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* DOCUMENTATION SNIPPET */}
          <Card className="p-6 bg-slate-900 text-white rounded-[2rem] space-y-4">
             <div className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-widest">
                <Info size={16} /> API Constraints
             </div>
             <ul className="space-y-2 text-[11px] font-medium opacity-80">
                <li className="flex gap-2"><ArrowRight size={12} className="text-indigo-400"/> Max 2 attempts allowed per AWB.</li>
                <li className="flex gap-2"><ArrowRight size={12} className="text-indigo-400"/> Async API: Returns UPL ID for tracking.</li>
                <li className="flex gap-2"><ArrowRight size={12} className="text-indigo-400"/> Check NSL code compatibility before POST.</li>
             </ul>
          </Card>
        </div>

        {/* --- RIGHT: LIVE STATUS & RESPONSE --- */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-white animate-in zoom-in-95">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-black">Request Accepted</h2>
                  <p className="text-xs font-bold text-slate-400">UPL ID generated for asynchronous processing</p>
                </div>
              </div>
              <div className="bg-slate-950 rounded-3xl p-6 overflow-hidden">
                <pre className="text-emerald-400 font-mono text-[11px]">{JSON.stringify(result, null, 2)}</pre>
              </div>
              <Button variant="outline" className="w-full mt-6 rounded-xl font-bold border-slate-200">
                <History size={16} className="mr-2" /> Check UPL Status
              </Button>
            </Card>
          ) : shipment ? (
            <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white space-y-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 text-slate-50 -mr-4 -mt-4"><Truck size={120} /></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Badge className="bg-rose-100 text-rose-600 border-none mb-2">NDR Pending</Badge>
                    <h2 className="text-3xl font-black text-slate-900">{shipment.status}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase">NSL Code</p>
                    <p className="text-xl font-black text-indigo-600">{shipment.nsl_code || "N/A"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <DetailBox label="Attempts" value={`${shipment.attempt_count}/2`} />
                  <DetailBox label="Latest Remark" value={shipment.latest_remark || "No remarks found"} />
                </div>

                {!checkEligibility("RE-ATTEMPT") && !checkEligibility("PICKUP_RESCHEDULE") && (
                  <div className="mt-8 p-6 bg-rose-50 border border-rose-100 rounded-3xl flex gap-4">
                    <AlertCircle className="text-rose-600 shrink-0" size={24} />
                    <p className="text-xs font-bold text-rose-800">
                      This shipment is ineligible for NDR actions. This usually happens if the NSL code is not in the allowed list or attempts have exceeded the limit (Max 2).
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 opacity-40">
              <PackageSearch size={48} className="text-slate-300 mb-4" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Awaiting Waybill Validation</p>
            </div>
          )}
        </div>
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Confirm NDR Post</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">
              You are sending a <span className="text-indigo-600 font-black">{action}</span> instruction for waybill {awb}.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="ghost" onClick={() => setConfirmOpen(false)} className="rounded-xl font-bold">Cancel</Button>
              <Button 
                onClick={executeAction} 
                disabled={loading} // Disable the button while loading
                className="rounded-xl bg-indigo-600 text-white font-black"
              >
                {loading ? "Processing..." : "Confirm"} 
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function ActionToggle({ active, disabled, onClick, title, icon }: any) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all",
        disabled ? "opacity-40 grayscale cursor-not-allowed border-slate-100" :
        active ? "border-indigo-600 bg-indigo-50 shadow-sm" : "border-slate-100 hover:border-slate-200 bg-white"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={clsx("p-2 rounded-lg", active ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500")}>{icon}</div>
        <span className={clsx("font-black text-sm", active ? "text-indigo-900" : "text-slate-600")}>{title}</span>
      </div>
      {active && <CheckCircle2 size={20} className="text-indigo-600" />}
    </button>
  );
}

function DetailBox({ label, value }: any) {
  return (
    <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-black text-slate-700 mt-1">{value}</p>
    </div>
  );
}