'use client';

import { useState } from 'react';
import { 
  Search, UploadCloud, MapPin, Clock, 
  Info, Box, ArrowRight, CheckCircle2, 
  Truck, PackageCheck, Terminal
} from 'lucide-react';
import clsx from 'clsx';

// ... (TrackingEvent type and MOCK_EVENTS stay the same)
type TrackingEvent = {
  time: string;
  status: string;
  location: string;
  remarks: string;
};

const MOCK_EVENTS: TrackingEvent[] = [
  {
    time: '2025-02-01 10:20',
    status: 'Picked Up',
    location: 'Delhi',
    remarks: 'Shipment picked up',
  },
  {
    time: '2025-02-01 18:45',
    status: 'In Transit',
    location: 'Gurgaon Hub',
    remarks: 'Arrived at hub',
  },
  {
    time: '2025-02-02 09:10',
    status: 'Out for Delivery',
    location: 'Mumbai',
    remarks: 'Out for delivery',
  },
];

export default function TrackingPage() {
  const [awb, setAwb] = useState('');
  const [provider, setProvider] = useState('DTDC');

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Box size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Consignment Tracking</h1>
            <p className="text-sm text-slate-500 font-medium">Real-time status across multi-carrier networks</p>
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
              placeholder="Enter AWB Number (e.g. DTDC123456)"
              className="w-full bg-slate-900 border-slate-800 text-white rounded-2xl pl-12 pr-4 py-4 text-sm font-mono focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="flex-1 lg:w-40 bg-slate-900 border-slate-800 text-slate-300 rounded-2xl px-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/50 border transition-all appearance-none cursor-pointer"
            >
              <option>DTDC</option>
              <option>Delhivery</option>
              <option>Maruti</option>
            </select>

            <button className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95">
              Track <ArrowRight size={18} />
            </button>
          </div>

          <div className="hidden lg:block h-10 w-[1px] bg-slate-800 mx-2" />

          <label className="flex items-center gap-2 cursor-pointer rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-5 py-4 text-slate-400 hover:text-white hover:border-slate-500 transition-all group">
            <UploadCloud size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">Bulk Upload</span>
            <input type="file" className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* ───────────────── VISUAL TIMELINE ───────────────── */}
        <div className="xl:col-span-1 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock size={18} className="text-indigo-600" />
            Journey Timeline
          </h3>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="relative space-y-8">
              {/* Vertical Line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100" />
              
              {MOCK_EVENTS.map((event, idx) => (
                <div key={idx} className="relative flex gap-6 group">
                  <div className={clsx(
                    "relative z-10 h-8 w-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-transform group-hover:scale-110",
                    idx === 0 ? "bg-emerald-500 text-white" : "bg-indigo-100 text-indigo-600"
                  )}>
                    {idx === 0 ? <CheckCircle2 size={14} /> : <div className="h-2 w-2 rounded-full bg-current" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{event.time}</p>
                    <h4 className="font-bold text-slate-900">{event.status}</h4>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ───────────────── DETAILED TABLE ───────────────── */}
        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Terminal size={18} className="text-indigo-600" />
            Event Details
          </h3>
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <Th>Activity</Th>
                    <Th>Status</Th>
                    <Th>Remarks</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {MOCK_EVENTS.map((event, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <Td>
                         <div className="flex flex-col">
                            <span className="font-bold text-slate-900">{event.location}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{event.time}</span>
                         </div>
                      </Td>
                      <Td>
                        <StatusBadge status={event.status} />
                      </Td>
                      <Td className="text-slate-500 italic text-xs">{event.remarks}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-indigo-50 p-4 border border-indigo-100">
            <Info className="text-indigo-600 shrink-0" size={20} />
            <p className="text-xs text-indigo-700 leading-relaxed font-medium">
              Provider Raw Payload available in <strong>Developer Mode</strong>. Click on any event row to view the JSON response from {provider} API.
            </p>
          </div>
        </div>
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