'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { bulkTrackDtdc, bulkTrackDelhivery } from '@/lib/api/bulkTracking.api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { 
  UploadCloud, Play, Layers, Loader2, ChevronRight, Hash,
  Terminal, Database, FileSpreadsheet, Zap
} from 'lucide-react';
import { clsx } from 'clsx';
import { BulkGroup, ParsedRow, Provider } from '../../interface/adminInterface';

export default function BulkTrackingPage() {
  const [provider, setProvider] = useState<Provider>('DTDC');
  const [groups, setGroups] = useState<BulkGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);

  const getLowerKeys = (obj: Record<string, unknown>) => {
    const lower: Record<string, unknown> = {};
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
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

        let normalized: ParsedRow[] = [];

        if (provider === 'DTDC') {
          normalized = rows.map(r => {
            const l = getLowerKeys(r);
            return {
              code: String(l['dsr_act_cust_code'] ?? l['dsr_act_code'] ?? '').trim(),
              awb: String(l['dsr_cnno'] ?? l['awb'] ?? '').trim(),
              booked_at: l['dsr_booking_date'] ? safeDate(l['dsr_booking_date'] as string | Date) : null,
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
              awb: String(awb ?? ref ?? '').trim(),
              reference_number: null,
              origin_pincode: null,
              destination_pincode: null,
              booked_at: null
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

        const grouped: BulkGroup[] = Array.from(map.entries()).map(([code, rows]) => ({
          code,
          awbs: rows.map(r => ({
            awb: r.awb,
            reference_number: r.reference_number ?? null,
            origin_pincode: r.origin_pincode ?? null,
            destination_pincode: r.destination_pincode ?? null,
            booked_at: r.booked_at ? r.booked_at.toISOString() : null,
          })),
        }));

        setGroups(grouped);
        toast.success(`Parsed ${normalized.length} rows for ${provider}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        toast.error(message);
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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(message);
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