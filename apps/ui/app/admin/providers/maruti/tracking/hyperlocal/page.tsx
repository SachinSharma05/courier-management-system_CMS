"use client";

import React, { useState } from 'react';
import { 
  Zap, MapPin, Navigation, Clock, 
  Phone, User, ShieldCheck, Timer,
  Search, Loader2, AlertCircle
} from 'lucide-react';
import { useMaruti } from '@/hooks/useMaruti';

export default function HyperlocalTracking() {
  const { trackOrder } = useMaruti();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await trackOrder(query);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* SEARCH HEADER */}
      <div className="bg-white border-b-2 border-amber-500 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
          <Zap className="text-amber-500" fill="currentColor" size={20} />
          <h2 className="text-xs font-black uppercase tracking-widest">Hyperlocal_Radar</h2>
        </div>
        <div className="flex-1 relative w-full">
          <input 
            type="text"
            placeholder="ENTER_HYPERLOCAL_AWB..."
            className="w-full bg-slate-50 border border-slate-200 pl-4 pr-4 py-2 text-xs font-mono font-black uppercase outline-none focus:border-amber-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={handleTrack}
          className="bg-slate-900 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-colors"
        >
          {loading ? <Loader2 className="animate-spin" size={14}/> : 'Intercept_Signal'}
        </button>
      </div>

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          
          {/* MISSION STATUS CARD */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Timer size={80} />
              </div>
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded-sm border border-amber-200">
                    {data.deliveryPromise || '90_MIN_DELIVERY'}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2 tracking-tighter uppercase">{data.status}</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Live_Tracking_Session: {query}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Estimated_Arrival</p>
                  <p className="text-xl font-mono font-black text-indigo-600">14:20 PM</p>
                </div>
              </div>

              {/* VISUAL PROGRESS BAR */}
              <div className="space-y-2">
                 <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                    <span>Pickup</span>
                    <span>In_Transit</span>
                    <span>Destination</span>
                 </div>
                 <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-amber-500 w-1/3 border-r border-white" />
                    <div className="h-full bg-amber-500 w-1/3 animate-pulse border-r border-white" />
                    <div className="h-full bg-slate-200 w-1/3" />
                 </div>
              </div>
            </div>

            {/* ROUTE TELEMETRY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <LocationCard title="Pickup_Origin" address={data.pickupAddress} icon={<Navigation size={14}/>} />
               <LocationCard title="Final_Destination" address={data.shippingAddress} icon={<MapPin size={14}/>} />
            </div>
          </div>

          {/* RIDER & SENSOR DATA */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-sm shadow-xl border-t-4 border-amber-500">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-slate-500">Rider_Assignment</h4>
               <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 text-amber-500">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight">{data.riderName || 'Unit_772_Rahul'}</p>
                    <p className="text-[9px] font-bold text-slate-500 flex items-center gap-1 mt-1">
                      <ShieldCheck size={10} className="text-emerald-500"/> VERIFIED_PARTNER
                    </p>
                  </div>
               </div>
               <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                  <Phone size={14}/> Contact_Rider
               </button>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-sm">
               <h4 className="text-[9px] font-black uppercase text-indigo-900 mb-2">Order_Payload</h4>
               <div className="space-y-1">
                 {data.lineItems?.map((item: any, i: number) => (
                   <div key={i} className="flex justify-between text-[10px] font-bold text-indigo-700">
                     <span>{item.name} x {item.quantity}</span>
                     <span>₹{item.price}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

/* ───────────────── UI COMPONENTS ───────────────── */

function LocationCard({ title, address, icon }: any) {
  return (
    <div className="bg-white border border-slate-200 p-4 rounded-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-amber-600 bg-amber-50 p-1.5 rounded-sm">{icon}</span>
        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{title}</h4>
      </div>
      <p className="text-[11px] font-black text-slate-800 uppercase leading-snug">
        {address.address1}
      </p>
      <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">
        {address.city}, {address.state} - {address.zip}
      </p>
      <div className="mt-3 pt-3 border-t border-slate-50 flex gap-4">
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase">Lat</p>
          <p className="text-[10px] font-mono font-bold text-slate-600">{address.latitude}</p>
        </div>
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase">Long</p>
          <p className="text-[10px] font-mono font-bold text-slate-600">{address.longitude}</p>
        </div>
      </div>
    </div>
  );
}