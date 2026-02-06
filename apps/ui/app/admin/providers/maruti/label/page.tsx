"use client";

import React, { Activity, useState } from 'react';
import { 
  Printer, FileText, Download, Search, 
  FileCheck, AlertCircle, ExternalLink, Loader2, 
  Fingerprint
} from 'lucide-react';
import { useMaruti } from '@/hooks/useMaruti';

// export default function MarutiLabelInvoicePage() {
//   const { getLabelInvoice } = useMaruti();
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<{ url: string; type: string } | null>(null);
//   const [error, setError] = useState("");

//   const handleFetch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!query) return;
    
//     setLoading(true);
//     setError("");
//     setResult(null);

//     try {
//       // API expects either awb or cawb in params
//       const response = await getLabelInvoice({ awb: query } as any); 
      
//       if (response.data?.url) {
//         setResult({ 
//           url: response.data.url, 
//           type: query.startsWith('C') ? 'CAWB (Courier)' : 'AWB (Standard)' 
//         });
//       } else {
//         setError("DOCUMENT_NOT_FOUND_IN_S3_REPOSITORY");
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || "COMMUNICATION_FAILURE_WITH_DOC_SERVER");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* HEADER */}
//       <div className="border-b border-slate-200 pb-4">
//         <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Label_Generation_Center</h1>
//         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Maruti_Air // S3_Integrated_Invoice_Engine</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
//         {/* SEARCH PANEL */}
//         <div className="md:col-span-5 space-y-4">
//           <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
//             <form onSubmit={handleFetch} className="space-y-4">
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                   <Search size={12} /> Identifier_Input
//                 </label>
//                 <input 
//                   type="text"
//                   placeholder="ENTER_AWB_OR_CAWB..."
//                   className="w-full bg-slate-50 border border-slate-200 px-3 py-3 text-xs font-mono font-black uppercase outline-none focus:border-indigo-500 transition-all"
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                 />
//                 <p className="text-[9px] text-slate-400 font-bold italic">
//                   * Mandatory: Enter either AWB (Innofulfill) or CAWB (Courier)
//                 </p>
//               </div>

//               <button 
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
//               >
//                 {loading ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
//                 {loading ? 'GENERATING_LINK...' : 'FETCH_DOCUMENTS'}
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* RESULTS PANEL */}
//         <div className="md:col-span-7">
//           <div className="h-full min-h-[250px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center p-8 text-center">
//             {!result && !error && !loading && (
//               <div className="opacity-30 flex flex-col items-center gap-3">
//                 <FileText size={48} />
//                 <span className="text-[10px] font-black uppercase tracking-widest">Awaiting_Input_Parameters</span>
//               </div>
//             )}

//             {loading && (
//               <div className="flex flex-col items-center gap-3">
//                 <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
//                 <span className="text-[10px] font-black uppercase text-indigo-600 animate-pulse">Querying_Cloud_Storage...</span>
//               </div>
//             )}

//             {error && (
//               <div className="text-rose-500 flex flex-col items-center gap-2 animate-in zoom-in-95">
//                 <AlertCircle size={32} />
//                 <span className="text-[11px] font-black uppercase tracking-tight">{error}</span>
//                 <button onClick={() => setError("")} className="text-[9px] font-bold underline mt-2">Clear_Error</button>
//               </div>
//             )}

//             {result && (
//               <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-2">
//                 <div className="bg-white border border-emerald-500/30 p-4 rounded-sm shadow-xl flex items-center justify-between">
//                   <div className="flex items-center gap-4 text-left">
//                     <div className="bg-emerald-100 text-emerald-600 p-3 rounded-sm">
//                       <FileCheck size={24} />
//                     </div>
//                     <div>
//                       <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Document_Ready</p>
//                       <h4 className="text-sm font-mono font-black text-slate-900 mt-1">{query}</h4>
//                       <p className="text-[9px] text-slate-400 font-bold uppercase">{result.type}</p>
//                     </div>
//                   </div>
//                   <a 
//                     href={result.url} 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-sm shadow-lg transition-transform active:scale-95"
//                   >
//                     <Download size={20} />
//                   </a>
//                 </div>
                
