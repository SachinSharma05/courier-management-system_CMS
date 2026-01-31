'use client';

import { 
  FileUp, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Terminal, 
  Database, 
  Activity, 
  Layers,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

export default function BulkUploadPage() {
  return (
    <div className="space-y-6">
      {/* ───────────────── PAGE HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-slate-900 flex items-center justify-center text-white rounded-sm shadow-md">
            <Layers size={24} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Bulk_Manifest_Ingestion</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
              <Terminal size={12} className="text-indigo-600" /> Engine: DELHI_BULK_V4
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-sm">
            <Activity size={14} className="text-indigo-600 animate-pulse" />
            <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Buffer_Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ───────────────── UPLOAD ZONE (CORE) ───────────────── */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden group">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-1.5 bg-white border border-slate-200 text-slate-500 rounded-sm">
                <FileUp size={16} />
              </div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">01_Data_Stream_Input</h2>
            </div>
            
            <div className="p-12 flex flex-col items-center text-center space-y-6 bg-slate-50/30">
              <div className="w-20 h-20 bg-slate-900 rounded-sm flex items-center justify-center text-indigo-400 shadow-xl ring-8 ring-slate-100 transition-all group-hover:scale-105 group-hover:ring-indigo-50">
                <FileSpreadsheet size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Manifest_Drop_Zone</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                  Support_Formats: .CSV / .XLSX / .XLSM <br/>
                  Max_Buffer_Limit: 5,000 Nodes
                </p>
              </div>
              
              <input type="file" className="hidden" id="bulk-file" />
              <label 
                htmlFor="bulk-file"
                className="bg-indigo-600 text-white px-10 py-4 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] cursor-pointer hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                Execute_Browse_Command
              </label>
            </div>
          </div>

          {/* SYSTEM ALERT BLOCK */}
          <div className="bg-amber-950 border border-amber-800 p-5 rounded-sm flex gap-4 shadow-lg">
            <div className="h-10 w-10 shrink-0 bg-amber-500 rounded-sm flex items-center justify-center text-amber-950">
                <AlertCircle size={20} />
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Validation_Protocol_Active</p>
                <p className="text-[11px] font-mono font-bold text-amber-100/80 leading-relaxed">
                  System strictly enforces Schema v2.4. Non-compliant headers will cause record rejection. Ensure Destination_Pincode strings are 6-digit integers.
                </p>
            </div>
          </div>
        </div>

        {/* ───────────────── SYSTEM CONTEXT (SIDEBAR) ───────────────── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-1.5 bg-white border border-slate-200 text-slate-500 rounded-sm">
                <ShieldCheck size={16} />
              </div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Ingestion_Protocol</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-6">
                <InstructionStep step="01" title="Fetch_Schema" desc="Acquire the latest CSV template structure." />
                <InstructionStep step="02" title="Data_Normalization" desc="Populate customer and SKU variables." />
                <InstructionStep step="03" title="Pre_Flight_Check" desc="Validate pincodes and weight units." />
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <Button className="w-full rounded-sm h-12 bg-white border border-slate-200 text-slate-900 gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 shadow-sm">
                  <Download size={14} className="text-indigo-600" />
                  Fetch_Sample_CSV
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-sm p-6 text-white overflow-hidden relative shadow-xl">
            <CheckCircle2 className="absolute -right-4 -bottom-4 opacity-5" size={120} />
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Database size={14} className="text-indigo-400" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Auto_Map_Engine</p>
                </div>
                <p className="text-xs font-mono font-bold leading-relaxed text-slate-300">
                  Neural header mapping is enabled. The system will attempt to reconcile heterogeneous column names to the core Delhivery schema.
                </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function InstructionStep({ step, title, desc }: { step: string, title: string, desc: string }) {
  return (
    <li className="flex gap-4 group">
      <span className="w-8 h-8 rounded-sm bg-slate-50 flex items-center justify-center text-[10px] font-mono font-black text-slate-400 shrink-0 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors">
        {step}
      </span>
      <div>
        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{title}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase leading-tight mt-1">{desc}</p>
      </div>
    </li>
  );
}