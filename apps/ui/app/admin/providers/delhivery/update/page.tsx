"use client";

import { ComponentType, useState } from "react";
import { 
  Edit3, User, Banknote, RefreshCw, Loader2, CheckCircle2, Search, 
  Boxes, Lock, Terminal, ShieldAlert, Hash, Ruler, Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api/axios";
import clsx from "clsx";

// ───────────────── CORE BUSINESS LOGIC ─────────────────
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
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 bg-[#0F172A] flex items-center justify-center text-white rounded-2xl shadow-xl shadow-indigo-100">
            <Edit3 size={28} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Shipment Editor V3</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
              <Terminal size={12} className="text-indigo-500" /> Provider: <span className="text-indigo-600 font-bold">DELHI-NET</span>
            </p>
          </div>
        </div>
        {isFetched && (
          <Button 
            variant="outline" 
            onClick={() => { setIsFetched(false); setAwb(""); }} 
            className="rounded-xl font-bold text-xs uppercase tracking-widest border-slate-200 h-12 px-6 hover:bg-slate-50 transition-all"
          >
            <Search size={16} className="mr-2" /> New Search Sequence
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ───────────────── LEFT: PROTOCOL MONITOR ───────────────── */}
        <div className="lg:col-span-4 space-y-8">
          <SectionModule icon={<ShieldAlert size={18} className="text-amber-500" />} title="System Protocols">
             <div className="space-y-6">
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">Authorized States</p>
                  <div className="flex flex-wrap gap-2">
                    {["Manifested", "In Transit", "Pending", "Scheduled"].map(s => (
                      <span key={s} className="bg-white text-[9px] text-slate-500 px-3 py-1 rounded-md font-bold uppercase border border-slate-100 shadow-sm">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-rose-50 border border-rose-100 rounded-xl">
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Terminal States (Locked)</p>
                  <p className="text-xs font-bold text-rose-700/70 uppercase italic leading-relaxed">Delivered, RTO, DTO, Lost, Closed</p>
                </div>
             </div>
          </SectionModule>

          {isFetched && (
            <div className={clsx(
              "p-8 rounded-2xl shadow-2xl transition-all duration-700 transform",
              canEdit ? "bg-emerald-600 text-white scale-100" : "bg-slate-900 text-slate-400 scale-95 opacity-80"
            )}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-70 mb-2">State Analysis</p>
                  <h2 className="text-3xl font-mono font-black tracking-tighter uppercase italic">{currentStatus}</h2>
                </div>
                {canEdit ? <CheckCircle2 size={32} className="text-emerald-200" /> : <Lock size={32} className="text-slate-600" />}
              </div>
              {!canEdit && (
                <div className="mt-6 pt-6 border-t border-white/10 text-[10px] font-bold uppercase tracking-widest leading-relaxed opacity-60">
                  CRITICAL: Sequence has reached a terminal state. Lock engaged in Delhivery Master Node.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ───────────────── RIGHT: DATA INJECTION WORKSPACE ───────────────── */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl shadow-sm relative overflow-hidden transition-all">
          {!isFetched ? (
             <div className="py-32 text-center space-y-10 bg-slate-50/30">
                <div className="w-24 h-24 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-200 shadow-xl animate-pulse">
                  <Hash size={48} />
                </div>
                <div className="max-w-sm mx-auto space-y-6 px-8">
                  <div className="space-y-3">
                    <Label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Sequence Injection</Label>
                    <Input 
                      value={awb} 
                      onChange={(e) => setAwb(e.target.value)}
                      placeholder="ENTER 14-DIGIT AWB"
                      className="h-16 rounded-2xl border-none bg-white shadow-inner text-center font-mono text-2xl font-black text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all uppercase placeholder:opacity-20"
                    />
                  </div>
                  <Button onClick={fetchDetails} disabled={loading || !awb} className="w-full h-14 rounded-2xl bg-[#0F172A] text-xs font-bold uppercase tracking-widest text-white hover:bg-black transition-all shadow-xl shadow-indigo-100">
                    {loading ? <Loader2 className="animate-spin" /> : "Verify Shipment Sequence"}
                  </Button>
                </div>
             </div>
          ) : (
            <div className={clsx("p-10 space-y-12 transition-all duration-700", !canEdit && "opacity-40 grayscale pointer-events-none blur-[1px]")}>
              
              {!canEdit && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-transparent">
                  <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95">
                    <Lock className="text-slate-300" size={32} />
                    <p className="font-black text-slate-400 text-[11px] uppercase tracking-[0.4em]">Workspace Locked</p>
                  </div>
                </div>
              )}

              {/* CONSIGNEE IDENTITY */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg"><User size={18} className="text-indigo-600" /></div>
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-900">Consignee Identity</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormGroup label="Identity Name" value={form.name} onChange={(v: string) => setForm({...form, name: v})} disabled={!canEdit} />
                  <FormGroup label="Comms Channel (Phone)" value={form.phone} onChange={(v: string) => setForm({...form, phone: v})} disabled={!canEdit} />
                  <div className="md:col-span-2">
                    <FormGroup label="Deployment Address" value={form.add} onChange={(v: string) => setForm({...form, add: v})} disabled={!canEdit} />
                  </div>
                </div>
              </div>

              {/* LOGISTICS DATA */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg"><Boxes size={18} className="text-indigo-600" /></div>
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-900">Mass & Dimensions</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <FormGroup label="Weight (GMS)" icon={Scale} value={form.weight} onChange={(v: string) => setForm({...form, weight: v})} disabled={!canEdit} />
                  <FormGroup label="Height (CM)" icon={Ruler} value={form.height} onChange={(v: string) => setForm({...form, height: v})} disabled={!canEdit} />
                  <FormGroup label="Width (CM)" icon={Ruler} value={form.width} onChange={(v: string) => setForm({...form, width: v})} disabled={!canEdit} />
                  <FormGroup label="Length (CM)" icon={Ruler} value={form.length} onChange={(v: string) => setForm({...form, length: v})} disabled={!canEdit} />
                </div>
                <FormGroup label="Content Inventory Description" value={form.products_desc} onChange={(v: string) => setForm({...form, products_desc: v})} disabled={!canEdit} />
              </div>

              {/* FINANCIAL PATCH */}
              <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl space-y-8">
                <div className="flex items-center gap-3">
                  <Banknote size={20} className="text-indigo-600" />
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-900">Financial Parameters</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormGroup label="COD Value (INR)" value={form.cod_amount} onChange={(v: string) => setForm({...form, cod_amount: v})} disabled={!canEdit} />
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Payment Module (PT)</Label>
                    <select 
                      disabled={!canEdit}
                      value={form.pt} 
                      onChange={(e) => setForm({...form, pt: e.target.value})}
                      className="w-full h-14 rounded-2xl border-none bg-white px-5 font-bold text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 uppercase transition-all shadow-sm"
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
                className="w-full h-16 rounded-2xl bg-[#0F172A] hover:bg-black text-white font-bold text-sm uppercase tracking-[0.3em] transition-all shadow-2xl shadow-indigo-100"
              >
                {loading ? <Loader2 className="animate-spin" /> : <RefreshCw className="mr-4" size={20} />}
                {loading ? "Committing Data Stream..." : "Execute Patch Sequence"}
              </Button>
            </div>
          )}

          {result && (
            <div className="mt-4 p-8 bg-[#0F172A] border-t border-slate-800 animate-in slide-in-from-bottom-6 duration-500">
               <div className="flex items-center justify-between mb-6">
                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Server Response Output</p>
                 <Badge className="bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-mono px-3">NODE_TX_OK</Badge>
               </div>
               <pre className="text-emerald-400/90 font-mono text-xs leading-relaxed overflow-auto max-h-[400px] scrollbar-hide p-4 bg-black/20 rounded-xl">
                 {JSON.stringify(result, null, 2)}
               </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────── SHARED MODULE COMPONENTS ───────────────── */

function SectionModule({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden transition-all">
        <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
          <div className="p-2.5 bg-white border border-slate-100 text-indigo-500 rounded-xl shadow-sm">{icon}</div>
          <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-800">{title}</h2>
        </div>
        <div className="p-8">{children}</div>
      </div>
    );
}

function FormGroup({ label, value, onChange, disabled, placeholder, icon: Icon }: 
      {label: string, value: string | number, onChange: (val: string) => void, disabled?: boolean, placeholder?: string, icon?: ComponentType<{ size?: number | string; className?: string }> }) {
  return (
    <div className="space-y-3 group">
      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2 group-focus-within:text-indigo-500 transition-colors">
        {Icon && <Icon size={14} className="text-slate-300 group-focus-within:text-indigo-400" />} {label}
      </Label>
      <Input 
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-14 rounded-2xl border-none bg-slate-50 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500 font-bold text-sm text-slate-700 disabled:bg-slate-100 disabled:text-slate-300 transition-all placeholder:opacity-30 uppercase shadow-sm"
      />
    </div>
  );
}