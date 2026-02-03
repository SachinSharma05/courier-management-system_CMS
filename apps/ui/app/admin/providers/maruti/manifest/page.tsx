"use client";

import React, { useState } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Trash2, 
  Send,  
  AlertCircle,
  PackageCheck
} from 'lucide-react';
import clsx from 'clsx';
import { useMaruti } from '@/hooks/useMaruti';

export default function MarutiManifestPage() {
  const { createManifest } = useMaruti();
  const [loading, setLoading] = useState(false);
  const [awbInput, setAwbInput] = useState("");
  const [manifestList, setManifestList] = useState<{ id: string; type: 'AWB' | 'CAWB' }[]>([]);
  const [response, setResponse] = useState<any>(null);

  const addId = () => {
    if (!awbInput) return;
    const type = awbInput.startsWith('C') || awbInput.length < 12 ? 'CAWB' : 'AWB';
    // Avoid duplicates
    if (!manifestList.find(i => i.id === awbInput)) {
      setManifestList([...manifestList, { id: awbInput.trim(), type }]);
    }
    setAwbInput("");
  };

  const removeId = (id: string) => {
    setManifestList(manifestList.filter(item => item.id !== id));
  };

  const handleManifestSubmit = async () => {
    if (manifestList.length === 0) return;
    setLoading(true);
    
    const payload = {
      awbNumber: manifestList.filter(i => i.type === 'AWB').map(i => i.id).join(','),
      cAwbNumber: manifestList.filter(i => i.type === 'CAWB').map(i => i.id).join(',')
    };

    try {
      const res = await createManifest(payload);
      setResponse(res.data);
      setManifestList([]); // Clear list on success
    } catch (err) {
      console.error(err);
      alert("MANIFEST_GENERATION_FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Manifest_Dispatch_Terminal</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Carrier_Handover_Protocol // Maruti_Air</p>
        </div>
        <div className="text-right">
           <span className="text-[9px] font-black text-slate-400 uppercase block">Terminal_Status</span>
           <span className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1">
             <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"/> Ready_For_Ingestion
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT SECTION */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Plus size={14}/> ID_Ingestion_Node
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase">Scan_or_Paste_AWB_CAWB</label>
                <div className="flex gap-2 mt-1">
                  <input 
                    type="text"
                    value={awbInput}
                    onChange={(e) => setAwbInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && addId()}
                    placeholder="ENTER_ID..."
                    className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono font-black outline-none focus:border-indigo-500"
                  />
                  <button onClick={addId} className="bg-slate-900 text-white px-4 py-2 text-[10px] font-black uppercase">Add</button>
                </div>
              </div>
              
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-sm">
                <p className="text-[10px] text-indigo-700 font-bold leading-relaxed">
                  <InfoIcon className="inline mr-1" /> 
                  System will auto-detect AWB vs CAWB based on identifier prefix and length.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* QUEUE LIST SECTION */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col h-[450px]">
            <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <ClipboardList size={14} className="text-indigo-600"/> Batch_Queue ({manifestList.length})
              </h3>
              <button 
                onClick={() => setManifestList([])}
                className="text-[9px] font-black text-rose-500 uppercase hover:underline"
              >
                Clear_All
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {manifestList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <PackageCheck size={48} />
                  <span className="text-[10px] font-black uppercase mt-2">Queue_Empty</span>
                </div>
              ) : (
                manifestList.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 border border-slate-100 hover:border-indigo-200 transition-colors bg-white group">
                    <div className="flex items-center gap-3">
                      <span className={clsx(
                        "text-[8px] font-black px-1.5 py-0.5 rounded-sm border",
                        item.type === 'AWB' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-purple-50 text-purple-600 border-purple-100"
                      )}>
                        {item.type}
                      </span>
                      <span className="text-xs font-mono font-black text-slate-700">{item.id}</span>
                    </div>
                    <button onClick={() => removeId(item.id)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button 
                disabled={manifestList.length === 0 || loading}
                onClick={handleManifestSubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg transition-all active:scale-[0.98]"
              >
                {loading ? 'COMMITTING_MANIFEST...' : <><Send size={16}/> Finalize_Handover</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoIcon({ className }: any) {
  return <AlertCircle size={12} className={className} />;
}