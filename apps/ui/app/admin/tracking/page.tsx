'use client';

import { useState } from 'react';
import { 
  Box, Search, ArrowRight, UploadCloud, Clock, CheckCircle2, 
  MapPin, Terminal, Info, PackageCheck, History, ShieldAlert,
  Calendar, Navigation, Hash, ShieldCheck
} from 'lucide-react';
import clsx from 'clsx';
import { useTracking } from '@/hooks/useTracking';
import Link from 'next/link';

export default function TrackingPage() {
  const [awb, setAwb] = useState('');
  const [query, setQuery] = useState<string>();

  const { data, isLoading } = useTracking(query);

  // 1. Change to singular 'consignment' to match your API response
  const consignment = data?.consignment; 

  // 2. Add defensive checks for the description/remarks field
  const timelineEvents = data?.timeline?.map((e: any, idx: number) => ({
    status: e.status,
    location: e.location || 'Location Unknown',
    // Ensure the field name matches your API (description vs remarks)
    remarks: e.description || e.remarks || 'No details provided', 
    time: e.eventAt ? new Date(e.eventAt).toLocaleString() : 'Date Pending',
    isLatest: idx === 0,
  })) ?? [];

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Box size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Consignment Tracking</h1>
            <p className="text-sm text-slate-500 font-medium tracking-tight">Real-time status across multi-carrier networks</p>
          </div>
        </div>
      </div>

      {/* ───────────────── TRACKING INPUT AREA ───────────────── */}
      <div className="rounded-3xl bg-slate-950 p-6 shadow-2xl border border-slate-800">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
            <input
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
              placeholder="Enter AWB Number (e.g. 42315610020355)"
              className="w-full bg-slate-900 border-slate-800 text-white rounded-2xl pl-12 pr-4 py-4 text-sm font-mono focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button 
              onClick={() => setQuery(awb.trim())}
              className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-500/20">
              Track <ArrowRight size={18} />
            </button>
          </div>

          <div className="hidden lg:block h-10 w-[1px] bg-slate-800 mx-2" />

          <Link href="/admin/tracking/bulk">
            <label className="flex items-center gap-2 cursor-pointer rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-5 py-4 text-slate-400 hover:text-white hover:border-slate-500 transition-all group">
              <UploadCloud size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">Bulk Upload</span>
            </label>
          </Link>
        </div>
      </div>

      {consignment ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ───────────────── LEFT: SCROLLABLE TIMELINE (8 Cols) ───────────────── */}
          <div className="lg:col-span-8 space-y-4 order-2 lg:order-1">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight text-xs">
                <History size={18} className="text-indigo-600" /> 
                Live Activity Timeline
              </h3>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded tracking-widest">AUTO-REFRESHING</span>
            </div>

            <div className="max-h-[700px] overflow-y-auto pr-4 no-scrollbar space-y-4">
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  {event.isLatest && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />}
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-row md:flex-col items-center md:items-start gap-4 shrink-0">
                       <div className={clsx(
                         "h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105",
                         event.isLatest ? "bg-emerald-50 text-emerald-600 shadow-sm" : "bg-slate-50 text-slate-400"
                       )}>
                         {event.isLatest ? <PackageCheck size={24} /> : <Clock size={22} />}
                       </div>
                       <div className="md:mt-2">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{event.time.split(',')[1]}</p>
                         <p className="text-[10px] font-bold text-slate-500 uppercase">{event.time.split(',')[0]}</p>
                       </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold text-slate-900 tracking-tight">{event.status}</h4>
                        <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-bold border border-slate-200 uppercase">{event.location}</span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {event.remarks}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ───────────────── RIGHT: CONSIGNMENT DETAILS (4 Cols) ───────────────── */}
          <div className="lg:col-span-4 space-y-6 order-1 lg:order-2 lg:sticky lg:top-6">
            
            {/* Status Card */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-8 space-y-6">
              <div className="space-y-1 text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</p>
                 <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">{consignment.status}</h2>
                 <div className="flex items-center justify-center gap-2 mt-4">
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-[10px] font-bold border",
                      consignment.movement === "Critical" ? "bg-red-50 text-red-600 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    )}>MOV: {consignment.movement}</span>
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold border border-indigo-100">TAT: {consignment.tat}</span>
                 </div>
              </div>

              <div className="h-[1px] bg-slate-100 w-full" />

              <div className="space-y-4">
                <DetailRow icon={<Hash size={14}/>} label="AWB Number" value={consignment.awb} isBold />
                <DetailRow icon={<Navigation size={14}/>} label="Carrier" value={consignment.provider} />
                <DetailRow icon={<MapPin size={14}/>} label="Origin" value={consignment.origin} />
                <DetailRow icon={<Navigation size={14}/>} label="Destination" value={consignment.destination} />
                <DetailRow icon={<Calendar size={14}/>} label="Booked At" value={new Date(consignment.bookedAt).toLocaleDateString()} />
                <DetailRow icon={<Clock size={14}/>} label="Last Update" value={new Date(consignment.lastUpdatedAt).toLocaleTimeString()} />
              </div>

              <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                Download Proof of Delivery <ArrowRight size={16} />
              </button>
            </div>

            {/* Support/Info Card */}
            <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
              <ShieldCheck className="absolute -right-4 -bottom-4 h-32 w-32 text-indigo-500 opacity-20 group-hover:rotate-12 transition-transform" />
              <div className="relative z-10">
                <h4 className="font-bold text-lg mb-2">Verified Tracking</h4>
                <p className="text-indigo-100 text-xs leading-relaxed opacity-90">
                  Data sourced directly from {consignment.provider} master server. Last handshake verified successfully.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-[3rem] text-slate-400">
           <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
             <Search size={32} className="opacity-20" />
           </div>
           <p className="font-bold tracking-tight uppercase text-xs">Waiting for valid AWB entry...</p>
        </div>
      )}
    </div>
  );
}

// ───────────────── SUBCOMPONENTS ─────────────────

function DetailRow({ label, value, icon, isBold }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-slate-300">{icon}</div>
      <div className="flex-1 border-b border-slate-50 pb-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
        <p className={clsx("text-xs text-slate-700 mt-0.5", isBold ? "font-black" : "font-medium")}>{value || '—'}</p>
      </div>
    </div>
  );
}

/* ───────────────── COMPONENTS ───────────────── */

function StatusBadge({ status }: { status: string }) {
  const isDelivered = status === 'Delivered' || status === 'Out for Delivery';
  return (
    <span className={clsx(
      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold border ring-4 ring-white shadow-sm",
      isDelivered ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-blue-50 text-blue-700 border-blue-100"
    )}>
      {isDelivered ? <PackageCheck size={12}/> : <Truck size={12}/>}
      {status.toUpperCase()}
    </span>
  );
}

function Th({ children }: any) {
  return <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">{children}</th>;
}

function Td({ children, className }: any) {
  return <td className={clsx("px-6 py-4 text-sm text-slate-600", className)}>{children}</td>;
}