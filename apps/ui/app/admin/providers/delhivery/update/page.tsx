"use client";

import { useState } from "react";
import { 
  Edit3, User, Banknote, 
  RefreshCw, Loader2, CheckCircle2, Search, 
  Boxes, AlertTriangle, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api/axios";
import clsx from "clsx";

export default function UpdateDelhiveryShipment() {
  const [awb, setAwb] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [currentStatus, setCurrentStatus] = useState("");
  
  const [form, setForm] = useState({
    name: "", phone: "", add: "", pt: "", 
    cod_amount: "", products_desc: "",
    weight: "", height: "", width: "", length: ""
  });

  // Business Logic: Determine if editing is allowed based on documentation
  const isEditableStatus = (status: string) => {
    const s = status?.toLowerCase() || "";
    const allowed = ["manifested", "in transit", "pending", "scheduled"];
    const terminal = ["delivered", "dto", "rto", "lost", "closed"];
    
    return allowed.some(keyword => s.includes(keyword)) && 
           !terminal.some(keyword => s.includes(keyword));
  };

  const canEdit = isFetched && isEditableStatus(currentStatus);

  async function fetchDetails() {
    if (!awb) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.get('/providers/delhivery/shipment', { params: { waybill: awb } });
      const shipment = data.raw;
      
      setCurrentStatus(data.status || "Unknown");
      setForm({
        name: data.consignee?.name || "",
        phone: shipment?.Consignee?.Telephone1 || "",
        add: shipment?.Consignee?.Address3 || "",
        pt: shipment?.OrderType || "Pre-paid",
        cod_amount: shipment?.CODAmount?.toString() || "0",
        products_desc: shipment?.Extras || "",
        weight: shipment?.ChargedWeight || "",
        height: "", width: "", length: ""
      });
      setIsFetched(true);
    } catch (e) {
      alert("Shipment not found. Please verify AWB.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
  setLoading(true);
    try {
      const payload = {
        waybill: awb,

        // 👇 FLAT KEYS (AS PER DELHIVERY DOCS)
        name: form.name || undefined,
        phone: form.phone || undefined,
        add: form.add || undefined,
        pt: form.pt || undefined,
        products_desc: form.products_desc || undefined,

        cod_amount: form.cod_amount
          ? Number(form.cod_amount)
          : undefined,

        weight: form.weight
          ? parseFloat(form.weight)
          : undefined,

        shipment_height: form.height
          ? parseFloat(form.height)
          : undefined,

        shipment_width: form.width
          ? parseFloat(form.width)
          : undefined,

        shipment_length: form.length
          ? parseFloat(form.length)
          : undefined,
      };

      const res = await api.post(
        '/providers/delhivery/update',
        payload,
      );

      setResult(res.data);
    } catch (e) {
      setResult({
        success: false,
        message: 'Connection to API failed.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
            <Edit3 size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shipment Editor</h1>
            <p className="text-slate-500 font-medium">Official Delhivery Updation Interface</p>
          </div>
        </div>
        {isFetched && (
          <Button variant="outline" onClick={() => setIsFetched(false)} className="rounded-xl font-bold border-slate-200">
            <Search size={16} className="mr-2" /> New Search
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT: GUIDELINES & STATUS --- */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 border-none shadow-xl rounded-[2.5rem] bg-white space-y-5">
             <div className="flex items-center gap-2 text-amber-600 px-1">
                <AlertTriangle size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Update Protocols</span>
             </div>
             
             <div className="space-y-4">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Allowed for Edits</p>
                 <div className="flex flex-wrap gap-2">
                   {["Manifested", "In Transit", "Pending", "Scheduled"].map(s => (
                     <Badge key={s} variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 font-bold">{s}</Badge>
                   ))}
                 </div>
               </div>

               <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                 <p className="text-[10px] font-black text-rose-400 uppercase mb-1 tracking-tighter">Locked Status (No Edits)</p>
                 <p className="text-xs font-bold text-rose-700">Delivered, RTO, DTO, Lost, Closed</p>
               </div>

               <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                  <p className="text-[10px] font-black text-indigo-400 uppercase mb-2 tracking-tighter">Payment Rules</p>
                  <ul className="text-[11px] font-bold text-indigo-800 space-y-2">
                    <li className="flex items-start gap-2 italic">✓ COD ↔ Prepaid swaps are supported.</li>
                    <li className="flex items-start gap-2 text-indigo-400 opacity-70">✕ Same-mode updates (e.g. COD to COD) are blocked.</li>
                  </ul>
               </div>
             </div>
          </Card>

          {isFetched && (
            <Card className={clsx(
              "p-8 border-none shadow-2xl rounded-[2.5rem] text-white transition-all duration-500",
              canEdit ? "bg-emerald-600 shadow-emerald-200" : "bg-slate-900 shadow-slate-200"
            )}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Current State</p>
                  <h2 className="text-3xl font-black tracking-tight italic uppercase">{currentStatus}</h2>
                </div>
                {canEdit ? <CheckCircle2 size={32} /> : <Lock size={32} />}
              </div>
              {!canEdit && (
                <div className="mt-4 pt-4 border-t border-white/10 text-[11px] font-medium leading-relaxed opacity-80">
                  This shipment has reached a terminal state. Parameters are now locked in the Delhivery system.
                </div>
              )}
            </Card>
          )}
        </div>

        {/* --- RIGHT: THE DYNAMIC WORKSPACE --- */}
        <Card className="lg:col-span-8 p-8 border-none shadow-xl rounded-[2.5rem] bg-white relative overflow-hidden">
          {!isFetched ? (
             <div className="py-24 text-center space-y-8">
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200 animate-pulse">
                  <Search size={48} />
                </div>
                <div className="max-w-xs mx-auto space-y-4">
                  <div className="space-y-2 text-center">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Step 1: Fetch Live Data</Label>
                    <Input 
                      value={awb} 
                      onChange={(e) => setAwb(e.target.value)}
                      placeholder="Enter 14-digit AWB"
                      className="h-16 rounded-2xl border-2 border-slate-100 text-center font-mono text-2xl font-black text-slate-700 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <Button onClick={fetchDetails} disabled={loading || !awb} className="w-full h-16 rounded-2xl bg-indigo-600 text-lg font-black shadow-lg shadow-indigo-100">
                    {loading ? <Loader2 className="animate-spin" /> : "Verify Shipment"}
                  </Button>
                </div>
             </div>
          ) : (
            <div className={clsx("space-y-8 transition-all duration-500", !canEdit && "opacity-50 grayscale-[0.4] pointer-events-none")}>
              
              {!canEdit && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-[1px]">
                  <div className="bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center gap-2">
                    <Lock className="text-slate-400" size={32} />
                    <p className="font-black text-slate-400 text-xs uppercase tracking-widest">Fields Locked</p>
                  </div>
                </div>
              )}

              {/* SECTION: CONSIGNEE */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 px-1">
                  <User size={16} className="text-indigo-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consignee Details</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormGroup label="Consignee Name" value={form.name} onChange={(v) => setForm({...form, name: v})} disabled={!canEdit} />
                  <FormGroup label="Phone Number" value={form.phone} onChange={(v) => setForm({...form, phone: v})} disabled={!canEdit} />
                  <div className="md:col-span-2">
                    <FormGroup label="Delivery Address" value={form.add} onChange={(v) => setForm({...form, add: v})} disabled={!canEdit} />
                  </div>
                </div>
              </div>

              {/* SECTION: LOGISTICS DATA */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 px-1">
                  <Boxes size={16} className="text-indigo-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Package & Dimensions</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <FormGroup label="Weight (gms)" value={form.weight} onChange={(v) => setForm({...form, weight: v})} disabled={!canEdit} />
                   <FormGroup label="Height (cm)" value={form.height} onChange={(v) => setForm({...form, height: v})} disabled={!canEdit} />
                   <FormGroup label="Width (cm)" value={form.width} onChange={(v) => setForm({...form, width: v})} disabled={!canEdit} />
                   <FormGroup label="Length (cm)" value={form.length} onChange={(v) => setForm({...form, length: v})} disabled={!canEdit} />
                </div>
                <FormGroup label="Products Description" value={form.products_desc} onChange={(v) => setForm({...form, products_desc: v})} disabled={!canEdit} />
              </div>

              {/* SECTION: PAYMENT */}
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-5">
                <div className="flex items-center gap-2 px-1">
                  <Banknote size={16} className="text-indigo-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Patch</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormGroup label="COD Amount (₹)" value={form.cod_amount} onChange={(v) => setForm({...form, cod_amount: v})} disabled={!canEdit} />
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Payment Mode (PT)</Label>
                    <select 
                      disabled={!canEdit}
                      value={form.pt} 
                      onChange={(e) => setForm({...form, pt: e.target.value})}
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 font-bold text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100"
                    >
                      <option value="Pre-paid">Pre-paid</option>
                      <option value="COD">COD</option>
                    </select>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleUpdate} 
                disabled={loading || !canEdit}
                className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all shadow-xl shadow-indigo-100"
              >
                {loading ? <Loader2 className="animate-spin" /> : <RefreshCw className="mr-2" />}
                {loading ? "Pushing Changes..." : "Commit Update"}
              </Button>
            </div>
          )}

          {result && (
            <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] animate-in zoom-in-95 duration-300">
               <div className="flex items-center justify-between mb-4">
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Server Response</p>
                 <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px]">Live Data</Badge>
               </div>
               <pre className="text-emerald-400 font-mono text-[11px] leading-relaxed overflow-auto max-h-[300px] scrollbar-hide">
                 {JSON.stringify(result, null, 2)}
               </pre>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// --- SHARED FORM GROUP COMPONENT ---
function FormGroup({ label, value, onChange, disabled, placeholder }: any) {
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</Label>
      <Input 
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-xl border-slate-200 bg-white font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 disabled:text-slate-400 transition-all"
      />
    </div>
  );
}