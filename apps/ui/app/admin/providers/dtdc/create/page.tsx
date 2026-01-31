"use client";

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { 
  Truck, User, MapPin, Phone, Package, Hash, 
  Send, Loader2, Terminal, ShieldCheck, Activity,
  Database, Info, AlertCircle, Box
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import clsx from 'clsx';

export default function BookDTDCPage({ params }: { params: { id: string } }) {
  const clientId = Number(params.id);
  
  // ───────────────── CORE STATE ─────────────────
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    pincode: "",
    weight: "",
    reference: "",
  });

  // ───────────────── INTEGRATED MUTATION ─────────────────
  const { mutate: submitBooking, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/dtdc/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          payload: {
            consignee_name: form.name,
            consignee_address: form.address,
            consignee_phone: form.phone,
            pincode: form.pincode,
            weight: form.weight,
            reference: form.reference || "",
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Booking failed");
      return json;
    },
    onSuccess: (data) => {
      toast.success(`AWB Created: ${data.awb}`);
      setForm({ name: "", address: "", phone: "", pincode: "", weight: "", reference: "" });
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* ───────────────── ERP HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-600 flex items-center justify-center text-white rounded-sm shadow-md">
            <Truck size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Initialize_Shipment_Node</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
              <Terminal size={12} className="text-blue-500" /> Target_Client: #{clientId} // Provider: DTDC_EXPRESS
            </p>
          </div>
        </div>
        <Badge variant="outline" className="h-8 rounded-sm border-slate-200 font-mono text-[10px] px-3 bg-slate-50 text-slate-500">
          NODE_STATUS: READY_FOR_INGESTION
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ───────────────── LEFT: TELEMETRY & PROTOCOLS ───────────────── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
             <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <ShieldCheck size={14} className="text-blue-500" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Validation_Protocols</h2>
             </div>
             
             <div className="p-5 space-y-4">
               <ProtocolRow icon={<Hash size={14}/>} label="Pincode Check" status="Required: 6-Digit Numeric" />
               <ProtocolRow icon={<Package size={14}/>} label="Weight Metric" status="Unit: Kilograms (KG)" />
               <ProtocolRow icon={<Database size={14}/>} label="API Endpoint" status="Live Production Node" />
               
               <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Info size={14} className="text-blue-600" />
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Operator_Note</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-600 uppercase leading-tight tracking-tight">
                    Ensure the consignee address is detailed. Inaccurate address strings may result in NDR (Non-Delivery Report) flags.
                  </p>
               </div>
             </div>
          </div>

          <div className="p-6 bg-slate-900 rounded-sm border border-slate-800 text-white space-y-4">
             <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Activity size={14} className="text-blue-400" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Real_Time_Manifest</span>
             </div>
             <div className="space-y-3 font-mono">
                <ManifestLine label="Target" value={form.name || "---"} />
                <ManifestLine label="Dest_PIN" value={form.pincode || "---"} />
                <ManifestLine label="Mass_KG" value={form.weight || "0.00"} />
             </div>
          </div>
        </div>

        {/* ───────────────── RIGHT: WORKSPACE FORM ───────────────── */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-sm shadow-sm">
          <form 
            onSubmit={(e) => { e.preventDefault(); submitBooking(); }} 
            className="p-8 space-y-10"
          >
            {/* Consignee Data Section */}
            <div className="space-y-6">
              <SectionHeader icon={<User size={14}/>} title="Consignee_Identity_Profile" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup 
                  label="Full_Legal_Name" 
                  value={form.name} 
                  onChange={(val: string) => setForm({ ...form, name: val })}
                  placeholder="Receiver's Name"
                  icon={<User size={16}/>}
                />
                <FormGroup 
                  label="Contact_Sequence" 
                  value={form.phone} 
                  onChange={(val: string) => setForm({ ...form, phone: val })}
                  placeholder="Mobile Number"
                  icon={<Phone size={16}/>}
                />
              </div>
            </div>

            {/* Logistics Data Section */}
            <div className="space-y-6">
              <SectionHeader icon={<MapPin size={14}/>} title="Logistics_Destination_Metrics" />
              <div className="space-y-4">
                <FormGroup 
                  label="Full_Address_String" 
                  isTextArea
                  value={form.address} 
                  onChange={(val: string) => setForm({ ...form, address: val })}
                  placeholder="House/Office No, Building, Street, Area..."
                  icon={<MapPin size={16}/>}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormGroup 
                    label="Destination_Pincode" 
                    value={form.pincode} 
                    onChange={(val: string) => setForm({ ...form, pincode: val })}
                    placeholder="6 Digit PIN"
                    icon={<Hash size={16}/>}
                  />
                  <FormGroup 
                    label="Payload_Weight_KG" 
                    type="number"
                    value={form.weight} 
                    onChange={(val: string) => setForm({ ...form, weight: val })}
                    placeholder="e.g. 0.500"
                    icon={<Box size={16}/>}
                  />
                </div>
              </div>
            </div>

            {/* Reference */}
            <div className="space-y-6">
               <SectionHeader icon={<Hash size={14}/>} title="Reference_Metadata" />
               <FormGroup 
                  label="Internal_Order_ID" 
                  value={form.reference} 
                  onChange={(val: string) => setForm({ ...form, reference: val })}
                  placeholder="Your internal reference code (Optional)"
                />
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-3 rounded-sm bg-blue-600 h-16 text-[11px] font-black text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.99] disabled:opacity-50 uppercase tracking-[0.3em]"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Broadcasting_Booking_Packet...
                </>
              ) : (
                <>
                  Commit_Booking_Sequence
                  <Send size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ───────────────── ERP SUB-COMPONENTS ─────────────────

function SectionHeader({ icon, title }: { icon: any, title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
      <div className="text-blue-600">{icon}</div>
      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">{title}</h2>
    </div>
  );
}

function FormGroup({ label, value, onChange, placeholder, icon, isTextArea, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
            {icon}
          </div>
        )}
        {isTextArea ? (
          <textarea
            required
            rows={3}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-sm border border-slate-200 bg-slate-50/50 p-4 text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
          />
        ) : (
          <Input
            required
            type={type}
            step={type === 'number' ? "0.01" : undefined}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={clsx(
              "h-12 rounded-sm border-slate-200 bg-slate-50/50 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all",
              icon && "pl-12"
            )}
          />
        )}
      </div>
    </div>
  );
}

function ProtocolRow({ icon, label, status }: any) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-sm border border-slate-100">
      <div className="text-slate-400">{icon}</div>
      <div>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-tight">{label}</p>
        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tighter">{status}</p>
      </div>
    </div>
  );
}

function ManifestLine({ label, value }: any) {
  return (
    <div className="flex justify-between text-[10px]">
      <span className="text-slate-500 uppercase tracking-widest">{label}:</span>
      <span className="text-blue-400 font-bold uppercase truncate max-w-[150px]">{value}</span>
    </div>
  );
}