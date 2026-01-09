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
  Truck, CheckCircle2, ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';

type Provider = 'DTDC' | 'DELHIVERY';

export default function BulkTrackingPage() {
  const [provider, setProvider] = useState<Provider>('DTDC');
  const [groups, setGroups] = useState<BulkGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);

  // Helper to normalize Excel Row keys
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

        let normalized: { code: string; awb: string }[] = [];

        if (provider === 'DTDC') {
          normalized = rows.map(r => {
            const l = getLowerKeys(r);
            return {
              code: String(l['dsr_act_cust_code'] ?? l['dsr_act_code'] ?? '').trim(),
              awb: String(l['dsr_cnno'] ?? l['awb'] ?? '').trim()
            };
          }).filter(r => r.code && r.awb);
        } else {
          // Delhivery Logic: Group by a virtual "Bulk" code or Reference if missing
          normalized = rows.map(r => {
            const l = getLowerKeys(r);
            const awb = l['waybill'] ?? l['awb'] ?? l['waybill no'] ?? l['awb no'];
            const ref = l['reference_no'] ?? l['reference no'] ?? l['reference'];
            return {
              code: 'DELHIVERY_BATCH', // Delhivery usually processed as one big batch
              awb: String(awb ?? ref ?? '').trim()
            };
          }).filter(r => r.awb);
        }

        if (normalized.length === 0) throw new Error('No valid data found in Excel');

        // Grouping Logic
        const map = new Map<string, string[]>();
        normalized.forEach(r => {
          const arr = map.get(r.code) ?? [];
          arr.push(r.awb);
          map.set(r.code, arr);
        });

        const grouped = Array.from(map.entries()).map(([code, awbs]) => ({
          code,
          awbs: Array.from(new Set(awbs))
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
    <div className="min-h-screen bg-[#f8fafc] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER & PROVIDER TOGGLE */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Truck className="text-indigo-600" size={32} />
              Bulk Tracking Center
            </h1>
            <p className="text-slate-500 font-medium mt-1">Select provider and upload manifest to sync data.</p>
          </div>

          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 flex gap-1 shadow-sm">
            {(['DTDC', 'DELHIVERY'] as Provider[]).map((p) => (
              <button
                key={p}
                onClick={() => { setProvider(p); setGroups([]); }}
                className={clsx(
                  "px-6 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest",
                  provider === p ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* UPLOAD ZONE */}
        <Card className="border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-all bg-white rounded-[2.5rem] overflow-hidden">
          <div className="relative p-12 flex flex-col items-center text-center group">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => e.target.files?.[0] && parseWorkbook(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {loading ? <Loader2 className="animate-spin" size={32} /> : <UploadCloud size={40} />}
            </div>
            <h3 className="text-xl font-bold text-slate-900">Drop your {provider} sheet here</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-sm">
              Required: <span className="font-mono font-bold text-indigo-500">
                {provider === 'DTDC' ? 'DSR_ACT_CUST_CODE, DSR_CNNO' : 'Waybill / AWB'}
              </span>
            </p>
          </div>
        </Card>

        {/* BATCHES */}
        {groups.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Layers size={16} /> Prepared Batches ({groups.length})
              </h2>
              <Button onClick={runAll} disabled={running} className="bg-indigo-600 rounded-xl font-bold gap-2 px-8">
                {running ? <Loader2 className="animate-spin" size={18} /> : <Play size={16} fill="white" />}
                Process All {provider}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((g) => (
                <div key={g.code} className="bg-white border border-slate-200 p-6 rounded-[2rem] hover:border-indigo-200 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{provider} GROUP</span>
                      <h4 className="text-lg font-black text-slate-900 mt-1">{g.code}</h4>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black border border-emerald-100">
                      {g.awbs.length} AWBS
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {g.awbs.slice(0, 8).map(a => (
                      <span key={a} className="px-2 py-1 bg-slate-50 border border-slate-100 text-[10px] font-mono font-bold text-slate-500 rounded-md">
                        {a}
                      </span>
                    ))}
                    {g.awbs.length > 8 && <span className="text-[10px] text-slate-300 font-bold self-center">+{g.awbs.length - 8} more</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER NAVIGATION */}
        <div className="flex justify-between items-center pt-8 border-t border-slate-200">
          <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle2 size={16} />
            <span className="text-xs font-medium">Auto-background processing via BullMQ</span>
          </div>
          <Link href="/admin/consignments" className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline">
            View Live Status <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}