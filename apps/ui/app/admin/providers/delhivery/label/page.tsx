"use client";

import { useState } from "react";
import { 
  FileText, 
  Loader2, 
  Download, 
  Printer, 
  Search, 
  ExternalLink,
  ShieldCheck,
  Terminal,
  FileSearch,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api/axios";
import clsx from "clsx";

export default function LabelDownload() {
  const [awb, setAwb] = useState("");
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);

  // ───────────────── CORE LOGIC (PRESERVED) ─────────────────
  async function generate() {
    setLoading(true);
    setPdfBase64(null);
    setPdfUrl(null);

    try {
      const response = await api.get(`/providers/delhivery/label?waybill=${awb}`).then(res => res.data);
      const j = response?.packages?.[0];
      setLoading(false);

      if (j.pdf_download_link) {
        setPdfUrl(j.pdf_download_link);
        setFilename(`${awb}.pdf`);
      } else if (j.base64) {
        setPdfBase64(j.base64);
        setFilename(`${awb}.pdf`);
      }
    } catch (e) {
      console.error("Label Error:", e);
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

  const hasLabel = !!(pdfUrl || pdfBase64);
  const currentSrc = pdfUrl ? pdfUrl : `data:application/pdf;base64,${pdfBase64}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* ───────────────── ERP HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-slate-900 flex items-center justify-center text-white rounded-sm shadow-md">
            <Printer size={24} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Print_Station_V2.0</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
              <Terminal size={12} className="text-indigo-600" /> System_Output: READY_FOR_RENDER
            </p>
          </div>
        </div>
        {hasLabel && (
          <Button 
            onClick={download}
            className="rounded-sm bg-indigo-600 hover:bg-indigo-700 text-white gap-3 h-11 px-6 shadow-lg shadow-indigo-100 font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <Download size={16} />
            Download_PDF_Package
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ───────────────── LEFT: CONTROL CONSOLE ───────────────── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <FileSearch size={14} className="text-slate-400" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Label_Parameters</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Master_AWB_Sequence
                </Label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <Input 
                    value={awb}
                    onChange={(e) => setAwb(e.target.value)}
                    placeholder="E.G. 1283940192"
                    className="pl-12 h-12 rounded-sm border-slate-200 bg-slate-50/50 focus:bg-white font-mono font-black text-xs transition-all uppercase placeholder:opacity-30"
                  />
                </div>
              </div>

              <Button 
                onClick={generate} 
                disabled={loading || !awb}
                className="w-full h-12 rounded-sm bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-md active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <FileText className="mr-2" size={16} />}
                {loading ? "INITIALIZING..." : "EXECUTE_RENDER"}
              </Button>
            </div>
          </div>

          {/* Compliance Guidelines */}
          <div className="bg-slate-900 rounded-sm p-5 border border-slate-800 space-y-4">
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
              <ShieldCheck size={14} /> Compliance_Protocol
            </h3>
            <ul className="space-y-3">
              <GuidelineItem text="Format: 4x6 Industrial Thermal Grade." />
              <GuidelineItem text="Density: 300 DPI minimum for scan integrity." />
              <GuidelineItem text="Sequence: Verify AWB status is 'Ready_to_Ship'." />
            </ul>
          </div>
        </div>

        {/* ───────────────── RIGHT: RENDER VIEWPORT ───────────────── */}
        <div className="lg:col-span-8">
          {hasLabel ? (
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="bg-white border-slate-300 rounded-sm font-mono text-[10px] px-3 py-1 font-black shadow-sm">
                    {awb}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Preview_Active</span>
                  </div>
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => window.open(currentSrc)} 
                    className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 gap-2"
                >
                  <ExternalLink size={14} /> Fullscreen_Mode
                </Button>
              </div>
              
              <div className="p-6 bg-slate-100/50">
                <div className="border border-slate-200 rounded-sm overflow-hidden shadow-inner bg-white">
                  <iframe
                    className="w-full h-[650px] bg-slate-200"
                    src={currentSrc}
                    title="Label Preview"
                  />
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-slate-400">
                    <AlertCircle size={12} />
                    <p className="text-[9px] font-bold uppercase tracking-tighter">Rendered via Delhivery Cloud Print Node</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[600px] border border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center text-center p-12 bg-slate-50/30">
              <div className="w-20 h-20 bg-white border border-slate-100 rounded-sm flex items-center justify-center text-slate-200 mx-auto shadow-sm">
                <Printer size={40} />
              </div>
              <div className="mt-6 space-y-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Viewport_Standby</p>
                <p className="text-[11px] text-slate-400 font-bold uppercase max-w-[280px] mx-auto leading-relaxed">
                  Awaiting valid AWB input for sequence generation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GuidelineItem({ text }: { text: string }) {
  return (
    <li className="flex gap-3 items-start group">
      <div className="mt-1 w-1 h-3 bg-indigo-500 rounded-full shrink-0 opacity-50 group-hover:opacity-100 transition-all" />
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">{text}</p>
    </li>
  );
}