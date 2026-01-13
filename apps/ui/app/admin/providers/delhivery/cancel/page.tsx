"use client";

import { useState } from "react";
import { 
  PackageX, 
  Trash2, 
  Search, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert,
  Info,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

export default function CancelShipmentPage() {
  const [awb, setAwb] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function cancel() {
    if (!awb) return;
    setLoading(true);
    setResult(null);

    try {
      const r = await fetch("/api/admin/delhivery/cancel-shipment", {
        method: "POST",
        body: JSON.stringify({ awb }),
      });

      const json = await r.json();
      setResult(json);
    } catch (err) {
      console.error("Cancellation error", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm">
          <PackageX size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Void Shipment</h1>
          <p className="text-slate-500 font-medium">Cancel active Delhivery waybills and manifest entries</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT: CANCELLATION FORM --- */}
        <Card className="lg:col-span-5 p-8 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
              <Info className="text-amber-600 shrink-0" size={20} />
              <p className="text-[11px] font-bold text-amber-800 leading-relaxed">
                Cancellations are only possible before the shipment is picked up. 
                Once picked up, please use the NDR module for RTO requests.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Waybill Number (AWB)
              </Label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  value={awb}
                  onChange={(e) => setAwb(e.target.value)}
                  placeholder="Ex: 4231561000..."
                  className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white font-mono font-bold text-slate-700 transition-all"
                />
              </div>
            </div>
          </div>

          <Button 
            disabled={loading || !awb}
            onClick={cancel}
            className="w-full h-16 rounded-[1.5rem] bg-rose-600 hover:bg-rose-700 text-white font-black shadow-xl shadow-rose-100 transition-all active:scale-95 text-md gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Trash2 size={20} />}
            {loading ? "Processing..." : "Confirm Cancellation"}
          </Button>
        </Card>

        {/* --- RIGHT: STATUS FEEDBACK --- */}
        <div className="lg:col-span-7">
          {result ? (
            <Card className={clsx(
              "p-8 border-none shadow-2xl rounded-[2.5rem] bg-white relative overflow-hidden transition-all duration-500",
              result?.success ? "shadow-emerald-100" : "shadow-rose-100"
            )}>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className={clsx(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                    result?.success ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                  )}>
                    {result?.success ? <CheckCircle2 size={28} /> : <ShieldAlert size={28} />}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      {result?.success ? "Shipment Cancelled" : "Cancellation Failed"}
                    </h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                      AWB: {awb}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[2rem] p-6">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">System Metadata</p>
                  <pre className="text-emerald-400 font-mono text-[11px] leading-relaxed overflow-auto max-h-[300px]">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>

                {result?.success && (
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-slate-400">
                     <span className="text-xs font-bold italic">Reference ID: {result.rmk || 'N/A'}</span>
                     <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100">VOID_SUCCESS</Badge>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <div className="h-full min-h-[440px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
                <AlertCircle size={40} />
              </div>
              <div>
                <p className="text-xl font-black text-slate-400">Ready to Terminate</p>
                <p className="text-sm text-slate-400 font-medium max-w-[280px] mx-auto">
                  Submit a valid AWB to void the label. This action cannot be undone.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}