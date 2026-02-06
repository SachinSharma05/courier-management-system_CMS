"use client";

import React, { useState } from 'react';
import { 
  Zap, MapPin, Navigation, Phone, User, Activity, Timer, Loader2, 
  Package,
  Clock,
  Radar
} from 'lucide-react';
import { useMaruti } from '@/hooks/useMaruti';
import clsx from 'clsx';

// export default function HyperlocalTracking() {
//   const { trackOrder } = useMaruti();
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<any>(null);

//   const handleTrack = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await trackOrder(query);
//       setData(res.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto space-y-6">
//       {/* SEARCH HEADER */}
//       <div className="bg-white border-b-2 border-amber-500 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
//         <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
//           <Zap className="text-amber-500" fill="currentColor" size={20} />
//           <h2 className="text-xs font-black uppercase tracking-widest">Hyperlocal_Radar</h2>
//         </div>
//         <div className="flex-1 relative w-full">
//           <input 
//             type="text"
//             placeholder="ENTER_HYPERLOCAL_AWB..."
//             className="w-full bg-slate-50 border border-slate-200 pl-4 pr-4 py-2 text-xs font-mono font-black uppercase outline-none focus:border-amber-500"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//           />
//         </div>
//         <button 
//           onClick={handleTrack}
//           className="bg-slate-900 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-colors"
//         >
//           {loading ? <Loader2 className="animate-spin" size={14}/> : 'Intercept_Signal'}
//         </button>
//       </div>

//       {data && (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          
//           {/* MISSION STATUS CARD */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm relative overflow-hidden">
//               <div className="absolute top-0 right-0 p-4 opacity-5">
//                 <Timer size={80} />
//               </div>
              
//               <div className="flex justify-between items-start mb-8">
//                 <div>
//                   <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded-sm border border-amber-200">
//                     {data.deliveryPromise || '90_MIN_DELIVERY'}
//                   </span>
//                   <h3 className="text-2xl font-black text-slate-900 mt-2 tracking-tighter uppercase">{data.status}</h3>
//                   <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Live_Tracking_Session: {query}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-[9px] font-black text-slate-400 uppercase">Estimated_Arrival</p>
//                   <p className="text-xl font-mono font-black text-indigo-600">14:20 PM</p>
//                 </div>
//               </div>

//               {/* VISUAL PROGRESS BAR */}
//               <div className="space-y-2">
//                  <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
//                     <span>Pickup</span>
//                     <span>In_Transit</span>
//                     <span>Destination</span>
//                  </div>
//                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
//                     <div className="h-full bg-amber-500 w-1/3 border-r border-white" />
//                     <div className="h-full bg-amber-500 w-1/3 animate-pulse border-r border-white" />
//                     <div className="h-full bg-slate-200 w-1/3" />
//                  </div>
//               </div>
//             </div>

//             {/* ROUTE TELEMETRY */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                <LocationCard title="Pickup_Origin" address={data.pickupAddress} icon={<Navigation size={14}/>} />
//                <LocationCard title="Final_Destination" address={data.shippingAddress} icon={<MapPin size={14}/>} />
//             </div>
//           </div>

//           {/* RIDER & SENSOR DATA */}
//           <div className="space-y-6">
//             <div className="bg-slate-900 text-white p-6 rounded-sm shadow-xl border-t-4 border-amber-500">
//                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-slate-500">Rider_Assignment</h4>
//                <div className="flex items-center gap-4 mb-6">
//                   <div className="h-12 w-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 text-amber-500">
//                     <User size={24} />
//                   </div>
//                   <div>
//                     <p className="text-sm font-black uppercase tracking-tight">{data.riderName || 'Unit_772_Rahul'}</p>
//                     <p className="text-[9px] font-bold text-slate-500 flex items-center gap-1 mt-1">
//                       <ShieldCheck size={10} className="text-emerald-500"/> VERIFIED_PARTNER
//                     </p>
//                   </div>
//                </div>
//                <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
//                   <Phone size={14}/> Contact_Rider
//                </button>
//             </div>

