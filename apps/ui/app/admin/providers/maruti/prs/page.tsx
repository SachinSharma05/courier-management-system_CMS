"use client";

import React, { useState } from 'react';
import { 
  PackageSearch, MapPin, Truck, ScanLine, 
  History, CheckCircle, ArrowUpRight, 
  User, Building2, Save, Loader2, RefreshCcw
} from 'lucide-react';
import clsx from 'clsx';
import { useMaruti } from '@/hooks/useMaruti';

export default function MarutiPRSPage() {
  const { createPrs, updatePrsScanned, updatePrsStatus, getPrsOrders } = useMaruti();
  
  // STATE MANAGEMENT
  const [activePrsId, setActivePrsId] = useState("");
  const [loading, setLoading] = useState(false);
  const [prsData, setPrsData] = useState<any>(null);
  
  // 1. Create PRS State
  const [newPrs, setNewPrs] = useState({
    awbNumberList: [] as string[],
    sellerInfo: { name: "", mobile: "", companyName: "" },
    pickupInfo: { city: "", zip: "", address1: "" }
  });

  // 2. Scan Update State
  const [scanList, setScanList] = useState("");

  // HANDLERS
  const handleFetchPRS = async () => {
    if (!activePrsId) return;
    setLoading(true);
    try {
      const res = await getPrsOrders(activePrsId);
      setPrsData(res.data);
    } catch (err) { alert("PRS_ID_NOT_FOUND"); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await createPrs(newPrs);
      setActivePrsId(res.data.prsNumber);
      alert("PRS_CREATED_SUCCESSFULLY");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* MODULE HEADER */}
      <div className="bg-white border-l-8 border-indigo-600 p-6 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">PRS_Management_Console</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-1">Pickup_Run_Sheet // First_Mile_Logistics</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              placeholder="SEARCH_PRS_ID..."
              className="bg-slate-100 border-2 border-slate-200 px-4 py-2 text-xs font-mono font-black uppercase outline-none focus:border-indigo-600 w-64"
              value={activePrsId}
              onChange={(e) => setActivePrsId(e.target.value)}
            />
            <button onClick={handleFetchPRS} className="absolute right-2 top-2 text-indigo-600 hover:text-indigo-800">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <PackageSearch size={16} />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-280px)]">
        
        {/* COLUMN 1: PRS CREATION (API 1) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 flex flex-col rounded-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
              <PlusSquareIcon size={14}/> 01_Initiate_Pickup
            </h3>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto">
            <section className="space-y-3">
              <p className="text-[9px] font-black text-indigo-600 uppercase">Seller_Entity</p>
              <div className="grid grid-cols-1 gap-2">
                <Input label="Company_Name" placeholder="Test Pvt Ltd" onChange={(v) => setNewPrs({...newPrs, sellerInfo: {...newPrs.sellerInfo, companyName: v}})} />
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Contact_Name" placeholder="Rohan" />
                  <Input label="Mobile" placeholder="987xxxxxxx" />
                </div>
              </div>
            </section>
            <section className="space-y-3 pt-4">
              <p className="text-[9px] font-black text-indigo-600 uppercase">Pickup_Coordinate_Node</p>
              <Input label="Street_Address" placeholder="34, Floor 2" />
              <div className="grid grid-cols-2 gap-2">
                <Input label="City" placeholder="Ahmedabad" />
                <Input label="Zip_Code" placeholder="380015" />
              </div>
            </section>
            <button 
              onClick={handleCreate}
              className="w-full bg-indigo-600 text-white py-4 font-black text-[11px] uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-700 transition-all"
            >
              Generate_PRS_Manifest
            </button>
          </div>
        </div>

        {/* COLUMN 2: SCAN & INWARD (API 2 & 4) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 flex flex-col rounded-sm shadow-xl">
          <div className="p-4 bg-slate-900 text-white border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
              <ScanLine size={14} className="text-amber-400"/> 02_Hub_Inward_Scanning
            </h3>
            {prsData && <span className="bg-amber-500 text-[9px] px-2 py-0.5 rounded-full font-black uppercase">Active: {activePrsId}</span>}
          </div>
          
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Batch_Scan_AWBs (Comma Separated)</label>
            <textarea 
              rows={3}
              className="w-full bg-white border-2 border-slate-200 p-3 font-mono text-xs font-black outline-none focus:border-amber-500"
              placeholder="SCAN_MULTIPLE_LABELS_HERE..."
              value={scanList}
              onChange={(e) => setScanList(e.target.value)}
            />
            <button 
              onClick={() => updatePrsScanned({ prsNumber: activePrsId, awbNumberList: scanList.split(',') })}
              className="mt-2 w-full bg-slate-900 text-white py-2 text-[10px] font-black uppercase tracking-widest hover:bg-black"
            >
              Update_Scanned_Inventory
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
             <table className="w-full text-[10px] text-left">
                <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 z-10">
                  <tr className="text-slate-500 font-black uppercase">
                    <th className="p-3">AWB_Number</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold uppercase">
                  {prsData?.orders?.map((order: any, i: number) => (
                    <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="p-3 font-mono text-slate-900">{order.awb}</td>
                      <td className="p-3">
                        <span className={clsx("px-2 py-0.5 rounded-sm border", order.scanned ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200")}>
                          {order.scanned ? "Scanned" : "Pending_Pickup"}
                        </span>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={2} className="p-10 text-center opacity-30 italic">No_PRS_Loaded</td>
                    </tr>
                  )}
                </tbody>
             </table>
          </div>
        </div>

        {/* COLUMN 3: STATUS & LIFECYCLE (API 3) */}
        <div className="lg:col-span-3 bg-slate-50 border border-slate-200 flex flex-col rounded-sm">
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
              <RefreshCcw size={14} className="text-indigo-600"/> 03_Lifecycle_Control
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update_Global_Status</p>
              <div className="grid grid-cols-1 gap-2">
                {['PRS_PENDING', 'PRS_ASSIGNED', 'PRS_PICKED', 'PRS_CLOSED'].map((status) => (
                  <button 
                    key={status}
                    onClick={() => updatePrsStatus({ prsNumber: activePrsId, status })}
                    className="w-full bg-white border border-slate-200 p-3 text-left hover:border-indigo-500 transition-all group flex justify-between items-center"
                  >
                    <span className="text-[10px] font-black text-slate-700 uppercase">{status}</span>
                    <ArrowUpRight size={14} className="text-slate-300 group-hover:text-indigo-600" />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-indigo-900 text-white rounded-sm space-y-4 shadow-xl">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border-b border-indigo-700 pb-2">
                 <Truck size={14} className="text-amber-400" /> Pickup_Telemetry
               </h4>
               <div className="space-y-3">
                  <Metric label="Hub_Inbound" value="44.5%" />
                  <Metric label="Agent_Load" value="12/20" />
                  <div className="pt-2">
                    <p className="text-[8px] font-black text-indigo-400 uppercase">Current_Assigned_Agent</p>
                    <p className="text-[10px] font-bold uppercase mt-1">Agent_701 (Vikram Singh)</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ───────────────── UI ATOMS ───────────────── */

function Input({ label, placeholder, onChange }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[8px] font-black text-slate-400 uppercase">{label}</label>
      <input 
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-white border border-slate-200 px-3 py-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-600"
      />
    </div>
  );
}

function Metric({ label, value }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[9px] font-bold text-indigo-300 uppercase">{label}</span>
      <span className="text-[11px] font-black font-mono">{value}</span>
    </div>
  );
}

function PlusSquareIcon({ size }: any) {
  return (
    <div className="bg-indigo-100 p-1 rounded-sm text-indigo-600">
       <CheckCircle size={size} />
    </div>
  );
}