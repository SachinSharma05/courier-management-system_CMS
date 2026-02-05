'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calculator, MapPin, Zap, Loader2, Check, 
  ChevronsUpDown, Truck, Info, Timer, Terminal,
  ShieldCheck, Database, Box, Scale, Hash
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getCommodities, getPriceTat, getSinglePincodeServiceability } from '@/hooks/useDtdc';
import clsx from 'clsx';

// export default function DTDCCostCalculator() {
//   // ───────────────── 1. CORE LOGIC & STATE (PRESERVED) ─────────────────
//   const [payload, setPayload] = useState({
//     pickupPincode: "",
//     deliveryPincode: "",
//     srcCity: "",
//     srcState: "",
//     destCity: "",
//     destState: "",
//     weight: "",
//     isQRBooking: false,
//     length: "",
//     breadth: "",
//     height: "",
//     declaredPrice: "",
//   });

//   const [commodities, setCommodities] = useState<{id: string, name: string, code: string}[]>([]);
//   const [selectedCommodityObj, setSelectedCommodityObj] = useState<any>(null);
//   const [comboOpen, setComboOpen] = useState(false);
//   const [loadingItems, setLoadingItems] = useState(true);
//   const [results, setResults] = useState<any[] | null>(null);
//   const [calculating, setCalculating] = useState(false);

//   const isDocument = selectedCommodityObj?.name?.toUpperCase().includes("DOCUMENT") && 
//                     !selectedCommodityObj?.name?.toUpperCase().includes("NON");

//   // ───────────────── 2. DATA FETCHING HOOKS (PRESERVED) ─────────────────
//   useEffect(() => {
//     async function loadData() {
//       setLoadingItems(true);
//       try {
//         const res = await getCommodities();
//         setCommodities(res); 
//       } catch (e) {
//         console.error("Failed to load commodities", e);
//       } finally {
//         setLoadingItems(false);
//       }
//     }
//     loadData();
//   }, []);

//   useEffect(() => {
//     const fetchSourceDetails = async () => {
//       if (payload.pickupPincode.length === 6) {
//         try {
//           const res = await getSinglePincodeServiceability(payload.pickupPincode);
//           if (res.status === "OK" && res.data) {
//             setPayload(prev => ({ ...prev, srcCity: res.data.destinationBranchCity, srcState: res.data.state }));
//           }
//         } catch (error) { console.error("Error fetching source pincode details:", error); }
//       }
//     };
//     fetchSourceDetails();
//   }, [payload.pickupPincode]);

//   useEffect(() => {
//     const fetchDestDetails = async () => {
//       if (payload.deliveryPincode.length === 6) {
//         try {
//           const res = await getSinglePincodeServiceability(payload.deliveryPincode);
//           if (res.status === "OK" && res.data) {
//             setPayload(prev => ({ ...prev, destCity: res.data.destinationBranchCity, destState: res.data.state }));
//           }
//         } catch (error) { console.error("Error fetching destination pincode details:", error); }
//       }
//     };
//     fetchDestDetails();
//   }, [payload.deliveryPincode]);

//   const handleCalculate = async () => {
//     setCalculating(true);
//     const finalPayload = {
//       ...payload,
//       courierType: isDocument ? "Document" : "Non-Document",
//       commodityId: selectedCommodityObj?.id || "",
//       commodityName: selectedCommodityObj?.name || "",
//       commodityCode: selectedCommodityObj?.code || "",
//     };
//     try {
//       const res = await getPriceTat(finalPayload);
//       if (res.data && Array.isArray(res.data)) { setResults(res.data); } 
//       else { setResults([]); }
//     } catch (e) {
//       console.error("Calculation failed", e);
//       setResults(null);
//     } finally { setCalculating(false); }
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
      
//       {/* ───────────────── ERP HEADER ───────────────── */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
//         <div className="flex items-center gap-4">
//           <div className="h-12 w-12 bg-blue-600 flex items-center justify-center text-white rounded-sm shadow-md">
//             <Calculator size={24} />
//           </div>
//           <div>
//             <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Cost_Engine_Terminal</h1>
//             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
//               <Terminal size={12} className="text-blue-500" /> SYSTEM: DTDC_PRICING_V4 // MODE: LIVE_ESTIMATION
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
//         {/* ───────────────── LEFT: WORKSPACE FORM ───────────────── */}
//         <Card className="lg:col-span-5 p-8 border border-slate-200 shadow-sm rounded-sm bg-white space-y-8">
          
