"use client";

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Box, Search, ArrowRight, UploadCloud, History, 
  PackageCheck, Clock, Hash, Navigation, MapPin, 
  Calendar, ShieldCheck, ChevronDown, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { useTracking } from '@/hooks/useTracking';

// ─── UTILITY FOR INPUT SANITIZATION ───
const sanitizeAwbs = (input: string) => {
  return input
    .split(/[\s,\n]+/) // Split by space, comma, or newline
    .filter(Boolean)
    .slice(0, 25)
    .join(',');
};

function TrackingContent() {
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState<string>('');
  const [expandedAwb, setExpandedAwb] = useState<string | null>(null);

  const { data, isLoading } = useTracking(query);

  // Sync URL params to State
  useEffect(() => {
    const awbFromUrl = searchParams.get('awb');
    if (awbFromUrl) {
      const sanitized = sanitizeAwbs(awbFromUrl);
      setInputValue(sanitized);
      setQuery(sanitized);
    }
  }, [searchParams]);

  const results = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = sanitizeAwbs(inputValue);
    setQuery(sanitized);
    // Auto-expand the first result if multiple
    setExpandedAwb(null); 
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Box size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Consignment Tracking</h1>
            <p className="text-sm text-slate-500 font-medium">Bulk support up to 25 AWBs</p>
          </div>
        </div>
      </div>

      {/* TRACKING INPUT AREA */}
      <div className="rounded-3xl bg-slate-950 p-6 shadow-2xl border border-slate-800">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" size={20} />
            <textarea
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter AWB Numbers (separated by comma, space or newline)"
              className="w-full bg-slate-900 border-slate-800 text-white rounded-2xl pl-12 pr-4 py-4 text-sm font-mono focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none overflow-hidden"
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch(e); }}}
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full lg:w-auto flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white hover:bg-indigo-700 transition-all disabled:opacity-50 min-w-[140px]"
          >
            {isLoading ? 'Searching...' : 'Track List'} <ArrowRight size={18} />
          </button>
          <Link href="/admin/tracking/bulk">
            <div className="flex items-center gap-2 cursor-pointer rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-5 py-4 text-slate-400 hover:text-white hover:border-slate-500 transition-all group">
              <UploadCloud size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">Bulk Upload</span>
            </div>
          </Link>
        </form>
      </div>

      {/* RESULTS SECTION */}
      <div className="space-y-4">
        {results.length > 0 ? (
          results.length === 1 ? (
            <DetailedTrackingView item={results[0]} />
          ) : (
            results.map((item: any) => (
              <TrackingAccordion 
                key={item.consignment.awb} 
                item={item} 
                isExpanded={expandedAwb === item.consignment.awb}
                onToggle={() => setExpandedAwb(expandedAwb === item.consignment.awb ? null : item.consignment.awb)}
              />
            ))
          )
        ) : (
          !isLoading && query && (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-bold">No results found for these AWBs.</p>
            </div>
          )
        )}

        {!query && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-[3rem] text-slate-400">
             <Search size={48} className="opacity-10 mb-4" />
             <p className="font-bold uppercase text-xs tracking-widest">Awaiting input for batch tracking</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: ACCORDION VIEW (For Multiple Results)
// ─────────────────────────────────────────────────────────────────────────────
function TrackingAccordion({ item, isExpanded, onToggle }: any) {
  const { consignment, timeline } = item;
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden transition-all hover:shadow-md">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-6">
          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <Hash size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black text-indigo-600 uppercase">{consignment.provider}</p>
            <h4 className="font-bold text-slate-900">{consignment.awb}</h4>
          </div>
          <div className="hidden md:block h-8 w-[1px] bg-slate-200" />
          <div className="hidden md:block">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
            <p className="text-xs font-black text-slate-700">{consignment.status}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <span className={clsx("px-3 py-1 rounded-full text-[10px] font-bold border", 
             consignment.movement === "Critical" ? "bg-red-50 text-red-600 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
           )}>{consignment.movement}</span>
           <ChevronDown size={20} className={clsx("text-slate-400 transition-transform", isExpanded && "rotate-180")} />
        </div>
      </button>

      {isExpanded && (
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
          <DetailedTrackingView item={item} isEmbedded />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: DETAILED VIEW (Reuse for Single or inside Accordion)
// ─────────────────────────────────────────────────────────────────────────────
function DetailedTrackingView({ item, isEmbedded = false }: any) {
  const { consignment, timeline } = item;
  
  return (
    <div className={clsx("grid grid-cols-1 lg:grid-cols-12 gap-8 items-start", !isEmbedded && "animate-in fade-in")}>
      {/* TIMELINE */}
      <div className="lg:col-span-8 space-y-4">
        <div className="max-h-[500px] overflow-y-auto pr-2 no-scrollbar space-y-3">
          {timeline.map((event: any, idx: number) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 relative">
              {idx === 0 && <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500 rounded-l-2xl" />}
              <div className={clsx("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", idx === 0 ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400")}>
                {idx === 0 ? <PackageCheck size={20} /> : <Clock size={18} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h5 className="text-sm font-bold text-slate-900">{event.status}</h5>
                  <span className="text-[10px] font-bold text-slate-400">{new Date(event.eventAt).toLocaleString()}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{event.description || event.remarks}</p>
                <p className="text-[10px] font-bold text-indigo-500 mt-1 uppercase tracking-tighter">{event.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS CARD */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
           <div className="text-center mb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consignment Info</p>
              <h2 className="text-xl font-black text-slate-900 mt-1 uppercase">{consignment.awb}</h2>
           </div>
           <div className="space-y-3">
              <DetailRow icon={<Navigation size={14}/>} label="Carrier" value={consignment.provider} />
              <DetailRow icon={<MapPin size={14}/>} label="Route" value={`${consignment.origin} → ${consignment.destination}`} />
              <DetailRow icon={<Calendar size={14}/>} label="Booked" value={new Date(consignment.bookedAt).toLocaleDateString()} />
           </div>
           <Link href={`/admin/tracking?awb=${consignment.awb}`} className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
             Full Report <ExternalLink size={14} />
           </Link>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between text-[11px] py-1 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-2 text-slate-500">{icon} <span>{label}</span></div>
      <span className="font-bold text-slate-900 truncate ml-4">{value}</span>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center animate-pulse">Initializing multi-tracking system...</div>}>
      <TrackingContent />
    </Suspense>
  );
}