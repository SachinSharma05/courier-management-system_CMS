'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { 
  FileUp, Download, AlertCircle, CheckCircle2, 
  Loader2, Send, FileSpreadsheet, Terminal, 
  Database, ShieldCheck, Info, FileText,
  Cpu, Activity, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';

// export default function DTDCBulkUpload({ params }: { params: { id: string } }) {
//   const clientId = Number(params.id);
//   const [file, setFile] = useState<File | null>(null);

//   // ───────────────── CORE LOGIC (PRESERVED) ─────────────────
//   const { mutate: handleUpload, isPending } = useMutation({
//     mutationFn: async () => {
//       if (!file) return;
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('clientId', String(clientId));

//       const res = await fetch("/api/admin/dtdc/bulk-book", {
//         method: "POST",
//         body: formData,
//       });

//       const json = await res.json();
//       if (!res.ok) throw new Error(json.error || "Upload failed");
//       return json;
//     },
//     onSuccess: (data) => {
//       toast.success(`Success! ${data.count} shipments created.`);
//       setFile(null);
//     },
//     onError: (err: any) => toast.error(err.message),
//   });

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
      
//       {/* ───────────────── ERP HEADER ───────────────── */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
//         <div className="flex items-center gap-4">
//           <div className="h-12 w-12 bg-blue-600 flex items-center justify-center text-white rounded-sm shadow-md">
//             <FileUp size={24} />
//           </div>
//           <div>
//             <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Bulk_Ingestion_Protocol</h1>
//             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
//               <Terminal size={12} className="text-blue-500" /> DTDC-NODE // STREAM_TYPE: MULTI_MANIFEST // TARGET: #{clientId}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
//         {/* ───────────────── LEFT: DATA WORKSPACE ───────────────── */}
//         <div className="lg:col-span-8 space-y-6">
//           <div className={clsx(
//             "bg-white border-2 border-dashed rounded-sm p-16 flex flex-col items-center text-center transition-all group relative overflow-hidden",
//             file ? "border-emerald-500 bg-emerald-50/10" : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/50"
//           )}>
            
//             <div className={clsx(
//               "w-24 h-24 rounded-sm flex items-center justify-center mb-6 transition-all border",
//               file ? "bg-emerald-600 border-emerald-400 text-white shadow-lg" : "bg-white border-slate-100 text-slate-300"
//             )}>
//               {file ? <FileSpreadsheet size={40} /> : <FileUp size={40} />}
//             </div>

//             <div className="space-y-2 z-10">
//               <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
//                 {file ? "Manifest_Detected" : "Select_Batch_Source"}
//               </h2>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-xs mx-auto">
//                 {file ? file.name : "Supported Formats: .CSV / .XLSX // Max Capacity: 5,000 Nodes"}
//               </p>
//             </div>

//             <input 
//               type="file" 
//               className="hidden" 
//               id="bulk-file" 
//               accept=".csv, .xlsx"
//               onChange={(e) => setFile(e.target.files?.[0] || null)}
//             />

//             <div className="mt-8 flex gap-3 z-10">
//               {!file ? (
//                 <label 
//                   htmlFor="bulk-file"
//                   className="bg-slate-900 text-white px-10 py-4 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] cursor-pointer hover:bg-black transition-all"
//                 >
//                   Browse_Local_Storage
//                 </label>
//               ) : (
//                 <>
//                   <Button 
//                     variant="outline" 
//                     onClick={() => setFile(null)}
//                     className="rounded-sm h-14 px-8 border-slate-200 font-black text-[10px] uppercase tracking-widest hover:bg-white"
//                   >
//                     Reset_Buffer
//                   </Button>
//                   <Button 
//                     onClick={() => handleUpload()}
//                     disabled={isPending}
//                     className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm h-14 px-10 font-black text-[10px] uppercase tracking-[0.2em] gap-3 shadow-xl shadow-blue-100"
//                   >
//                     {isPending ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
//                     {isPending ? "Executing_Ingestion..." : "Execute_Batch_Upload"}
//                   </Button>
//                 </>
//               )}
//             </div>

