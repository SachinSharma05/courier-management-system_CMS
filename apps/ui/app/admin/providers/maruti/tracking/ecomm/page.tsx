"use client";

import React, { Activity, useState } from 'react';
import { 
  Search, 
  MapPin, 
  Clock,  
  AlertCircle,
  Navigation2,
  Loader2,
  Box,
  ShieldCheck,
  Cpu,
  Radar
} from 'lucide-react';
import clsx from 'clsx';
import { useMaruti } from '@/hooks/useMaruti';

// export default function MarutiTrackingPage() {
//   const { trackOrder } = useMaruti();
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [trackingData, setTrackingData] = useState<any>(null);
//   const [error, setError] = useState("");

//   const handleTrack = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!query) return;

//     setLoading(true);
//     setError("");
//     try {
//       const res = await trackOrder(query);
//       setTrackingData(res.data);
//     } catch (err: any) {
//       setError("NODE_NOT_FOUND: IDENTIFIER_UNRECOGNIZED_BY_MARUTI_NETWORK");
//       setTrackingData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto space-y-6">
//       {/* ───────────────── SEARCH BAR ───────────────── */}
//       <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm flex flex-col md:flex-row gap-4 items-center">
//         <div className="flex-1 relative w-full">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//           <input 
//             type="text"
//             placeholder="ENTER_AWB_OR_CAWB_FOR_REALTIME_TELEMETRY..."
//             className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 text-xs font-mono font-black uppercase tracking-tight focus:ring-1 focus:ring-indigo-500 outline-none"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//           />
//         </div>
//         <button 
//           onClick={handleTrack}
//           disabled={loading}
//           className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2"
//         >
//           {loading ? <Loader2 size={16} className="animate-spin" /> : "Initiate_Scan"}
//         </button>
//       </div>

//       {error && (
//         <div className="bg-rose-50 border border-rose-100 p-4 flex items-center gap-3 text-rose-600 rounded-sm animate-in fade-in zoom-in-95">
//           <AlertCircle size={18} />
//           <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
//         </div>
//       )}

//       {trackingData && (
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          
//           {/* LEFT: ORDER METADATA (COL-4) */}
//           <div className="lg:col-span-4 space-y-4">
//             <div className="bg-slate-900 text-white p-5 rounded-sm shadow-xl">
//               <div className="flex justify-between items-start mb-6">
//                 <div>
//                   <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Identifier</p>
//                   <h2 className="text-xl font-mono font-black">{query}</h2>
//                 </div>
//                 <div className="bg-indigo-500/20 p-2 rounded-sm text-indigo-400">
//                   <Box size={20} />
//                 </div>
//               </div>
              
//               <div className="space-y-4">
//                 <MetaItem label="Current_Status" value={trackingData.status} highlight />
//                 <MetaItem label="Origin" value={trackingData.origin || "NOT_SET"} />
//                 <MetaItem label="Destination" value={trackingData.destination} />
//                 <MetaItem label="Weight" value={`${trackingData.weight}g`} />
//               </div>
//             </div>

//             <div className="bg-white border border-slate-200 p-5 rounded-sm">
//               <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest flex items-center gap-2">
//                 <MapPin size={14}/> Consignee_Details
//               </h3>
//               <p className="text-sm font-black text-slate-900 uppercase">{trackingData.shippingAddress.name}</p>
//               <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase leading-relaxed">
//                 {trackingData.shippingAddress.address1}, {trackingData.shippingAddress.city}, {trackingData.shippingAddress.zip}
//               </p>
//             </div>
//           </div>

//           {/* RIGHT: TRACKING TIMELINE (COL-8) */}
//           <div className="lg:col-span-8">
//             <div className="bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col h-full">
//               <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
//                   <Clock size={14} className="text-indigo-600"/> Movement_History
//                 </h3>
//                 <span className="text-[9px] font-mono text-slate-400 italic font-bold">LIVE_REPLICATION_ACTIVE</span>
//               </div>
              
