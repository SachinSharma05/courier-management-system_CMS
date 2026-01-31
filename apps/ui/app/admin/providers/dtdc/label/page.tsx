'use client';

import React, { useState } from 'react';
import { 
  Printer, Download, Search, FileText, 
  Loader2, ExternalLink, ShieldCheck, 
  AlertCircle, Terminal, Database, Activity,
  Monitor, Hash, Cpu
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import clsx from 'clsx';

export default function DTDCLabelDownload() {
  // ───────────────── CORE LOGIC (PRESERVED) ─────────────────
  const [awb, setAwb] = useState("");
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setPdfBase64(null);
    setPdfUrl(null);

    try {
      const response = await fetch(`/api/providers/dtdc/label?waybill=${awb}`).then(res => res.json());
      const labelData = response?.data;
      setLoading(false);

      if (labelData?.pdf_url) {
        setPdfUrl(labelData.pdf_url);
        setFilename(`DTDC_${awb}.pdf`);
      } else if (labelData?.base64) {
        setPdfBase64(labelData.base64);
        setFilename(`DTDC_${awb}.pdf`);
      }
    } catch (e) {
      console.error("DTDC Label Error:", e);
      setLoading(false);
    }
  }

  function download() {
    const dataUrl = pdfUrl ? pdfUrl : `data:application/pdf;base64,${pdfBase64}`;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }

  const hasLabel = pdfUrl || pdfBase64;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* ───────────────── ERP HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-600 flex items-center justify-center text-white rounded-sm shadow-md">
            <Printer size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Print_Queue_Terminal</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
              <Terminal size={12} className="text-blue-500" /> SYSTEM: DTDC_LABEL_GEN_V2 // MODE: THERMAL_OPTIMIZED
            </p>
          </div>
        </div>
        
        {hasLabel && (
          <Button 
            onClick={download}
            className="rounded-sm bg-blue-600 hover:bg-blue-700 text-white gap-3 h-14 px-8 shadow-xl shadow-blue-100 font-black text-[10px] uppercase tracking-[0.2em] transition-all"
          >
            <Download size={18} />
            Download_Manifest_PDF
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ───────────────── LEFT: COMMAND WORKSPACE ───────────────── */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 border border-slate-200 shadow-sm rounded-sm bg-white space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Activity size={14} className="text-blue-600" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Input_Parameters</h2>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                WAYBILL_ID / AWB_NODE
              </Label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <Input 
                  value={awb}
                  onChange={(e) => setAwb(e.target.value)}
                  placeholder="EX: D12345678"
                  className="pl-12 h-14 rounded-sm border-slate-200 bg-slate-50/50 focus:bg-white font-mono font-bold text-xs transition-all uppercase"
                />
              </div>
            </div>

            <Button 
              onClick={generate} 
              disabled={loading || !awb}
              className="w-full h-16 rounded-sm bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Database className="mr-2" size={18} />}
              {loading ? "Establishing_Sync..." : "Fetch_Node_Label"}
            </Button>
          </Card>

          {/* Guidelines Section */}
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <ShieldCheck size={14} className="text-blue-600" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Printing_Protocols</h3>
            </div>
            <div className="p-6 space-y-6">
              <GuidelineItem text="Format optimized for 4x6 inch (A6) thermal nodes." />
              <GuidelineItem text="Ensure Barcode contrast ratio exceeds 80% for scan sync." />
              <GuidelineItem text="Label availability requires 'Booked' status in DTDC DB." />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-5 rounded-sm flex gap-4">
             <AlertCircle className="text-amber-600 shrink-0" size={18} />
             <p className="text-[9px] font-black text-amber-800 leading-relaxed uppercase tracking-widest">
               Warning: Ensure thermal head is clean. Illegible waybills may cause terminal routing delays.
             </p>
          </div>
        </div>

        {/* ───────────────── RIGHT: TELEMETRY PREVIEW ───────────────── */}
        <div className="lg:col-span-8">
          {hasLabel ? (
            <Card className="border border-slate-200 shadow-sm rounded-sm bg-white overflow-hidden animate-in slide-in-from-right-4 duration-700">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Monitor size={14} className="text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preview_Stream</span>
                  </div>
                  <div className="h-4 w-[1px] bg-slate-200" />
                  <span className="font-mono text-[11px] font-black text-slate-900 tracking-tighter">NODE_ID: {awb}</span>
                </div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(pdfUrl || `data:application/pdf;base64,${pdfBase64}`)} 
                    className="h-10 rounded-sm border-slate-200 text-blue-600 font-black text-[9px] uppercase tracking-widest gap-2 hover:bg-blue-50"
                >
                  <ExternalLink size={14} /> View_Original_Buffer
                </Button>
              </div>
              
              <div className="p-8 bg-slate-100/30 relative">
                <div className="border border-slate-200 rounded-sm overflow-hidden shadow-2xl bg-white min-h-[600px] flex items-center justify-center relative z-10">
                  <iframe
                    className="w-full h-[700px]"
                    src={pdfUrl ? pdfUrl : `data:application/pdf;base64,${pdfBase64}`}
                    title="DTDC Label Preview"
                  />
                </div>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
                    <Cpu size={300} />
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full min-h-[600px] border-2 border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center text-center p-12 space-y-4 bg-slate-50/50 relative overflow-hidden">
              <div className="w-24 h-24 bg-white border border-slate-200 rounded-sm shadow-sm flex items-center justify-center text-slate-200 mb-4 animate-pulse relative z-10">
                <Printer size={48} />
              </div>
              <div className="relative z-10">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.4em]">Awaiting_Buffer_Data</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-xs mx-auto mt-4 leading-relaxed">
                  Enter Waybill ID in the control panel to initialize the thermal label rendering sequence.
                </p>
              </div>
              <Monitor size={200} className="absolute opacity-[0.02] text-slate-900 pointer-events-none" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GuidelineItem({ text }: { text: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 w-2 h-2 bg-blue-500 shrink-0 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">{text}</p>
    </div>
  );
}