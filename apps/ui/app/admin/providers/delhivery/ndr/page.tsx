"use client";

import { useState } from "react";
import {
  RefreshCw,
  Calendar,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Truck,
  Undo2,
  CalendarPlus,
  MessageSquare,
  Search,
  ShieldAlert,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";

export default function NDRPage() {
  const [awb, setAwb] = useState("");
  const [action, setAction] = useState("reattempt");
  const [date, setDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function getActionDetails() {
    switch (action) {
      case "reattempt": return { label: "Reattempt Delivery", icon: <Truck size={18} />, color: "text-blue-600" };
      case "reschedule": return { label: "Pickup Reschedule", icon: <CalendarPlus size={18} />, color: "text-amber-600" };
      case "rto": return { label: "Return to Sender", icon: <Undo2 size={18} />, color: "text-rose-600" };
      default: return { label: "Unknown", icon: null, color: "" };
    }
  }

  async function submitNdr() {
    setLoading(true);
    const payload: any = { awb, action, remarks };
    if (action === "reschedule") payload.date = date;

    try {
      const r = await fetch("/api/admin/delhivery/ndr", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      setResult(j);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  }

  const canSubmit = awb && action && (action !== "reschedule" || date);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <ShieldAlert className="text-rose-600" size={32} />
          NDR Action Center
        </h1>
        <p className="text-slate-500 font-medium mt-1">Resolve undelivered shipments and instruction failures</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT: COMMAND PANEL --- */}
        <Card className="lg:col-span-5 p-8 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white space-y-6">
          <div className="space-y-4">
            {/* AWB Input */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Waybill Number</Label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  value={awb}
                  onChange={(e) => setAwb(e.target.value)}
                  placeholder="Enter AWB to modify..."
                  className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white font-mono font-bold text-slate-700 transition-all"
                />
              </div>
            </div>

            {/* Action Cards */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Instruction</Label>
              <div className="grid grid-cols-1 gap-2">
                <ActionButton 
                  active={action === "reattempt"} 
                  onClick={() => setAction("reattempt")}
                  icon={<Truck size={20} />}
                  title="Reattempt"
                  desc="Try delivering to customer again"
                />
                <ActionButton 
                  active={action === "reschedule"} 
                  onClick={() => setAction("reschedule")}
                  icon={<CalendarPlus size={20} />}
                  title="Reschedule"
                  desc="Move to a specific future date"
                />
                <ActionButton 
                  active={action === "rto"} 
                  onClick={() => setAction("rto")}
                  icon={<Undo2 size={20} />}
                  title="Return to Sender"
                  desc="Cancel and start RTO process"
                />
              </div>
            </div>

            {/* Dynamic Date Field */}
            {action === "reschedule" && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Delivery Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white font-bold transition-all"
                  />
                </div>
              </div>
            )}

            {/* Remarks */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Internal Remarks</Label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-slate-400" size={18} />
                <Textarea 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Note for the operations team..."
                  className="pl-12 min-h-[100px] rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white font-medium text-slate-700 transition-all"
                />
              </div>
            </div>
          </div>

          <Button 
            disabled={!canSubmit || loading}
            onClick={() => setConfirmOpen(true)}
            className="w-full h-16 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-100 transition-all active:scale-95 text-md"
          >
            {loading ? <RefreshCw className="animate-spin mr-2" /> : <RefreshCw className="mr-2" size={20} />}
            Execute NDR Action
          </Button>
        </Card>

        {/* --- RIGHT: RESPONSE PANEL --- */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <Card className="p-8 border-none shadow-2xl shadow-slate-200 rounded-[2.5rem] bg-white relative overflow-hidden">
               <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                  <CheckCircle size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-900">Action Response</h2>
              </div>
              
              <div className="bg-slate-900 rounded-3xl p-6 relative group">
                <div className="absolute top-4 right-4 opacity-30 text-emerald-400 font-mono text-xs">API_LOG</div>
                <pre className="text-emerald-400 font-mono text-xs leading-relaxed overflow-auto max-h-[400px] scrollbar-hide">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </Card>
          ) : (
            <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 italic font-serif text-4xl">
                !
              </div>
              <div>
                <p className="text-xl font-black text-slate-400">Waiting for Command</p>
                <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto">
                  Provide an AWB and select an instruction to override the current delivery status.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                <AlertTriangle size={32} />
              </div>
              <button onClick={() => setConfirmOpen(false)} className="text-slate-300 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Confirm Instruction</h3>
            <p className="text-slate-500 font-medium mt-2 leading-relaxed">
              You are about to trigger <span className={clsx("font-black", getActionDetails().color)}>{getActionDetails().label}</span> for waybill:
            </p>
            
            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <span className="font-mono font-black text-lg text-slate-700 tracking-tighter">{awb}</span>
              <Badge variant="outline" className="bg-white">{action.toUpperCase()}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <Button variant="ghost" onClick={() => setConfirmOpen(false)} className="h-12 rounded-xl font-bold">
                Go Back
              </Button>
              <Button onClick={submitNdr} className="h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-lg shadow-rose-100">
                Confirm Execution
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- SUB-COMPONENTS --- */

function ActionButton({ active, onClick, icon, title, desc }: any) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all",
        active 
          ? "border-indigo-600 bg-indigo-50/50 shadow-sm" 
          : "border-slate-100 hover:border-slate-200 bg-white"
      )}
    >
      <div className={clsx(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
        active ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400"
      )}>
        {icon}
      </div>
      <div>
        <p className={clsx("font-black text-sm", active ? "text-indigo-900" : "text-slate-600")}>{title}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{desc}</p>
      </div>
    </button>
  );
}