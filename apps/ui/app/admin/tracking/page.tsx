'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Box, Search, ArrowRight, UploadCloud, History, PackageCheck, Clock, Navigation, MapPin, 
  Calendar, ChevronDown, ExternalLink, Truck, Map, List, SearchX, Loader2, Terminal, Activity
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { useTracking } from '@/hooks/useTracking';
import { TrackingResult } from '../interface/adminInterface';

/* ================= UTILITIES ================= */
const sanitizeAwbs = (input: string) => {
  return input
    .split(/[\s,\n]+/)
    .filter(Boolean)
    .slice(0, 25)
    .join(',');
};

/* ================= MAIN CONTENT ================= */
export default function TrackingPage() {
  return (
    <Suspense fallback={
        <div className="p-10 text-center animate-pulse flex flex-col items-center gap-4">
            <Box className="text-slate-200" size={40}/>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Initializing_Tracking_Engine...</p>
        </div>
    }>
      <TrackingContent />
    </Suspense>
  );
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const awbFromUrl = searchParams.get('awb');

  const sanitizedFromUrl = useMemo(() => {
    return awbFromUrl ? sanitizeAwbs(awbFromUrl) : '';
  }, [awbFromUrl]);

  const [inputValue, setInputValue] = useState(() => sanitizedFromUrl);
  const [query, setQuery] = useState(() => sanitizedFromUrl);
  const [expandedAwb, setExpandedAwb] = useState<string | null>(null);
  const { data, isLoading } = useTracking(query);

  const results = useMemo(() => (Array.isArray(data) ? (data as TrackingResult[]) : []), [data]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = sanitizeAwbs(inputValue);
    setQuery(sanitized);
    setExpandedAwb(null); 
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      
      {/* ───────────────── HEADER: UNIFIED FLAT ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-5 border border-slate-200 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Tracking Command Center</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Batch Processing Engine • 25 AWB Limit</p>
          </div>
        </div>
      </div>

      {/* ───────────────── TRACKING INPUT: SEMANTIC DARK ───────────────── */}
      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-xl">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch gap-3">
          <div className="relative flex-1 group">
            <Terminal className="absolute left-3 top-3 text-slate-600" size={16} />
            <textarea
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Input AWB list (Comma or Newline separated)..."
              className="w-full bg-slate-950 border border-slate-800 text-emerald-400 rounded-lg pl-10 pr-4 py-3 text-xs font-mono focus:border-blue-500/50 outline-none transition-all resize-none min-h-[48px] placeholder:text-slate-700"
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch(e); }}}
            />
          </div>
          <div className="flex gap-2">
            <button 
              type="submit"
              disabled={isLoading}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all disabled:opacity-50 tracking-tight"
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : 'Execute Sync'} 
              <ArrowRight size={14} />
            </button>
            <Link href="/admin/tracking/bulk" className="flex">
              <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-5 py-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer">
                <UploadCloud size={14} />
                <span className="text-xs font-bold whitespace-nowrap">Bulk Upload</span>
              </div>
            </Link>
          </div>
        </form>
      </div>

      {/* ───────────────── RESULTS AREA ───────────────── */}
      <div className="space-y-4">
        {results.length > 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Stream Result: {results.length} Nodes Found</span>
                <List size={14} className="text-slate-400"/>
            </div>
            <div className="divide-y divide-slate-100">
                {results.map((item) => (
                  <TrackingAccordion 
                    key={item.consignment.awb} 
                    item={item} 
                    isExpanded={expandedAwb === item.consignment.awb || results.length === 1}
                    onToggle={() => setExpandedAwb(expandedAwb === item.consignment.awb ? null : item.consignment.awb)}
                  />
                ))}
            </div>
          </div>
        ) : (
          !isLoading && query && (
            <div className="text-center py-24 bg-white border border-slate-200 rounded-xl">
              <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchX className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-900 font-bold text-sm">No Matching Records</p>
              <p className="text-slate-500 text-xs mt-1">Verify the AWBs and try re-syncing.</p>
            </div>
          )
        )}

        {!query && !isLoading && (
          <div className="flex flex-col items-center justify-center py-32 bg-white border border-slate-200 rounded-xl">
             <div className="relative">
                <Search size={48} className="text-slate-100" />
                <div className="absolute inset-0 animate-ping rounded-full bg-slate-50 opacity-20" />
             </div>
             <p className="font-bold text-slate-400 text-xs mt-6 tracking-tight">Awaiting batch tracking sequence input</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= COMPONENT: ACCORDION (Refactored for Flat) ================= */

function TrackingAccordion({ item, isExpanded, onToggle }: { item: TrackingResult, isExpanded: boolean, onToggle: () => void }) {
  const { consignment } = item;
  return (
    <div className="w-full">
      <button 
        onClick={onToggle}
        className={clsx(
            "w-full flex items-center justify-between p-5 text-left transition-colors",
            isExpanded ? "bg-blue-50/30" : "bg-white hover:bg-slate-50"
        )}
      >
        <div className="flex items-center gap-12">
          <div className="flex flex-col">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">{consignment.provider}</p>
            <h4 className="font-mono font-bold text-slate-900 text-base">{consignment.awb}</h4>
          </div>
          
          <div className="hidden md:flex flex-col border-l border-slate-200 pl-8">
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Status</p>
            <p className="text-[11px] font-bold text-slate-700">{consignment.status}</p>
          </div>

          <div className="hidden lg:flex flex-col border-l border-slate-200 pl-8">
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Transit Route</p>
            <p className="text-[11px] font-bold text-slate-700">{consignment.origin} → {consignment.destination}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
            <span className={clsx("px-3 py-1 rounded-full text-[10px] font-bold border", 
              consignment.movement === "Critical" ? "bg-rose-100 text-rose-700 border-rose-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"
            )}>{consignment.movement}</span>
            <div className={clsx("p-1.5 rounded-lg transition-transform", isExpanded ? "rotate-180 bg-blue-100 text-blue-600" : "bg-slate-50 text-slate-400")}>
               <ChevronDown size={18} />
            </div>
        </div>
      </button>

      {isExpanded && (
        <div className="p-8 bg-white border-t border-slate-100 animate-in slide-in-from-top-1 duration-200">
          <DetailedTrackingView item={item} isEmbedded />
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENT: DETAILED VIEW (Refactored for Flat) ================= */

function DetailedTrackingView({ item, isEmbedded = false }: { item: TrackingResult, isEmbedded?: boolean }) {
  const { consignment, timeline } = item;
  
  return (
    <div className={clsx("grid grid-cols-1 lg:grid-cols-12 gap-8 items-start", !isEmbedded && "animate-in fade-in")}>
      
      {/* ───────────────── TIMELINE (Left) ───────────────── */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <History size={16} className="text-slate-400"/> Operational Audit Trail
            </h3>
            <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded border">Synced: Live</span>
        </div>
        
        <div className="space-y-3">
          {timeline.map((event, idx) => (
            <div key={idx} className="group flex gap-4 relative">
              <div className="flex flex-col items-center">
                 <div className={clsx(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border transition-all shadow-sm", 
                    idx === 0 ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300"
                 )}>
                   {idx === 0 ? <PackageCheck size={18} /> : <Clock size={16} />}
                 </div>
                 {idx !== timeline.length - 1 && <div className="w-0.5 h-full bg-slate-100 my-1" />}
              </div>
              
              <div className="flex-1 pb-6 min-w-0">
                <div className="flex justify-between items-start">
                  <h5 className={clsx("text-sm font-bold tracking-tight", idx === 0 ? "text-blue-600" : "text-slate-900")}>
                    {event.status}
                  </h5>
                  <span className="text-[11px] font-semibold text-slate-400">{new Date(event.eventAt).toLocaleString()}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{event.description || event.remarks}</p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mt-2">
                    <MapPin size={12} className="text-slate-300"/> {event.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────── METADATA (Right) ───────────────── */}
      <div className="lg:col-span-5">
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 sticky top-4">
           <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm">
                 <Box className="text-slate-600" size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase">Master Entity</p>
                 <h2 className="text-lg font-mono font-bold text-slate-900 leading-none">{consignment.awb}</h2>
              </div>
           </div>

           <div className="space-y-1">
              <DetailRow icon={<Truck size={14}/>} label="Carrier Service" value={consignment.provider} />
              <DetailRow icon={<Map size={14}/>} label="Origin Hub" value={consignment.origin} />
              <DetailRow icon={<Navigation size={14}/>} label="Final Dest" value={consignment.destination} />
              <DetailRow icon={<Calendar size={14}/>} label="System Entry" value={new Date(consignment.bookedAt).toLocaleDateString()} />
           </div>

           <Link 
             href={`/admin/tracking?awb=${consignment.awb}`} 
             className="mt-8 w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-xl text-xs font-bold hover:bg-black transition-all"
           >
             Generate Full Report <ExternalLink size={14} />
           </Link>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-200/60 last:border-0">
      <div className="flex items-center gap-3 text-slate-400 font-semibold text-[11px]">
          {icon} <span className="uppercase tracking-tight">{label}</span>
      </div>
      <span className="font-bold text-slate-900 text-xs">{value}</span>
    </div>
  );
}