//           {/* Section: Route Origin/Dest */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
//               <MapPin size={14} className="text-blue-600" />
//               <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Route_Telemetry</h2>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <FormGroup label="Pickup PIN" value={payload.pickupPincode} maxLength={6} onChange={(val: string) => setPayload({...payload, pickupPincode: val})} placeholder="452010" />
//               <FormGroup label="Delivery PIN" value={payload.deliveryPincode} maxLength={6} onChange={(val: string) => setPayload({...payload, deliveryPincode: val})} placeholder="110001" />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <ReadOnlyNode label="Source_City" value={payload.srcCity} />
//               <ReadOnlyNode label="Source_State" value={payload.srcState} />
//               <ReadOnlyNode label="Dest_City" value={payload.destCity} />
//               <ReadOnlyNode label="Dest_State" value={payload.destState} />
//             </div>
//           </div>

//           {/* Section: Commodity Details */}
//           <div className="space-y-4 pt-4 border-t border-slate-100">
//             <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
//               <Database size={14} className="text-blue-600" />
//               <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Payload_Classification</h2>
//             </div>

//             <div className="space-y-2">
//               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Commodity_Type</Label>
//               <Popover open={comboOpen} onOpenChange={setComboOpen}>
//                 <PopoverTrigger asChild>
//                   <Button variant="outline" className="w-full h-12 justify-between rounded-sm bg-slate-50 border-slate-200 font-bold text-xs">
//                     {loadingItems ? <Loader2 className="animate-spin h-4 w-4" /> : selectedCommodityObj ? selectedCommodityObj.name : "SELECT_NODE_TYPE..."}
//                     <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-sm shadow-2xl border-slate-200">
//                   <Command>
//                     <CommandInput placeholder="Search system database..." className="h-10 text-xs" />
//                     <CommandEmpty className="p-4 text-[10px] font-bold uppercase text-slate-400">No match found.</CommandEmpty>
//                     <CommandGroup className="max-h-[250px] overflow-y-auto">
//                       {commodities.map((c, index) => (
//                         <CommandItem key={`${c.id}-${index}`} value={c.name.toLowerCase()} onSelect={() => { setSelectedCommodityObj(c); setComboOpen(false); }} className="font-bold py-3 text-xs">
//                           <Check className={cn("mr-2 h-4 w-4 text-blue-600", selectedCommodityObj?.id === c.id ? "opacity-100" : "opacity-0")} />
//                           {c.name}
//                         </CommandItem>
//                       ))}
//                     </CommandGroup>
//                   </Command>
//                 </PopoverContent>
//               </Popover>
//             </div>

//             {selectedCommodityObj && (
//               <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
//                 <div className="space-y-2">
//                   <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mass_Metric</Label>
//                   <div className="relative">
//                     <Input type="number" value={payload.weight} onChange={(e) => setPayload({...payload, weight: e.target.value})} className="h-12 rounded-sm bg-slate-50 border-slate-200 font-bold pr-16 text-xs" placeholder="0.00" />
//                     <div className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-[9px] text-blue-600 bg-blue-50 px-2 py-1 rounded-sm border border-blue-100 uppercase">
//                       {isDocument ? "Grams" : "Kilograms"}
//                     </div>
//                   </div>
//                 </div>