//             {/* Background Decor */}
//             <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
//               <Cpu size={240} />
//             </div>
//           </div>

//           <div className="bg-amber-50 border border-amber-100 p-5 rounded-sm flex gap-4">
//             <AlertCircle className="text-amber-600 shrink-0" size={20} />
//             <div>
//               <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1">Validation_Warning</p>
//               <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase">
//                 Critical: Ensure "consignee_pincode" and "weight" columns are populated. System will automatically attempt to map similar headers.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* ───────────────── RIGHT: PROTOCOL SIDEBAR ───────────────── */}
//         <div className="lg:col-span-4 space-y-6">
//           <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
//             <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
//               <ShieldCheck size={14} className="text-blue-500" />
//               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Ingestion_Steps</h3>
//             </div>
//             <div className="p-6 space-y-8">
//               <InstructionStep step="01" title="Template Sync" desc="Fetch standardized .CSV structure" />
//               <InstructionStep step="02" title="Data Mapping" desc="Populate manifest with node data" />
//               <InstructionStep step="03" title="Pre-Flight" desc="Validate pincodes & zone coverage" />
              
//               <div className="pt-6 border-t border-slate-100">
//                 <Button variant="outline" className="w-full h-14 rounded-sm border-slate-200 gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">
//                   <Download size={18} className="text-blue-600" />
//                   Download_Template.csv
//                 </Button>
//               </div>
//             </div>
//           </div>

//           <div className="bg-slate-900 rounded-sm p-6 text-white relative overflow-hidden">
//             <CheckCircle2 className="absolute -right-4 -bottom-4 opacity-10" size={120} />
//             <div className="flex items-center gap-2 mb-4">
//               <Activity size={14} className="text-blue-400" />
//               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Automated_Mapping</p>
//             </div>
//             <p className="text-[11px] font-bold leading-relaxed uppercase tracking-tight opacity-80">
//               The ingestion engine uses fuzzy-logic to map column headers to DTDC system requirements. Manual mapping is not required for standard CSVs.
//             </p>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// // ───────────────── ERP SUB-COMPONENTS ─────────────────

