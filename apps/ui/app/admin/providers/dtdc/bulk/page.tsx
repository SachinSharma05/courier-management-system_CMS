'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FileUp, Download, AlertCircle, CheckCircle2, Loader2, Send, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function DTDCBulkUpload({ params }: { params: { id: string } }) {
  const clientId = Number(params.id);
  const [file, setFile] = useState<File | null>(null);

  // --- 1. THE LOGIC ---
  const { mutate: handleUpload, isPending } = useMutation({
    mutationFn: async () => {
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('clientId', String(clientId));

      const res = await fetch("/api/admin/dtdc/bulk-book", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      return json;
    },
    onSuccess: (data) => {
      toast.success(`Success! ${data.count} shipments created.`);
      setFile(null);
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: UPLOAD SECTION --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center text-center space-y-6 hover:border-blue-400 hover:bg-blue-50/10 transition-all group">
            
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl transition-all">
              {file ? (
                <FileSpreadsheet className="text-emerald-600" size={32} />
              ) : (
                <FileUp className="text-blue-600" size={32} />
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">
                {file ? "File Selected" : "Upload Manifest"}
              </h2>
              <p className="text-slate-500 font-medium max-w-xs mx-auto">
                {file ? file.name : "Drag and drop your CSV or Excel file to create shipments in bulk."}
              </p>
            </div>

            {/* Manual File Input as per your Delhivery code */}
            <input 
              type="file" 
              className="hidden" 
              id="bulk-file" 
              accept=".csv, .xlsx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            {!file ? (
              <label 
                htmlFor="bulk-file"
                className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold cursor-pointer hover:bg-black shadow-lg shadow-slate-200 transition-all"
              >
                Browse Files
              </label>
            ) : (
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setFile(null)}
                  className="rounded-xl px-6 border-slate-200 font-bold"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleUpload()}
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 font-bold gap-2 shadow-lg shadow-blue-100"
                >
                  {isPending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  {isPending ? "Processing..." : "Create Shipments"}
                </Button>
              </div>
            )}
          </div>

          {/* Validation Alert */}
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3">
            <AlertCircle className="text-amber-600 shrink-0" size={20} />
            <p className="text-xs font-bold text-amber-800 leading-relaxed">
              Ensure your CSV follows the official template to avoid AWB generation errors. 
              The system supports up to 5,000 rows per upload.
            </p>
          </div>
        </div>

        {/* --- RIGHT: SIDEBAR --- */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Instructions</h3>
            <ul className="space-y-6">
              <InstructionStep step="1" title="Download Template" desc="Get the latest .csv format" />
              <InstructionStep step="2" title="Prepare Data" desc="Fill in customer & SKU details" />
              <InstructionStep step="3" title="Validation" desc="Check for pincode errors" />
            </ul>

            <div className="mt-8 pt-6 border-t border-slate-50">
              <Button variant="outline" className="w-full rounded-2xl py-6 border-slate-200 gap-3 font-bold hover:bg-slate-50">
                <Download size={18} className="text-blue-600" />
                Download Sample CSV
              </Button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative">
            <CheckCircle2 className="absolute -right-4 -bottom-4 opacity-10" size={120} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Automated Mapping</p>
            <p className="text-sm font-bold leading-snug">
              Our AI automatically maps your column headers to our system requirements.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// Sub-component Helper
function InstructionStep({ step, title, desc }: { step: string, title: string, desc: string }) {
  return (
    <li className="flex gap-4">
      <span className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-black text-slate-900 shrink-0 border border-slate-100">
        {step}
      </span>
      <div>
        <p className="text-sm font-black text-slate-900">{title}</p>
        <p className="text-xs font-medium text-slate-400 leading-tight mt-0.5">{desc}</p>
      </div>
    </li>
  );
}