//                 {!isDocument && (
//                   <>
//                     <div className="space-y-2">
//                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Dimensional_Metrics (CM)</Label>
//                       <div className="grid grid-cols-3 border border-slate-200 rounded-sm overflow-hidden divide-x divide-slate-200">
//                         <input placeholder="L" className="h-12 bg-slate-50 w-full text-center text-xs font-bold outline-none focus:bg-white" value={payload.length} onChange={(e) => setPayload({...payload, length: e.target.value})} />
//                         <input placeholder="B" className="h-12 bg-slate-50 w-full text-center text-xs font-bold outline-none focus:bg-white" value={payload.breadth} onChange={(e) => setPayload({...payload, breadth: e.target.value})} />
//                         <input placeholder="H" className="h-12 bg-slate-50 w-full text-center text-xs font-bold outline-none focus:bg-white" value={payload.height} onChange={(e) => setPayload({...payload, height: e.target.value})} />
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Declared_Value (INR)</Label>
//                       <Input placeholder="3500" value={payload.declaredPrice} onChange={(e) => setPayload({...payload, declaredPrice: e.target.value})} className="h-12 rounded-sm bg-slate-50 border-slate-200 font-bold text-xs" />
//                     </div>
//                   </>
//                 )}
//               </div>
//             )}
//           </div>

//           <Button onClick={handleCalculate} disabled={calculating || !selectedCommodityObj} className="w-full h-16 rounded-sm bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-blue-100 transition-all active:scale-[0.98]">
//             {calculating ? <Loader2 className="animate-spin mr-2" /> : <Zap size={16} className="mr-2" />}
//             Execute_Calculation_Sequence
//           </Button>
//         </Card>

//         {/* ───────────────── RIGHT: SYSTEM OUTPUT ───────────────── */}
//         <div className="lg:col-span-7 space-y-6">
//           {results && results.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-700">
//               {results
//                 .filter((v, i, a) => a.findIndex(t => t.serviceCode === v.serviceCode) === i)
//                 .map((item, idx) => {
//                   const totalAmount = Math.round(parseFloat(item.price) + parseFloat(item.GST));
//                   const isPremium = item.serviceType.includes("PREMIUM") || item.serviceCode === "DMG";

//                   return (
//                     <div key={idx} className={clsx(
//                       "relative p-6 border transition-all group overflow-hidden rounded-sm bg-white",
//                       isPremium ? "border-blue-500 shadow-md" : "border-slate-200"
//                     )}>
//                       <div className="flex items-start justify-between mb-8">
//                         <div className="flex items-center gap-3">
//                           <div className={clsx(
//                             "w-5 h-5 rounded-full border-2 flex items-center justify-center",
//                             isPremium ? "border-blue-600" : "border-slate-300"
//                           )}>
//                             {isPremium && <div className="w-2 h-2 rounded-full bg-blue-600" />}
//                           </div>
//                           <span className="font-black text-[11px] tracking-widest text-slate-900 uppercase">
//                             {item.serviceType === "PREMIUM" ? "Express_Premium" : "Express_Lite"}
//                           </span>
//                         </div>
//                         {isPremium && (
//                           <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-sm uppercase tracking-tighter shadow-sm">
//                             OPTIMIZED
//                           </span>
//                         )}
//                       </div>

//                       <div className="flex items-end justify-between border-t border-slate-100 pt-4">
//                         <div>
//                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
//                             <Timer size={10} /> Lead_Time
//                           </p>
//                           <p className="text-lg font-black text-slate-800 font-mono italic">{item.period.replace('/s', 's')}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Final_Freight</p>
//                           <p className="text-3xl font-black text-blue-600 tracking-tighter">₹{totalAmount}</p>
//                         </div>
//                       </div>

//                       <div className="absolute -right-4 -top-4 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform text-slate-900">
//                         <Truck size={100} />
//                       </div>
//                     </div>
//                   );
//               })}
//             </div>
//           ) : (
//             <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center text-center p-12 bg-slate-50/50 relative overflow-hidden">
//                <ShieldCheck size={200} className="absolute opacity-[0.03] text-slate-900" />
//                <div className="w-20 h-20 bg-white border border-slate-200 rounded-sm shadow-sm flex items-center justify-center text-blue-500 mb-8 animate-pulse relative z-10">
//                 <Calculator size={32} />
//               </div>
//               <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] relative z-10">Awaiting_Input_Parameters</h3>
//               <p className="text-slate-400 max-w-xs mt-3 text-[10px] font-bold uppercase tracking-widest leading-relaxed relative z-10">
//                 Enter valid pincodes and payload classification to generate DTDC_CORE network estimate.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ───────────────── SHARED ERP SUB-COMPONENTS ─────────────────

