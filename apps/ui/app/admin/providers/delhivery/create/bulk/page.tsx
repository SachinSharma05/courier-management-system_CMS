'use client';

import { FileUp, Download, FileText, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function BulkUploadPage() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Navigation Back */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm transition-colors"
      >
        <ChevronLeft size={16} /> Back to Shipments
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- UPLOAD SECTION --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center text-center space-y-6 hover:border-indigo-400 hover:bg-indigo-50/10 transition-all group">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl transition-all">
              <FileUp className="text-indigo-600" size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Upload Manifest</h2>
              <p className="text-slate-500 font-medium max-w-xs mx-auto">
                Drag and drop your CSV or Excel file to create shipments in bulk.
              </p>
            </div>
            <input type="file" className="hidden" id="bulk-file" />
            <label 
              htmlFor="bulk-file"
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold cursor-pointer hover:bg-black shadow-lg shadow-slate-200 transition-all"
            >
              Browse Files
            </label>
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

        {/* --- SIDEBAR: TEMPLATE & STEPS --- */}
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
                <Download size={18} className="text-indigo-600" />
                Download Sample CSV
              </Button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative">
            <CheckCircle2 className="absolute -right-4 -bottom-4 opacity-10" size={120} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Automated Mapping</p>
            <p className="text-sm font-bold leading-snug">
              Our AI automatically maps your column headers to our system requirements.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

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