//                 <div className="flex gap-2">
//                    <button 
//                     onClick={() => window.open(result.url, '_blank')}
//                     className="flex-1 border border-slate-300 bg-white hover:bg-slate-50 text-[10px] font-black uppercase py-2 flex items-center justify-center gap-2"
//                    >
//                      <ExternalLink size={14}/> Open_In_Browser
//                    </button>
//                    <button 
//                     onClick={() => {setResult(null); setQuery("");}}
//                     className="border border-slate-300 bg-white hover:bg-slate-50 text-[10px] font-black uppercase px-4 py-2"
//                    >
//                      Reset
//                    </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
export default function MarutiLabelInvoicePage() {
  const { getLabelInvoice } = useMaruti();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; type: string } | null>(null);
  const [error, setError] = useState("");

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await getLabelInvoice({ awb: query } as any); 
      
      if (response.data?.url) {
        setResult({ 
          url: response.data.url, 
          type: query.startsWith('C') ? 'CAWB (Courier)' : 'AWB (Standard)' 
        });
      } else {
        setError("DOCUMENT_NOT_FOUND_IN_S3_REPOSITORY");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "COMMUNICATION_FAILURE_WITH_DOC_SERVER");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex items-end justify-between border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.25em] flex items-center gap-2">
            <div className="h-1 w-4 bg-indigo-600 rounded-full" /> Document Retrieval
          </h2>
          <h1 className="text-2xl font-bold text-slate-900 mt-2 uppercase tracking-tighter">Label Generation Center</h1>
          <p className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-tight opacity-70">
            Maruti_Air // S3_Integrated_Invoice_Engine
          </p>
        </div>
        <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 hidden md:block">
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Protocol: S3_Direct_Fetch</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ───────────────── SEARCH PANEL (COL-5) ───────────────── */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
            <form onSubmit={handleFetch} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <Search size={14} className="text-indigo-600" /> Identifier Input
                </label>
                <div className="relative group">
                   <input 
                    type="text"
                    placeholder="ENTER_AWB_OR_CAWB..."
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-mono font-black uppercase outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                    <Fingerprint size={20} className="text-indigo-600" />
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 border-dashed">
                   <p className="text-[9px] text-slate-400 font-bold leading-relaxed">
                     <span className="text-indigo-600 font-black tracking-tighter">* MANDATORY:</span> SYSTEM SUPPORTS <span className="text-slate-600 underline">AWB</span> (INNOFULFILL) OR <span className="text-slate-600 underline">CAWB</span> (COURIER PARTNER).
                   </p>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#0F172A] hover:bg-black text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Activity size={18} className="animate-spin" /> : <Printer size={18} />}
                {loading ? 'GENERATING_LINK...' : 'FETCH_DOCUMENTS'}
              </button>
            </form>
          </div>
        </div>

        {/* ───────────────── RESULTS PANEL (COL-7) ───────────────── */}
        <div className="lg:col-span-7 h-full">
          <div className="h-[380px] bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center transition-all">
            
            {/* IDLE STATE */}
            {!result && !error && !loading && (
              <div className="flex flex-col items-center gap-4 group">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-200 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <FileText size={32} />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Awaiting Input Parameters</span>
                  <p className="text-[10px] font-bold text-slate-300 mt-1">Ready for document handshake...</p>
                </div>
              </div>
            )}

            {/* LOADING STATE */}
            {loading && (
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="h-16 w-16 border-4 border-indigo-600/10 rounded-full" />
                  <div className="h-16 w-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase text-indigo-600 animate-pulse tracking-widest">Querying Cloud Storage</span>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter italic">S3.GET_OBJECT_REQUEST_SENT</p>
                </div>
              </div>
            )}

            {/* ERROR STATE */}
            {error && (
              <div className="text-rose-500 flex flex-col items-center gap-4 animate-in zoom-in-95">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center">
                  <AlertCircle size={32} />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase tracking-widest">{error}</span>
                  <p className="text-[9px] font-bold text-rose-300">SERVER_SIDE_REJECTION_0x044</p>
                </div>
                <button 
                  onClick={() => setError("")} 
                  className="bg-rose-500 text-white px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-lg shadow-rose-100"
                >
                  Clear_Error
                </button>
              </div>
            )}

            {/* SUCCESS STATE */}
            {result && (
              <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-white border border-emerald-100 p-8 rounded-[2rem] shadow-xl shadow-emerald-50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <FileCheck size={80} />
                  </div>
                  
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="bg-emerald-50 text-emerald-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner">
                      <FileCheck size={28} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] leading-none mb-2">Document_Ready</p>
                      <h4 className="text-xl font-mono font-black text-slate-900 tracking-tighter italic">{query}</h4>
                      <div className="mt-2 px-3 py-1 bg-slate-100 rounded-full inline-block">
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{result.type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                    >
                      <Download size={16} /> Download
                    </a>
                    <button 
                      onClick={() => window.open(result.url, '_blank')}
                      className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 h-12 rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                    >
                      <ExternalLink size={16}/> Browser
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={() => {setResult(null); setQuery("");}}
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
                >
                  Reset_Terminal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}