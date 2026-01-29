'use client';

import React, { useState, useMemo } from 'react';
import { 
  MapPin, Route, CheckCircle2, Info, 
  Truck, Zap, Landmark, Phone, Mail,
  ArrowRight, Globe, ShieldCheck, AlertCircle, Loader2, Search
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { clsx } from 'clsx';
import { api } from '@/lib/api/axios';

// --- TYPES & INTERFACES ---

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

// --- SUB-COMPONENTS ---

const CapabilityBadge = ({ label, active, invert = false }: { label: string, active: boolean, invert?: boolean }) => {
  const isAvailable = invert ? !active : active;
  return (
    <div className={clsx(
      "px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 border transition-all",
      isAvailable ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100 grayscale"
    )}>
      {isAvailable ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
      {label}
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function DTDCServiceability() {
  // 1. Input States
  const [origin, setOrigin] = useState("452010");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DtdcServiceabilityResponse | null>(null);

  // 2. Action Handler
  const handleCheck = async () => {
    if (!origin || !destination) return;
    setLoading(true);
    try {
      // Replace this with your actual API hook call
      const payload = {
        origin_pincode: origin,
        destination_pincode: destination
      };
      
      // Using the hook pattern
      const res = await api.post('/providers/dtdc/serviceability', payload).then(r => r.data);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 3. Data Transformation Logic
  const processedServices = useMemo(() => {
    if (!data?.SERV_LIST_DTLS) return [];
    const uniqueMap = new Map();
    data.SERV_LIST_DTLS.forEach((item) => {
      const existing = uniqueMap.get(item.NAME);
      if (!existing || parseInt(item.TAT) < parseInt(existing.TAT)) {
        uniqueMap.set(item.NAME, item);
      }
    });
    return Array.from(uniqueMap.values()).sort((a, b) => parseInt(a.TAT) - parseInt(b.TAT));
  }, [data]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 min-h-screen bg-slate-50/50">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT: SEARCH PANEL (Always Visible) --- */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Source Pincode</Label>
                <Input 
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold focus:bg-white transition-all"
                  placeholder="e.g. 110001"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Destination Pincode</Label>
                <Input 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold focus:bg-white transition-all"
                  placeholder="Enter Pincode..."
                />
              </div>

              <Button 
                onClick={handleCheck} 
                disabled={loading || !destination}
                className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-xl transition-all active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Search size={20} className="mr-2" />}
                Check Serviceability
              </Button>
            </div>
          </Card>

          <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
             <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase mb-2">
               <Info size={14} /> Franchisee Note
             </div>
             <p className="text-[11px] opacity-70 leading-relaxed">
               This tool provides real-time data from the DTDC Master Database including ODA surcharges and Service Branch contacts.
             </p>
          </div>
        </div>

        {/* --- RIGHT: RESULTS PANEL --- */}
        <div className="lg:col-span-8">
          {data ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              
              {/* Route Summary */}
              <Card className="p-8 border-none shadow-xl rounded-[3rem] bg-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center md:items-start">
                  <div className="flex items-center gap-4 text-4xl font-black text-slate-900">
                    <span>{data.ZIPCODE_RESP[0]?.ORGPIN}</span>
                    <ArrowRight className="text-blue-500" size={24} />
                    <span>{data.ZIPCODE_RESP[0]?.DESTPIN}</span>
                  </div>
                  <p className="mt-2 text-slate-500 font-bold uppercase tracking-tight">
                    {data.ZIPCODE_RESP[0]?.DESTCITY}, {data.PIN_CITY[1]?.STATE_NAME || ""}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <CapabilityBadge label="COD" active={data.SERV_LIST[0]?.COD_Serviceable === "YES"} />
                    <CapabilityBadge label="B2B" active={data.SERV_LIST[0]?.b2B_SERVICEABLE === "YES"} />
                    <CapabilityBadge label="LITE" active={data.SERV_LIST[0]?.LITE_Serviceable === "YES"} />
                  </div>
                </div>

                <div className="md:ml-auto md:border-l md:pl-8 border-slate-100 space-y-2">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center md:text-left">Master Branch</p>
                   <h3 className="font-black text-slate-800 text-lg leading-tight">{data.SERV_BR[0]?.BR_NAME}</h3>
                   <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                     <Phone size={14} /> {data.SERV_BR[0]?.PHONE}
                   </div>
                </div>
              </Card>

              {/* Service List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {processedServices.map((service: any) => (
                  <Card key={`${service.NAME}-${service.CODE}`} className="p-5 border-none shadow-md rounded-[2rem] bg-white hover:border-blue-500 border border-transparent transition-all">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-black text-slate-800 text-sm uppercase">{service.NAME.replace(/_/g, ' ')}</h4>
                        <p className="text-[10px] font-bold text-slate-400">PCODE: {service.PCODE}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-blue-600">{service.TAT}</span>
                        <span className="text-[10px] font-black text-slate-400 block uppercase">Days</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

            </div>
          ) : (
            /* Empty State (Shown before user searches) */
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 bg-white/50">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-200 mb-6">
                <Truck size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-300 uppercase">Ready for Lookup</h3>
              <p className="text-sm text-slate-400 max-w-xs mt-2">
                Enter a destination pincode to fetch branch contacts and delivery timelines.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}