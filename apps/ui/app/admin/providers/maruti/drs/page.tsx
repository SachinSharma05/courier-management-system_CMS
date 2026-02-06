"use client";

import React, { useState } from 'react';
import { 
  Scan, ClipboardList, CheckCircle2, 
  Camera, MapPin, UserCheck, Save, Loader2, Trash2,
  Box,
  User,
  MapIcon
} from 'lucide-react';
import { useMaruti } from '@/hooks/useMaruti';

// export default function MarutiDRSCommander() {
//   const { validateDrsAwbs, createDrs, updateDrsStatus } = useMaruti();
  
//   // STEP 1: CONFIG & VALIDATION STATE
//   const [drsConfig, setDrsConfig] = useState({
//     daId: "65d451ebeed2eb673adddb29",
//     daMobileNo: "7017727624",
//     deliveryArea: "Koregaon",
//     deliveryPincode: 123457,
//     type: "ECOM"
//   });
  
//   const [awbInput, setAwbInput] = useState("");
//   const [validatedList, setValidatedList] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [activeDrsId, setActiveDrsId] = useState<string | null>(null);

//   // STEP 4: POD STATE
//   const [podData, setPodData] = useState({
//     cAWB_No: "",
//     is_delivered: true,
//     receiver_name: "",
//     receiver_phone: "",
//     delivery_remarks: ""
//   });

//   // HANDLERS
//   const handleValidate = async () => {
//     if (!awbInput) return;
//     setLoading(true);
//     try {
//       // Payload 1: validateDrsAwbs
//       const res = await validateDrsAwbs({ ...drsConfig, awbList: [awbInput], type: drsConfig.type as 'ECOM' | 'NORMAL' | 'HYPERLOCAL' });
//       setValidatedList(prev => [...new Set([...prev, awbInput])]);
//       setAwbInput("");
//     } catch (err) { alert("AWB_VALIDATION_FAILED: Check Pincode/Status"); }
//     finally { setLoading(false); }
//   };

//   const handleCreateDRS = async () => {
//     setLoading(true);
//     try {
//       // Payload 3: createDrs
//       const res = await createDrs({ ...drsConfig, awbList: validatedList, type: drsConfig.type as 'ECOM' | 'HYPERLOCAL' });
//       setActiveDrsId(res.data?.drsId || "DRS-8829-X");
//       alert("DRS_COMMITTED_TO_FLEET");
//     } catch (err) { console.error(err); }
//     finally { setLoading(false); }
//   };

//   const handleUpdateStatus = () => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition((pos) => {
//         const payload = {
//           ...podData,
//           location: `${pos.coords.latitude},${pos.coords.longitude}`,
//           status_timestamp: new Date().toISOString(),
//         };
//         updateDrsStatus(payload);
//       });
//     } else {
//       // Fallback if GPS is unavailable
//       updateDrsStatus({
//         ...podData,
//         location: "MANUAL_ENTRY_BRANCH",
//         status_timestamp: new Date().toISOString(),
//       });
//     }
//   };