// function FormGroup({ label, value, onChange, placeholder, maxLength }: any) {
//   return (
//     <div className="space-y-2">
//       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</Label>
//       <Input 
//         value={value} 
//         maxLength={maxLength}
//         onChange={(e) => onChange(e.target.value)} 
//         className="h-12 rounded-sm border-slate-200 bg-slate-50/50 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all" 
//         placeholder={placeholder} 
//       />
//     </div>
//   );
// }

// function ReadOnlyNode({ label, value }: { label: string, value: string }) {
//   return (
//     <div className="space-y-2">
//       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1">{label}</Label>
//       <div className="h-12 rounded-sm bg-slate-50 border border-slate-100 flex items-center px-4 text-[10px] font-black text-slate-500 uppercase tracking-tighter truncate">
//         {value || "---"}
//       </div>
//     </div>
//   );
// }
export default function DTDCCostCalculator() {
  // ───────────────── 1. CORE LOGIC & STATE (PRESERVED) ─────────────────
  const [payload, setPayload] = useState({
    pickupPincode: "",
    deliveryPincode: "",
    srcCity: "",
    srcState: "",
    destCity: "",
    destState: "",
    weight: "",
    isQRBooking: false,
    length: "",
    breadth: "",
    height: "",
    declaredPrice: "",
  });

  const [commodities, setCommodities] = useState<{id: string, name: string, code: string}[]>([]);
  const [selectedCommodityObj, setSelectedCommodityObj] = useState<any>(null);
  const [comboOpen, setComboOpen] = useState(false);
  const [loadingItems, setLoadingItems] = useState(true);
  const [results, setResults] = useState<any[] | null>(null);
  const [calculating, setCalculating] = useState(false);

  const isDocument = selectedCommodityObj?.name?.toUpperCase().includes("DOCUMENT") && 
                    !selectedCommodityObj?.name?.toUpperCase().includes("NON");

  // ───────────────── 2. DATA FETCHING HOOKS (PRESERVED) ─────────────────
  useEffect(() => {
    async function loadData() {
      setLoadingItems(true);
      try {
        const res = await getCommodities();
        setCommodities(res); 
      } catch (e) {
        console.error("Failed to load commodities", e);
      } finally {
        setLoadingItems(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const fetchSourceDetails = async () => {
      if (payload.pickupPincode.length === 6) {
        try {
          const res = await getSinglePincodeServiceability(payload.pickupPincode);
          if (res.status === "OK" && res.data) {
            setPayload(prev => ({ ...prev, srcCity: res.data.destinationBranchCity, srcState: res.data.state }));
          }
        } catch (error) { console.error("Error fetching source pincode details:", error); }
      }
    };
    fetchSourceDetails();
  }, [payload.pickupPincode]);

  useEffect(() => {
    const fetchDestDetails = async () => {
      if (payload.deliveryPincode.length === 6) {
        try {
          const res = await getSinglePincodeServiceability(payload.deliveryPincode);
          if (res.status === "OK" && res.data) {
            setPayload(prev => ({ ...prev, destCity: res.data.destinationBranchCity, destState: res.data.state }));
          }
        } catch (error) { console.error("Error fetching destination pincode details:", error); }
      }
    };
    fetchDestDetails();
  }, [payload.deliveryPincode]);

  const handleCalculate = async () => {
    setCalculating(true);
    const finalPayload = {
      ...payload,
      courierType: isDocument ? "Document" : "Non-Document",
      commodityId: selectedCommodityObj?.id || "",
      commodityName: selectedCommodityObj?.name || "",
      commodityCode: selectedCommodityObj?.code || "",
    };
    try {
      const res = await getPriceTat(finalPayload);
      if (res.data && Array.isArray(res.data)) { setResults(res.data); } 
      else { setResults([]); }
    } catch (e) {
      console.error("Calculation failed", e);
      setResults(null);
    } finally { setCalculating(false); }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* ───────────────── MODERN ERP HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 bg-[#0F172A] flex items-center justify-center text-blue-400 rounded-2xl shadow-lg shadow-blue-100">
            <Calculator size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cost Engine Terminal</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] flex items-center gap-2 mt-1">
              <Terminal size={12} className="text-blue-500" /> SYSTEM: DTDC_PRICING_V4 <span className="text-slate-200">|</span> MODE: LIVE_ESTIMATION
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ───────────────── LEFT: WORKSPACE FORM ───────────────── */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm space-y-8">
          
          {/* Section: Route Origin/Dest */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
              <MapPin size={16} className="text-blue-600" />
              <h2 className="text-xs font-black uppercase tracking-[0.15em] text-slate-800">Route Telemetry</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormGroup label="Pickup PIN" value={payload.pickupPincode} maxLength={6} onChange={(val: string) => setPayload({...payload, pickupPincode: val})} placeholder="452010" />
              <FormGroup label="Delivery PIN" value={payload.deliveryPincode} maxLength={6} onChange={(val: string) => setPayload({...payload, deliveryPincode: val})} placeholder="110001" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ReadOnlyNode label="Source_City" value={payload.srcCity} />
              <ReadOnlyNode label="Source_State" value={payload.srcState} />
              <ReadOnlyNode label="Dest_City" value={payload.destCity} />
              <ReadOnlyNode label="Dest_State" value={payload.destState} />
            </div>
          </div>

          {/* Section: Commodity Details */}
          <div className="space-y-6 pt-4 border-t border-slate-50">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
              <Database size={16} className="text-blue-600" />
              <h2 className="text-xs font-black uppercase tracking-[0.15em] text-slate-800">Payload Classification</h2>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Commodity_Type</Label>
              <Popover open={comboOpen} onOpenChange={setComboOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-14 justify-between rounded-xl bg-slate-50 border-slate-100 font-bold text-[13px] hover:bg-white transition-all">
                    {loadingItems ? <Loader2 className="animate-spin h-4 w-4" /> : selectedCommodityObj ? selectedCommodityObj.name : "SELECT_NODE_TYPE..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl shadow-2xl border-slate-100 overflow-hidden">
                  <Command>
                    <CommandInput placeholder="Search system database..." className="h-12 text-xs" />
                    <CommandEmpty className="p-4 text-[10px] font-bold uppercase text-slate-400">No match found.</CommandEmpty>
                    <CommandGroup className="max-h-[250px] overflow-y-auto p-2">
                      {commodities.map((c, index) => (
                        <CommandItem key={`${c.id}-${index}`} value={c.name.toLowerCase()} onSelect={() => { setSelectedCommodityObj(c); setComboOpen(false); }} className="font-bold py-3 text-xs rounded-lg cursor-pointer">
                          <Check className={cn("mr-2 h-4 w-4 text-blue-600", selectedCommodityObj?.id === c.id ? "opacity-100" : "opacity-0")} />
                          {c.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {selectedCommodityObj && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mass_Metric</Label>
                  <div className="relative group">
                    <Input type="number" value={payload.weight} onChange={(e) => setPayload({...payload, weight: e.target.value})} className="h-14 rounded-xl bg-slate-50 border-slate-100 font-bold pr-20 text-[13px] focus:bg-white transition-all" placeholder="0.00" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-[9px] text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 uppercase tracking-tighter">
                      {isDocument ? "Grams" : "Kilograms"}
                    </div>
                  </div>
                </div>

                {!isDocument && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Dimensional_Metrics (CM)</Label>
                      <div className="grid grid-cols-3 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden divide-x divide-slate-100">
                        <input placeholder="L" className="h-14 bg-transparent w-full text-center text-xs font-bold outline-none focus:bg-white transition-all" value={payload.length} onChange={(e) => setPayload({...payload, length: e.target.value})} />
                        <input placeholder="B" className="h-14 bg-transparent w-full text-center text-xs font-bold outline-none focus:bg-white transition-all" value={payload.breadth} onChange={(e) => setPayload({...payload, breadth: e.target.value})} />
                        <input placeholder="H" className="h-14 bg-transparent w-full text-center text-xs font-bold outline-none focus:bg-white transition-all" value={payload.height} onChange={(e) => setPayload({...payload, height: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Declared_Value (INR)</Label>
                      <Input placeholder="3500" value={payload.declaredPrice} onChange={(e) => setPayload({...payload, declaredPrice: e.target.value})} className="h-14 rounded-xl bg-slate-50 border-slate-100 font-bold text-[13px] focus:bg-white transition-all" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button onClick={handleCalculate} disabled={calculating || !selectedCommodityObj} className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-100 transition-all active:scale-[0.98] mt-4">
            {calculating ? <Loader2 className="animate-spin mr-3" size={18} /> : <Zap size={18} className="mr-3" />}
            Execute Calculation Sequence
          </Button>
        </div>

        {/* ───────────────── RIGHT: SYSTEM OUTPUT ───────────────── */}
        <div className="lg:col-span-7 h-full">
          {results && results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-700">
              {results
                .filter((v, i, a) => a.findIndex(t => t.serviceCode === v.serviceCode) === i)
                .map((item, idx) => {
                  const totalAmount = Math.round(parseFloat(item.price) + parseFloat(item.GST));
                  const isPremium = item.serviceType.includes("PREMIUM") || item.serviceCode === "DMG";

                  return (
                    <div key={idx} className={clsx(
                      "relative p-8 border transition-all group overflow-hidden rounded-[2rem] bg-white",
                      isPremium ? "border-blue-500 shadow-xl shadow-blue-50" : "border-slate-100 shadow-sm"
                    )}>
                      <div className="flex items-start justify-between mb-10">
                        <div className="flex items-center gap-3">
                          <div className={clsx(
                            "w-6 h-6 rounded-full border-4 flex items-center justify-center transition-colors",
                            isPremium ? "border-blue-100" : "border-slate-50"
                          )}>
                            <div className={clsx("w-2 h-2 rounded-full", isPremium ? "bg-blue-600" : "bg-slate-300")} />
                          </div>
                          <span className="font-black text-[10px] tracking-widest text-slate-900 uppercase">
                            {item.serviceType === "PREMIUM" ? "Express_Premium" : "Express_Lite"}
                          </span>
                        </div>
                        {isPremium && (
                          <span className="bg-[#0F172A] text-blue-400 text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                            OPTIMIZED
                          </span>
                        )}
                      </div>

                      <div className="flex items-end justify-between border-t border-slate-50 pt-6">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Timer size={12} className="text-blue-500" /> Lead_Time
                          </p>
                          <p className="text-xl font-black text-slate-800 font-mono italic tracking-tighter">{item.period.replace('/s', 's')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Final_Freight</p>
                          <p className="text-4xl font-black text-blue-600 tracking-tighter">₹{totalAmount}</p>
                        </div>
                      </div>

                      <div className="absolute -right-6 -top-6 opacity-[0.02] pointer-events-none group-hover:scale-110 group-hover:opacity-[0.05] transition-all text-slate-900">
                        <Truck size={140} />
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="h-[600px] border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 bg-slate-50/30 relative overflow-hidden group">
               <ShieldCheck size={280} className="absolute opacity-[0.02] text-slate-900 group-hover:scale-110 transition-transform duration-1000" />
               <div className="w-24 h-24 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 flex items-center justify-center text-blue-500 mb-8 animate-pulse relative z-10">
                <Calculator size={36} />
              </div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] relative z-10">Awaiting_Input_Parameters</h3>
              <p className="text-slate-400 max-w-xs mt-4 text-[11px] font-bold uppercase tracking-widest leading-relaxed relative z-10 opacity-60">
                Provide route telemetry and payload metrics to initialize the pricing sequence.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ───────────────── SHARED MODERN COMPONENTS ─────────────────

function FormGroup({ label, value, onChange, placeholder, maxLength }: any) {
  return (
    <div className="space-y-2 group">
      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-blue-500 transition-colors">{label}</Label>
      <Input 
        value={value} 
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)} 
        className="h-14 rounded-xl border-slate-100 bg-slate-50/50 text-[13px] font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all placeholder:text-slate-300" 
        placeholder={placeholder} 
      />
    </div>
  );
}

function ReadOnlyNode({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-[9px] font-black uppercase tracking-widest text-slate-300 ml-1">{label}</Label>
      <div className="h-12 rounded-xl bg-slate-50/80 border border-slate-50 flex items-center px-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter truncate italic">
        {value || "pending..."}
      </div>
    </div>
  );
}