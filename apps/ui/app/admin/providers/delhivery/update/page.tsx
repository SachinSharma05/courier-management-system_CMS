"use client";

import { useState } from "react";
import { 
  Edit3, User, Banknote, 
  RefreshCw, Loader2, CheckCircle2, Search, 
  Boxes, AlertTriangle, Lock, Terminal, ShieldAlert,
  Hash, Ruler, Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

  // ───────────────── CORE BUSINESS LOGIC (PRESERVED) ─────────────────
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
        name: form.name || undefined,
        phone: form.phone || undefined,
        add: form.add || undefined,
        pt: form.pt || undefined,
        products_desc: form.products_desc || undefined,
        cod_amount: form.cod_amount ? Number(form.cod_amount) : undefined,
        weight: form.weight ? parseFloat(form.weight) : undefined,
        shipment_height: form.height ? parseFloat(form.height) : undefined,
        shipment_width: form.width ? parseFloat(form.width) : undefined,
        shipment_length: form.length ? parseFloat(form.length) : undefined,
      };

      const res = await api.post('/providers/delhivery/update', payload);
      setResult(res.data);
    } catch (e) {
      setResult({ success: false, message: 'Connection to API failed.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* ───────────────── ERP HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-slate-900 flex items-center justify-center text-white rounded-sm shadow-md">
            <Edit3 size={24} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Shipment_Editor_V3</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
              <Terminal size={12} className="text-indigo-600" /> Provider: DELHI-NET // MODIFICATION_ENABLED
            </p>
          </div>
        </div>
        {isFetched && (
          <Button 
            variant="outline" 
            onClick={() => setIsFetched(false)} 
            className="rounded-sm font-black text-[10px] uppercase tracking-widest border-slate-200 h-10 hover:bg-slate-50"
          >
            <Search size={14} className="mr-2" /> RE_INITIALIZE_SEARCH
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ───────────────── LEFT: PROTOCOL MONITOR ───────────────── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
             <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <ShieldAlert size={14} className="text-amber-500" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">System_Protocols</h2>
             </div>
             
             <div className="p-5 space-y-4">
               <div className="p-4 bg-slate-900 rounded-sm border-l-2 border-indigo-500">
                 <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Edit_Authorized_Buffer</p>
                 <div className="flex flex-wrap gap-1.5">
                   {["Manifested", "In Transit", "Pending", "Scheduled"].map(s => (
                     <span key={s} className="bg-slate-800 text-[9px] text-slate-300 px-2 py-0.5 font-bold uppercase border border-slate-700">{s}</span>
                   ))}
                 </div>
               </div>

               <div className="p-4 bg-rose-50 border border-rose-100 rounded-sm">
                 <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">Forbidden_Terminal_States</p>
                 <p className="text-[10px] font-bold text-rose-700 uppercase italic leading-tight">Delivered, RTO, DTO, Lost, Closed</p>
               </div>

               <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-sm">
                  <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-2">Transaction_Logic</p>
                  <ul className="text-[10px] font-bold text-slate-600 space-y-2 uppercase tracking-tight">
                    <li className="flex items-start gap-2 italic text-emerald-600">✓ Cross-Mode Patching Supported (COD ↔ PP)</li>
                    <li className="flex items-start gap-2 opacity-50">✕ Redundant Mode Updates Restricted</li>
                  </ul>
               </div>
             </div>
          </div>

          {isFetched && (
            <div className={clsx(
              "p-6 border rounded-sm shadow-sm transition-all duration-500",
              canEdit ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"
            )}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">State_Analysis</p>
                  <h2 className="text-2xl font-mono font-black tracking-tighter uppercase italic">{currentStatus}</h2>
                </div>
                {canEdit ? <CheckCircle2 size={24} /> : <Lock size={24} />}
              </div>
              {!canEdit && (
                <div className="mt-4 pt-4 border-t border-white/10 text-[9px] font-bold uppercase tracking-tight opacity-60">
                  CRITICAL: Sequence has reached a terminal state. Lock engaged in Delhivery master node.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ───────────────── RIGHT: DATA INJECTION WORKSPACE ───────────────── */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-sm shadow-sm relative overflow-hidden">
          {!isFetched ? (
             <div className="py-24 text-center space-y-8 bg-slate-50/30">
                <div className="w-20 h-20 bg-white border border-slate-100 rounded-sm flex items-center justify-center mx-auto text-slate-200 shadow-sm animate-pulse">
                  <Hash size={40} />
                </div>
                <div className="max-w-xs mx-auto space-y-4 px-6">
                  <div className="space-y-2 text-center">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sequence_Injection</Label>
                    <Input 
                      value={awb} 
                      onChange={(e) => setAwb(e.target.value)}
                      placeholder="ENTER 14-DIGIT AWB"
                      className="h-14 rounded-sm border-slate-200 bg-white text-center font-mono text-xl font-black text-slate-700 focus:border-indigo-500 transition-all uppercase placeholder:opacity-20"
                    />
                  </div>
                  <Button onClick={fetchDetails} disabled={loading || !awb} className="w-full h-12 rounded-sm bg-slate-900 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-black transition-all">
                    {loading ? <Loader2 className="animate-spin" /> : "VERIFY_SHIPMENT_SEQUENCE"}
                  </Button>
                </div>
             </div>
          ) : (
            <div className={clsx("p-8 space-y-10 transition-all duration-500", !canEdit && "opacity-30 grayscale pointer-events-none")}>
              
              {!canEdit && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/5 backdrop-blur-[2px]">
                  <div className="bg-white p-5 border border-slate-200 rounded-sm shadow-2xl flex flex-col items-center gap-3">
                    <Lock className="text-slate-400" size={24} />
                    <p className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em]">Workspace_Locked</p>
                  </div>
                </div>
              )}

              {/* SECTION: CONSIGNEE */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User size={14} className="text-indigo-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Consignee_Identity</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormGroup 
                    label="Identity Name" 
                    value={form.name} 
                    onChange={(v: string) => setForm({...form, name: v})} 
                    disabled={!canEdit} 
                  />
                  <FormGroup 
                    label="Comms Channel (Phone)" 
                    value={form.phone} 
                    onChange={(v: string) => setForm({...form, phone: v})} 
                    disabled={!canEdit} 
                  />
                  <div className="md:col-span-2">
                    <FormGroup 
                      label="Deployment Address" 
                      value={form.add} 
                      onChange={(v: string) => setForm({...form, add: v})} 
                      disabled={!canEdit} 
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: LOGISTICS DATA */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Boxes size={14} className="text-indigo-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Mass_And_Dimensions</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormGroup label="Weight (GMS)" icon={Scale} value={form.weight} onChange={(v: any) => setForm({...form, weight: v})} disabled={!canEdit} />
                  <FormGroup label="Height (CM)" icon={Ruler} value={form.height} onChange={(v: any) => setForm({...form, height: v})} disabled={!canEdit} />
                  <FormGroup label="Width (CM)" icon={Ruler} value={form.width} onChange={(v: any) => setForm({...form, width: v})} disabled={!canEdit} />
                  <FormGroup label="Length (CM)" icon={Ruler} value={form.length} onChange={(v: any) => setForm({...form, length: v})} disabled={!canEdit} />
                </div>
                <FormGroup label="Content_Inventory_Description" value={form.products_desc} onChange={(v: any) => setForm({...form, products_desc: v})} disabled={!canEdit} />
              </div>

              {/* SECTION: FINANCIAL PATCH */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm space-y-6">
                <div className="flex items-center gap-2">
                  <Banknote size={14} className="text-indigo-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Financial_Parameters</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormGroup label="COD_VALUE (INR)" value={form.cod_amount} onChange={(v: any) => setForm({...form, cod_amount: v})} disabled={!canEdit} />
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Payment_Module (PT)</Label>
                    <select 
                      disabled={!canEdit}
                      value={form.pt} 
                      onChange={(e) => setForm({...form, pt: e.target.value})}
                      className="w-full h-11 rounded-sm border border-slate-200 bg-white px-4 font-black text-xs text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100 uppercase"
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
                className="w-full h-14 rounded-sm bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-slate-200"
              >
                {loading ? <Loader2 className="animate-spin" /> : <RefreshCw className="mr-3" size={16} />}
                {loading ? "COMMITTING_DATA_STREAM..." : "EXECUTE_PATCH_SEQUENCE"}
              </Button>
            </div>
          )}

          {result && (
            <div className="mt-8 p-6 bg-slate-900 border-t border-slate-800 animate-in slide-in-from-bottom-4 duration-300">
               <div className="flex items-center justify-between mb-4">
                 <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">Server_Response_Output</p>
                 <Badge className="bg-slate-800 text-slate-400 border border-slate-700 text-[8px] font-mono">NODE_TX_OK</Badge>
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

function FormGroup({ label, value, onChange, disabled, placeholder, icon: Icon }: any) {
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
        {Icon && <Icon size={12} className="text-slate-300" />} {label}
      </Label>
      <Input 
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-sm border-slate-200 bg-white font-bold text-xs text-slate-700 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400 transition-all placeholder:opacity-30 uppercase"
      />
    </div>
  );
}