'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { bulkTrackDtdc, BulkGroup, bulkTrackDelhivery } from '@/lib/api/bulkTracking.api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { 
  UploadCloud, Play, Layers, Loader2, 
  Truck, CheckCircle2, ChevronRight, Hash,
  Terminal, Database, FileSpreadsheet, Activity,
  Zap
} from 'lucide-react';
import { clsx } from 'clsx';

type Provider = 'DTDC' | 'DELHIVERY';

type ParsedRow = {
  code: string;
  awb: string;
  reference_number?: string | null;
  origin_pincode?: string | null;
  destination_pincode?: string | null;
  booked_at?: string | null;
};

// export default function BulkTrackingPage() {
//   const [provider, setProvider] = useState<Provider>('DTDC');
//   const [groups, setGroups] = useState<BulkGroup[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [running, setRunning] = useState(false);

//   const getLowerKeys = (obj: any) => {
//     const lower: any = {};
//     Object.keys(obj).forEach((k) => (lower[k.toLowerCase().trim()] = obj[k]));
//     return lower;
//   };

//   async function parseWorkbook(file: File) {
//     setLoading(true);
//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       try {
//         const data = e.target?.result;
//         if (!data) throw new Error('Failed to read file');

//         const workbook = XLSX.read(data, { type: 'binary' });
//         const sheet = workbook.Sheets[workbook.SheetNames[0]];
//         const rows = XLSX.utils.sheet_to_json<any>(sheet, { defval: '' });

//         let normalized: any[] = [];

//         if (provider === 'DTDC') {
//           normalized = rows.map(r => {
//             const l = getLowerKeys(r);
//             return {
//               code: String(l['dsr_act_cust_code'] ?? l['dsr_act_code'] ?? '').trim(),
//               awb: String(l['dsr_cnno'] ?? l['awb'] ?? '').trim(),
//               booked_at: l['dsr_booking_date'] ? safeDate(l['dsr_booking_date']) : null,
//               reference_number: l['dsr_refno'] ? String(l['dsr_refno']).trim() : null,
//               origin_pincode: l['bkg_pincode'] ? String(l['bkg_pincode']).trim() : null,
//               destination_pincode: l['dsr_dest_pin'] ? String(l['dsr_dest_pin']).trim() : null,
//             };
//           }).filter(r => r.code && r.awb);
//         } else {
//           normalized = rows.map(r => {
//             const l = getLowerKeys(r);
//             const awb = l['waybill'] ?? l['awb'] ?? l['waybill no'] ?? l['awb no'];
//             const ref = l['reference_no'] ?? l['reference no'] ?? l['reference'];
//             return {
//               code: 'DELHIVERY_BATCH',
//               awb: String(awb ?? ref ?? '').trim()
//             };
//           }).filter(r => r.awb);
//         }

//         if (normalized.length === 0) throw new Error('No valid data found in Excel');

//         const map = new Map<string, ParsedRow[]>();
//         normalized.forEach(r => {
//           const arr = map.get(r.code) ?? [];
//           arr.push(r);
//           map.set(r.code, arr);
//         });

//         const grouped = Array.from(map.entries()).map(([code, rows]) => ({
//           code,
//           awbs: rows.map(r => ({
//             awb: r.awb,
//             reference_number: r.reference_number ?? null,
//             origin_pincode: r.origin_pincode ?? null,
//             destination_pincode: r.destination_pincode ?? null,
//             booked_at: r.booked_at ?? null,
//           })),
//         }));

//         setGroups(grouped);
//         toast.success(`Parsed ${normalized.length} rows for ${provider}`);
//       } catch (err: any) {
//         toast.error(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     reader.readAsBinaryString(file);
//   }

//   async function runAll() {
//     setRunning(true);
//     try {
//       if (provider === 'DTDC') {
//         await bulkTrackDtdc(groups);
//       } else {
//         await bulkTrackDelhivery(groups);
//       }
//       toast.success(`${provider} processing initiated via BullMQ`);
//       setGroups([]);
//     } catch (e: any) {
//       toast.error(e.message || 'Processing failed');
//     } finally {
//       setRunning(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 space-y-4 font-sans">
      
//       {/* ───────────────── SYSTEM HEADER ───────────────── */}
//       <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//         <div className="flex items-center gap-4">
//           <div className="h-12 w-12 bg-slate-900 flex items-center justify-center text-white rounded-sm shadow-md">
//             <Database size={24} />
//           </div>
//           <div>
//             <div className="flex items-center gap-3">
//               <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Bulk_Intake_Center</h1>
//               <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest">
//                 Data_Sync_Active
//               </span>
//             </div>
//             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 flex items-center gap-2">
//               <Terminal size={12} className="text-indigo-600" /> Protocol: Manifest_Synchronization_v2
//             </p>
//           </div>
//         </div>