//               <div className="p-8 relative">
//                 {/* TIMELINE THREAD */}
//                 <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-slate-100" />
                
//                 <div className="space-y-8 relative">
//                   {trackingData.history?.map((event: any, idx: number) => (
//                     <TimelineEvent 
//                       key={idx}
//                       status={event.status}
//                       location={event.location}
//                       time={event.timestamp}
//                       isLatest={idx === 0}
//                     />
//                   )) || (
//                     <div className="text-center py-10 opacity-30 italic text-[11px] font-bold uppercase">
//                       NO_MOVEMENT_HISTORY_RECORDED_YET
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ───────────────── UI ATOMS ───────────────── */

// function MetaItem({ label, value, highlight }: any) {
//   return (
//     <div className="border-b border-white/5 pb-2 last:border-0">
//       <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{label}</p>
//       <p className={clsx(
//         "text-[11px] font-bold uppercase mt-0.5",
//         highlight ? "text-emerald-400" : "text-white"
//       )}>{value}</p>
//     </div>
//   );
// }

// function TimelineEvent({ status, location, time, isLatest }: any) {
//   return (
//     <div className="flex gap-6 group">
//       <div className="relative z-10">
//         <div className={clsx(
//           "h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all",
//           isLatest ? "bg-indigo-600 border-indigo-200 scale-125 shadow-lg shadow-indigo-100" : "bg-white border-slate-200"
//         )}>
//           {isLatest && <div className="h-1 w-1 bg-white rounded-full animate-ping" />}
//         </div>
//       </div>
//       <div className="flex-1 pb-2">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
//           <h4 className={clsx(
//             "text-[11px] font-black uppercase tracking-tight",
//             isLatest ? "text-indigo-600" : "text-slate-700"
//           )}>{status}</h4>
//           <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">{time}</span>
//         </div>
//         <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase flex items-center gap-1">
//           <Navigation2 size={10} className="text-slate-300" /> {location}
//         </p>
//       </div>
//     </div>
//   );
// }
export default function MarutiTrackingPage() {
  const { trackOrder } = useMaruti();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError("");
    try {
      const res = await trackOrder(query);
      setTrackingData(res.data);
    } catch (err: any) {
      setError("NODE_NOT_FOUND: IDENTIFIER_UNRECOGNIZED_BY_MARUTI_NETWORK");
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 w-full pb-20">
      <div className="max-w-[1400px] mx-auto space-y-8 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ───────────────── SEARCH & SCAN TERMINAL ───────────────── */}
      <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="ENTER_AWB_OR_CAWB_FOR_REALTIME_TELEMETRY..."
            className="w-full bg-slate-50 border border-slate-100 pl-14 pr-6 h-16 rounded-2xl text-sm font-mono font-black uppercase tracking-tight focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none shadow-inner"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack(e as any)}
          />
        </div>
        <button 
          onClick={handleTrack}
          disabled={loading}
          className="w-full md:w-auto bg-[#0F172A] hover:bg-black text-white px-10 h-16 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Activity size={18} className="animate-spin" /> : <Radar size={18} />}
          {loading ? "Scanning_Node..." : "Initiate_Scan"}
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 p-6 flex items-center gap-4 text-rose-600 rounded-[1.5rem] animate-in slide-in-from-top-2">
          <AlertCircle size={24} />
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest block leading-none">Detection_Error</span>
            <span className="text-[10px] font-bold uppercase mt-1 opacity-70 italic">{error}</span>
          </div>
        </div>
      )}

      {trackingData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* ───────────────── LEFT: TELEMETRY METADATA (COL-4) ───────────────── */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#0F172A] text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Box size={120} />
              </div>
              
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Identifier</p>
                  <h2 className="text-2xl font-mono font-black mt-1 tracking-tighter italic">{query}</h2>
                </div>
                <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-400 border border-indigo-500/20 shadow-inner">
                  <Cpu size={24} />
                </div>
              </div>
              
              <div className="space-y-6 relative z-10">
                <MetaItem label="Current_Status" value={trackingData.status} highlight />
                <div className="grid grid-cols-2 gap-6">
                   <MetaItem label="Origin" value={trackingData.origin || "NOT_SET"} />
                   <MetaItem label="Destination" value={trackingData.destination} />
                </div>
                <MetaItem label="Payload_Weight" value={`${trackingData.weight}g`} />
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest flex items-center gap-2">
                <MapPin size={16} className="text-indigo-600"/> Consignee_Details
              </h3>
              <div className="space-y-1">
                <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{trackingData.shippingAddress.name}</p>
                <p className="text-[12px] font-bold text-slate-500 uppercase leading-relaxed mt-2">
                  {trackingData.shippingAddress.address1}<br/>
                  {trackingData.shippingAddress.city}, {trackingData.shippingAddress.zip}
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50">
                 <div className="flex items-center gap-2 text-indigo-600">
                    <ShieldCheck size={16}/>
                    <span className="text-[10px] font-black uppercase tracking-tighter">Verified_Address_Node</span>
                 </div>
              </div>
            </div>
          </div>

          {/* ───────────────── RIGHT: MOVEMENT HISTORY (COL-8) ───────────────── */}
          <div className="lg:col-span-8 h-full">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex flex-col h-full overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-lg text-white">
                    <Clock size={16}/>
                  </div>
                  Movement_History_Logs
                </h3>
                <div className="flex items-center gap-2">
                   <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"/>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live_Sync_Enabled</span>
                </div>
              </div>
              
              <div className="p-10 relative flex-1 overflow-y-auto custom-scrollbar">
                {/* TIMELINE THREAD */}
                <div className="absolute left-[59px] top-12 bottom-12 w-[2px] bg-slate-100 border-l border-dashed border-slate-200" />
                
                <div className="space-y-12 relative">
                  {trackingData.history?.map((event: any, idx: number) => (
                    <TimelineEvent 
                      key={idx}
                      status={event.status}
                      location={event.location}
                      time={event.timestamp}
                      isLatest={idx === 0}
                    />
                  )) || (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-300 gap-4">
                      <Search size={48} className="opacity-20" />
                      <p className="text-[11px] font-black uppercase tracking-widest opacity-40 italic">
                        NO_MOVEMENT_HISTORY_RECORDED_YET
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

/* ───────────────── UI ATOMS (TELEMETRY THEME) ───────────────── */

function MetaItem({ label, value, highlight }: any) {
  return (
    <div className="border-b border-white/5 pb-4 last:border-0">
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
      <p className={clsx(
        "text-sm font-black uppercase mt-1 tracking-tight italic",
        highlight ? "text-emerald-400 underline decoration-emerald-400/30 underline-offset-4" : "text-white"
      )}>{value}</p>
    </div>
  );
}

function TimelineEvent({ status, location, time, isLatest }: any) {
  return (
    <div className="flex gap-10 group">
      <div className="relative z-10 shrink-0">
        <div className={clsx(
          "h-10 w-10 rounded-2xl border-4 flex items-center justify-center transition-all duration-500",
          isLatest ? "bg-indigo-600 border-indigo-100 scale-125 shadow-xl shadow-indigo-200 rotate-3" : "bg-white border-slate-50 shadow-sm"
        )}>
          {isLatest ? (
            <div className="h-2 w-2 bg-white rounded-full animate-ping" />
          ) : (
            <div className="h-2 w-2 bg-slate-200 rounded-full group-hover:bg-indigo-300 transition-colors" />
          )}
        </div>
      </div>
      <div className="flex-1 border-b border-slate-50 pb-8 group-last:border-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <h4 className={clsx(
              "text-sm font-black uppercase tracking-tight",
              isLatest ? "text-indigo-600" : "text-slate-800"
            )}>{status}</h4>
            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase flex items-center gap-1.5">
              <Navigation2 size={12} className={isLatest ? "text-indigo-400" : "text-slate-300"} /> {location}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono font-black text-slate-300 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 uppercase">
              {time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}