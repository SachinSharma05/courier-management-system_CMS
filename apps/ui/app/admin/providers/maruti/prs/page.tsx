"use client";

import React, { useState } from 'react';
import { 
  PackageSearch, Truck, ScanLine, CheckCircle, ArrowUpRight, Loader2, RefreshCcw,
  Box,
  PlusSquare
} from 'lucide-react';
import clsx from 'clsx';
import { useMaruti } from '@/hooks/useMaruti';

// export default function MarutiPRSPage() {
//   const { createPrs, updatePrsScanned, updatePrsStatus, getPrsOrders } = useMaruti();
  
//   // STATE MANAGEMENT
//   const [activePrsId, setActivePrsId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [prsData, setPrsData] = useState<any>(null);
  
//   // 1. Create PRS State
//   const [newPrs, setNewPrs] = useState({
//     awbNumberList: [] as string[],
//     sellerInfo: { name: "", mobile: "", companyName: "" },
//     pickupInfo: { name: "", mobile: "", city: "", zip: "", address1: "", state: "", geoLocation: { cordinates: [0, 0] } },
//     dropInfo: { name: "", mobile: "", city: "", zip: "", address1: "", state: "", geoLocation: { cordinates: [0, 0] } },
//     source: ""
//   });

//   // 2. Scan Update State
//   const [scanList, setScanList] = useState("");
//   const [deliveryAgentId, setDeliveryAgentId] = useState("");

//   // HANDLERS
//   const handleFetchPRS = async () => {
//     if (!activePrsId) return;
//     setLoading(true);
//     try {
//       const res = await getPrsOrders(activePrsId);
//       setPrsData(res.data);
//     } catch (err) { alert("PRS_ID_NOT_FOUND"); }
//     finally { setLoading(false); }
//   };

//   const handleCreate = async () => {
//     setLoading(true);
//     try {
//       const res = await createPrs(newPrs);
//       setActivePrsId(res.data.prsNumber);
//       alert("PRS_CREATED_SUCCESSFULLY");
//     } finally { setLoading(false); }
//   };

//   return (
//     <div className="max-w-[1600px] mx-auto space-y-6">
//       {/* MODULE HEADER */}
//       <div className="bg-white border-l-8 border-indigo-600 p-6 shadow-sm flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">PRS_Management_Console</h1>
//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-1">Pickup_Run_Sheet // First_Mile_Logistics</p>
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <input 
//               placeholder="SEARCH_PRS_ID..."
//               className="bg-slate-100 border-2 border-slate-200 px-4 py-2 text-xs font-mono font-black uppercase outline-none focus:border-indigo-600 w-64"
//               value={activePrsId}
//               onChange={(e) => setActivePrsId(e.target.value)}
//             />
//             <button onClick={handleFetchPRS} className="absolute right-2 top-2 text-indigo-600 hover:text-indigo-800">
//               {loading ? <Loader2 size={16} className="animate-spin" /> : <PackageSearch size={16} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-280px)]">
        