//         <div className="flex bg-slate-100 border border-slate-200 rounded-sm p-1 shadow-inner">
//             {(['DTDC', 'DELHIVERY'] as Provider[]).map((p) => (
//               <button
//                 key={p}
//                 onClick={() => { setProvider(p); setGroups([]); }}
//                 className={clsx(
//                   "px-6 py-2 rounded-sm text-[10px] font-black transition-all uppercase tracking-[0.2em]",
//                   provider === p ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
//                 )}
//               >
//                 {p}
//               </button>
//             ))}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        
//         {/* ───────────────── INTAKE MODULE ───────────────── */}
//         <div className="xl:col-span-4 space-y-4">
//             <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
//                 <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
//                     <FileSpreadsheet size={14} className="text-slate-400" />
//                     <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Manifest_Upload</h3>
//                 </div>
//                 <div className="p-8">
//                     <div className="relative border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 rounded-sm transition-all group">
//                         <input
//                             type="file"
//                             accept=".xlsx,.xls"
//                             onChange={(e) => e.target.files?.[0] && parseWorkbook(e.target.files[0])}
//                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                         />
//                         <div className="p-10 flex flex-col items-center text-center">
//                             <div className="w-14 h-14 bg-white border border-slate-200 text-indigo-600 rounded-sm flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
//                                 {loading ? <Loader2 className="animate-spin" size={24} /> : <UploadCloud size={28} />}
//                             </div>
//                             <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Drop {provider} Manifest</p>
//                             <p className="text-[9px] text-slate-400 font-bold uppercase mt-2">XLSX / XLS Formats Only</p>
//                         </div>
//                     </div>

//                     <div className="mt-6 space-y-3">
//                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Required_Schema</p>
//                         <div className="flex flex-wrap gap-2">
//                             {provider === 'DTDC' ? (
//                                 <>
//                                     <code className="text-[10px] bg-slate-100 px-2 py-1 rounded-sm font-mono font-bold text-indigo-600">DSR_ACT_CODE</code>
//                                     <code className="text-[10px] bg-slate-100 px-2 py-1 rounded-sm font-mono font-bold text-indigo-600">DSR_CNNO</code>
//                                 </>
//                             ) : (
//                                 <code className="text-[10px] bg-slate-100 px-2 py-1 rounded-sm font-mono font-bold text-indigo-600">Waybill / AWB</code>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="bg-slate-900 p-5 rounded-sm shadow-xl text-white">
//                 <div className="flex items-center gap-3 mb-4">
//                     <div className="p-2 bg-indigo-600 rounded-sm text-white"><Activity size={18}/></div>
//                     <h3 className="text-xs font-black uppercase tracking-widest">Processing_Queue</h3>
//                 </div>
//                 <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed mb-4">
//                     All manifests are processed via <span className="text-indigo-400">BullMQ Background Workers</span> to ensure zero-timeout on large datasets.
//                 </p>
//                 <div className="h-px bg-slate-800 mb-4" />
//                 <Link href="/admin/consignments" className="w-full py-2 bg-white text-slate-900 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
//                     <ChevronRight size={14}/> View_Live_Registry
//                 </Link>
//             </div>
//         </div>

