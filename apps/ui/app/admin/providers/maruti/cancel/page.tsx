"use client";

import React, { useState } from 'react';
import { 
  XCircle, Search, AlertTriangle, Trash2, 
  Info, ShieldAlert, Loader2, CheckCircle 
} from 'lucide-react';
import { useMaruti } from '@/hooks/useMaruti';

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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="border-b border-rose-200 pb-4">
        <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
          <XCircle className="text-rose-600" /> Order_Termination_Terminal
        </h1>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
          Maruti_Air // Security_Void_Protocol_V3
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* INPUT PANEL */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase">Target_Identifier (Order_ID / AWB)</label>
              <div className="flex gap-2 mt-1">
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ID_ENTRY..."
                  className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono font-black outline-none focus:border-rose-500"
                />
                <button 
                  onClick={handleVerify}
                  className="bg-slate-900 text-white px-4 py-2 text-[10px] font-black uppercase"
                >
                  Verify
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase">Cancellation_Reason</label>
              <select 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-[10px] font-black uppercase outline-none focus:border-rose-500 appearance-none"
              >
                <option value="">SELECT_REASON</option>
                <option value="Customer Request">Customer Request</option>
                <option value="Duplicate Order">Duplicate Order</option>
                <option value="Incorrect Address">Incorrect Address</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Cancel Test">Cancel Test</option>
              </select>
            </div>
            
            <div className="p-4 bg-rose-50 border border-rose-100 flex gap-3">
               <AlertTriangle className="text-rose-600 shrink-0" size={16} />
               <p className="text-[9px] text-rose-800 font-bold leading-relaxed uppercase">
                 Warning: This action is irreversible. Once the node is terminated in the Maruti network, tracking will cease.
               </p>
            </div>
          </div>

          {status === 'success' && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-sm flex items-center gap-3 text-emerald-700 animate-in fade-in zoom-in-95">
              <CheckCircle size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">ORDER_VOID_SUCCESSFUL</span>
            </div>
          )}
        </div>

        {/* PREVIEW PANEL */}
        <div className="md:col-span-7">
          {preview ? (
            <div className="bg-white border-2 border-rose-500/20 rounded-sm shadow-xl overflow-hidden animate-in slide-in-from-right-4">
              <div className="bg-rose-600 px-4 py-2 flex justify-between items-center">
                <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                   <ShieldAlert size={14}/> Confirmation_Required
                </span>
                <span className="text-[9px] font-mono text-rose-200">{preview.status}</span>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-mono font-black text-slate-900">{query}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Consignee: {preview.shippingAddress.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Invoice_Amt</p>
                    <p className="text-lg font-mono font-black text-slate-900">₹{preview.amount}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
                   <div>
                     <p className="text-[8px] font-black text-slate-400 uppercase">Origin</p>
                     <p className="text-[10px] font-black uppercase text-slate-700">{preview.pickupAddress.city}</p>
                   </div>
                   <div>
                     <p className="text-[8px] font-black text-slate-400 uppercase">Destination</p>
                     <p className="text-[10px] font-black uppercase text-slate-700">{preview.shippingAddress.city}</p>
                   </div>
                </div>

                <button 
                  onClick={handleCancel}
                  disabled={loading || !reason}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-lg shadow-rose-100"
                >
                  {loading ? <Loader2 className="animate-spin" size={18}/> : <Trash2 size={18}/>}
                  Confirm_Termination
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center p-8 opacity-40">
               <Info size={40} className="mb-4" />
               <p className="text-[11px] font-black uppercase tracking-widest text-center">
                 Verify_an_Order_ID_to_begin_the<br/>Termination_Protocol
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}