//   return (
//     <div className="max-w-[1600px] mx-auto space-y-6 pb-20">
//       {/* HEADER */}
//       <div className="flex justify-between items-center border-b-4 border-slate-900 pb-4">
//         <div>
//           <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">DRS_Fulfillment_Terminal</h1>
//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Delivery_Run_Sheet // Operational_Flow_v4</p>
//         </div>
//         <div className="flex gap-4">
//           <StatusChip label="DA_Node" value={drsConfig.daId.slice(-6)} />
//           <StatusChip label="Zone" value={drsConfig.deliveryArea} />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        
//         {/* COLUMN 1: INGESTION & VALIDATION */}
//         <section className="bg-white border border-slate-200 flex flex-col rounded-sm">
//           <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
//             <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
//               <Scan size={14} className="text-indigo-600"/> 01_Ingestion_Node
//             </h3>
//           </div>
//           <div className="p-4 space-y-4">
//              <div className="grid grid-cols-2 gap-2">
//                 <MiniInput label="Type" value={drsConfig.type} />
//                 <MiniInput label="Pincode" value={drsConfig.deliveryPincode} />
//              </div>
//              <div className="relative">
//                 <input 
//                   value={awbInput}
//                   onChange={(e) => setAwbInput(e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
//                   placeholder="SCAN_AWB_FOR_VALIDATION..."
//                   className="w-full bg-slate-900 text-white p-4 font-mono text-sm font-black outline-none placeholder:text-slate-600 border-b-4 border-indigo-500"
//                 />
//                 {loading && <Loader2 className="absolute right-4 top-4 animate-spin text-indigo-400" size={20}/>}
//              </div>
//           </div>
//           <div className="flex-1 overflow-y-auto p-4 space-y-2">
//             {validatedList.map(awb => (
//               <div key={awb} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200">
//                 <span className="text-xs font-mono font-black">{awb}</span>
//                 <CheckCircle2 size={14} className="text-emerald-500" />
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* COLUMN 2: LIST & CREATION */}
//         <section className="bg-white border border-slate-200 flex flex-col rounded-sm shadow-xl">
//           <div className="p-4 border-b border-slate-100 bg-indigo-600 text-white flex items-center justify-between">
//             <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
//               <ClipboardList size={14}/> 02_Batch_Finalization
//             </h3>
//             <span className="text-[10px] font-black">{validatedList.length} UNITS</span>
//           </div>
//           <div className="flex-1 overflow-y-auto">
//              {/* Payload 2: DRS Details List Visualization */}
//              <table className="w-full text-[10px] text-left">
//                 <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-black">
//                    <tr>
//                      <th className="p-3">AWB_Sequence</th>
//                      <th className="p-3">Status</th>
//                      <th className="p-3">Action</th>
//                    </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-50 font-bold">
//                    {validatedList.map((awb, i) => (
//                      <tr key={awb} className="hover:bg-slate-50 transition-colors">
//                         <td className="p-3 font-mono">{awb}</td>
//                         <td className="p-3"><span className="text-emerald-600 uppercase">Validated</span></td>
//                         <td className="p-3"><Trash2 size={12} className="text-rose-400 cursor-pointer" onClick={() => setValidatedList(v => v.filter(x => x !== awb))}/></td>
//                      </tr>
//                    ))}
//                 </tbody>
//              </table>
//           </div>
//           <div className="p-4 border-t border-slate-100">
//             <button 
//               onClick={handleCreateDRS}
//               disabled={validatedList.length === 0}
//               className="w-full bg-slate-900 text-white py-4 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-all disabled:opacity-30"
//             >
//               <Save size={16}/> Commit_To_Runner
//             </button>
//           </div>
//         </section>

//         {/* COLUMN 3: STATUS & POD CLOSURE */}
//         <section className="bg-slate-50 border border-slate-200 flex flex-col rounded-sm">
//           <div className="p-4 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
//             <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
//               <UserCheck size={14} className="text-emerald-400"/> 03_POD_Closure
//             </h3>
//           </div>
//           <div className="p-6 space-y-5">
//              <div className="bg-white p-4 border border-slate-200 space-y-4">
//                 <p className="text-[9px] font-black text-slate-400 uppercase">Active_Closure_Identifier</p>
//                 <input 
//                   placeholder="AWB_TO_UPDATE..."
//                   className="w-full text-xs font-mono font-black border-b border-slate-200 pb-2 outline-none focus:border-emerald-500"
//                   value={podData.cAWB_No}
//                   onChange={(e) => setPodData({...podData, cAWB_No: e.target.value})}
//                 />
                
//                 <div className="grid grid-cols-2 gap-4">
//                    <MiniInput label="Receiver_Name" value={podData.receiver_name} onChange={(v: string) => setPodData({...podData, receiver_name: v})} />
//                    <MiniInput label="Receiver_Phone" value={podData.receiver_phone} onChange={(v: string) => setPodData({...podData, receiver_phone: v})} />
//                 </div>

//                 <div className="flex items-center gap-3 py-2">
//                    <input type="checkbox" checked={podData.is_delivered} onChange={(e) => setPodData({...podData, is_delivered: e.target.checked})} className="accent-emerald-500" />
//                    <span className="text-[10px] font-black uppercase">Is_Delivered_Successfully</span>
//                 </div>

//                 <button className="w-full bg-emerald-100 text-emerald-700 py-3 rounded-sm text-[10px] font-black uppercase flex items-center justify-center gap-2 border border-emerald-200">
//                    <Camera size={14}/> Capture_POD_Image
//                 </button>

//                 <button 
//                   onClick={handleUpdateStatus}
//                   className="w-full bg-emerald-600 text-white py-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg"
//                 >
//                    Update_Mission_Status
//                 </button>
//              </div>
             
//              <div className="p-4 bg-indigo-50 border border-indigo-100 flex gap-3">
//                 <MapPin className="text-indigo-400 shrink-0" size={16}/>
//                 <p className="text-[9px] text-indigo-800 font-bold uppercase leading-relaxed">
//                   Note: GPS Coordinates will be captured automatically on status update for POD validation.
//                 </p>
//              </div>
//           </div>
//         </section>

//       </div>
//     </div>
//   );
// }

// /* ───────────────── UI COMPONENTS ───────────────── */

