"use client";

import React, { useState } from 'react';
import { 
  Scan, Truck, ClipboardList, CheckCircle2, 
  Camera, MapPin, UserCheck, ChevronRight,
  PackageCheck, Save, Loader2, Plus, Trash2
} from 'lucide-react';
import clsx from 'clsx';
import { useMaruti } from '@/hooks/useMaruti';

export default function MarutiDRSCommander() {
  const { validateDrsAwbs, createDrs, updateDrsStatus } = useMaruti();
  
  // STEP 1: CONFIG & VALIDATION STATE
  const [drsConfig, setDrsConfig] = useState({
    daId: "65d451ebeed2eb673adddb29",
    daMobileNo: "7017727624",
    deliveryArea: "Koregaon",
    deliveryPincode: 123457,
    type: "ECOM"
  });
  
  const [awbInput, setAwbInput] = useState("");
  const [validatedList, setValidatedList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeDrsId, setActiveDrsId] = useState<string | null>(null);

  // STEP 4: POD STATE
  const [podData, setPodData] = useState({
    cAWB_No: "",
    is_delivered: true,
    receiver_name: "",
    receiver_phone: "",
    delivery_remarks: ""
  });

  // HANDLERS
  const handleValidate = async () => {
    if (!awbInput) return;
    setLoading(true);
    try {
      // Payload 1: validateDrsAwbs
      const res = await validateDrsAwbs({ ...drsConfig, awbList: [awbInput] });
      setValidatedList(prev => [...new Set([...prev, awbInput])]);
      setAwbInput("");
    } catch (err) { alert("AWB_VALIDATION_FAILED: Check Pincode/Status"); }
    finally { setLoading(false); }
  };

  const handleCreateDRS = async () => {
    setLoading(true);
    try {
      // Payload 3: createDrs
      const res = await createDrs({ ...drsConfig, awbList: validatedList });
      setActiveDrsId(res.data?.drsId || "DRS-8829-X");
      alert("DRS_COMMITTED_TO_FLEET");
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-20">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b-4 border-slate-900 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">DRS_Fulfillment_Terminal</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Delivery_Run_Sheet // Operational_Flow_v4</p>
        </div>
        <div className="flex gap-4">
          <StatusChip label="DA_Node" value={drsConfig.daId.slice(-6)} />
          <StatusChip label="Zone" value={drsConfig.deliveryArea} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        
        {/* COLUMN 1: INGESTION & VALIDATION */}
        <section className="bg-white border border-slate-200 flex flex-col rounded-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
              <Scan size={14} className="text-indigo-600"/> 01_Ingestion_Node
            </h3>
          </div>
          <div className="p-4 space-y-4">
             <div className="grid grid-cols-2 gap-2">
                <MiniInput label="Type" value={drsConfig.type} />
                <MiniInput label="Pincode" value={drsConfig.deliveryPincode} />
             </div>
             <div className="relative">
                <input 
                  value={awbInput}
                  onChange={(e) => setAwbInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
                  placeholder="SCAN_AWB_FOR_VALIDATION..."
                  className="w-full bg-slate-900 text-white p-4 font-mono text-sm font-black outline-none placeholder:text-slate-600 border-b-4 border-indigo-500"
                />
                {loading && <Loader2 className="absolute right-4 top-4 animate-spin text-indigo-400" size={20}/>}
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {validatedList.map(awb => (
              <div key={awb} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200">
                <span className="text-xs font-mono font-black">{awb}</span>
                <CheckCircle2 size={14} className="text-emerald-500" />
              </div>
            ))}
          </div>
        </section>

        {/* COLUMN 2: LIST & CREATION */}
        <section className="bg-white border border-slate-200 flex flex-col rounded-sm shadow-xl">
          <div className="p-4 border-b border-slate-100 bg-indigo-600 text-white flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
              <ClipboardList size={14}/> 02_Batch_Finalization
            </h3>
            <span className="text-[10px] font-black">{validatedList.length} UNITS</span>
          </div>
          <div className="flex-1 overflow-y-auto">
             {/* Payload 2: DRS Details List Visualization */}
             <table className="w-full text-[10px] text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-black">
                   <tr>
                     <th className="p-3">AWB_Sequence</th>
                     <th className="p-3">Status</th>
                     <th className="p-3">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-bold">
                   {validatedList.map((awb, i) => (
                     <tr key={awb} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono">{awb}</td>
                        <td className="p-3"><span className="text-emerald-600 uppercase">Validated</span></td>
                        <td className="p-3"><Trash2 size={12} className="text-rose-400 cursor-pointer" onClick={() => setValidatedList(v => v.filter(x => x !== awb))}/></td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={handleCreateDRS}
              disabled={validatedList.length === 0}
              className="w-full bg-slate-900 text-white py-4 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-all disabled:opacity-30"
            >
              <Save size={16}/> Commit_To_Runner
            </button>
          </div>
        </section>

        {/* COLUMN 3: STATUS & POD CLOSURE */}
        <section className="bg-slate-50 border border-slate-200 flex flex-col rounded-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
              <UserCheck size={14} className="text-emerald-400"/> 03_POD_Closure
            </h3>
          </div>
          <div className="p-6 space-y-5">
             <div className="bg-white p-4 border border-slate-200 space-y-4">
                <p className="text-[9px] font-black text-slate-400 uppercase">Active_Closure_Identifier</p>
                <input 
                  placeholder="AWB_TO_UPDATE..."
                  className="w-full text-xs font-mono font-black border-b border-slate-200 pb-2 outline-none focus:border-emerald-500"
                  value={podData.cAWB_No}
                  onChange={(e) => setPodData({...podData, cAWB_No: e.target.value})}
                />
                
                <div className="grid grid-cols-2 gap-4">
                   <MiniInput label="Receiver_Name" value={podData.receiver_name} onChange={(v) => setPodData({...podData, receiver_name: v})} />
                   <MiniInput label="Receiver_Phone" value={podData.receiver_phone} onChange={(v) => setPodData({...podData, receiver_phone: v})} />
                </div>

                <div className="flex items-center gap-3 py-2">
                   <input type="checkbox" checked={podData.is_delivered} onChange={(e) => setPodData({...podData, is_delivered: e.target.checked})} className="accent-emerald-500" />
                   <span className="text-[10px] font-black uppercase">Is_Delivered_Successfully</span>
                </div>

                <button className="w-full bg-emerald-100 text-emerald-700 py-3 rounded-sm text-[10px] font-black uppercase flex items-center justify-center gap-2 border border-emerald-200">
                   <Camera size={14}/> Capture_POD_Image
                </button>

                <button 
                  onClick={() => updateDrsStatus(podData)}
                  className="w-full bg-emerald-600 text-white py-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg"
                >
                   Update_Mission_Status
                </button>
             </div>
             
             <div className="p-4 bg-indigo-50 border border-indigo-100 flex gap-3">
                <MapPin className="text-indigo-400 shrink-0" size={16}/>
                <p className="text-[9px] text-indigo-800 font-bold uppercase leading-relaxed">
                  Note: GPS Coordinates will be captured automatically on status update for POD validation.
                </p>
             </div>
          </div>
        </section>

      </div>
    </div>
  );
}

/* ───────────────── UI COMPONENTS ───────────────── */

function StatusChip({ label, value }: any) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
      <span className="text-[11px] font-bold text-slate-900 uppercase">{value}</span>
    </div>
  );
}

function MiniInput({ label, value, onChange }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[8px] font-black text-slate-400 uppercase">{label}</label>
      <input 
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 px-2 py-1 text-[10px] font-bold outline-none"
      />
    </div>
  );
}