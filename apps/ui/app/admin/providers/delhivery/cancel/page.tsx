"use client";

import { useState } from "react";
import { 
  PackageX, Hash, Search, Loader2, CheckCircle2, 
  AlertTriangle, Lock, RefreshCcw, Info, Trash2,
  Undo2, MapPin, User, ArrowRight,
  PackageOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  // Business Logic: Determine if cancellation is allowed
  const isCancellable = (status: string) => {
    const s = status?.toLowerCase() || "";
    const allowed = ["manifested", "in transit", "pending", "scheduled"];
    return allowed.some(keyword => s.includes(keyword));
  };

  // Business Logic: Predicted outcome based on documentation
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
        cancellation: "true" // Required as string/true per docs
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
    <div className="max-w-6xl mx-auto space-y-8 p-6 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm">
          <PackageX size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Void Shipment</h1>
          <p className="text-slate-500 font-medium">Cancel live waybills via Delhivery API</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT: ACTIONS --- */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Waybill Identifier</Label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <Input 
                    value={awb}
                    onChange={(e) => setAwb(e.target.value)}
                    placeholder="Enter AWB Number"
                    disabled={isFetched && loading}
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-mono font-black text-slate-700"
                  />
                </div>
              </div>
              {!isFetched ? (
                <Button onClick={fetchDetails} disabled={loading || !awb} className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <Search size={18} className="mr-2" />}
                  Check Eligibility
                </Button>
              ) : (
                <Button onClick={() => { setIsFetched(false); setDetails(null); }} variant="outline" className="w-full h-14 rounded-2xl border-slate-200 font-bold">
                  <RefreshCcw size={16} className="mr-2" /> Clear Search
                </Button>
              )}
            </div>

            {isFetched && (
              <div className="pt-6 border-t border-slate-100 animate-in slide-in-from-top-4">
                <Button 
                  onClick={handleCancel} 
                  disabled={loading || !canCancel}
                  className={clsx(
                    "w-full h-16 rounded-2xl font-black text-lg shadow-lg transition-all",
                    canCancel ? "bg-rose-600 hover:bg-rose-700 shadow-rose-100" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  )}
                >
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <Trash2 size={20} className="mr-2" />}
                  Confirm Cancellation
                </Button>
              </div>
            )}
          </Card>

          {/* POLICY GUIDELINE */}
          <Card className="p-6 border-none shadow-lg bg-indigo-600 text-white rounded-[2rem]">
            <h4 className="text-xs font-black uppercase tracking-widest opacity-70 mb-3 flex items-center gap-2">
              <Info size={14} /> Cancellation Policy
            </h4>
            <div className="space-y-3 text-[11px] font-bold leading-relaxed">
               <p className="flex gap-2"><ArrowRight size={12} className="shrink-0"/> Manifested shipments stay UD (Undelivered).</p>
               <p className="flex gap-2"><ArrowRight size={12} className="shrink-0"/> Transit shipments trigger RT (Return to Origin).</p>
               <p className="flex gap-2"><ArrowRight size={12} className="shrink-0"/> Pickups trigger CN (Cancelled).</p>
            </div>
          </Card>
        </div>

        {/* --- RIGHT: SHIPMENT PREVIEW --- */}
        <div className="lg:col-span-7">
          {result ? (
            <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-white animate-in zoom-in-95">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-black">Request Processed</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">API Waybill: {awb}</p>
                </div>
              </div>
              <div className="bg-slate-900 rounded-3xl p-6">
                <pre className="text-emerald-400 font-mono text-[11px] overflow-auto max-h-[300px]">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </Card>
          ) : details ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <Card className={clsx(
                "p-8 border-none shadow-xl rounded-[2.5rem] transition-all duration-500",
                canCancel ? "bg-white" : "bg-slate-50"
              )}>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <Badge className={clsx("mb-2 border-none", canCancel ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600")}>
                      {canCancel ? "Eligible for Cancellation" : "Non-Cancellable State"}
                    </Badge>
                    <h2 className="text-2xl font-black text-slate-900">{details.status}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Order ID</p>
                    <p className="text-sm font-black text-slate-700">#{details.order_id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <DetailItem icon={<User size={16}/>} label="Consignee" value={details.consignee?.name} />
                  <DetailItem icon={<MapPin size={16}/>} label="City" value={details.consignee?.city} />
                </div>

                {canCancel ? (
                  <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl space-y-2">
                    <div className="flex items-center gap-2 text-amber-700 font-black text-[10px] uppercase tracking-widest">
                      <Undo2 size={14} /> Expected Outcome
                    </div>
                    <p className="text-lg font-black text-amber-900 leading-tight">{outcome?.label}</p>
                    <p className="text-xs font-medium text-amber-700/80">{outcome?.desc}</p>
                  </div>
                ) : (
                  <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex gap-4 items-center">
                    <Lock className="text-rose-600 shrink-0" size={24} />
                    <p className="text-xs font-bold text-rose-800 leading-relaxed">
                      This shipment has reached a terminal status. Cancellation is no longer supported by the carrier.
                    </p>
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <div className="h-[400px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8 opacity-40">
              <PackageOpen size={48} className="text-slate-300 mb-4" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Enter AWB to verify</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl">
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{label}</p>
        <p className="text-sm font-black text-slate-700">{value}</p>
      </div>
    </div>
  );
}