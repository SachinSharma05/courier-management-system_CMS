"use client";

import React, { useState } from "react";
import { 
  FileText, Loader2, Download, Printer, Search, ExternalLink,
  ShieldCheck, Terminal, FileSearch, AlertCircle, PackageCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api/axios";

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
      // Mocking API call based on your logic
      const response = await api.get(`/providers/delhivery/label?waybill=${awb}`).then(res => res.data);
      const j = response?.packages?.[0];
      setLoading(false);

      if (j?.pdf_download_link) {
        setPdfUrl(j.pdf_download_link);
        setFilename(`${awb}.pdf`);
      } else if (j?.base64) {
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
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 bg-[#0F172A] flex items-center justify-center text-white rounded-2xl shadow-xl shadow-indigo-100">
            <Printer size={28} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Print Station V2.0</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
              <Terminal size={12} className="text-indigo-500" /> System_Output: <span className="text-emerald-500">READY_FOR_RENDER</span>
            </p>
          </div>
        </div>
        {hasLabel && (
          <Button 
            onClick={download}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white gap-3 h-14 px-8 shadow-xl shadow-indigo-200 font-bold text-xs uppercase tracking-widest transition-all animate-in zoom-in-95"
          >
            <Download size={18} />
            Download PDF Package
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ───────────────── LEFT: CONTROL CONSOLE ───────────────── */}
        <div className="lg:col-span-4 space-y-8">
          <SectionModule icon={<FileSearch size={18}/>} title="Label Parameters">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Master AWB Sequence
                </Label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <Input 
                    value={awb}
                    onChange={(e) => setAwb(e.target.value)}
                    placeholder="E.G. 1283940192"
                    className="pl-12 h-14 rounded-xl border-slate-100 bg-slate-50/50 focus-visible:bg-white focus-visible:ring-indigo-500 font-mono font-bold text-sm transition-all uppercase placeholder:opacity-30"
                  />
                </div>
              </div>

              <Button 
                onClick={generate} 
                disabled={loading || !awb}
                className="w-full h-14 rounded-xl bg-[#0F172A] hover:bg-black text-white font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-50"
              >
                {loading ? <Loader2 className="animate-spin mr-3" size={20} /> : <FileText className="mr-3" size={20} />}
                {loading ? "Initializing..." : "Execute Render"}
              </Button>
            </div>
          </SectionModule>

          {/* Compliance Guidelines */}
          <div className="bg-[#0F172A] rounded-2xl p-8 border border-slate-800 shadow-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400 flex items-center gap-3 mb-6">
              <ShieldCheck size={16} /> Compliance Protocol
            </h3>
            <ul className="space-y-5">
              <GuidelineItem text="Format: 4x6 Industrial Thermal Grade." />
              <GuidelineItem text="Density: 300 DPI for scan integrity." />
              <GuidelineItem text="Sequence: Verify 'Ready_to_Ship' status." />
            </ul>
          </div>
        </div>

        {/* ───────────────── RIGHT: RENDER VIEWPORT ───────────────── */}
        <div className="lg:col-span-8">
          {hasLabel ? (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-700">
              <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-5">
                  <Badge variant="outline" className="bg-white border-slate-200 text-slate-900 rounded-lg font-mono text-xs px-4 py-1.5 font-black shadow-sm">
                    {awb}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preview Active</span>
                  </div>
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => window.open(currentSrc)} 
                    className="text-[11px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 rounded-lg px-4"
                >
                  <ExternalLink size={14} className="mr-2" /> Fullscreen
                </Button>
              </div>
              
              <div className="p-8 bg-slate-200/30">
                <div className="border-4 border-white rounded-xl overflow-hidden shadow-2xl bg-white">
                  <iframe
                    className="w-full h-[700px] bg-slate-50"
                    src={currentSrc}
                    title="Label Preview"
                  />
                </div>
                <div className="mt-6 flex items-center justify-center gap-3 text-slate-400">
                    <AlertCircle size={14} />
                    <p className="text-[10px] font-black uppercase tracking-[0.1em]">Rendered via Delhivery Cloud Print Node</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[680px] border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center p-16 bg-slate-50/30">
              <div className="w-24 h-24 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-200 mx-auto shadow-sm mb-8">
                <PackageCheck size={48} />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Viewport Standby</p>
                <p className="text-[13px] text-slate-300 font-bold uppercase max-w-xs tracking-widest leading-relaxed">
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

/* ───────────────── MODERN ERP COMPONENTS ───────────────── */

function SectionModule({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode}) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transition-all hover:border-indigo-100">
        <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
          <div className="p-2.5 bg-white border border-slate-100 text-indigo-500 rounded-xl shadow-sm">{icon}</div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">{title}</h2>
        </div>
        <div className="p-8">{children}</div>
      </div>
    );
}

function GuidelineItem({ text }: { text: string }) {
  return (
    <li className="flex gap-4 items-start group">
      <div className="mt-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0 group-hover:scale-150 transition-transform" />
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight leading-snug group-hover:text-slate-300 transition-colors">{text}</p>
    </li>
  );
}