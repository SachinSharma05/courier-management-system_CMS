"use client";

import { useState } from "react";
import { 
  FileText, 
  Loader2, 
  Download, 
  Printer, 
  Search, 
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  async function generate() {
    setLoading(true);
    setPdfBase64(null);
    setPdfUrl(null);

    try {
      // Pass params in the config object
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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Printer className="text-indigo-600" size={32} />
            Print Station
          </h1>
          <p className="text-slate-500 font-medium mt-1">Generate and download Delhivery shipping labels</p>
        </div>
        {hasLabel && (
          <Button 
            onClick={download}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-12 px-6 shadow-lg shadow-indigo-100 font-bold"
          >
            <Download size={18} />
            Download PDF
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT: INPUT PANEL --- */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Enter Tracking Number
              </Label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  value={awb}
                  onChange={(e) => setAwb(e.target.value)}
                  placeholder="AWB Number..."
                  className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white font-mono font-bold text-slate-700 transition-all"
                />
              </div>
            </div>

            <Button 
              onClick={generate} 
              disabled={loading || !awb}
              className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black shadow-xl shadow-slate-200 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : <FileText className="mr-2" size={18} />}
              {loading ? "Fetching..." : "Generate Label"}
            </Button>
          </Card>

          {/* Guidelines */}
          <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              Print Guidelines
            </h3>
            <ul className="space-y-3">
              <GuidelineItem text="Use a 4x6 Thermal Printer for best results." />
              <GuidelineItem text="Ensure the Barcode is clear and unscanned." />
              <GuidelineItem text="Check for AWB generation in Shipment Logs." />
            </ul>
          </div>
        </div>

        {/* --- RIGHT: PREVIEW PANEL --- */}
        <div className="lg:col-span-8">
          {hasLabel ? (
            <Card className="border-none shadow-2xl shadow-slate-200 rounded-[2.5rem] bg-white overflow-hidden">
              <div className="px-8 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Badge className="bg-white text-slate-900 border-slate-200 rounded-lg py-1 px-3 font-mono">
                    {awb}
                  </Badge>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preview</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => window.open(pdfUrl || `data:application/pdf;base64,${pdfBase64}`)} className="text-indigo-600 font-bold gap-2">
                  <ExternalLink size={14} /> Fullscreen
                </Button>
              </div>
              
              <div className="p-8 bg-slate-200/30">
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner bg-white min-h-[600px]">
                  <iframe
                    className="w-full h-[600px]"
                    src={pdfUrl ? pdfUrl : `data:application/pdf;base64,${pdfBase64}`}
                  />
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full min-h-[600px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
                <Printer size={40} />
              </div>
              <div>
                <p className="text-xl font-black text-slate-400">No Label Selected</p>
                <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto">
                  Enter an AWB number on the left to generate a printable shipping label preview.
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
    <li className="flex gap-3 items-start">
      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
      <p className="text-xs font-medium text-slate-500 leading-relaxed">{text}</p>
    </li>
  );
}