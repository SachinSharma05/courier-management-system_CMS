"use client";

import React, { useState } from 'react';
import { 
  XCircle, AlertTriangle, Trash2, 
  Info, ShieldAlert, Loader2, CheckCircle, 
  Hash,
  Navigation,
  MapPin,
  User,
  Badge,
  ChevronDown
} from 'lucide-react';
import { useMaruti } from '@/hooks/useMaruti';

// export default function MarutiCancelPage() {
//   const { cancelOrder, trackOrder } = useMaruti();
//   const [query, setQuery] = useState("");
//   const [reason, setReason] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [preview, setPreview] = useState<any>(null);
//   const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

//   const handleVerify = async () => {
//     if (!query) return;
//     setLoading(true);
//     try {
//       const res = await trackOrder(query);
//       setPreview(res.data);
//       setStatus('idle');
//     } catch (err) {
//       alert("ORDER_NOT_FOUND_FOR_CANCELLATION");
//       setPreview(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = async () => {
//     if (!reason) return alert("PLEASE_SPECIFY_CANCELLATION_REASON");
    
//     setLoading(true);
//     try {
//       await cancelOrder({
//         orderId: query,
//         cancelReason: reason
//       });
//       setStatus('success');
//       setPreview(null);
//       setQuery("");
//       setReason("");
//     } catch (err) {
//       setStatus('error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* HEADER */}
//       <div className="border-b border-rose-200 pb-4">
//         <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
//           <XCircle className="text-rose-600" /> Order_Termination_Terminal
//         </h1>
//         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
//           Maruti_Air // Security_Void_Protocol_V3
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
//         {/* INPUT PANEL */}
//         <div className="md:col-span-5 space-y-4">
//           <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
//             <div>
//               <label className="text-[9px] font-black text-slate-500 uppercase">Target_Identifier (Order_ID / AWB)</label>
//               <div className="flex gap-2 mt-1">
//                 <input 
//                   type="text"
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   placeholder="ID_ENTRY..."
//                   className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono font-black outline-none focus:border-rose-500"
//                 />
//                 <button 
//                   onClick={handleVerify}
//                   className="bg-slate-900 text-white px-4 py-2 text-[10px] font-black uppercase"
//                 >
//                   Verify
//                 </button>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="text-[9px] font-black text-slate-500 uppercase">Cancellation_Reason</label>
//               <select 
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//                 className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-[10px] font-black uppercase outline-none focus:border-rose-500 appearance-none"
//               >
//                 <option value="">SELECT_REASON</option>
//                 <option value="Customer Request">Customer Request</option>
//                 <option value="Duplicate Order">Duplicate Order</option>
//                 <option value="Incorrect Address">Incorrect Address</option>
//                 <option value="Out of Stock">Out of Stock</option>
//                 <option value="Cancel Test">Cancel Test</option>
//               </select>
//             </div>
            
//             <div className="p-4 bg-rose-50 border border-rose-100 flex gap-3">
//                <AlertTriangle className="text-rose-600 shrink-0" size={16} />
//                <p className="text-[9px] text-rose-800 font-bold leading-relaxed uppercase">
//                  Warning: This action is irreversible. Once the node is terminated in the Maruti network, tracking will cease.
//                </p>
//             </div>
//           </div>

//           {status === 'success' && (
//             <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-sm flex items-center gap-3 text-emerald-700 animate-in fade-in zoom-in-95">
//               <CheckCircle size={18} />
//               <span className="text-[10px] font-black uppercase tracking-widest">ORDER_VOID_SUCCESSFUL</span>
//             </div>
//           )}
//         </div>

//         {/* PREVIEW PANEL */}
//         <div className="md:col-span-7">
//           {preview ? (
//             <div className="bg-white border-2 border-rose-500/20 rounded-sm shadow-xl overflow-hidden animate-in slide-in-from-right-4">
//               <div className="bg-rose-600 px-4 py-2 flex justify-between items-center">
//                 <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
//                    <ShieldAlert size={14}/> Confirmation_Required
//                 </span>
//                 <span className="text-[9px] font-mono text-rose-200">{preview.status}</span>
//               </div>
              
