'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calculator, MapPin, Weight, Zap, 
  Loader2, Check, ChevronsUpDown, 
  Package, Truck, Info, Star, Timer
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { api } from '@/lib/api/axios';
import { getServiceability, getCommodities, getPriceTat, getSinglePincodeServiceability } from '@/hooks/useDtdc';

export default function DTDCCostCalculator() {
  // 1. Unified State
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

  // 2. Commodity/Selection State
  const [commodities, setCommodities] = useState<{id: string, name: string, code: string}[]>([]);
  const [selectedCommodityObj, setSelectedCommodityObj] = useState<any>(null);
  const [comboOpen, setComboOpen] = useState(false);
  const [loadingItems, setLoadingItems] = useState(true);

  // 3. UI/Results State
  const [results, setResults] = useState<any[] | null>(null);
  const [calculating, setCalculating] = useState(false);

  // Derive if selection is a Document
  const isDocument = selectedCommodityObj?.name?.toUpperCase().includes("DOCUMENT") && 
                    !selectedCommodityObj?.name?.toUpperCase().includes("NON");

  useEffect(() => {
    async function loadData() {
      setLoadingItems(true);
      try {
        // Call the function from the hook
        const res = await getCommodities();
        // res is the Axios response, so we use res.data
        setCommodities(res); 
      } catch (e) {
        console.error("Failed to load commodities", e);
      } finally {
        setLoadingItems(false);
      }
    }
    loadData();
  }, []); // Empty dependency array means this runs once on mount

  // 1. Auto-fetch Source Details when Pickup PIN changes
  useEffect(() => {
    const fetchSourceDetails = async () => {
      // Only trigger if pincode is 6 digits
      if (payload.pickupPincode.length === 6) {
        try {
          const res = await getSinglePincodeServiceability(payload.pickupPincode);
          if (res.status === "OK" && res.data) {
            setPayload(prev => ({
              ...prev,
              srcCity: res.data.destinationBranchCity,
              srcState: res.data.state
            }));
          }
        } catch (error) {
          console.error("Error fetching source pincode details:", error);
        }
      }
    };

    fetchSourceDetails();
  }, [payload.pickupPincode]);

  // 2. Auto-fetch Destination Details when Delivery PIN changes
  useEffect(() => {
    const fetchDestDetails = async () => {
      if (payload.deliveryPincode.length === 6) {
        try {
          const res = await getSinglePincodeServiceability(payload.deliveryPincode);
          if (res.status === "OK" && res.data) {
            setPayload(prev => ({
              ...prev,
              destCity: res.data.destinationBranchCity,
              destState: res.data.state
            }));
          }
        } catch (error) {
          console.error("Error fetching destination pincode details:", error);
        }
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
      // 1. Call the hook function
      const res = await getPriceTat(finalPayload);
      // 2. Axios automatically parses JSON, so data is in res.data
      if (res.data && Array.isArray(res.data)) {
        setResults(res.data);
      } else {
        setResults([]);
      }
    } catch (e) {
      console.error("Calculation failed", e);
      setResults(null);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 min-h-screen bg-slate-50/50">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: INPUT FORM */}
        <Card className="lg:col-span-5 p-8 border-none shadow-xl rounded-[2.5rem] bg-white space-y-6">
          
          {/* PINCODE & LOCATION SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pickup PIN</Label>
                <Input 
                  value={payload.pickupPincode} 
                  maxLength={6}
                  onChange={(e) => setPayload({...payload, pickupPincode: e.target.value})} 
                  className="h-12 rounded-xl border-blue-100 focus:border-blue-400" 
                  placeholder="452010" 
                />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Delivery PIN</Label>
                <Input 
                  value={payload.deliveryPincode} 
                  maxLength={6}
                  onChange={(e) => setPayload({...payload, deliveryPincode: e.target.value})} 
                  className="h-12 rounded-xl border-blue-100 focus:border-blue-400" 
                  placeholder="110001" 
                />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Source City</Label>
                <Input 
                  value={payload.srcCity} 
                  readOnly 
                  className="h-12 rounded-xl bg-slate-50 border-none font-bold text-slate-600 cursor-not-allowed" 
                  placeholder="City (Auto-filled)" 
                />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Source State</Label>
                <Input 
                  value={payload.srcState} 
                  readOnly 
                  className="h-12 rounded-xl bg-slate-50 border-none font-bold text-slate-600 cursor-not-allowed" 
                  placeholder="State (Auto-filled)" 
                />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Dest City</Label>
                <Input 
                  value={payload.destCity} 
                  readOnly 
                  className="h-12 rounded-xl bg-slate-50 border-none font-bold text-slate-600 cursor-not-allowed" 
                  placeholder="City (Auto-filled)" 
                />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Dest State</Label>
                <Input 
                  value={payload.destState} 
                  readOnly 
                  className="h-12 rounded-xl bg-slate-50 border-none font-bold text-slate-600 cursor-not-allowed" 
                  placeholder="City (Auto-filled)" 
                />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            {/* COMMODITY SEARCH */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Content / Commodity</Label>
                  <Info size={14} className="text-slate-300" />
                </div>
                <Popover open={comboOpen} onOpenChange={setComboOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full h-14 justify-between rounded-xl bg-slate-50 border-none font-bold shadow-inner">
                            {loadingItems ? <Loader2 className="animate-spin h-4 w-4" /> : selectedCommodityObj ? selectedCommodityObj.name : "Select Commodity..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl shadow-2xl border-none">
                        <Command>
                            <CommandInput placeholder="Search items (e.g. Household, Documents...)" />
                            <CommandEmpty>No commodity found.</CommandEmpty>
                            <CommandGroup className="max-h-[250px] overflow-y-auto">
                                {commodities.map((c, index) => (
                                    <CommandItem 
                                      key={`${c.id}-${index}`} 
                                      value={c.name.toLowerCase()} 
                                      onSelect={() => { setSelectedCommodityObj(c); setComboOpen(false); }} 
                                      className="font-bold py-3"
                                    >
                                        <Check className={cn("mr-2 h-4 w-4 text-blue-600", selectedCommodityObj?.id === c.id ? "opacity-100" : "opacity-0")} />
                                        {c.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* CONDITIONAL SHIPMENT DETAILS */}
            {selectedCommodityObj && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                
                {/* Weight Field (Grams for Docs, KG for Rest) */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Weight</Label>
                    <div className="relative">
                      <Input type="number" value={payload.weight} onChange={(e) => setPayload({...payload, weight: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold pr-16" placeholder="0.00" />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-[10px] text-slate-400 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">
                        {isDocument ? "GMS" : "KG"}
                      </div>
                    </div>
                </div>

                {!isDocument && (
                  <>
                    {/* Measurements Box */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Measurement (cm)</Label>
                        <Info size={14} className="text-slate-300" />
                      </div>
                      <div className="grid grid-cols-3 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <Input placeholder="Length" className="h-12 border-none rounded-none text-center font-bold border-r border-slate-100 focus-visible:ring-0" value={payload.length} onChange={(e) => setPayload({...payload, length: e.target.value})} />
                        <Input placeholder="Breadth" className="h-12 border-none rounded-none text-center font-bold border-r border-slate-100 focus-visible:ring-0" value={payload.breadth} onChange={(e) => setPayload({...payload, breadth: e.target.value})} />
                        <Input placeholder="Height" className="h-12 border-none rounded-none text-center font-bold focus-visible:ring-0" value={payload.height} onChange={(e) => setPayload({...payload, height: e.target.value})} />
                      </div>
                    </div>

                    {/* Shipment Value */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Shipment Value (INR)</Label>
                      <Input placeholder="e.g. 3500" value={payload.declaredPrice} onChange={(e) => setPayload({...payload, declaredPrice: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <Button onClick={handleCalculate} disabled={calculating || !selectedCommodityObj} className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-100 transition-all active:scale-[0.98]">
            {calculating ? <Loader2 className="animate-spin mr-2" /> : <Zap size={20} className="mr-2" />}
            Calculate Freight
          </Button>
        </Card>

        {/* RIGHT: RESULTS */}
        <div className="lg:col-span-7 space-y-6">
          {results && results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-700">
              {/* Filtering duplicates: DTDC sometimes returns the same service twice 
                  if the API call is structured a certain way. 
              */}
              {results
                .filter((v, i, a) => a.findIndex(t => t.serviceCode === v.serviceCode) === i)
                .map((item, idx) => {
                  const totalAmount = Math.round(parseFloat(item.price) + parseFloat(item.GST));
                  const isPremium = item.serviceType.includes("PREMIUM") || item.serviceCode === "DMG";

                  return (
                    <Card 
                      key={idx} 
                      className={cn(
                        "relative p-6 border-2 transition-all cursor-pointer group hover:shadow-2xl overflow-hidden rounded-[2rem]",
                        isPremium 
                          ? "border-blue-600 bg-white" 
                          : "border-slate-100 bg-white hover:border-blue-200"
                      )}
                    >
                      {/* Radio Indicator (Top Left) */}
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                            isPremium ? "border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]" : "border-slate-300"
                          )}>
                            <div className={cn(
                              "w-3 h-3 rounded-full",
                              isPremium ? "bg-blue-600" : "bg-transparent"
                            )} />
                          </div>
                          <span className="font-black text-lg tracking-tight text-slate-900 uppercase">
                            {item.serviceType === "PREMIUM" ? "Express Premium" : "Express Standard-Lite"}
                          </span>
                        </div>
                        {isPremium && (
                          <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-blue-200">
                            Recommended
                          </span>
                        )}
                      </div>

                      {/* Footer: TAT and Price */}
                      <div className="flex items-end justify-between border-t border-slate-50 pt-4">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                          <p className="text-xl font-black text-slate-800">{item.period.replace('/s', 's')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Cost</p>
                          <p className="text-3xl font-black text-blue-600">₹{totalAmount}</p>
                        </div>
                      </div>

                      {/* Subtle background decoration */}
                      <div className="absolute -right-4 -top-4 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
                        <Truck size={120} />
                      </div>
                    </Card>
                  );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="h-full min-h-[500px] border-4 border-dotted border-slate-200 rounded-[3.5rem] flex flex-col items-center justify-center text-center p-12 bg-white/40">
              <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-blue-500 mb-8 animate-bounce">
                <Calculator size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tighter">Ready for Estimate</h3>
              <p className="text-slate-400 max-w-xs mt-3 font-medium leading-relaxed">
                Enter pincodes and commodity details to generate your DTDC shipping quote.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}