//         {/* COLUMN 1: PRS CREATION (API 1) */}
//         <div className="lg:col-span-4 bg-white border border-slate-200 flex flex-col rounded-sm">
//           <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
//             <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
//               <PlusSquareIcon size={14}/> 01_Initiate_Pickup
//             </h3>
//           </div>
//           <div className="p-6 space-y-4 overflow-y-auto">
//             <section className="space-y-3">
//               <p className="text-[9px] font-black text-indigo-600 uppercase">Seller_Entity</p>
//               <div className="grid grid-cols-1 gap-2">
//                 <Input label="Company_Name" placeholder="Test Pvt Ltd" onChange={(v: string) => setNewPrs({...newPrs, sellerInfo: {...newPrs.sellerInfo, companyName: v}})} />
//                 <div className="grid grid-cols-2 gap-2">
//                   <Input label="Contact_Name" placeholder="Rohan" />
//                   <Input label="Mobile" placeholder="987xxxxxxx" />
//                 </div>
//               </div>
//             </section>
//             <section className="space-y-3 pt-4">
//               <p className="text-[9px] font-black text-indigo-600 uppercase">Pickup_Coordinate_Node</p>
//               <Input label="Contact_Name" placeholder="John" onChange={(v: string) => setNewPrs({...newPrs, pickupInfo: {...newPrs.pickupInfo, name: v}})} />
//               <Input label="Mobile" placeholder="987xxxxxxx" onChange={(v: string) => setNewPrs({...newPrs, pickupInfo: {...newPrs.pickupInfo, mobile: v}})} />
//               <Input label="Street_Address" placeholder="34, Floor 2" onChange={(v: string) => setNewPrs({...newPrs, pickupInfo: {...newPrs.pickupInfo, address1: v}})} />
//               <div className="grid grid-cols-2 gap-2">
//                 <Input label="City" placeholder="Ahmedabad" onChange={(v: string) => setNewPrs({...newPrs, pickupInfo: {...newPrs.pickupInfo, city: v}})} />
//                 <Input label="State" placeholder="Gujarat" onChange={(v: string) => setNewPrs({...newPrs, pickupInfo: {...newPrs.pickupInfo, state: v}})} />
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 <Input label="Zip_Code" placeholder="380015" onChange={(v: string) => setNewPrs({...newPrs, pickupInfo: {...newPrs.pickupInfo, zip: v}})} />
//               </div>
//             </section>
//             <button 
//               onClick={handleCreate}
//               className="w-full bg-indigo-600 text-white py-4 font-black text-[11px] uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-700 transition-all"
//             >
//               Generate_PRS_Manifest
//             </button>
//           </div>
//         </div>

//         {/* COLUMN 2: SCAN & INWARD (API 2 & 4) */}
//         <div className="lg:col-span-5 bg-white border border-slate-200 flex flex-col rounded-sm shadow-xl">
//           <div className="p-4 bg-slate-900 text-white border-b border-slate-700 flex items-center justify-between">
//             <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
//               <ScanLine size={14} className="text-amber-400"/> 02_Hub_Inward_Scanning
//             </h3>
//             {prsData && <span className="bg-amber-500 text-[9px] px-2 py-0.5 rounded-full font-black uppercase">Active: {activePrsId}</span>}
//           </div>
          
//           <div className="p-4 bg-slate-50 border-b border-slate-200">
//             <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Delivery_Agent_ID</label>
//             <input 
//               className="w-full bg-white border-2 border-slate-200 p-2 font-mono text-xs font-black outline-none focus:border-amber-500 mb-3"
//               placeholder="AGENT_ID..."
//               value={deliveryAgentId}
//               onChange={(e) => setDeliveryAgentId(e.target.value)}
//             />
//             <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Batch_Scan_AWBs (Comma Separated)</label>
//             <textarea 
//               rows={3}
//               className="w-full bg-white border-2 border-slate-200 p-3 font-mono text-xs font-black outline-none focus:border-amber-500"
//               placeholder="SCAN_MULTIPLE_LABELS_HERE..."
//               value={scanList}
//               onChange={(e) => setScanList(e.target.value)}
//             />
//             <button 
//               onClick={() => updatePrsScanned({ prsNumber: activePrsId, awbNumberList: scanList.split(','), deliveryAgentId })}
//               className="mt-2 w-full bg-slate-900 text-white py-2 text-[10px] font-black uppercase tracking-widest hover:bg-black"
//             >
//               Update_Scanned_Inventory
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto">
//              <table className="w-full text-[10px] text-left">
//                 <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 z-10">
//                   <tr className="text-slate-500 font-black uppercase">
//                     <th className="p-3">AWB_Number</th>
//                     <th className="p-3">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100 font-bold uppercase">
//                   {prsData?.orders?.map((order: any, i: number) => (
//                     <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
//                       <td className="p-3 font-mono text-slate-900">{order.awb}</td>
//                       <td className="p-3">
//                         <span className={clsx("px-2 py-0.5 rounded-sm border", order.scanned ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200")}>
//                           {order.scanned ? "Scanned" : "Pending_Pickup"}
//                         </span>
//                       </td>
//                     </tr>
//                   )) || (
//                     <tr>
//                       <td colSpan={2} className="p-10 text-center opacity-30 italic">No_PRS_Loaded</td>
//                     </tr>
//                   )}
//                 </tbody>
//              </table>
//           </div>
//         </div>