// function InstructionStep({ step, title, desc }: { step: string, title: string, desc: string }) {
//   return (
//     <div className="flex gap-4">
//       <span className="w-10 h-10 bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-900 shrink-0 border border-slate-200 rounded-sm">
//         {step}
//       </span>
//       <div>
//         <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{title}</p>
//         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-tight mt-1">{desc}</p>
//       </div>
//     </div>
//   );
// }
export default function DTDCBulkUpload({ params }: { params: { id: string } }) {
  const clientId = Number(params.id);
  const [file, setFile] = useState<File | null>(null);

  // ───────────────── CORE LOGIC (PRESERVED) ─────────────────
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* ───────────────── MODERN ERP HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 bg-[#0F172A] flex items-center justify-center text-blue-400 rounded-2xl shadow-lg shadow-blue-100">
            <FileUp size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bulk Ingestion Protocol</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] flex items-center gap-2 mt-1">
              <Terminal size={12} className="text-blue-500" /> DTDC-NODE // STREAM_TYPE: MULTI_MANIFEST // TARGET: #{clientId}
            </p>
          </div>
        </div>
        <div className="h-9 rounded-full border border-slate-200 font-bold text-[10px] px-4 bg-white text-slate-500 flex items-center gap-2 shadow-sm uppercase">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Gateway: Awaiting Manifest
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ───────────────── LEFT: DATA WORKSPACE ───────────────── */}
        <div className="lg:col-span-8 space-y-6">
          <div className={clsx(
            "bg-white border-2 border-dashed rounded-[2rem] p-16 flex flex-col items-center text-center transition-all group relative overflow-hidden",
            file ? "border-emerald-500 bg-emerald-50/10" : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/50"
          )}>
            
            <div className={clsx(
              "w-24 h-24 rounded-2xl flex items-center justify-center mb-6 transition-all border shadow-sm",
              file ? "bg-emerald-600 border-emerald-400 text-white shadow-emerald-100" : "bg-slate-50 border-slate-100 text-slate-300"
            )}>
              {file ? <FileSpreadsheet size={40} /> : <FileUp size={40} />}
            </div>

            <div className="space-y-3 z-10">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">
                {file ? "Manifest Detected" : "Select Batch Source"}
              </h2>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                {file ? file.name : "Formats: .CSV / .XLSX // Max Capacity: 5,000 Nodes"}
              </p>
            </div>

            <input 
              type="file" 
              className="hidden" 
              id="bulk-file" 
              accept=".csv, .xlsx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <div className="mt-10 flex flex-wrap justify-center gap-4 z-10">
              {!file ? (
                <label 
                  htmlFor="bulk-file"
                  className="bg-[#0F172A] text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] cursor-pointer hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                >
                  Browse Local Storage
                </label>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setFile(null)}
                    className="rounded-2xl h-16 px-10 border-slate-200 font-black text-[11px] uppercase tracking-widest hover:bg-white"
                  >
                    Reset Buffer
                  </Button>
                  <Button 
                    onClick={() => handleUpload()}
                    disabled={isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-16 px-12 font-black text-[11px] uppercase tracking-[0.2em] gap-3 shadow-xl shadow-blue-200"
                  >
                    {isPending ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                    {isPending ? "Executing Ingestion..." : "Execute Batch Upload"}
                  </Button>
                </>
              )}
            </div>

            {/* Background Decor */}
            <div className="absolute top-10 right-10 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
              <Cpu size={240} />
            </div>
          </div>

          <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-2xl flex gap-5 shadow-sm">
            <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <AlertCircle className="text-amber-600" size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1">Validation Warning</p>
              <p className="text-[11px] font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
                Critical: Ensure "consignee_pincode" and "weight" columns are populated. System maps similar headers automatically.
              </p>
            </div>
          </div>
        </div>

        {/* ───────────────── RIGHT: PROTOCOL SIDEBAR ───────────────── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
              <ShieldCheck size={16} className="text-blue-500" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Ingestion Steps</h3>
            </div>
            <div className="p-8 space-y-8">
              <InstructionStep step="01" title="Template Sync" desc="Fetch standardized .CSV structure" />
              <InstructionStep step="02" title="Data Mapping" desc="Populate manifest with node data" />
              <InstructionStep step="03" title="Pre-Flight" desc="Validate pincodes & coverage" />
              
              <div className="pt-6 border-t border-slate-50">
                <Button variant="outline" className="w-full h-14 rounded-xl border-slate-100 gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:border-blue-200 text-slate-600 transition-all">
                  <Download size={18} className="text-blue-600" />
                  Download_Template.csv
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/10">
            <CheckCircle2 className="absolute -right-6 -bottom-6 opacity-[0.03] rotate-12" size={160} />
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-blue-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Automated Mapping</p>
            </div>
            <p className="text-[11px] font-bold leading-relaxed uppercase tracking-tight opacity-70">
              The ingestion engine uses fuzzy-logic to map column headers to DTDC system requirements. No manual mapping required for standard CSVs.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ───────────────── SHARED MODERN COMPONENTS ─────────────────

function InstructionStep({ step, title, desc }: { step: string, title: string, desc: string }) {
  return (
    <div className="flex gap-5 group">
      <span className="w-12 h-12 bg-slate-50 flex items-center justify-center text-[12px] font-black text-slate-900 shrink-0 border border-slate-100 rounded-xl group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
        {step}
      </span>
      <div className="pt-1">
        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{title}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-tight mt-1.5">{desc}</p>
      </div>
    </div>
  );
}