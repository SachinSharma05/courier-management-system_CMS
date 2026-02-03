"use client";

import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Clock,  
  AlertCircle,
  Navigation2,
  Loader2,
  Box
} from 'lucide-react';
import clsx from 'clsx';
import { useMaruti } from '@/hooks/useMaruti';

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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ───────────────── SEARCH BAR ───────────────── */}
      <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="ENTER_AWB_OR_CAWB_FOR_REALTIME_TELEMETRY..."
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 text-xs font-mono font-black uppercase tracking-tight focus:ring-1 focus:ring-indigo-500 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={handleTrack}
          disabled={loading}
          className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Initiate_Scan"}
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 p-4 flex items-center gap-3 text-rose-600 rounded-sm animate-in fade-in zoom-in-95">
          <AlertCircle size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
        </div>
      )}

      {trackingData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* LEFT: ORDER METADATA (COL-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 text-white p-5 rounded-sm shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Identifier</p>
                  <h2 className="text-xl font-mono font-black">{query}</h2>
                </div>
                <div className="bg-indigo-500/20 p-2 rounded-sm text-indigo-400">
                  <Box size={20} />
                </div>
              </div>
              
              <div className="space-y-4">
                <MetaItem label="Current_Status" value={trackingData.status} highlight />
                <MetaItem label="Origin" value={trackingData.origin || "NOT_SET"} />
                <MetaItem label="Destination" value={trackingData.destination} />
                <MetaItem label="Weight" value={`${trackingData.weight}g`} />
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-sm">
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest flex items-center gap-2">
                <MapPin size={14}/> Consignee_Details
              </h3>
              <p className="text-sm font-black text-slate-900 uppercase">{trackingData.shippingAddress.name}</p>
              <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase leading-relaxed">
                {trackingData.shippingAddress.address1}, {trackingData.shippingAddress.city}, {trackingData.shippingAddress.zip}
              </p>
            </div>
          </div>

          {/* RIGHT: TRACKING TIMELINE (COL-8) */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col h-full">
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <Clock size={14} className="text-indigo-600"/> Movement_History
                </h3>
                <span className="text-[9px] font-mono text-slate-400 italic font-bold">LIVE_REPLICATION_ACTIVE</span>
              </div>
              
              <div className="p-8 relative">
                {/* TIMELINE THREAD */}
                <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-slate-100" />
                
                <div className="space-y-8 relative">
                  {trackingData.history?.map((event: any, idx: number) => (
                    <TimelineEvent 
                      key={idx}
                      status={event.status}
                      location={event.location}
                      time={event.timestamp}
                      isLatest={idx === 0}
                    />
                  )) || (
                    <div className="text-center py-10 opacity-30 italic text-[11px] font-bold uppercase">
                      NO_MOVEMENT_HISTORY_RECORDED_YET
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────── UI ATOMS ───────────────── */

function MetaItem({ label, value, highlight }: any) {
  return (
    <div className="border-b border-white/5 pb-2 last:border-0">
      <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{label}</p>
      <p className={clsx(
        "text-[11px] font-bold uppercase mt-0.5",
        highlight ? "text-emerald-400" : "text-white"
      )}>{value}</p>
    </div>
  );
}

function TimelineEvent({ status, location, time, isLatest }: any) {
  return (
    <div className="flex gap-6 group">
      <div className="relative z-10">
        <div className={clsx(
          "h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all",
          isLatest ? "bg-indigo-600 border-indigo-200 scale-125 shadow-lg shadow-indigo-100" : "bg-white border-slate-200"
        )}>
          {isLatest && <div className="h-1 w-1 bg-white rounded-full animate-ping" />}
        </div>
      </div>
      <div className="flex-1 pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
          <h4 className={clsx(
            "text-[11px] font-black uppercase tracking-tight",
            isLatest ? "text-indigo-600" : "text-slate-700"
          )}>{status}</h4>
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">{time}</span>
        </div>
        <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase flex items-center gap-1">
          <Navigation2 size={10} className="text-slate-300" /> {location}
        </p>
      </div>
    </div>
  );
}