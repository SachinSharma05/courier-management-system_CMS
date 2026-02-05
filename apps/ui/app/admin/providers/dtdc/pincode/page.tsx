'use client';

import React, { useState, useMemo } from 'react';
// Change 'Map' to 'Map as MapIcon'
import { 
  MapPin, Route, CheckCircle2, Info, 
  Truck, Zap, Landmark, Phone, Mail,
  ArrowRight, Globe, ShieldCheck, AlertCircle, Loader2, Search,
  Terminal, Database, Activity, Map as MapIcon, Hash, PhoneCall 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { clsx } from 'clsx';
import { api } from '@/lib/api/axios';

// // --- TYPES & INTERFACES ---

export interface DtdcBranch {
  CODE: string;
  LONGITUDE: string;
  PHONE: string;
  BR_ADDRESS: string;
  EMAIL: string;
  BR_NAME: string;
  LATITUDE: string;
}

export interface DtdcServiceCapabilities {
  DC_Serviceable: "YES" | "NO";
  b2B_COD_Serviceable: "YES" | "NO";
  GEC_Serviceable: "YES" | "NO";
  b2C_COD_Serviceable: "YES" | "NO";
  b2C_SERVICEABLE: "YES" | "NO";
  special_Destination: "YES" | "NO";
  remote_Delivery_Area: "YES" | "NO";
  COD_Serviceable: "YES" | "NO";
  b2B_SERVICEABLE: "YES" | "NO";
  LITE_Serviceable: "YES" | "NO";
}

export interface DtdcProductDetail {
  CODE: string;
  TAT: string;
  PCODE: string;
  NAME: string;
}

export interface DtdcZipcodeMeta {
  MESSAGE: string;
  ORGPIN: string;
  DESTCITY: string;
  DESTCOUNTRY: string;
  ORGCOUNTRY: string;
  SERV_COD: "Y" | "N";
  SERVFLAG: "Y" | "N";
  DESTSTATE: string;
  DESTPIN: string;
}

export interface DtdcFranchisee {
  CODE: string;
  FR_ADDRESS: string;
  LONGITUDE: string;
  PHONE: string;
  EMAIL: string;
  LATITUDE: string;
  FR_NAME: string;
}

export interface DtdcPinCity {
  STATE_NAME: string;
  CITY_CODE: string;
  PARTIALSERV_AREA_AND_CITY: string;
  CITY: string;
  PIN: string;
  TALUKA_AND_DISTRICT: string;
  STATE_CODE: string;
}

export interface DtdcServiceabilityResponse {
  SERV_BR: DtdcBranch[];
  SERV_LIST: DtdcServiceCapabilities[];
  ZIPCODE_RESP: DtdcZipcodeMeta[];
  SERV_FR: DtdcFranchisee[];
  SERV_LIST_DTLS: DtdcProductDetail[];
  PIN_CITY: DtdcPinCity[];
}

// // --- SUB-COMPONENTS ---

// const CapabilityNode = ({ label, active, invert = false }: { label: string, active: boolean, invert?: boolean }) => {
//   const isAvailable = invert ? !active : active;
//   return (
//     <div className={clsx(
//       "px-3 py-1.5 rounded-sm text-[9px] font-black flex items-center gap-1.5 border transition-all uppercase tracking-widest",
//       isAvailable ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200 grayscale opacity-50"
//     )}>
//       {isAvailable ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
//       {label}
//     </div>
//   );
// };

// // --- MAIN COMPONENT ---

// export default function DTDCServiceability() {
//   // 1. Input States
//   const [origin, setOrigin] = useState("452010");
//   const [destination, setDestination] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<DtdcServiceabilityResponse | null>(null);

//   // 2. Action Handler
//   const handleCheck = async () => {
//     if (!origin || !destination) return;
//     setLoading(true);
//     try {
//       const payload = {
//         origin_pincode: origin,
//         destination_pincode: destination
//       };
//       const res = await api.post('/providers/dtdc/serviceability', payload).then(r => r.data);
//       setData(res);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 3. Data Transformation Logic
//   const processedServices = useMemo(() => {
//     if (!data?.SERV_LIST_DTLS) return [];

//     // This will now correctly reference the native JS Map
//     const uniqueMap = new Map<string, DtdcProductDetail>();

//     data.SERV_LIST_DTLS.forEach((item: DtdcProductDetail) => {
//       const existing = uniqueMap.get(item.NAME);
//       if (!existing || parseInt(item.TAT) < parseInt(existing.TAT)) {
//         uniqueMap.set(item.NAME, item);
//       }
//     });

//     return Array.from(uniqueMap.values()).sort((a, b) => 
//       parseInt(a.TAT) - parseInt(b.TAT)
//     );
//   }, [data]);

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
      
//       {/* ───────────────── ERP HEADER ───────────────── */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
//         <div className="flex items-center gap-4">
//           <div className="h-12 w-12 bg-blue-600 flex items-center justify-center text-white rounded-sm shadow-md">
//             <MapIcon size={24} />
//           </div>
//           <div>
//             <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Service_Map_Terminal</h1>
//             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
//               <Terminal size={12} className="text-blue-500" /> DTDC_NETWORK_SYNC // NODE_LOOKUP: READY
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
//         {/* ───────────────── LEFT: PARAMETER WORKSPACE ───────────────── */}
//         <div className="lg:col-span-4 space-y-6">
//           <Card className="p-8 border border-slate-200 shadow-sm rounded-sm bg-white space-y-6">
//             <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
//               <Activity size={14} className="text-blue-600" />
//               <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Query_Parameters</h2>
//             </div>
            
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Origin_PIN</Label>
//                 <div className="relative">
//                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
//                    <Input 
//                     value={origin}
//                     onChange={(e) => setOrigin(e.target.value)}
//                     className="h-14 rounded-sm border-slate-200 bg-slate-50/50 pl-12 font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all text-xs"
//                     placeholder="Source PIN"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Destination_PIN</Label>
//                 <div className="relative">
//                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
//                    <Input 
//                     value={destination}
//                     onChange={(e) => setDestination(e.target.value)}
//                     className="h-14 rounded-sm border-slate-200 bg-slate-50/50 pl-12 font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all text-xs"
//                     placeholder="Destination PIN"
//                   />
//                 </div>
//               </div>

//               <Button 
//                 onClick={handleCheck} 
//                 disabled={loading || !destination}
//                 className="w-full h-16 rounded-sm bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-blue-100 transition-all active:scale-95"
//               >
//                 {loading ? <Loader2 className="animate-spin mr-2" /> : <Search size={18} className="mr-2" />}
//                 Initialize_Lookup
//               </Button>
//             </div>
//           </Card>

//           <div className="p-6 bg-slate-900 rounded-sm border border-slate-800 text-white relative overflow-hidden">
//              <Database size={80} className="absolute -right-4 -bottom-4 opacity-[0.05] pointer-events-none" />
//              <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase mb-3">
//                <ShieldCheck size={14} /> System_Documentation
//              </div>
//              <p className="text-[10px] font-bold opacity-70 leading-relaxed uppercase tracking-tight">
//                Real-time extraction from DTDC Master DB. Includes ODA surcharges, service branch telemetry, and regional delivery area (RDA) status.
//              </p>
//           </div>
//         </div>

//         {/* ───────────────── RIGHT: TELEMETRY RESULTS ───────────────── */}
//         <div className="lg:col-span-8">
//           {data ? (
//             <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              
//               {/* Route Summary Stats */}
//               <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-8 relative overflow-hidden">
//                 <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
//                   <div className="flex flex-col items-center md:items-start">
//                     <div className="flex items-center gap-6 text-4xl font-black text-slate-900 tracking-tighter font-mono">
//                       <span>{data.ZIPCODE_RESP[0]?.ORGPIN}</span>
//                       <ArrowRight className="text-blue-500" size={24} />
//                       <span>{data.ZIPCODE_RESP[0]?.DESTPIN}</span>
//                     </div>
//                     <p className="mt-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
//                       {data.ZIPCODE_RESP[0]?.DESTCITY}, {data.PIN_CITY[1]?.STATE_NAME || "NETWORK_NODE"}
//                     </p>
                    
//                     <div className="flex flex-wrap gap-2 mt-6">
//                       <CapabilityNode label="COD_ACTIVE" active={data.SERV_LIST[0]?.COD_Serviceable === "YES"} />
//                       <CapabilityNode label="B2B_PROTOCOL" active={data.SERV_LIST[0]?.b2B_SERVICEABLE === "YES"} />
//                       <CapabilityNode label="LITE_SUPPORT" active={data.SERV_LIST[0]?.LITE_Serviceable === "YES"} />
//                     </div>
//                   </div>

//                   <div className="md:border-l border-slate-100 md:pl-8 space-y-4 w-full md:w-auto">
//                      <div className="space-y-1">
//                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Master_Branch</p>
//                         <h3 className="font-black text-slate-800 text-lg leading-tight uppercase tracking-tighter">{data.SERV_BR[0]?.BR_NAME}</h3>
//                      </div>
//                      <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 p-3 rounded-sm">
//                         <PhoneCall size={14} className="text-blue-600" />
//                         <span className="text-[11px] font-black text-blue-900 font-mono">{data.SERV_BR[0]?.PHONE}</span>
//                      </div>
//                   </div>
//                 </div>
//                 <div className="absolute top-4 right-4 opacity-[0.03] pointer-events-none">
//                     <Globe size={120} />
//                 </div>
//               </div>

//               {/* Service Matrix */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {processedServices.map((service: any) => (
//                   <div key={`${service.NAME}-${service.CODE}`} className="p-5 bg-white border border-slate-200 rounded-sm shadow-sm hover:border-blue-400 hover:shadow-md transition-all group relative">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-widest group-hover:text-blue-600 transition-colors">{service.NAME.replace(/_/g, ' ')}</h4>
//                         <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Node_Code: {service.PCODE}</p>
//                       </div>
//                       <div className="text-right">
//                         <div className="flex items-baseline gap-1 justify-end">
//                            <span className="text-3xl font-black text-blue-600 tracking-tighter font-mono">{service.TAT}</span>
//                            <span className="text-[9px] font-black text-slate-400 uppercase">Days</span>
//                         </div>
//                         <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">EST_LEAD_TIME</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//             </div>
//           ) : (
//             /* Empty Data State */
//             <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center text-center p-12 bg-slate-50/50">
//               <div className="w-20 h-20 bg-white border border-slate-200 rounded-sm shadow-sm flex items-center justify-center text-slate-200 mb-8 animate-pulse">
//                 <Truck size={40} />
//               </div>
//               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Awaiting_Lookup_Coordinates</h3>
//               <p className="text-slate-400 max-w-xs mt-3 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
//                 Enter target destination pincode to verify branch contacts and delivery SLA protocols.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
const CapabilityNode = ({ label, active, invert = false }: { label: string, active: boolean, invert?: boolean }) => {
  const isAvailable = invert ? !active : active;
  return (
    <div className={clsx(
      "px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 border transition-all uppercase tracking-widest",
      isAvailable 
        ? "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm shadow-emerald-50" 
        : "bg-slate-50 text-slate-300 border-slate-100 grayscale opacity-60"
    )}>
      {isAvailable ? <CheckCircle2 size={12} className="text-emerald-500" /> : <AlertCircle size={12} />}
      {label}
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function DTDCServiceability() {
  // 1. Input States (PRESERVED)
  const [origin, setOrigin] = useState("452010");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DtdcServiceabilityResponse | null>(null);

  // 2. Action Handler (PRESERVED)
  const handleCheck = async () => {
    if (!origin || !destination) return;
    setLoading(true);
    try {
      const payload = {
        origin_pincode: origin,
        destination_pincode: destination
      };
      const res = await api.post('/providers/dtdc/serviceability', payload).then(r => r.data);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 3. Data Transformation (PRESERVED)
  const processedServices = useMemo(() => {
    if (!data?.SERV_LIST_DTLS) return [];
    const uniqueMap = new Map<string, DtdcProductDetail>();
    data.SERV_LIST_DTLS.forEach((item: DtdcProductDetail) => {
      const existing = uniqueMap.get(item.NAME);
      if (!existing || parseInt(item.TAT) < parseInt(existing.TAT)) {
        uniqueMap.set(item.NAME, item);
      }
    });
    return Array.from(uniqueMap.values()).sort((a, b) => 
      parseInt(a.TAT) - parseInt(b.TAT)
    );
  }, [data]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* ───────────────── MODERN ERP HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 bg-[#0F172A] flex items-center justify-center text-blue-400 rounded-2xl shadow-xl shadow-blue-100">
            <MapIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Service Map Terminal</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] flex items-center gap-2 mt-1">
              <Terminal size={12} className="text-blue-500" /> DTDC_NETWORK_SYNC // NODE_LOOKUP: READY
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ───────────────── LEFT: PARAMETER WORKSPACE ───────────────── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
              <Activity size={16} className="text-blue-600" />
              <h2 className="text-xs font-black uppercase tracking-[0.15em] text-slate-800">Query Parameters</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Origin_PIN</Label>
                <div className="relative group">
                   <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                   <Input 
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="h-14 rounded-xl border-slate-100 bg-slate-50/50 pl-12 font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-[13px]"
                    placeholder="Source PIN"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Destination_PIN</Label>
                <div className="relative group">
                   <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                   <Input 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="h-14 rounded-xl border-slate-100 bg-slate-50/50 pl-12 font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-[13px]"
                    placeholder="Destination PIN"
                  />
                </div>
              </div>

              <Button 
                onClick={handleCheck} 
                disabled={loading || !destination}
                className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-blue-100 transition-all active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin mr-3" size={18} /> : <Search size={18} className="mr-3" />}
                Initialize Lookup
              </Button>
            </div>
          </div>

          <div className="p-8 bg-[#0F172A] rounded-[2rem] text-white relative overflow-hidden shadow-2xl shadow-slate-200">
             <Database size={100} className="absolute -right-6 -bottom-6 opacity-[0.05] pointer-events-none rotate-12" />
             <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase mb-4 tracking-widest">
               <ShieldCheck size={14} /> System Documentation
             </div>
             <p className="text-[11px] font-bold opacity-60 leading-relaxed uppercase tracking-tight">
               Real-time extraction from DTDC Master DB. Includes ODA surcharges, service branch telemetry, and regional delivery area (RDA) status.
             </p>
          </div>
        </div>

        {/* ───────────────── RIGHT: TELEMETRY RESULTS ───────────────── */}
        <div className="lg:col-span-8">
          {data ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-700">
              
              {/* Route Summary Stats */}
              <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm p-10 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                  <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-8 text-5xl font-black text-slate-900 tracking-tighter font-mono">
                      <span>{data.ZIPCODE_RESP[0]?.ORGPIN}</span>
                      <div className="h-1 w-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <ArrowRight className="text-blue-600" size={24} />
                      </div>
                      <span>{data.ZIPCODE_RESP[0]?.DESTPIN}</span>
                    </div>
                    <p className="mt-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Globe size={14} className="text-blue-400" />
                      {data.ZIPCODE_RESP[0]?.DESTCITY}, {data.PIN_CITY[1]?.STATE_NAME || "NETWORK_NODE"}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mt-8">
                      <CapabilityNode label="COD Protocol" active={data.SERV_LIST[0]?.COD_Serviceable === "YES"} />
                      <CapabilityNode label="B2B Channel" active={data.SERV_LIST[0]?.b2B_SERVICEABLE === "YES"} />
                      <CapabilityNode label="Lite Support" active={data.SERV_LIST[0]?.LITE_Serviceable === "YES"} />
                    </div>
                  </div>

                  <div className="md:border-l-2 border-slate-50 md:pl-10 space-y-5 w-full md:w-auto">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Master_Branch</p>
                        <h3 className="font-black text-slate-900 text-2xl leading-tight uppercase tracking-tighter italic">{data.SERV_BR[0]?.BR_NAME}</h3>
                     </div>
                     <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 p-4 rounded-2xl shadow-sm shadow-blue-50">
                        <PhoneCall size={18} className="text-blue-600" />
                        <span className="text-[13px] font-black text-blue-900 font-mono tracking-widest">{data.SERV_BR[0]?.PHONE}</span>
                     </div>
                  </div>
                </div>
                <div className="absolute top-10 right-10 opacity-[0.02] pointer-events-none">
                    <Globe size={240} />
                </div>
              </div>

              {/* Service Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {processedServices.map((service: any) => (
                  <div key={`${service.NAME}-${service.CODE}`} className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50/50 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <h4 className="font-black text-slate-900 text-[12px] uppercase tracking-widest group-hover:text-blue-600 transition-colors">
                            {service.NAME.replace(/_/g, ' ')}
                          </h4>
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Node_ID: {service.PCODE}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-baseline gap-1 justify-end">
                           <span className="text-4xl font-black text-blue-600 tracking-tighter font-mono">{service.TAT}</span>
                           <span className="text-[10px] font-black text-slate-300 uppercase italic">Days</span>
                        </div>
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">EST_LEAD_TIME</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            /* Empty Data State */
            <div className="h-full min-h-[600px] border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 bg-slate-50/30 relative overflow-hidden group">
               <ShieldCheck size={300} className="absolute opacity-[0.02] text-slate-900 group-hover:scale-110 transition-transform duration-1000" />
               <div className="w-24 h-24 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center justify-center text-blue-500 mb-10 animate-pulse relative z-10">
                <Truck size={44} />
              </div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] relative z-10">Awaiting_Lookup_Coordinates</h3>
              <p className="text-slate-400 max-w-xs mt-4 text-[11px] font-bold uppercase tracking-widest leading-relaxed relative z-10 opacity-60">
                Provide destination pincode to verify network availability and branch telemetry.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}