'use client';

import { useState } from 'react';
import { 
  IndianRupee, Info, Calculator, 
  Layers, ArrowDownRight, ArrowUpRight, 
  Zap, Truck, ShieldCheck, Download, 
  Percent, ChevronDown
} from 'lucide-react';
import clsx from 'clsx';

const ZONES = ['A', 'B', 'C1', 'C2', 'D1', 'D2', 'E', 'F'];

export default function PricingPage() {
  const [provider, setProvider] = useState('DTDC');
  const [service, setService] = useState<'Surface' | 'Express'>('Surface');
  const [gstInclusive, setGstInclusive] = useState(false);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200">
            <IndianRupee size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Rate Cards</h1>
            <p className="text-sm text-slate-500 font-medium">Dynamic zone-based pricing and weight slabs.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={16} /> Export PDF
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-md">
            <Calculator size={16} /> Rate Calculator
          </button>
        </div>
      </div>

      {/* ───────────────── CONTROLS ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center rounded-3xl bg-white p-4 border border-slate-100 shadow-sm">
        {/* Provider Select */}
        <div className="lg:col-span-3 relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Layers size={16} className="text-slate-400" />
          </div>
          <select 
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full bg-slate-50 border-slate-100 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500/20 appearance-none"
          >
            <option>DTDC</option>
            <option>Delhivery</option>
            <option>Maruti</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Service Toggle */}
        <div className="lg:col-span-4 flex p-1 bg-slate-100 rounded-2xl h-[52px]">
          {(['Surface', 'Express'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setService(s)}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all",
                service === s 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {s === 'Surface' ? <Truck size={16} /> : <Zap size={16} />}
              {s}
            </button>
          ))}
        </div>

        {/* GST Toggle */}
        <div className="lg:col-span-5 flex justify-end">
            <label className="flex items-center gap-3 cursor-pointer group px-4">
              <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700">Show rates with GST (18%)</span>
              <div className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={gstInclusive}
                    onChange={() => setGstInclusive(!gstInclusive)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </div>
            </label>
        </div>
      </div>

      {/* ───────────────── RATE TABLE ───────────────── */}
      <div className="rounded-3xl border border-slate-100 bg-white shadow-xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-white">
                <Th className="w-[300px] py-6 border-slate-800">Weight Slabs</Th>
                {ZONES.map((z) => (
                  <Th key={z} className="text-center border-slate-800">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Zone</span>
                        <span className="text-lg font-black">{z}</span>
                    </div>
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <SectionRow label="Forward Charges" icon={<ArrowUpRight size={14}/>} />
              <RateRow label="Base Fare (upto 250 g)" value={45} />
              <RateRow label="Addl. 250 g (upto 500 g)" value={12} />
              <RateRow label="Addl. 500 g (upto 5 kg)" value={25} />
              <RateRow label="Every Additional 1 kg" value={40} isHighlight />

              <SectionRow label="Return Charges (RTO)" icon={<ArrowDownRight size={14}/>} />
              <RateRow label="RTO Base Fare" value={35} />
              
              <SectionRow label="Reverse Pickup (DTO)" icon={<RefreshCw size={14}/>} />
              <RateRow label="DTO Base Fare" value={55} />
            </tbody>
          </table>
        </div>
      </div>

      {/* ───────────────── FOOTER NOTES ───────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 rounded-2xl bg-indigo-50 p-4 border border-indigo-100">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                <Percent size={20} />
            </div>
            <p className="text-xs text-indigo-900 font-medium leading-relaxed">
                Fuel Surcharge (DPH) of <strong>15.5%</strong> is applicable on all base rates and will be calculated on the final invoice.
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl bg-emerald-50 p-4 border border-emerald-100">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                <ShieldCheck size={20} />
            </div>
            <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                Rates are protected under <strong>Contract SLA</strong> valid until Dec 2025. Volume discounts apply automatically above 5000 shipments/mo.
            </p>
          </div>
      </div>
    </div>
  );
}

/* ───────────────── HELPERS ───────────────── */

function RateRow({ label, value, isHighlight }: { label: string; value: number, isHighlight?: boolean }) {
  return (
    <tr className={clsx("group transition-colors", isHighlight ? "bg-slate-50/50" : "hover:bg-slate-50/50")}>
      <Td className="font-bold text-slate-700 py-5">
        <div className="flex items-center gap-2">
            {isHighlight && <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />}
            {label}
        </div>
      </Td>
      {Array.from({ length: 8 }).map((_, i) => (
        <Td key={i} className="text-center group-hover:scale-110 transition-transform">
          <span className="text-sm font-mono font-black text-slate-900">₹{value + (i * 5)}</span>
        </Td>
      ))}
    </tr>
  );
}

function SectionRow({ label, icon }: { label: string, icon: React.ReactNode }) {
  return (
    <tr className="bg-slate-50/80">
      <Td colSpan={9} className="py-2">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            {icon} {label}
        </div>
      </Td>
    </tr>
  );
}

function Th({ children, className }: any) {
  return <th className={clsx("px-6 py-4 text-sm border-x border-transparent", className)}>{children}</th>;
}

function Td({ children, className, colSpan }: any) {
  return <td colSpan={colSpan} className={clsx("px-6 py-4 text-sm border-x border-slate-50", className)}>{children}</td>;
}

function RefreshCw({ size, className }: { size: number, className?: string }) {
    return <Truck size={size} className={className} />;
}