//         {/* COLUMN 3: STATUS & LIFECYCLE (API 3) */}
//         <div className="lg:col-span-3 bg-slate-50 border border-slate-200 flex flex-col rounded-sm">
//           <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
//             <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
//               <RefreshCcw size={14} className="text-indigo-600"/> 03_Lifecycle_Control
//             </h3>
//           </div>
//           <div className="p-6 space-y-6">
//             <div className="space-y-4">
//               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update_Global_Status</p>
//               <div className="grid grid-cols-1 gap-2">
//                 {['PRS_PENDING', 'PRS_ASSIGNED', 'PRS_PICKED', 'PRS_CLOSED'].map((status) => (
//                   <button 
//                     key={status}
//                     onClick={() => updatePrsStatus({ prsNumber: activePrsId, status })}
//                     className="w-full bg-white border border-slate-200 p-3 text-left hover:border-indigo-500 transition-all group flex justify-between items-center"
//                   >
//                     <span className="text-[10px] font-black text-slate-700 uppercase">{status}</span>
//                     <ArrowUpRight size={14} className="text-slate-300 group-hover:text-indigo-600" />
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="p-4 bg-indigo-900 text-white rounded-sm space-y-4 shadow-xl">
//                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border-b border-indigo-700 pb-2">
//                  <Truck size={14} className="text-amber-400" /> Pickup_Telemetry
//                </h4>
//                <div className="space-y-3">
//                   <Metric label="Hub_Inbound" value="44.5%" />
//                   <Metric label="Agent_Load" value="12/20" />
//                   <div className="pt-2">
//                     <p className="text-[8px] font-black text-indigo-400 uppercase">Current_Assigned_Agent</p>
//                     <p className="text-[10px] font-bold uppercase mt-1">Agent_701 (Vikram Singh)</p>
//                   </div>
//                </div>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// /* ───────────────── UI ATOMS ───────────────── */

// function Input({ label, placeholder, onChange }: any) {
//   return (
//     <div className="space-y-1">
//       <label className="text-[8px] font-black text-slate-400 uppercase">{label}</label>
//       <input 
//         placeholder={placeholder}
//         onChange={(e) => onChange?.(e.target.value)}
//         className="w-full bg-white border border-slate-200 px-3 py-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-600"
//       />
//     </div>
//   );
// }

// function Metric({ label, value }: any) {
//   return (
//     <div className="flex justify-between items-center">
//       <span className="text-[9px] font-bold text-indigo-300 uppercase">{label}</span>
//       <span className="text-[11px] font-black font-mono">{value}</span>
//     </div>
//   );
// }

