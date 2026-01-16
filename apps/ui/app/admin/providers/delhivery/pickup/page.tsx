"use client";

import { useState } from "react";
import {
  Truck,
  Calendar,
  Clock,
  Warehouse,
  PackageCheck,
  AlertCircle,
  Info,
  CheckCircle2,
  Loader2,
  Send,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api/axios";
import clsx from "clsx";

export default function PickupRequestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({
    pickup_date: new Date().toISOString().split('T')[0],
    pickup_time: "14:00:00",
    pickup_location: "VARIABLEINSTINCT C2C",
    expected_package_count: 1
  });

  const update = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  async function handleCreatePickup() {
  setLoading(true);
  setResult(null);

  try {
    const payload = {
      pickup_date: form.pickup_date,
      pickup_time: form.pickup_time,
      pickup_location: form.pickup_location.trim(),
      expected_package_count: Math.max(
        1,
        Number(form.expected_package_count) || 1
      ),
    };

    const { data } = await api.post(
      "/providers/delhivery/pickup-request",
      payload,
    );

    setResult(data);
  } catch (e: any) {
    console.error(e);
    alert(
      e?.response?.data?.message ||
      "Failed to create pickup request. Ensure existing requests are closed."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Warehouse className="text-indigo-600" size={32} /> Pickup Scheduler
          </h1>
          <p className="text-slate-500 font-medium mt-1">Raise pickup requests for registered warehouse locations</p>
        </div>
        <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 px-4 py-1.5 rounded-full">
          Location Based Request
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT: FORM --- */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white space-y-8">
            
            {/* Warning Section based on Documentation */}
            <div className="bg-amber-50 border border-amber-100 p-5 rounded-3xl flex gap-4">
              <AlertCircle className="text-amber-600 shrink-0" size={24} />
              <div className="space-y-1">
                <p className="text-sm font-black text-amber-900 tracking-tight">Important Note</p>
                <p className="text-xs font-medium text-amber-700 leading-relaxed">
                  Only raise this request when all shipments are packed and labeled. 
                  A second request for the same warehouse can only be raised once the existing one is closed.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Location Picker */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Registered Warehouse Name</Label>
                <div className="relative">
                  <Warehouse className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    value={form.pickup_location}
                    onChange={(e) => update('pickup_location', e.target.value)}
                    placeholder="e.g. MAIN_WAREHOUSE"
                    disabled
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Picker */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pickup Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input 
                      type="date"
                      value={form.pickup_date}
                      onChange={(e) => update('pickup_date', e.target.value)}
                      className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold"
                    />
                  </div>
                </div>

                {/* Time Picker */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pickup Time (hh:mm:ss)</Label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input 
                      type="time"
                      step="1"
                      value={form.pickup_time}
                      onChange={(e) => update('pickup_time', e.target.value)}
                      className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Package Count */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Expected Package Count</Label>
                <div className="relative">
                  <PackageCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    type="number"
                    min="1"
                    value={form.expected_package_count}
                    onChange={(e) => update('expected_package_count', e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCreatePickup}
              disabled={loading || !form.pickup_location}
              className="w-full h-16 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-100 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" size={18} />}
              Request Collection
            </Button>
          </Card>
        </div>

        {/* --- RIGHT: GUIDELINES & RESPONSE --- */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-emerald-600 text-white animate-in zoom-in-95">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-black">Pickup Requested</h2>
                  <p className="text-xs font-bold text-emerald-100">Request successfully logged</p>
                </div>
              </div>
              <div className="bg-black/20 rounded-2xl p-4 font-mono text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Truck size={120} /></div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-widest">
                    <Info size={16} /> Operational Rules
                  </div>
                  <ul className="space-y-4">
                    <RuleItem text="One request per warehouse location is sufficient for multiple waybills." />
                    <RuleItem text="Ensure labels have scannable barcodes before the Field Executive (FE) arrives." />
                    <RuleItem text="Requests are mandatory if Auto-Pickup is not enabled for your account." />
                  </ul>
                </div>
              </Card>

              <div className="p-6 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-3 opacity-60">
                <PackageCheck size={40} className="text-slate-300" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Ready for hand-over?</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RuleItem({ text }: { text: string }) {
  return (
    <li className="flex gap-3 text-xs font-medium leading-relaxed">
      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
      <span className="opacity-80">{text}</span>
    </li>
  );
}