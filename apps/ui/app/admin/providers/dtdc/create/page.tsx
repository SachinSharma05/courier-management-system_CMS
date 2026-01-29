"use client";

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Truck, User, MapPin, Phone, Package, Hash, Send, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function BookDTDCPage({ params }: { params: { id: string } }) {
  const clientId = Number(params.id);
  
  // 1. Combined State
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    pincode: "",
    weight: "",
    reference: "",
  });

  // 2. Integrated Mutation
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
    <div className="max-w-4xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
          <Truck size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DTDC Booking</h1>
          <p className="text-sm text-slate-500 font-medium">Create a single shipment for Client #{clientId}</p>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <form 
          onSubmit={(e) => { e.preventDefault(); submitBooking(); }} 
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Consignee Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Receiver's Full Name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-slate-900 transition-all"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Mobile Number"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-slate-900 transition-all"
                />
              </div>
            </div>

            {/* Address - Spans 2 cols */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-4 text-slate-400" size={16} />
                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="House/Office No, Building, Street, Area..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-slate-900 transition-all resize-none"
                />
              </div>
            </div>

            {/* Pincode */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pincode</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  required
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  placeholder="6 Digit PIN"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-slate-900 transition-all font-mono"
                />
              </div>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Weight (kg)</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  required
                  type="number"
                  step="0.01"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  placeholder="e.g. 0.500"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-slate-900 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Reference */}
          <div className="space-y-2 pt-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Reference / Order ID (Optional)</label>
            <input
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
              placeholder="Your internal ID..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-slate-900 transition-all"
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating Shipment...
              </>
            ) : (
              <>
                Confirm & Create AWB
                <Send size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}