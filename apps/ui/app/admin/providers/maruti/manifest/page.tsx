"use client";

import React, { useState } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Trash2, 
  Send,  
  AlertCircle,
  PackageCheck,
  Activity,
  Info
} from 'lucide-react';
import clsx from 'clsx';
import { useMaruti } from '@/hooks/useMaruti';

// export default function MarutiManifestPage() {
//   const { createManifest } = useMaruti();
//   const [loading, setLoading] = useState(false);
//   const [awbInput, setAwbInput] = useState("");
//   const [manifestList, setManifestList] = useState<{ id: string; type: 'AWB' | 'CAWB' }[]>([]);
//   const [response, setResponse] = useState<any>(null);

//   const addId = () => {
//     if (!awbInput) return;
//     const type = awbInput.startsWith('C') || awbInput.length < 12 ? 'CAWB' : 'AWB';
//     // Avoid duplicates
//     if (!manifestList.find(i => i.id === awbInput)) {
//       setManifestList([...manifestList, { id: awbInput.trim(), type }]);
//     }
//     setAwbInput("");
//   };

//   const removeId = (id: string) => {
//     setManifestList(manifestList.filter(item => item.id !== id));
//   };

//   const handleManifestSubmit = async () => {
//     if (manifestList.length === 0) return;
//     setLoading(true);
    
//     const payload = {
//       awbNumber: manifestList.filter(i => i.type === 'AWB').map(i => i.id).join(','),
//       cAwbNumber: manifestList.filter(i => i.type === 'CAWB').map(i => i.id).join(',')
//     };

//     try {
//       const res = await createManifest(payload);
//       setResponse(res.data);
//       setManifestList([]); // Clear list on success
//     } catch (err) {
//       console.error(err);
//       alert("MANIFEST_GENERATION_FAILED");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto space-y-6">
//       {/* HEADER */}
//       <div className="border-b border-slate-200 pb-4 flex justify-between items-end">
//         <div>
//           <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Manifest_Dispatch_Terminal</h1>
//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Carrier_Handover_Protocol // Maruti_Air</p>
//         </div>
//         <div className="text-right">
//            <span className="text-[9px] font-black text-slate-400 uppercase block">Terminal_Status</span>
//            <span className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1">
//              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"/> Ready_For_Ingestion
//            </span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//         {/* INPUT SECTION */}
//         <div className="lg:col-span-5 space-y-4">
//           <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
//             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
//               <Plus size={14}/> ID_Ingestion_Node
//             </h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="text-[9px] font-black text-slate-500 uppercase">Scan_or_Paste_AWB_CAWB</label>
//                 <div className="flex gap-2 mt-1">
//                   <input 
//                     type="text"
//                     value={awbInput}
//                     onChange={(e) => setAwbInput(e.target.value.toUpperCase())}
//                     onKeyDown={(e) => e.key === 'Enter' && addId()}
//                     placeholder="ENTER_ID..."
//                     className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono font-black outline-none focus:border-indigo-500"
//                   />
//                   <button onClick={addId} className="bg-slate-900 text-white px-4 py-2 text-[10px] font-black uppercase">Add</button>
//                 </div>
//               </div>
              
//               <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-sm">
//                 <p className="text-[10px] text-indigo-700 font-bold leading-relaxed">
//                   <InfoIcon className="inline mr-1" /> 
//                   System will auto-detect AWB vs CAWB based on identifier prefix and length.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* QUEUE LIST SECTION */}
//         <div className="lg:col-span-7 space-y-4">
//           <div className="bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col h-[450px]">
//             <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
//                 <ClipboardList size={14} className="text-indigo-600"/> Batch_Queue ({manifestList.length})
//               </h3>
//               <button 
//                 onClick={() => setManifestList([])}
//                 className="text-[9px] font-black text-rose-500 uppercase hover:underline"
//               >
//                 Clear_All
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4 space-y-2">
//               {manifestList.length === 0 ? (
//                 <div className="h-full flex flex-col items-center justify-center opacity-20">
//                   <PackageCheck size={48} />
//                   <span className="text-[10px] font-black uppercase mt-2">Queue_Empty</span>
//                 </div>
//               ) : (
//                 manifestList.map((item) => (
//                   <div key={item.id} className="flex items-center justify-between p-2 border border-slate-100 hover:border-indigo-200 transition-colors bg-white group">
//                     <div className="flex items-center gap-3">
//                       <span className={clsx(
//                         "text-[8px] font-black px-1.5 py-0.5 rounded-sm border",
//                         item.type === 'AWB' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-purple-50 text-purple-600 border-purple-100"
//                       )}>
//                         {item.type}
//                       </span>
//                       <span className="text-xs font-mono font-black text-slate-700">{item.id}</span>
//                     </div>
//                     <button onClick={() => removeId(item.id)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
//                       <Trash2 size={14} />
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>