//             <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-sm">
//                <h4 className="text-[9px] font-black uppercase text-indigo-900 mb-2">Order_Payload</h4>
//                <div className="space-y-1">
//                  {data.lineItems?.map((item: any, i: number) => (
//                    <div key={i} className="flex justify-between text-[10px] font-bold text-indigo-700">
//                      <span>{item.name} x {item.quantity}</span>
//                      <span>₹{item.price}</span>
//                    </div>
//                  ))}
//                </div>
//             </div>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }

// /* ───────────────── UI COMPONENTS ───────────────── */

// function LocationCard({ title, address, icon }: any) {
//   return (
//     <div className="bg-white border border-slate-200 p-4 rounded-sm">
//       <div className="flex items-center gap-2 mb-3">
//         <span className="text-amber-600 bg-amber-50 p-1.5 rounded-sm">{icon}</span>
//         <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{title}</h4>
//       </div>
//       <p className="text-[11px] font-black text-slate-800 uppercase leading-snug">
//         {address.address1}
//       </p>
//       <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">
//         {address.city}, {address.state} - {address.zip}
//       </p>
//       <div className="mt-3 pt-3 border-t border-slate-50 flex gap-4">
//         <div>
//           <p className="text-[8px] font-black text-slate-400 uppercase">Lat</p>
//           <p className="text-[10px] font-mono font-bold text-slate-600">{address.latitude}</p>
//         </div>
//         <div>
//           <p className="text-[8px] font-black text-slate-400 uppercase">Long</p>
//           <p className="text-[10px] font-mono font-bold text-slate-600">{address.longitude}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
export default function HyperlocalTracking() {
  const { trackOrder } = useMaruti();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
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
    <div className="min-h-screen bg-slate-50/50 w-full pb-20">
      <div className="max-w-[1400px] mx-auto space-y-8 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ───────────────── RADAR SEARCH HEADER ───────────────── */}
      <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm flex flex-col md:flex-row gap-6 items-center">
        <div className="flex items-center gap-4 px-6 py-2 border-r border-slate-100 h-12">
          <div className="bg-amber-100 p-2 rounded-lg">
            <Zap className="text-amber-600" fill="currentColor" size={20} />
          </div>
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 leading-none">Hyperlocal_Radar</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Status: Active_Scanning</p>
          </div>
        </div>
        
        <div className="flex-1 relative w-full group">
          <input 
            type="text"
            placeholder="ENTER_HYPERLOCAL_AWB_FOR_SIGNAL_INTERCEPT..."
            className="w-full bg-slate-50 border border-slate-100 pl-6 pr-6 h-14 rounded-2xl text-sm font-mono font-black uppercase outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-inner"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack(e as any)}
          />
        </div>
        
        <button 
          onClick={handleTrack}
          disabled={loading}
          className="bg-[#0F172A] hover:bg-black text-white px-10 h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Activity size={18} className="animate-spin text-amber-500" /> : <Radar size={18} className="text-amber-500" />}
          {loading ? 'Locking_Signal...' : 'Intercept_Signal'}
        </button>
      </div>

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in zoom-in-95 duration-700">
          
          {/* ───────────────── MISSION STATUS CARD (COL-8) ───────────────── */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none rotate-12">
                <Timer size={180} />
              </div>
              
              <div className="flex justify-between items-start mb-12 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase rounded-lg border border-amber-100 mb-4 tracking-widest">
                    <Clock size={12}/> {data.deliveryPromise || '90_MIN_DELIVERY'}
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{data.status}</h3>
                  <p className="text-[11px] font-bold text-slate-400 mt-3 uppercase tracking-widest flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-pulse"/> Tracking_Session: {query}
                  </p>
                </div>
                <div className="text-right bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated_Arrival</p>
                  <p className="text-2xl font-mono font-black text-indigo-600">14:20 <span className="text-xs">PM</span></p>
                </div>
              </div>

              {/* VISUAL PROGRESS TELEMETRY */}
              <div className="space-y-4 pt-6 border-t border-slate-50">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 px-1">
                    <span className="text-amber-600">Pickup_Success</span>
                    <span className="text-amber-600 animate-pulse">In_Transit_Active</span>
                    <span className="opacity-50">Final_Handover</span>
                 </div>
                 <div className="h-4 bg-slate-50 rounded-full p-1 border border-slate-100 overflow-hidden flex gap-1">
                    <div className="h-full bg-amber-500 w-1/3 rounded-l-full shadow-[0_0_12px_rgba(245,158,11,0.3)]" />
                    <div className="h-full bg-amber-400 w-1/3 animate-pulse" />
                    <div className="h-full bg-slate-100 w-1/3 rounded-r-full" />
                 </div>
              </div>
            </div>

            {/* ROUTE TELEMETRY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LocationCard title="Pickup_Origin" address={data.pickupAddress} icon={<Navigation size={18}/>} accent="amber" />
                <LocationCard title="Final_Destination" address={data.shippingAddress} icon={<MapPin size={18}/>} accent="indigo" />
            </div>
          </div>

          {/* ───────────────── RIDER & PAYLOAD (COL-4) ───────────────── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0F172A] text-white p-8 rounded-[2.5rem] shadow-2xl border-t-8 border-amber-500">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-slate-500">Field_Unit_Assignment</h4>
               <div className="flex items-center gap-6 mb-8">
                  <div className="h-16 w-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 text-amber-500 shadow-inner rotate-3">
                    <User size={32} />
                  </div>
                  <div>
                    <p className="text-xl font-black uppercase tracking-tight italic">{data.riderName || 'Unit_772_Rahul'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 text-[9px] font-black uppercase">Verified</div>
                      <div className="px-2 py-0.5 bg-white/5 text-slate-400 rounded text-[9px] font-black uppercase italic">ID: MAR-7729</div>
                    </div>
                  </div>
               </div>
               <button className="w-full bg-white text-[#0F172A] hover:bg-amber-500 hover:text-white h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 group">
                  <Phone size={18} className="group-hover:rotate-12 transition-transform"/> Secure_Comm_Link
               </button>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 p-8 rounded-[2.5rem]">
               <h4 className="text-[10px] font-black uppercase text-indigo-900 mb-6 tracking-widest flex items-center gap-2">
                 <Package size={16} /> Payload_Manifest
               </h4>
               <div className="space-y-4">
                 {data.lineItems?.map((item: any, i: number) => (
                   <div key={i} className="flex justify-between items-center bg-white/50 p-4 rounded-xl border border-indigo-100 shadow-sm">
                     <div className="flex flex-col">
                        <span className="text-[11px] font-black text-indigo-950 uppercase">{item.name}</span>
                        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-tighter">Qty: {item.quantity} units</span>
                     </div>
                     <span className="text-xs font-mono font-black text-indigo-700">₹{item.price}</span>
                   </div>
                 ))}
               </div>
               <div className="mt-6 pt-4 border-t border-indigo-100 flex justify-between items-center px-2">
                  <span className="text-[10px] font-black text-indigo-400 uppercase">Valuation</span>
                  <span className="text-lg font-black text-indigo-900 tracking-tighter italic">₹{data.lineItems?.reduce((acc: number, item: any) => acc + item.price, 0) || '0.00'}</span>
               </div>
            </div>
          </div>

        </div>
      )}
    </div>
    </div>
  );
}

/* ───────────────── UI SUB-COMPONENTS ───────────────── */

function LocationCard({ title, address, icon, accent }: any) {
  const colorMap = {
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100"
  };

  return (
    <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm group hover:border-amber-200 transition-colors">
      <div className="flex items-center gap-4 mb-6">
        <span className={clsx("p-3 rounded-xl border shadow-sm transition-transform group-hover:-translate-y-1", colorMap[accent as keyof typeof colorMap])}>
          {icon}
        </span>
        <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">{title}</h4>
      </div>
      <div className="space-y-1 h-14">
        <p className="text-sm font-black text-slate-800 uppercase leading-snug tracking-tight">
          {address.address1}
        </p>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter italic">
          {address.city}, {address.state} - {address.zip}
        </p>
      </div>
      <div className="mt-8 pt-6 border-t border-slate-50 flex gap-8">
        <div>
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Lat_Node</p>
          <p className="text-[11px] font-mono font-black text-slate-600 tracking-tighter">{address.latitude}</p>
        </div>
        <div>
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Long_Node</p>
          <p className="text-[11px] font-mono font-black text-slate-600 tracking-tighter">{address.longitude}</p>
        </div>
      </div>
    </div>
  );
}