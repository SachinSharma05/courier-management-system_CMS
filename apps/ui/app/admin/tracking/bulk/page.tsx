'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { bulkTrackDtdc, BulkGroup } from '@/lib/api/bulkTracking.api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { 
  UploadCloud, FileText, Play, 
  Layers, Loader2, ArrowRight
} from 'lucide-react';

export default function BulkTrackingPage() {
  const [groups, setGroups] = useState<BulkGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);

  /* -------------------------
      Excel Parsing (Unchanged Logic)
  ------------------------- */
  function parseWorkbook(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('Failed to read file');

        const workbook = XLSX.read(data, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
          defval: '',
        });

        const normalized = rows
          .map((r) => {
            const lower: any = {};
            Object.keys(r).forEach(
              (k) => (lower[k.toLowerCase().trim()] = r[k])
            );

            return {
              code: String(
                lower['dsr_act_cust_code'] ??
                  lower['dsr_act_code'] ??
                  ''
              ).trim(),
              awb: String(
                lower['dsr_cnno'] ??
                  lower['awb'] ??
                  ''
              ).trim(),
            };
          })
          .filter((r) => r.code && r.awb);

        const map = new Map<string, string[]>();
        for (const r of normalized) {
          const arr = map.get(r.code) ?? [];
          arr.push(r.awb);
          map.set(r.code, arr);
        }

        const grouped: BulkGroup[] = Array.from(map.entries())
          .map(([code, awbs]) => ({
            code,
            awbs: Array.from(new Set(awbs)), // dedupe
          }))
          .sort((a, b) => b.awbs.length - a.awbs.length);

        setGroups(grouped);
        toast.success(`Parsed ${normalized.length} rows`);
      } catch (err: any) {
        toast.error(err.message || 'Failed to parse Excel');
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    reader.readAsBinaryString(file);
  }

  /* -------------------------
      API Calls (Unchanged Logic)
  ------------------------- */
  async function runGroup(group: BulkGroup) {
    setRunning(true);
    try {
      await bulkTrackDtdc([group]);
      toast.success(`Processed ${group.awbs.length} AWBs for ${group.code}`);
      setGroups((g) => g.filter((x) => x.code !== group.code));
    } catch (e: any) {
      toast.error(e.message || 'Failed');
    } finally {
      setRunning(false);
    }
  }

  async function runAll() {
    if (!groups.length) return;
    setRunning(true);
    try {
      await bulkTrackDtdc(groups);
      toast.success('All groups processed');
      setGroups([]);
    } catch (e: any) {
      toast.error(e.message || 'Failed');
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bulk DTDC Tracking</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Upload Excel sheets to synchronize multi-client shipment data.</p>
          </div>

          <Button
            onClick={runAll}
            disabled={running || !groups.length}
            className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all rounded-xl gap-2 font-bold"
          >
            {running ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
            Process All Queues
          </Button>
        </div>

        {/* Progress Bar (Visible during processing) */}
        {running && (
          <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 animate-infinite-loading origin-left" />
          </div>
        )}

        {/* Upload Dropzone */}
        <Card className="relative group border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-all bg-white overflow-hidden rounded-2xl">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) parseWorkbook(f);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {loading ? <Loader2 className="animate-spin" /> : <UploadCloud size={32} />}
            </div>
            <h3 className="text-lg font-bold text-slate-900">Click or drag Excel file</h3>
            <p className="text-sm text-slate-500 max-w-xs mt-1">
              Supports .xlsx and .xls. Required columns: <code className="text-indigo-600 font-bold bg-indigo-50 px-1 rounded">DSR_ACT_CUST_CODE</code> and <code className="text-indigo-600 font-bold bg-indigo-50 px-1 rounded">DSR_CNNO</code>
            </p>
          </div>
        </Card>

        {/* Groups List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Layers size={14} />
              Pending Groups ({groups.length})
            </h2>
          </div>

          {groups.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl py-20 flex flex-col items-center justify-center text-slate-400">
              <FileText size={48} className="opacity-10 mb-4" />
              <p className="font-medium text-slate-500 text-sm">No data parsed yet. Please upload a file.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {groups.map((g) => (
                <Card key={g.code} className="p-5 bg-white border-slate-200 rounded-2xl hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h2 className="font-black text-slate-900 tracking-tight">{g.code}</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md border border-emerald-100">
                            {g.awbs.length} Shipments
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[10px] text-slate-400 font-medium">Ready for batch update</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={running}
                      onClick={() => runGroup(g)}
                      className="rounded-lg border-slate-200 font-bold text-xs hover:bg-slate-50 transition-all gap-2"
                    >
                      Process Branch
                      <ArrowRight size={14} />
                    </Button>
                  </div>

                  {/* AWB Tags */}
                  <div className="mt-5 pt-4 border-t border-slate-50 flex flex-wrap gap-2">
                    {g.awbs.slice(0, 16).map((a) => (
                      <div
                        key={a}
                        className="text-[10px] font-mono font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md"
                      >
                        {a}
                      </div>
                    ))}
                    {g.awbs.length > 16 && (
                      <div className="text-[10px] font-bold text-slate-400 self-center ml-2">
                        +{g.awbs.length - 16} additional entries
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer Link */}
        <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-400 font-medium italic">
            Ensure data integrity before processing all queues.
          </p>
          <Link
            href="/admin/consignments"
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors group"
          >
            View Results in Consignments
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}