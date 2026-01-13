"use client";

import { useState } from "react";
import { 
  Edit3, 
  Hash, 
  Phone, 
  MapPin, 
  User, 
  Banknote, 
  RefreshCw, 
  Loader2, 
  CheckCircle2, 
  Info,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

export default function UpdateDelhiveryShipment() {
  const [form, setForm] = useState({
    awb: "",
    phone: "",
    address: "",
    name: "",
    cod_amount: "",
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  function updateField(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    setLoading(true);
    setResult(null);

    const payload: any = {
      waybill: form.awb,
      update: {},
    };

    if (form.phone) payload.update.phone = form.phone;
    if (form.address) payload.update.add = form.address;
    if (form.name) payload.update.name = form.name;
    if (form.cod_amount) payload.update.cod_amount = Number(form.cod_amount);

    try {
      const res = await fetch("/api/admin/delhivery/update-shipment", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setResult(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Edit3 className="text-indigo-600" size={32} />
          Modify Shipment
        </h1>
        <p className="text-slate-500 font-medium mt-1">Update customer details or COD amounts for booked waybills</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT: UPDATE FORM --- */}
        <Card className="lg:col-span-7 p-8 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white">
          <div className="space-y-6">
            
            {/* Primary Identifier */}
            <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50 space-y-3">
               <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 ml-1">Required Identifier</Label>
               <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                <Input 
                  value={form.awb}
                  onChange={(e) => updateField("awb", e.target.value)}
                  placeholder="Enter Waybill (AWB) Number"
                  className="pl-12 h-14 rounded-2xl border-indigo-100 bg-white focus:ring-2 focus:ring-indigo-500/20 font-mono font-black text-slate-700 transition-all text-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FloatingInput 
                label="New Phone Number" 
                icon={<Phone size={16} />} 
                value={form.phone} 
                placeholder="10-digit mobile"
                onChange={(v) => updateField("phone", v)} 
              />
              <FloatingInput 
                label="New Customer Name" 
                icon={<User size={16} />} 
                value={form.name} 
                placeholder="Full Name"
                onChange={(v) => updateField("name", v)} 
              />
              <div className="md:col-span-2">
                 <FloatingInput 
                  label="Update Delivery Address" 
                  icon={<MapPin size={16} />} 
                  value={form.address} 
                  placeholder="House, Street, Area details..."
                  onChange={(v) => updateField("address", v)} 
                />
              </div>
              <div className="md:col-span-2">
                <FloatingInput 
                  label="New COD Amount" 
                  icon={<Banknote size={16} />} 
                  value={form.cod_amount} 
                  placeholder="Enter amount in ₹"
                  onChange={(v) => updateField("cod_amount", v)} 
                />
              </div>
            </div>

            <Button 
              onClick={submit} 
              disabled={loading || !form.awb}
              className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-black text-white font-black shadow-xl shadow-slate-200 transition-all active:scale-95 text-md gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <RefreshCw size={20} />}
              {loading ? "Processing Update..." : "Push Changes to Delhivery"}
            </Button>
          </div>
        </Card>

        {/* --- RIGHT: FEEDBACK & STATUS --- */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <Card className="p-8 border-none shadow-2xl shadow-slate-200 rounded-[2.5rem] bg-white relative overflow-hidden animate-in zoom-in-95 duration-300">
               <div className="flex items-center gap-3 mb-6">
                <div className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  result?.status === "Success" || result?.success ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                  <CheckCircle2 size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Update Result</h2>
              </div>
              
              <div className="bg-slate-900 rounded-3xl p-6 relative group">
                <div className="absolute top-4 right-4 opacity-30 text-emerald-400 font-mono text-[10px]">RAW_RESPONSE</div>
                <pre className="text-emerald-400 font-mono text-xs leading-relaxed overflow-auto max-h-[350px] scrollbar-hide">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>

              {result?.success && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                  <Info className="text-emerald-600 shrink-0" size={18} />
                  <p className="text-[11px] font-bold text-emerald-800 leading-tight">
                    The shipment data has been successfully patched. The courier's manifest will reflect these changes shortly.
                  </p>
                </div>
              )}
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="p-8 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-10 transition-transform group-hover:scale-110 duration-500">
                  <RefreshCw size={160} />
                </div>
                <div className="relative z-10">
                  <Badge className="bg-white/20 text-white border-none mb-4">Quick Tip</Badge>
                  <h3 className="text-xl font-black leading-tight mb-2">Partial Updates</h3>
                  <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                    You don't need to fill every field. Only enter the values you want to change; others will remain as originally booked.
                  </p>
                </div>
              </Card>

              <div className="p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
                  <Edit3 size={32} />
                </div>
                <p className="text-sm text-slate-400 font-bold max-w-[180px]">
                  Submit the form to see API response here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- SHARED UI COMPONENT ---

function FloatingInput({ label, icon, placeholder, value, onChange }: any) {
  return (
    <div className="space-y-2 group">
      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors">
        {label}
      </Label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
          {icon}
        </div>
        <Input 
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 pl-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
        />
      </div>
    </div>
  );
}