//             <div className="p-4 border-t border-slate-100 bg-slate-50">
//               <button 
//                 disabled={manifestList.length === 0 || loading}
//                 onClick={handleManifestSubmit}
//                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg transition-all active:scale-[0.98]"
//               >
//                 {loading ? 'COMMITTING_MANIFEST...' : <><Send size={16}/> Finalize_Handover</>}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function InfoIcon({ className }: any) {
//   return <AlertCircle size={12} className={className} />;
// }
export default function MarutiManifestPage() {
  const { createManifest } = useMaruti();
  const [loading, setLoading] = useState(false);
  const [awbInput, setAwbInput] = useState("");
  const [manifestList, setManifestList] = useState<{ id: string; type: 'AWB' | 'CAWB' }[]>([]);
  const [response, setResponse] = useState<any>(null);

  const addId = () => {
    if (!awbInput) return;
    const type = awbInput.startsWith('C') || awbInput.length < 12 ? 'CAWB' : 'AWB';
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
      alert("MANIFEST_GENERATED_SUCCESSFULLY");
    } catch (err) {
      console.error(err);
      alert("MANIFEST_GENERATION_FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ───────────────── HEADER: CARRIER HANDOVER ───────────────── */}
      <div className="flex items-end justify-between border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.25em] flex items-center gap-2">
            <div className="h-1 w-4 bg-indigo-600 rounded-full" /> Logistics Protocol
          </h2>
          <h1 className="text-2xl font-bold text-slate-900 mt-2 uppercase tracking-tighter italic">Manifest Dispatch Terminal</h1>
          <p className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-tight opacity-70">
            Carrier_Handover_Protocol // Maruti_Air_Hub
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-1">
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Terminal Status</span>
           <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2">
              <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"/>
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tighter">Ready_For_Ingestion</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ───────────────── INPUT SECTION (COL-5) ───────────────── */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
            <div className="flex items-center gap-3 mb-8">
               <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                  <Plus size={18} />
               </div>
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">ID Ingestion Node</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Scan or Paste AWB / CAWB</label>
                <div className="flex gap-3 mt-1">
                  <input 
                    type="text"
                    value={awbInput}
                    onChange={(e) => setAwbInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && addId()}
                    placeholder="ENTER_IDENTIFIER..."
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 h-14 text-sm font-mono font-black outline-none focus:bg-white focus:border-indigo-500 transition-all shadow-inner"
                  />
                  <button 
                    onClick={addId} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all active:scale-95"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-[1.5rem] flex gap-4">
                <Info size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-indigo-800 font-bold leading-relaxed">
                  Detection Logic: System auto-segregates <span className="underline">AWB</span> (Standard) vs <span className="underline">CAWB</span> (Courier) based on character prefix and string length.
                </p>
              </div>
            </div>
          </div>
          
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="AWB Items" count={manifestList.filter(i => i.type === 'AWB').length} color="blue" />
            <StatCard label="CAWB Items" count={manifestList.filter(i => i.type === 'CAWB').length} color="purple" />
          </div>
        </div>

        {/* ───────────────── QUEUE LIST SECTION (COL-7) ───────────────── */}
        <div className="lg:col-span-7 h-full">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex flex-col h-[520px] overflow-hidden">
            
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs">
                  {manifestList.length}
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Batch_Queue_Buffer</h3>
              </div>
              <button 
                onClick={() => setManifestList([])}
                className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline px-3 py-1 bg-rose-50 rounded-lg transition-colors"
              >
                Flush Queue
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-3 custom-scrollbar">
              {manifestList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-slate-400">
                  <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center mb-4">
                     <PackageCheck size={40} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Queue Is Empty</span>
                  <p className="text-[9px] font-bold mt-1 uppercase italic tracking-tighter">Ready for stream ingestion</p>
                </div>
              ) : (
                manifestList.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-slate-100 hover:border-indigo-200 transition-all bg-white rounded-2xl group hover:shadow-md hover:shadow-slate-100/50">
                    <div className="flex items-center gap-4">
                      <span className={clsx(
                        "text-[9px] font-black px-3 py-1 rounded-lg border uppercase tracking-tighter",
                        item.type === 'AWB' ? "bg-blue-50 text-blue-600 border-blue-100 shadow-sm" : "bg-purple-50 text-purple-600 border-purple-100 shadow-sm"
                      )}>
                        {item.type}
                      </span>
                      <span className="text-sm font-mono font-black text-slate-700 tracking-tight">{item.id}</span>
                    </div>
                    <button 
                      onClick={() => removeId(item.id)} 
                      className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-8 border-t border-slate-50 bg-slate-50/50 backdrop-blur-sm">
              <button 
                disabled={manifestList.length === 0 || loading}
                onClick={handleManifestSubmit}
                className="w-full h-16 bg-[#0F172A] hover:bg-black text-white rounded-[1.25rem] font-black text-[11px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl transition-all active:scale-[0.98] group"
              >
                {loading ? (
                  <Activity className="animate-spin" size={20} />
                ) : (
                  <>
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/> 
                    Finalize_Carrier_Handover
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── UI SUB-COMPONENTS ───────────────── */

function StatCard({ label, count, color }: { label: string, count: number, color: 'blue' | 'purple' }) {
  const styles = {
    blue: "border-blue-100 bg-blue-50/30 text-blue-600",
    purple: "border-purple-100 bg-purple-50/30 text-purple-600"
  };
  
  return (
    <div className={clsx("p-6 rounded-[2rem] border transition-all", styles[color])}>
      <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</p>
      <h4 className="text-3xl font-black mt-1">{count}</h4>
    </div>
  );
}