// function StatusChip({ label, value }: any) {
//   return (
//     <div className="flex flex-col items-end">
//       <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
//       <span className="text-[11px] font-bold text-slate-900 uppercase">{value}</span>
//     </div>
//   );
// }

// function MiniInput({ label, value, onChange }: any) {
//   return (
//     <div className="space-y-1">
//       <label className="text-[8px] font-black text-slate-400 uppercase">{label}</label>
//       <input 
//         value={value}
//         onChange={(e) => onChange?.(e.target.value)}
//         className="w-full bg-slate-50 border border-slate-200 px-2 py-1 text-[10px] font-bold outline-none"
//       />
//     </div>
//   );
// }
export default function MarutiDRSCommander() {
  const { validateDrsAwbs, createDrs, updateDrsStatus } = useMaruti();
  
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

  const [podData, setPodData] = useState({
    cAWB_No: "",
    is_delivered: true,
    receiver_name: "",
    receiver_phone: "",
    delivery_remarks: ""
  });

  const handleValidate = async () => {
    if (!awbInput) return;
    setLoading(true);
    try {
      await validateDrsAwbs({ 
        ...drsConfig, 
        awbList: [awbInput], 
        type: drsConfig.type as 'ECOM' | 'NORMAL' | 'HYPERLOCAL' 
      });
      setValidatedList(prev => [...new Set([...prev, awbInput])]);
      setAwbInput("");
    } catch (err) { 
      alert("AWB_VALIDATION_FAILED: Check Pincode/Status"); 
    } finally { setLoading(false); }
  };

  const handleCreateDRS = async () => {
    setLoading(true);
    try {
      const res = await createDrs({ ...drsConfig, awbList: validatedList, type: drsConfig.type as 'ECOM' | 'HYPERLOCAL' });
      setActiveDrsId(res.data?.drsId || "DRS-8829-X");
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleUpdateStatus = () => {
    const timestamp = new Date().toISOString();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        updateDrsStatus({ ...podData, location: `${pos.coords.latitude},${pos.coords.longitude}`, status_timestamp: timestamp });
      });
    } else {
      updateDrsStatus({ ...podData, location: "MANUAL_ENTRY_BRANCH", status_timestamp: timestamp });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 w-full pb-10">
      <div className="max-w-[1600px] mx-auto space-y-8 p-8 animate-in fade-in duration-700">
        
        {/* ───────────────── TERMINAL HEADER ───────────────── */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">DRS_Commander</h1>
            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
              <span className="h-2 w-2 bg-indigo-600 rounded-full animate-pulse"/> Fleet_Deployment_Terminal_v4.0
            </p>
          </div>
          <div className="flex gap-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <StatusChip label="Agent_Node" value={drsConfig.daId.slice(-6)} icon={<User size={12}/>} />
            <div className="w-px h-8 bg-slate-100" />
            <StatusChip label="Operational_Zone" value={drsConfig.deliveryArea} icon={<MapIcon size={12}/>} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-280px)]">
          
          {/* COLUMN 1: INGESTION NODE */}
          <section className="bg-white border border-slate-100 flex flex-col rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-3 text-slate-600">
                <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600"><Scan size={16}/></div>
                01_Ingestion_Node
              </h3>
            </div>
            <div className="p-8 space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <MiniInput label="Service_Type" value={drsConfig.type} />
                  <MiniInput label="Zone_Zip" value={drsConfig.deliveryPincode} />
               </div>
               <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-10 group-focus-within:opacity-30 transition duration-1000"></div>
                  <input 
                    value={awbInput}
                    onChange={(e) => setAwbInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
                    placeholder="SCAN_AWB_INPUT..."
                    className="relative w-full bg-[#0F172A] text-white h-16 px-6 font-mono text-sm font-black rounded-xl outline-none placeholder:text-slate-600 border-b-4 border-indigo-500 shadow-2xl"
                  />
                  {loading && <Loader2 className="absolute right-4 top-5 animate-spin text-indigo-400" size={24}/>}
               </div>
            </div>
            <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-3">
              {validatedList.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
                   <Box size={40} />
                   <p className="text-[9px] font-black uppercase mt-4">Queue_Empty</p>
                </div>
              )}
              {validatedList.map(awb => (
                <div key={awb} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-md transition-all group">
                  <span className="text-xs font-mono font-black text-slate-700 group-hover:text-indigo-600">{awb}</span>
                  <div className="bg-emerald-100 p-1 rounded-md">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* COLUMN 2: BATCH FINALIZATION */}
          <section className="bg-white border border-slate-100 flex flex-col rounded-[2.5rem] shadow-xl relative">
            <div className="p-6 border-b border-indigo-50 bg-indigo-600 text-white flex items-center justify-between rounded-t-[2.5rem]">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                <ClipboardList size={16}/> 02_Batch_Finalization
              </h3>
              <div className="bg-indigo-400/30 px-3 py-1 rounded-full text-[10px] font-black">
                {validatedList.length} UNITS
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
               <table className="w-full text-[10px] text-left border-collapse">
                  <thead className="sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-slate-50">
                     <tr className="text-slate-400 font-black uppercase tracking-tighter">
                       <th className="p-5">AWB_Sequence</th>
                       <th className="p-5 text-center">Status</th>
                       <th className="p-5 text-right">Removal</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-bold">
                     {validatedList.map((awb) => (
                       <tr key={awb} className="group hover:bg-slate-50 transition-colors">
                          <td className="p-5 font-mono text-slate-900">{awb}</td>
                          <td className="p-5 text-center">
                            <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-[9px] uppercase">Validated</span>
                          </td>
                          <td className="p-5 text-right">
                            <button onClick={() => setValidatedList(v => v.filter(x => x !== awb))} className="p-2 hover:bg-rose-50 rounded-lg text-rose-300 hover:text-rose-500 transition-all">
                              <Trash2 size={14}/>
                            </button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            <div className="p-8 border-t border-slate-50 bg-slate-50/30 rounded-b-[2.5rem]">
              <button 
                onClick={handleCreateDRS}
                disabled={validatedList.length === 0}
                className="w-full bg-[#0F172A] hover:bg-black text-white h-16 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 disabled:opacity-30"
              >
                <Save size={18} className="text-indigo-400"/> Commit_To_Runner
              </button>
            </div>
          </section>

          {/* COLUMN 3: POD CLOSURE */}
          <section className="bg-slate-100/50 border border-slate-200 flex flex-col rounded-[2.5rem] overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-3">
                <div className="bg-emerald-500 p-2 rounded-lg"><UserCheck size={16}/></div>
                03_POD_Closure
              </h3>
            </div>
            <div className="p-8 space-y-6 flex-1 overflow-y-auto">
               <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Closure_Target</p>
                    <input 
                      placeholder="SCAN_AWB_FOR_POD..."
                      className="w-full bg-slate-50 h-14 px-4 rounded-xl text-xs font-mono font-black border border-slate-100 outline-none focus:bg-white focus:border-emerald-500 transition-all shadow-inner"
                      value={podData.cAWB_No}
                      onChange={(e) => setPodData({...podData, cAWB_No: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                     <MiniInput label="Receiver_Identity" placeholder="Name" value={podData.receiver_name} onChange={(v: string) => setPodData({...podData, receiver_name: v})} />
                     <MiniInput label="Contact_Link" placeholder="Phone" value={podData.receiver_phone} onChange={(v: string) => setPodData({...podData, receiver_phone: v})} />
                  </div>

                  <label className="flex items-center gap-4 py-4 px-4 bg-emerald-50/50 rounded-xl border border-emerald-100 cursor-pointer group">
                     <input type="checkbox" checked={podData.is_delivered} onChange={(e) => setPodData({...podData, is_delivered: e.target.checked})} className="w-5 h-5 accent-emerald-600 rounded-lg" />
                     <span className="text-[10px] font-black uppercase text-emerald-800 tracking-tight">Confirmed_Delivered_Success</span>
                  </label>

                  <button className="w-full bg-white text-slate-900 h-14 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-3 border-2 border-slate-100 hover:border-indigo-500 transition-all">
                     <Camera size={18} className="text-indigo-500"/> Capture_Evidence
                  </button>

                  <button 
                    onClick={handleUpdateStatus}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-16 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 transition-all"
                  >
                    Execute_Update
                  </button>
               </div>
               
               <div className="p-5 bg-white border border-slate-100 rounded-2xl flex gap-4">
                  <div className="bg-indigo-50 p-3 rounded-xl">
                    <MapPin className="text-indigo-500" size={20}/>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-tight">
                    <span className="text-indigo-600 block mb-1 font-black underline">Geospatial_Auto_Lock:</span>
                    GPS Coordinates are currently active and will be appended to the POD.
                  </p>
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── UI ATOMS ───────────────── */

function StatusChip({ label, value, icon }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-slate-50 p-2 rounded-lg text-slate-400">{icon}</div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{label}</p>
        <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

function MiniInput({ label, value, onChange, placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 rounded-xl h-12 px-4 text-xs font-mono font-black outline-none focus:bg-white focus:border-indigo-400 transition-all shadow-inner placeholder:text-slate-300"
      />
    </div>
  );
}