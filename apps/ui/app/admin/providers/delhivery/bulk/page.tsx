import React from 'react';
import { 
  Layers, Terminal, Activity, FileUp, FileSpreadsheet, 
  AlertCircle, ShieldCheck, Download, Database, CheckCircle2,
  ChevronRight, ArrowRight, CloudLightning
} from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from "@/components/ui/button";

export default function BulkUploadPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ───────────────── PAGE HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 bg-[#0F172A] flex items-center justify-center text-white rounded-2xl shadow-xl shadow-indigo-100">
            <Layers size={28} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bulk Manifest Ingestion</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
              <Terminal size={12} className="text-indigo-500" /> Engine: DELHI_BULK_V4
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full shadow-sm">
            <CloudLightning size={14} className="text-indigo-600 animate-pulse" />
            <span className="text-[11px] font-black text-indigo-700 uppercase tracking-widest">Buffer Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ───────────────── UPLOAD ZONE (CORE) ───────────────── */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden group transition-all hover:border-indigo-100">
            <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
              <div className="p-2.5 bg-white border border-slate-100 text-indigo-500 rounded-xl shadow-sm">
                <FileUp size={18} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">01 Data Stream Input</h2>
            </div>
            
            <div className="p-16 flex flex-col items-center text-center space-y-8 bg-gradient-to-b from-white to-slate-50/50">
              <div className="relative group/icon">
                <div className="w-24 h-24 bg-[#0F172A] rounded-2xl flex items-center justify-center text-indigo-400 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
                  <FileSpreadsheet size={40} />
                </div>
                <div className="absolute -inset-4 bg-indigo-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Manifest Drop Zone</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                  Supported Formats: <span className="text-slate-900">.CSV / .XLSX / .XLSM</span> <br/>
                  Max Buffer Limit: <span className="text-indigo-600">5,000 Nodes / Batch</span>
                </p>
              </div>
              
              <input type="file" className="hidden" id="bulk-file" />
              <label 
                htmlFor="bulk-file"
                className="bg-indigo-600 text-white px-12 py-5 rounded-xl font-bold text-xs uppercase tracking-widest cursor-pointer hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center gap-3"
              >
                Execute Browse Command
                <ArrowRight size={16} />
              </label>
            </div>
          </div>

          {/* SYSTEM ALERT BLOCK */}
          <div className="bg-[#1a1403] border border-amber-900/30 p-6 rounded-2xl flex gap-5 shadow-xl">
            <div className="h-12 w-12 shrink-0 bg-amber-500 rounded-xl flex items-center justify-center text-[#1a1403] shadow-lg shadow-amber-500/20">
                <AlertCircle size={24} />
            </div>
            <div className="space-y-1">
                <p className="text-[11px] font-black text-amber-500 uppercase tracking-[0.2em]">Validation Protocol Active</p>
                <p className="text-[13px] font-medium text-amber-100/70 leading-relaxed">
                  System strictly enforces <span className="text-amber-400 font-bold underline decoration-amber-500/30">Schema v2.4</span>. Non-compliant headers will trigger immediate record rejection. Ensure Destination Pincode strings are 6-digit integers.
                </p>
            </div>
          </div>
        </div>

        {/* ───────────────── SYSTEM CONTEXT (SIDEBAR) ───────────────── */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
              <div className="p-2.5 bg-white border border-slate-100 text-indigo-500 rounded-xl shadow-sm">
                <ShieldCheck size={18} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">Ingestion Protocol</h2>
            </div>
            <div className="p-8">
              <ul className="space-y-8">
                <InstructionStep step="01" title="Fetch Schema" desc="Acquire the latest CSV template structure." />
                <InstructionStep step="02" title="Data Normalization" desc="Populate customer and SKU variables." />
                <InstructionStep step="03" title="Pre-Flight Check" desc="Validate pincodes and weight units." />
              </ul>

              <div className="mt-10 pt-8 border-t border-slate-50">
                <Button className="w-full rounded-xl h-14 bg-white border border-slate-100 text-slate-900 gap-3 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 hover:border-indigo-200 shadow-sm transition-all group">
                  <Download size={18} className="text-indigo-600 group-hover:-translate-y-0.5 transition-transform" />
                  Fetch Sample CSV
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] rounded-2xl p-8 text-white overflow-hidden relative shadow-2xl">
            <CheckCircle2 className="absolute -right-6 -bottom-6 opacity-5 rotate-12" size={160} />
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                    <div className="h-8 w-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                      <Database size={16} className="text-indigo-400" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.25em] text-indigo-400">Auto-Map Engine</p>
                </div>
                <p className="text-xs font-medium leading-relaxed text-slate-400">
                  Neural header mapping is enabled. The system will attempt to reconcile heterogeneous column names to the core <span className="text-slate-200 font-bold">Delhivery schema</span> automatically.
                </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ───────────────── ERP SUB-COMPONENTS ───────────────── */

function InstructionStep({ step, title, desc }: { step: string, title: string, desc: string }) {
  return (
    <li className="flex gap-5 group">
      <span className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400 shrink-0 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-sm">
        {step}
      </span>
      <div className="pt-0.5">
        <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
          {title}
          <ChevronRight size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </p>
        <p className="text-[11px] font-bold text-slate-400 uppercase leading-tight mt-1 tracking-tight">{desc}</p>
      </div>
    </li>
  );
}