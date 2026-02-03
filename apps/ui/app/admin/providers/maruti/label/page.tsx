"use client";

import React, { useState } from 'react';
import { 
  Printer, FileText, Download, Search, 
  FileCheck, AlertCircle, ExternalLink, Loader2 
} from 'lucide-react';
import { useMaruti } from '@/hooks/useMaruti';

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
      // API expects either awb or cawb in params
      const response = await getLabelInvoice({ awb: query }); 
      
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Label_Generation_Center</h1>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Maruti_Air // S3_Integrated_Invoice_Engine</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* SEARCH PANEL */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
            <form onSubmit={handleFetch} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Search size={12} /> Identifier_Input
                </label>
                <input 
                  type="text"
                  placeholder="ENTER_AWB_OR_CAWB..."
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-3 text-xs font-mono font-black uppercase outline-none focus:border-indigo-500 transition-all"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <p className="text-[9px] text-slate-400 font-bold italic">
                  * Mandatory: Enter either AWB (Innofulfill) or CAWB (Courier)
                </p>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
                {loading ? 'GENERATING_LINK...' : 'FETCH_DOCUMENTS'}
              </button>
            </form>
          </div>
        </div>

        {/* RESULTS PANEL */}
        <div className="md:col-span-7">
          <div className="h-full min-h-[250px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center p-8 text-center">
            {!result && !error && !loading && (
              <div className="opacity-30 flex flex-col items-center gap-3">
                <FileText size={48} />
                <span className="text-[10px] font-black uppercase tracking-widest">Awaiting_Input_Parameters</span>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-black uppercase text-indigo-600 animate-pulse">Querying_Cloud_Storage...</span>
              </div>
            )}

            {error && (
              <div className="text-rose-500 flex flex-col items-center gap-2 animate-in zoom-in-95">
                <AlertCircle size={32} />
                <span className="text-[11px] font-black uppercase tracking-tight">{error}</span>
                <button onClick={() => setError("")} className="text-[9px] font-bold underline mt-2">Clear_Error</button>
              </div>
            )}

            {result && (
              <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-white border border-emerald-500/30 p-4 rounded-sm shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-4 text-left">
                    <div className="bg-emerald-100 text-emerald-600 p-3 rounded-sm">
                      <FileCheck size={24} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Document_Ready</p>
                      <h4 className="text-sm font-mono font-black text-slate-900 mt-1">{query}</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{result.type}</p>
                    </div>
                  </div>
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-sm shadow-lg transition-transform active:scale-95"
                  >
                    <Download size={20} />
                  </a>
                </div>
                
                <div className="flex gap-2">
                   <button 
                    onClick={() => window.open(result.url, '_blank')}
                    className="flex-1 border border-slate-300 bg-white hover:bg-slate-50 text-[10px] font-black uppercase py-2 flex items-center justify-center gap-2"
                   >
                     <ExternalLink size={14}/> Open_In_Browser
                   </button>
                   <button 
                    onClick={() => {setResult(null); setQuery("");}}
                    className="border border-slate-300 bg-white hover:bg-slate-50 text-[10px] font-black uppercase px-4 py-2"
                   >
                     Reset
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}