//               <div className="p-6 space-y-6">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h4 className="text-xl font-mono font-black text-slate-900">{query}</h4>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Consignee: {preview.shippingAddress.name}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-[9px] font-black text-slate-400 uppercase">Invoice_Amt</p>
//                     <p className="text-lg font-mono font-black text-slate-900">₹{preview.amount}</p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
//                    <div>
//                      <p className="text-[8px] font-black text-slate-400 uppercase">Origin</p>
//                      <p className="text-[10px] font-black uppercase text-slate-700">{preview.pickupAddress.city}</p>
//                    </div>
//                    <div>
//                      <p className="text-[8px] font-black text-slate-400 uppercase">Destination</p>
//                      <p className="text-[10px] font-black uppercase text-slate-700">{preview.shippingAddress.city}</p>
//                    </div>
//                 </div>

//                 <button 
//                   onClick={handleCancel}
//                   disabled={loading || !reason}
//                   className="w-full bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-lg shadow-rose-100"
//                 >
//                   {loading ? <Loader2 className="animate-spin" size={18}/> : <Trash2 size={18}/>}
//                   Confirm_Termination
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="h-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center p-8 opacity-40">
//                <Info size={40} className="mb-4" />
//                <p className="text-[11px] font-black uppercase tracking-widest text-center">
//                  Verify_an_Order_ID_to_begin_the<br/>Termination_Protocol
//                </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
export default function MarutiCancelPage() {
  const { cancelOrder, trackOrder } = useMaruti();
  const [query, setQuery] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleVerify = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await trackOrder(query);
      setPreview(res.data);
      setStatus('idle');
    } catch (err) {
      alert("ORDER_NOT_FOUND_FOR_CANCELLATION");
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!reason) return alert("PLEASE_SPECIFY_CANCELLATION_REASON");
    
    setLoading(true);
    try {
      await cancelOrder({
        orderId: query,
        cancelReason: reason
      });
      setStatus('success');
      setPreview(null);
      setQuery("");
      setReason("");
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* ───────────────── HEADER SECTION ───────────────── */}
      <div className="flex items-end justify-between border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-[11px] font-black text-rose-600 uppercase tracking-[0.25em] flex items-center gap-2">
            <div className="h-1 w-4 bg-rose-600 rounded-full" /> Security Protocol
          </h2>
          <h1 className="text-2xl font-bold text-slate-900 mt-2 flex items-center gap-3">
             Order Termination Terminal
          </h1>
          <p className="text-sm text-slate-500 mt-1 uppercase font-bold tracking-tight opacity-70">
            Maruti_Air // Security_Void_Protocol_V3
          </p>
        </div>
        <div className="text-[11px] font-bold text-rose-600 bg-rose-50 px-4 py-2 rounded-full border border-rose-100 flex items-center gap-2 shadow-sm uppercase">
          <ShieldAlert size={14} /> Authorization Required
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ───────────────── LEFT: INPUT PANEL ───────────────── */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm space-y-8 relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Identifier</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="AWB / ORDER ID"
                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 text-[13px] font-mono font-black outline-none focus:bg-white focus:ring-4 focus:ring-rose-500/5 focus:border-rose-300 transition-all uppercase"
                    />
                  </div>
                  <button 
                    onClick={handleVerify}
                    disabled={loading || !query}
                    className="bg-[#0F172A] hover:bg-black text-white px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18}/> : "Verify"}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason for Termination</label>
                <div className="relative">
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  <select 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-xl px-4 text-[11px] font-black uppercase outline-none focus:bg-white focus:ring-4 focus:ring-rose-500/5 focus:border-rose-300 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">SELECT_REASON_CODE</option>
                    <option value="Customer Request">Customer Request</option>
                    <option value="Duplicate Order">Duplicate Order</option>
                    <option value="Incorrect Address">Incorrect Address</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Cancel Test">Cancel Test</option>
                  </select>
                </div>
              </div>
              
              <div className="p-5 bg-rose-50/50 border border-rose-100 rounded-2xl flex gap-4">
                 <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={18} />
                 <p className="text-[10px] text-rose-800 font-bold leading-relaxed uppercase tracking-tight opacity-80">
                   System Warning: Termination is irreversible. Once the node is purged from the Maruti grid, tracking will be terminated.
                 </p>
              </div>
            </div>
            
            <XCircle size={180} className="absolute -bottom-10 -left-10 text-slate-900 opacity-[0.02] pointer-events-none" />
          </div>

          {status === 'success' && (
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-center gap-4 text-emerald-700 animate-in zoom-in-95 duration-500">
              <CheckCircle size={22} className="shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Void_Executed</span>
                <span className="text-[9px] font-bold opacity-70 uppercase tracking-widest">Network Synchronized successfully</span>
              </div>
            </div>
          )}
        </div>

        {/* ───────────────── RIGHT: PREVIEW PANEL ───────────────── */}
        <div className="lg:col-span-7">
          {preview ? (
            <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl overflow-hidden animate-in slide-in-from-right-8 duration-700 flex flex-col h-full">
              <div className="bg-[#0F172A] px-8 py-5 flex justify-between items-center">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                   <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" /> Confirmation Protocol Required
                </span>
                <Badge className="bg-white/10 text-white border-none font-mono text-[10px] px-3 py-1 uppercase tracking-widest">
                  {preview.status}
                </Badge>
              </div>
              
              <div className="p-10 flex-1 flex flex-col justify-between">
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target_Node</p>
                      <h4 className="text-4xl font-mono font-black text-slate-900 tracking-tighter italic">{query}</h4>
                      <div className="flex items-center gap-2 mt-4 text-slate-600">
                        <User size={14} className="text-indigo-500" />
                        <p className="text-[11px] font-black uppercase tracking-widest">Consignee: {preview.shippingAddress.name}</p>
                      </div>
                    </div>
                    <div className="text-right bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Valuation</p>
                      <p className="text-2xl font-mono font-black text-slate-900 italic">₹{preview.amount}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 border-y border-slate-50 py-8">
                     <div className="space-y-1">
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Origin_Hub</p>
                       <p className="text-xs font-black uppercase text-slate-700 flex items-center gap-2 italic">
                         <MapPin size={12} className="text-slate-400" /> {preview.pickupAddress.city}
                       </p>
                     </div>
                     <div className="space-y-1">
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Destination_Hub</p>
                       <p className="text-xs font-black uppercase text-slate-700 flex items-center gap-2 italic">
                         <Navigation size={12} className="text-slate-400" /> {preview.shippingAddress.city}
                       </p>
                     </div>
                  </div>
                </div>

                <div className="mt-10">
                  <button 
                    onClick={handleCancel}
                    disabled={loading || !reason}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white h-20 rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all disabled:opacity-30 shadow-2xl shadow-rose-100 active:scale-[0.98]"
                  >
                    {loading ? <Loader2 className="animate-spin" size={24}/> : <Trash2 size={24}/>}
                    Commit Termination
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center p-12 bg-slate-50/30 relative overflow-hidden group">
               <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl shadow-xl flex items-center justify-center text-slate-300 mb-8 transition-all group-hover:scale-110 group-hover:rotate-6">
                <Info size={32} />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Handshake Pending</h3>
                <p className="text-slate-400 max-w-xs text-[11px] font-bold uppercase tracking-widest leading-relaxed opacity-60">
                  Verify a valid Maruti Airway Bill to initialize the secure voiding protocol.
                </p>
              </div>
              <Hash size={300} className="absolute -bottom-20 -right-20 opacity-[0.02] text-slate-900 pointer-events-none" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}