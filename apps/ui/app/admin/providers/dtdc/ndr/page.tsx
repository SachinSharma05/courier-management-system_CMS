'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, Search, Loader2, PackageSearch, 
  Truck, Calendar, Info, ArrowRight, 
  CheckCircle2, History, AlertCircle, Clock,
  XCircle, RotateCcw, MapPin
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { clsx } from 'clsx';
import { api } from '@/lib/api/axios';

// DTDC typically allows Re-attempt, Return to Origin, or Address Update
type DTDCAction = "RE_ATTEMPT" | "RTO" | "ADDRESS_UPDATE";

export default function DTDCNDRPage() {
  const [awb, setAwb] = useState("");
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<any>(null);
  const [action, setAction] = useState<DTDCAction | null>(null);
  const [result, setResult] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // DTDC operations typically process NDRs in morning/evening batches
  const isOptimalTime = new Date().getHours() <= 10 || new Date().getHours() >= 18;

  const checkEligibility = (act: DTDCAction) => {
    if (!shipment) return false;
    // DTDC eligibility is usually based on 'Undelivered' status
    const isUndelivered = shipment.status_code === "UD" || shipment.status?.toLowerCase().includes("failed");
    const attempts = shipment.attempt_count || 0;

    if (act === "RE_ATTEMPT") return isUndelivered && attempts < 3;
    if (act === "RTO") return isUndelivered;
    if (act === "ADDRESS_UPDATE") return isUndelivered;
    return false;
  };

  async function fetchShipmentDetails() {
    if (!awb) return;
    setLoading(true);
    setResult(null);
    try {
      // Endpoint for DTDC Shipment Status
      const { data } = await api.get(`/providers/dtdc/shipment`, { params: { waybill: awb } });
      setShipment(data);
    } catch (e) {
      alert("DTDC Shipment not found. Please check the AWB.");
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
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ShieldAlert className="text-blue-600" size={32} /> DTDC Action Center
          </h1>
          <p className="text-slate-500 font-medium mt-1">Resolution Hub for Failed Deliveries</p>
        </div>
        {isOptimalTime && (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-2 p-2 px-4 rounded-xl">
            <Clock size={14} /> High-Priority Processing Window Open
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT: CONTROLS --- */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">DTDC Consignment No.</Label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    value={awb}
                    onChange={(e) => { setAwb(e.target.value); setShipment(null); }}
                    placeholder="Enter Waybill..."
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold"
                  />
                </div>
              </div>
              
              {!shipment ? (
                <Button onClick={fetchShipmentDetails} disabled={!awb || loading} className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black transition-all">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <PackageSearch className="mr-2" size={18} />}
                  Find Consignment
                </Button>
              ) : (
                <div className="space-y-3 animate-in slide-in-from-top-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Action Required</Label>
                  <ActionToggle 
                    active={action === "RE_ATTEMPT"} 
                    disabled={!checkEligibility("RE_ATTEMPT")}
                    onClick={() => setAction("RE_ATTEMPT")}
                    title="Request Re-attempt"
                    icon={<RotateCcw size={18}/>}
                  />
                  <ActionToggle 
                    active={action === "ADDRESS_UPDATE"} 
                    disabled={!checkEligibility("ADDRESS_UPDATE")}
                    onClick={() => setAction("ADDRESS_UPDATE")}
                    title="Correct Address"
                    icon={<MapPin size={18}/>}
                  />
                  <ActionToggle 
                    active={action === "RTO"} 
                    disabled={!checkEligibility("RTO")}
                    onClick={() => setAction("RTO")}
                    title="Return to Origin"
                    icon={<XCircle size={18}/>}
                  />
                  
                  <Button 
                    onClick={() => setConfirmOpen(true)}
                    disabled={!action}
                    className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-black text-white font-black mt-4 shadow-xl"
                  >
                    Submit Instruction
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-blue-900 text-white rounded-[2rem] space-y-4">
              <div className="flex items-center gap-2 text-blue-300 font-black text-xs uppercase tracking-widest">
                <Info size={16} /> DTDC NDR Policy
              </div>
              <ul className="space-y-2 text-[11px] font-medium opacity-80">
                <li className="flex gap-2"><ArrowRight size={12} className="text-blue-300"/> Re-attempts limited to 3 cycles.</li>
                <li className="flex gap-2"><ArrowRight size={12} className="text-blue-300"/> Address corrections take 24-48hrs to sync.</li>
                <li className="flex gap-2"><ArrowRight size={12} className="text-blue-300"/> RTO requests are permanent and cannot be reversed.</li>
              </ul>
          </Card>
        </div>

        {/* --- RIGHT: STATUS --- */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-white animate-in zoom-in-95">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-black">Submission Successful</h2>
                  <p className="text-xs font-bold text-slate-400">DTDC Reference: {result.reference_id || 'Pending'}</p>
                </div>
              </div>
              <div className="bg-slate-950 rounded-3xl p-6 overflow-hidden">
                <pre className="text-blue-400 font-mono text-[11px]">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </Card>
          ) : shipment ? (
            <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white space-y-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 text-slate-50 -mr-4 -mt-4"><Truck size={120} /></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Badge className="bg-blue-50 text-blue-600 border-none mb-2">In NDR Queue</Badge>
                    <h2 className="text-3xl font-black text-slate-900 uppercase">{shipment.status}</h2>
                    <p className="text-slate-400 font-bold text-xs">Last Scanned: {shipment.last_location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Reason Code</p>
                    <p className="text-xl font-black text-blue-600">{shipment.reason_code || "N/A"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <DetailBox label="Delivery Attempts" value={`${shipment.attempt_count || 0} / 3`} />
                  <DetailBox label="Failure Reason" value={shipment.reason_description || "Recipient Not Available"} />
                </div>

                {!checkEligibility("RE_ATTEMPT") && (
                  <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-3xl flex gap-4">
                    <AlertCircle className="text-amber-600 shrink-0" size={24} />
                    <p className="text-xs font-bold text-amber-800">
                      Consignment has reached maximum re-attempt limit. Only RTO or manual branch pickup can be requested now.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12">
              <PackageSearch size={48} className="text-slate-200 mb-4" />
              <p className="text-sm font-black text-slate-300 uppercase tracking-widest">Validate DTDC AWB to proceed</p>
            </div>
          )}
        </div>
      </div>

      {/* --- CONFIRMATION --- */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="p-8 rounded-[3rem] w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Confirm Action</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">
              Sending <span className="text-blue-600 font-black">{action?.replace('_', ' ')}</span> instruction for {awb}. This action is logged and sent to the destination branch.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="ghost" onClick={() => setConfirmOpen(false)} className="rounded-xl font-bold">Cancel</Button>
              <Button onClick={executeAction} disabled={loading} className="rounded-xl bg-blue-600 text-white font-black">
                {loading ? "Syncing..." : "Submit to DTDC"} 
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// Sub-components kept identical but themed for DTDC Blue
function ActionToggle({ active, disabled, onClick, title, icon }: any) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all",
        disabled ? "opacity-40 grayscale cursor-not-allowed border-slate-100" :
        active ? "border-blue-600 bg-blue-50" : "border-slate-100 hover:border-slate-200 bg-white"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={clsx("p-2 rounded-lg", active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500")}>{icon}</div>
        <span className={clsx("font-black text-sm", active ? "text-blue-900" : "text-slate-600")}>{title}</span>
      </div>
      {active && <CheckCircle2 size={20} className="text-blue-600" />}
    </button>
  );
}

function DetailBox({ label, value }: any) {
  return (
    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-black text-slate-700 mt-1">{value}</p>
    </div>
  );
}