// function PlusSquareIcon({ size }: any) {
//   return (
//     <div className="bg-indigo-100 p-1 rounded-sm text-indigo-600">
//        <CheckCircle size={size} />
//     </div>
//   );
// }
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
    pickupInfo: { name: "", mobile: "", city: "", zip: "", address1: "", state: "", geoLocation: { cordinates: [0, 0] } },
    dropInfo: { name: "", mobile: "", city: "", zip: "", address1: "", state: "", geoLocation: { cordinates: [0, 0] } },
    source: ""
  });

  // 2. Scan Update State
  const [scanList, setScanList] = useState("");
  const [deliveryAgentId, setDeliveryAgentId] = useState("");

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
    <div className="min-h-screen bg-slate-50/50 w-full pb-10">
      <div className="max-w-[1600px] mx-auto space-y-8 p-8 animate-in fade-in duration-700">
        
        {/* ───────────────── HEADER ───────────────── */}
        <div className="bg-white border-l-[12px] border-indigo-600 p-8 rounded-[2.5rem] shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">PRS_Management_Console</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
              <span className="h-1.5 w-6 bg-indigo-600 rounded-full" /> Pickup_Run_Sheet // First_Mile_v4
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <div className="relative">
              <input 
                placeholder="SEARCH_PRS_ID..."
                className="bg-white border border-slate-200 pl-4 pr-12 py-3 text-xs font-mono font-black uppercase rounded-xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 w-72 transition-all shadow-inner"
                value={activePrsId}
                onChange={(e) => setActivePrsId(e.target.value)}
              />
              <button onClick={handleFetchPRS} className="absolute right-3 top-2.5 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-black transition-colors">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <PackageSearch size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(150vh-320px)]">
          
          {/* COLUMN 1: PRS INITIATION */}
          <div className="lg:col-span-4 bg-white border border-slate-100 flex flex-col rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-3 text-slate-600">
                <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600"><PlusSquare size={16}/></div>
                01_Initiate_Pickup
              </h3>
            </div>
            
            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
              <section className="space-y-4">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] ml-1">Seller_Entity</p>
                <div className="grid grid-cols-1 gap-4 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                  <MiniInput label="Company_Name" placeholder="Test Pvt Ltd" onChange={(v: string) => setNewPrs({...newPrs, sellerInfo: {...newPrs.sellerInfo, companyName: v}})} />
                  <div className="grid grid-cols-2 gap-4">
                    <MiniInput label="Contact_Name" placeholder="Rohan" />
                    <MiniInput label="Mobile" placeholder="987xxxxxxx" />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] ml-1">Pickup_Coordinate_Node</p>
                <div className="grid grid-cols-1 gap-4 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                  <div className="grid grid-cols-2 gap-4">
                    <MiniInput label="Contact_Name" placeholder="John" onChange={(v: string) => setNewPrs({...newPrs, pickupInfo: {...newPrs.pickupInfo, name: v}})} />
                    <MiniInput label="Mobile" placeholder="987xxxxxxx" onChange={(v: string) => setNewPrs({...newPrs, pickupInfo: {...newPrs.pickupInfo, mobile: v}})} />
                  </div>
                  <MiniInput label="Street_Address" placeholder="34, Floor 2" onChange={(v: string) => setNewPrs({...newPrs, pickupInfo: {...newPrs.pickupInfo, address1: v}})} />
                  <div className="grid grid-cols-2 gap-4">
                    <MiniInput label="City" placeholder="Ahmedabad" onChange={(v: string) => setNewPrs({...newPrs, pickupInfo: {...newPrs.pickupInfo, city: v}})} />
                    <MiniInput label="Zip_Code" placeholder="380015" onChange={(v: string) => setNewPrs({...newPrs, pickupInfo: {...newPrs.pickupInfo, zip: v}})} />
                  </div>
                </div>
              </section>

              <button 
                onClick={handleCreate}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-16 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-100 transition-all active:scale-95"
              >
                Generate_PRS_Manifest
              </button>
            </div>
          </div>

          {/* COLUMN 2: HUB INWARD SCANNING */}
          <div className="lg:col-span-5 bg-white border border-slate-100 flex flex-col rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="p-6 bg-[#0F172A] text-white flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="bg-amber-500 p-2 rounded-lg"><ScanLine size={16} className="text-black"/></div>
                02_Hub_Inward_Scanning
              </h3>
              {prsData && <span className="bg-amber-500/20 text-amber-500 text-[9px] px-3 py-1 rounded-full border border-amber-500/30 font-black uppercase">PRS: {activePrsId}</span>}
            </div>
            
            <div className="p-8 bg-slate-50 border-b border-slate-100 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MiniInput label="Delivery_Agent_ID" placeholder="AGENT_ID..." value={deliveryAgentId} onChange={(v: string) => setDeliveryAgentId(v)} />
                <div className="flex items-end">
                   <button 
                    onClick={() => updatePrsScanned({ prsNumber: activePrsId, awbNumberList: scanList.split(','), deliveryAgentId })}
                    className="w-full bg-[#0F172A] text-white h-12 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                  >
                    Update_Inventory
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Batch_Scan_AWBs (Comma Separated)</label>
                <textarea 
                  rows={2}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-4 font-mono text-xs font-black outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-inner placeholder:text-slate-300"
                  placeholder="SCAN_LABELS_IN_BULK..."
                  value={scanList}
                  onChange={(e) => setScanList(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-white p-2">
               <table className="w-full text-[10px] text-left border-collapse">
                  <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-slate-50">
                    <tr className="text-slate-400 font-black uppercase tracking-tighter">
                      <th className="p-5">AWB_Identity</th>
                      <th className="p-5 text-right">Inward_Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-bold uppercase">
                    {prsData?.orders?.map((order: any, i: number) => (
                      <tr key={i} className="group hover:bg-indigo-50/30 transition-colors">
                        <td className="p-5 font-mono text-slate-900 group-hover:text-indigo-600 transition-colors">{order.awb}</td>
                        <td className="p-5 text-right">
                          <span className={clsx(
                            "px-3 py-1 rounded-full text-[9px] border", 
                            order.scanned 
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                              : "bg-slate-50 text-slate-400 border-slate-100"
                          )}>
                            {order.scanned ? "●_Scanned" : "○_Pending"}
                          </span>
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={2} className="p-20 text-center opacity-20">
                           <Box size={48} className="mx-auto mb-4 opacity-10" />
                           <p className="text-[10px] font-black uppercase tracking-[0.3em]">No_PRS_Loaded_To_Terminal</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
               </table>
            </div>
          </div>

          {/* COLUMN 3: LIFECYCLE CONTROL */}
          <div className="lg:col-span-3 bg-slate-100/50 border border-slate-200 flex flex-col rounded-[2.5rem] overflow-hidden">
            <div className="p-6 bg-white border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-3 text-slate-600">
                <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600"><RefreshCcw size={16}/></div>
                03_Lifecycle_Control
              </h3>
            </div>
            
            <div className="p-8 space-y-8 flex-1 overflow-y-auto">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deployment_Status</p>
                <div className="grid grid-cols-1 gap-3">
                  {['PRS_PENDING', 'PRS_ASSIGNED', 'PRS_PICKED', 'PRS_CLOSED'].map((status) => (
                    <button 
                      key={status}
                      onClick={() => updatePrsStatus({ prsNumber: activePrsId, status })}
                      className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-left hover:border-indigo-500 hover:shadow-md transition-all group flex justify-between items-center"
                    >
                      <span className="text-[10px] font-black text-slate-600 uppercase group-hover:text-indigo-600 transition-colors">{status}</span>
                      <ArrowUpRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-[#0F172A] text-white rounded-[2rem] space-y-6 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5"><Truck size={80} /></div>
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 border-b border-slate-800 pb-4 relative z-10">
                   <div className="bg-amber-500 p-1.5 rounded-md text-black"><Truck size={14} /></div> 
                   Pickup_Telemetry
                 </h4>
                 <div className="space-y-4 relative z-10">
                    <Metric label="Hub_Inbound" value="44.5%" />
                    <Metric label="Agent_Capacity" value="12/20" />
                    <div className="pt-4 border-t border-slate-800">
                      <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Active_Node_Agent</p>
                      <p className="text-[11px] font-black uppercase mt-2 text-slate-300">Agent_701_Singh</p>
                    </div>
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

function MiniInput({ label, value, onChange, placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-white border border-slate-200 rounded-xl h-11 px-4 text-[10px] font-bold uppercase outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner placeholder:text-slate-300"
      />
    </div>
  );
}

function Metric({ label, value }: any) {
  return (
    <div className="flex justify-between items-center group">
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-black font-mono text-emerald-400 group-hover:scale-110 transition-transform">{value}</span>
    </div>
  );
}