//         {/* ───────────────── BATCH GRID ───────────────── */}
//         <div className="xl:col-span-8 space-y-4">
//           {groups.length > 0 ? (
//             <div className="space-y-4">
//               <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm flex items-center justify-between">
//                 <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
//                   <Layers size={14} className="text-indigo-600" /> Prepared_Batch_Registry ({groups.length})
//                 </h2>
//                 <button 
//                     onClick={runAll} 
//                     disabled={running} 
//                     className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-sm font-black text-[10px] uppercase tracking-widest flex items-center gap-2 px-6 py-2 shadow-md disabled:opacity-50 transition-all"
//                 >
//                   {running ? <Loader2 className="animate-spin" size={14} /> : <Play size={14} fill="white" />}
//                   Execute_All_{provider}_Nodes
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {groups.map((g) => (
//                   <div key={g.code} className="bg-white border border-slate-200 p-5 rounded-sm hover:border-indigo-400 transition-colors shadow-sm relative group">
//                     <div className="flex justify-between items-start mb-4">
//                       <div>
//                         <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] leading-none mb-1">Entity_Node</p>
//                         <h4 className="text-base font-black text-slate-900 uppercase tracking-tight font-mono">{g.code}</h4>
//                       </div>
//                       <div className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-sm text-[9px] font-black border border-emerald-200 uppercase tracking-widest">
//                         {g.awbs.length}_Units
//                       </div>
//                     </div>
                    
//                     <div className="bg-slate-50 border border-slate-100 p-3 rounded-sm space-y-3">
//                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Unit_Samples</p>
//                         <div className="flex flex-wrap gap-1.5">
//                             {g.awbs.slice(0, 10).map(a => (
//                                 <span key={a.awb} className="px-1.5 py-0.5 bg-white border border-slate-200 text-[9px] font-mono font-bold text-slate-600 rounded-sm">
//                                     {a.awb}
//                                 </span>
//                             ))}
//                             {g.awbs.length > 10 && <span className="text-[9px] text-slate-400 font-black self-center ml-1">+{g.awbs.length - 10}</span>}
//                         </div>
//                     </div>
//                     <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <Hash size={40} className="text-slate-50" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="bg-white border border-slate-200 rounded-sm p-12 flex flex-col items-center justify-center text-center opacity-60">
//                 <div className="h-16 w-16 bg-slate-50 border border-slate-200 rounded-sm flex items-center justify-center text-slate-300 mb-4">
//                     <Layers size={32} />
//                 </div>
//                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">No_Batches_Prepared</h3>
//                 <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Upload a manifest to begin the ingestion process.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function safeDate(d: string | Date | null): Date | null {
//   if (!d) return null;
//   const date = d instanceof Date ? d : new Date(d);
//   return isNaN(date.getTime()) ? null : date;
// }

export default function BulkTrackingPage() {
  const [provider, setProvider] = useState<Provider>('DTDC');
  const [groups, setGroups] = useState<BulkGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);

  const getLowerKeys = (obj: any) => {
    const lower: any = {};
    Object.keys(obj).forEach((k) => (lower[k.toLowerCase().trim()] = obj[k]));
    return lower;
  };

  async function parseWorkbook(file: File) {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('Failed to read file');

        const workbook = XLSX.read(data, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<any>(sheet, { defval: '' });

        let normalized: any[] = [];

        if (provider === 'DTDC') {
          normalized = rows.map(r => {
            const l = getLowerKeys(r);
            return {
              code: String(l['dsr_act_cust_code'] ?? l['dsr_act_code'] ?? '').trim(),
              awb: String(l['dsr_cnno'] ?? l['awb'] ?? '').trim(),
              booked_at: l['dsr_booking_date'] ? safeDate(l['dsr_booking_date']) : null,
              reference_number: l['dsr_refno'] ? String(l['dsr_refno']).trim() : null,
              origin_pincode: l['bkg_pincode'] ? String(l['bkg_pincode']).trim() : null,
              destination_pincode: l['dsr_dest_pin'] ? String(l['dsr_dest_pin']).trim() : null,
            };
          }).filter(r => r.code && r.awb);
        } else {
          normalized = rows.map(r => {
            const l = getLowerKeys(r);
            const awb = l['waybill'] ?? l['awb'] ?? l['waybill no'] ?? l['awb no'];
            const ref = l['reference_no'] ?? l['reference no'] ?? l['reference'];
            return {
              code: 'DELHIVERY_BATCH',
              awb: String(awb ?? ref ?? '').trim()
            };
          }).filter(r => r.awb);
        }

        if (normalized.length === 0) throw new Error('No valid data found in Excel');

        const map = new Map<string, ParsedRow[]>();
        normalized.forEach(r => {
          const arr = map.get(r.code) ?? [];
          arr.push(r);
          map.set(r.code, arr);
        });

        const grouped = Array.from(map.entries()).map(([code, rows]) => ({
          code,
          awbs: rows.map(r => ({
            awb: r.awb,
            reference_number: r.reference_number ?? null,
            origin_pincode: r.origin_pincode ?? null,
            destination_pincode: r.destination_pincode ?? null,
            booked_at: r.booked_at ?? null,
          })),
        }));

        setGroups(grouped);
        toast.success(`Parsed ${normalized.length} rows for ${provider}`);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  }

  async function runAll() {
    setRunning(true);
    try {
      if (provider === 'DTDC') {
        await bulkTrackDtdc(groups);
      } else {
        await bulkTrackDelhivery(groups);
      }
      toast.success(`${provider} processing initiated via BullMQ`);
      setGroups([]);
    } catch (e: any) {
      toast.error(e.message || 'Processing failed');
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 space-y-6 font-sans">
      
      {/* ───────────────── SYSTEM HEADER ───────────────── */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 bg-slate-900 flex items-center justify-center text-white rounded-xl shadow-lg ring-4 ring-slate-50">
            <Database size={28} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bulk Intake Center</h1>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                System Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-2">
              <Terminal size={14} className="text-blue-600" /> Protocol: Manifest_Synchronization_v3.2
            </p>
          </div>
        </div>

        <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1.5">
            {(['DTDC', 'DELHIVERY'] as Provider[]).map((p) => (
              <button
                key={p}
                onClick={() => { setProvider(p); setGroups([]); }}
                className={clsx(
                  "px-8 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest",
                  provider === p ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {p}
              </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* ───────────────── INTAKE MODULE (Left) ───────────────── */}
        <div className="xl:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet size={16} className="text-blue-500" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Manifest Dropzone</h3>
                    </div>
                </div>
                <div className="p-6">
                    <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 rounded-2xl transition-all group overflow-hidden">
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={(e) => e.target.files?.[0] && parseWorkbook(e.target.files[0])}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="p-10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white border border-slate-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                {loading ? <Loader2 className="animate-spin" size={28} /> : <UploadCloud size={32} />}
                            </div>
                            <p className="text-sm font-bold text-slate-900">Drop {provider} Manifest</p>
                            <p className="text-[11px] text-slate-400 font-medium mt-1">XLSX or XLS formats supported</p>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Required Columns</p>
                        <div className="flex flex-wrap gap-2">
                            {provider === 'DTDC' ? (
                                <>
                                    <span className="text-[10px] bg-white border border-slate-200 px-2.5 py-1 rounded-md font-mono font-bold text-blue-600 uppercase">dsr_act_code</span>
                                    <span className="text-[10px] bg-white border border-slate-200 px-2.5 py-1 rounded-md font-mono font-bold text-blue-600 uppercase">dsr_cnno</span>
                                </>
                            ) : (
                                <span className="text-[10px] bg-white border border-slate-200 px-2.5 py-1 rounded-md font-mono font-bold text-blue-600 uppercase">Waybill / AWB</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 shadow-xl text-white">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-blue-600 rounded-xl text-white"><Zap size={20} fill="currentColor"/></div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest">Async Processing</h3>
                      <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">BullMQ Background Workers</p>
                    </div>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                    Manifests are offloaded to background workers to prevent browser timeouts during large sync operations.
                </p>
                <div className="h-px bg-slate-800 mb-6" />
                <Link href="/admin/consignments" className="w-full py-3.5 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    View Registry <ChevronRight size={16}/>
                </Link>
            </div>
        </div>

        {/* ───────────────── BATCH REGISTRY (Right) ───────────────── */}
        <div className="xl:col-span-8 space-y-4">
          {groups.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Layers size={18} /></div>
                   <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                    Prepared Batches ({groups.length})
                  </h2>
                </div>
                <button 
                    onClick={runAll} 
                    disabled={running} 
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-3 px-8 py-3 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all"
                >
                  {running ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} fill="white" />}
                  Execute All Nodes
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.map((g) => (
                  <div key={g.code} className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all relative group">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Entity Node</p>
                        <h4 className="text-lg font-bold text-slate-900 font-mono tracking-tight">{g.code}</h4>
                      </div>
                      <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-100 uppercase">
                        {g.awbs.length} Units
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sample Manifest</p>
                        <div className="flex flex-wrap gap-2">
                            {g.awbs.slice(0, 8).map(a => (
                                <span key={a.awb} className="px-2 py-1 bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-600 rounded-md shadow-sm">
                                    {a.awb}
                                </span>
                            ))}
                            {g.awbs.length > 8 && <span className="text-[10px] text-slate-400 font-bold self-center ml-1">+{g.awbs.length - 8} More</span>}
                        </div>
                    </div>
                    <Hash size={48} className="absolute -bottom-2 -right-2 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-24 flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                    <Layers size={40} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">No Batches Prepared</h3>
                <p className="text-xs text-slate-400 font-medium mt-2 max-w-xs">Upload a manifest on the left to begin the background ingestion process.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function safeDate(d: string | Date | null): Date | null {
  if (!d) return null;
  const date = d instanceof Date ? d : new Date(d);
  return isNaN(date.getTime()) ? null : date;
}