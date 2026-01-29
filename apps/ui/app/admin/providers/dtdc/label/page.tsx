'use client';

import React, { useState } from 'react';
import { 
  Printer, Download, Search, FileText, 
  Loader2, ExternalLink, ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function DTDCLabelDownload() {
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
      // Updated to DTDC specific label endpoint
      const response = await fetch(`/api/providers/dtdc/label?waybill=${awb}`).then(res => res.json());
      
      // DTDC APIs often return the base64 string directly or a URL in a 'data' object
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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Printer className="text-blue-600" size={32} />
            DTDC Print Station
          </h1>
          <p className="text-slate-500 font-medium mt-1">Generate and download official DTDC shipping labels</p>
        </div>
        {hasLabel && (
          <Button 
            onClick={download}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2 h-12 px-6 shadow-lg shadow-blue-100 font-bold transition-all"
          >
            <Download size={18} />
            Download Label
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT: INPUT PANEL --- */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Reference Number / AWB
              </Label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  value={awb}
                  onChange={(e) => setAwb(e.target.value)}
                  placeholder="Ex: D12345678"
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
              {loading ? "Connecting to DTDC..." : "Generate Label"}
            </Button>
          </Card>

          {/* Print Guidelines */}
          <div className="bg-blue-50/50 rounded-[2rem] p-6 border border-blue-100 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
              <ShieldCheck size={14} />
              DTDC Label Specs
            </h3>
            <ul className="space-y-3">
              <GuidelineItem text="Optimized for 4x6 inch (A6) sticky labels." />
              <GuidelineItem text="Ensure DTDC Logo and Waybill are clearly visible." />
              <GuidelineItem text="Avoid placing tape directly over the barcode." />
            </ul>
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3">
             <AlertCircle className="text-amber-600 shrink-0" size={18} />
             <p className="text-[10px] font-bold text-amber-800 leading-tight">
               Labels are only available once the shipment status is 'Booked' or 'Manifested'.
             </p>
          </div>
        </div>

        {/* --- RIGHT: PREVIEW PANEL --- */}
        <div className="lg:col-span-8">
          {hasLabel ? (
            <Card className="border-none shadow-2xl shadow-slate-200 rounded-[2.5rem] bg-white overflow-hidden">
              <div className="px-8 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Badge className="bg-white text-blue-600 border-blue-200 rounded-lg py-1 px-3 font-mono font-bold">
                    {awb}
                  </Badge>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Preview</span>
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => window.open(pdfUrl || `data:application/pdf;base64,${pdfBase64}`)} 
                    className="text-blue-600 font-bold gap-2 hover:bg-blue-50"
                >
                  <ExternalLink size={14} /> View Original
                </Button>
              </div>
              
              <div className="p-8 bg-slate-100/50">
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner bg-white min-h-[600px] flex items-center justify-center">
                  <iframe
                    className="w-full h-[600px]"
                    src={pdfUrl ? pdfUrl : `data:application/pdf;base64,${pdfBase64}`}
                    title="DTDC Label Preview"
                  />
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full min-h-[600px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 space-y-4 bg-slate-50/30">
              <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-3xl flex items-center justify-center text-slate-200">
                <Printer size={40} className="text-slate-300" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-400 tracking-tight">Ready for Printing</p>
                <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto">
                  Fetch your DTDC Waybill label to view the thermal-optimized preview.
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
      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
      <p className="text-xs font-medium text-slate-600 leading-relaxed">{text}</p>
    </li>
  );
}