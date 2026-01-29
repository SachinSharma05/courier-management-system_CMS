'use client';

import React, { useState } from 'react';
import { 
  PackageX, Hash, Loader2, Search, RefreshCcw, 
  Trash2, Info, ArrowRight, CheckCircle2, 
  User, MapPin, Lock, Undo2, AlertTriangle,
  Ban
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { clsx } from 'clsx';

export default function CancelDTDCShipment() {
  const [awb, setAwb] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const [result, setResult] = useState<any>(null);

  // DTDC Logic: Cancellation is generally allowed until the shipment is 'Out for Delivery'
  const isCancellable = (status: string) => {
    const s = status?.toLowerCase() || "";
    const forbidden = ["delivered", "out for delivery", "returned", "rto"];
    return !forbidden.some(keyword => s.includes(keyword));
  };

  // DTDC Outcome Logic
  const getOutcome = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("booked") || s.includes("manifested")) 
        return { label: "Void Consignment", desc: "The booking will be invalidated and removed from current manifest." };
    if (s.includes("in transit")) 
        return { label: "Interception Request", desc: "A request will be sent to the current hub to halt and return the parcel." };
    return { label: "Standard Cancellation", desc: "Shipment will be marked as cancelled in the tracking system." };
  };

  async function fetchDetails() {
    if (!awb) return;
    setLoading(true);
    setResult(null);
    try {
      // API call to DTDC tracking/details endpoint
      const { data } = await api.get('/providers/dtdc/shipment', { params: { waybill: awb } });
      setDetails(data);
      setIsFetched(true);
    } catch (e) {
      alert("DTDC Consignment not found.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    setLoading(true);
    try {
      const payload = {
        consignment_no: awb,
        reason: "Customer Requested Cancellation" 
      };
      const res = await api.post("/providers/dtdc/cancel", payload);
      setResult(res.data);
    } catch (e) {
      setResult({ success: false, message: "DTDC Cancellation Failed" });
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
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
          <Ban size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Void Consignment</h1>
          <p className="text-slate-500 font-medium">Manage DTDC shipment revocations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT: ACTIONS --- */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Consignment Number</Label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
                  <Input 
                    value={awb}
                    onChange={(e) => setAwb(e.target.value)}
                    placeholder="Ex: D12345678"
                    disabled={isFetched && loading}
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-mono font-black text-slate-700"
                  />
                </div>
              </div>
              {!isFetched ? (
                <Button onClick={fetchDetails} disabled={loading || !awb} className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black transition-all">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <Search size={18} className="mr-2" />}
                  Verify Shipment
                </Button>
              ) : (
                <Button onClick={() => { setIsFetched(false); setDetails(null); }} variant="outline" className="w-full h-14 rounded-2xl border-slate-200 font-bold">
                  <RefreshCcw size={16} className="mr-2" /> New Search
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
                    canCancel ? "bg-slate-900 hover:bg-black shadow-slate-200" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  )}
                >
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <PackageX size={20} className="mr-2" />}
                  Void Shipment
                </Button>
              </div>
            )}
          </Card>

          {/* DTDC SPECIFIC POLICY */}
          <Card className="p-6 border-none shadow-lg bg-blue-900 text-white rounded-[2rem]">
            <h4 className="text-xs font-black uppercase tracking-widest opacity-70 mb-3 flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-400" /> DTDC Protocol
            </h4>
            <div className="space-y-3 text-[11px] font-bold leading-relaxed opacity-90">
               <p className="flex gap-2"><ArrowRight size={12} className="shrink-0 text-blue-400"/> Booked shipments can be voided instantly.</p>
               <p className="flex gap-2"><ArrowRight size={12} className="shrink-0 text-blue-400"/> In-transit items require Hub Interception.</p>
               <p className="flex gap-2"><ArrowRight size={12} className="shrink-0 text-blue-400"/> Charges may apply for mid-transit returns.</p>
            </div>
          </Card>
        </div>

        {/* --- RIGHT: PREVIEW --- */}
        <div className="lg:col-span-7">
          {result ? (
            <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-white animate-in zoom-in-95">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-black">Cancellation Requested</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DTDC ID: {awb}</p>
                </div>
              </div>
              <div className="bg-slate-950 rounded-3xl p-6">
                <pre className="text-blue-400 font-mono text-[11px] overflow-auto max-h-[300px]">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </Card>
          ) : details ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <Card className={clsx(
                "p-8 border-none shadow-xl rounded-[2.5rem] transition-all duration-500",
                canCancel ? "bg-white" : "bg-slate-50 border border-slate-200"
              )}>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <Badge className={clsx("mb-2 border-none", canCancel ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500")}>
                      {canCancel ? "Actionable Status" : "Locked / Terminal Status"}
                    </Badge>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{details.status}</h2>
                    <p className="text-xs font-bold text-slate-400 mt-1">Origin: {details.origin_city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Service Type</p>
                    <p className="text-sm font-black text-blue-600">{details.service_type || "Express"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <DetailItem icon={<User size={16}/>} label="Receiver" value={details.receiver_name} />
                  <DetailItem icon={<MapPin size={16}/>} label="Destination" value={details.destination_city} />
                </div>

                {canCancel ? (
                  <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl space-y-2">
                    <div className="flex items-center gap-2 text-blue-700 font-black text-[10px] uppercase tracking-widest">
                      <Undo2 size={14} /> Expected DTDC Action
                    </div>
                    <p className="text-lg font-black text-blue-900 leading-tight">{outcome?.label}</p>
                    <p className="text-xs font-medium text-blue-700/80">{outcome?.desc}</p>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-100 border border-slate-200 rounded-3xl flex gap-4 items-center">
                    <Lock className="text-slate-400 shrink-0" size={24} />
                    <p className="text-xs font-bold text-slate-500 leading-relaxed">
                      This consignment is either delivered or out for delivery. Digital cancellation is no longer possible through the API.
                    </p>
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <div className="h-[400px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8 opacity-40">
              <PackageX size={48} className="text-slate-300 mb-4" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Awaiting DTDC Waybill</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100/50 rounded-2xl">
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm border border-slate-100">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{label}</p>
        <p className="text-sm font-black text-slate-700">{value}</p>
      </div>
    </div>
  );
}