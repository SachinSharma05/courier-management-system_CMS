"use client";

import { useState } from "react";
import { 
  Search, 
  MapPin, 
  Clock, 
  Building2, 
  XCircle, 
  Loader2, 
  Navigation,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { api } from "@/lib/api/axios";

const DEFAULT_PICKUP_PIN = "452010";

export default function DelhiveryServiceability() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const [tatOrigin, setTatOrigin] = useState("");
  const [tatDest, setTatDest] = useState("");
  const [tatResult, setTatResult] = useState<number | null>(null);
  const [tatLoading, setTatLoading] = useState(false);

  async function check() {
    if (!pin) return;
    setLoading(true);
    setData(null);
    try {
      const r = await api.get(`/providers/delhivery/pincode?pin=${pin}`).then(r => r.data);
      setData(r);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function checkTat() {
    if (!tatOrigin || !tatDest) return;
    setTatLoading(true);
    try {
      const r = await api.get('/providers/delhivery/tat', {
        params: {
          origin_pin: DEFAULT_PICKUP_PIN,
          destination_pin: pin,
          mot: 'S',
        },
      }).then(r => r.data);
      if (r.success) setTatResult(r.data?.tat ?? null);
      else setTatResult(null);
    } catch (e) {
      console.error(e);
    } finally {
      setTatLoading(false);
    }
  }

  const postal = data?.delivery_codes?.[0]?.postal_code;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Navigation className="text-indigo-600" size={32} />
            Serviceability Hub
          </h1>
          <p className="text-slate-500 font-medium mt-1">Check pincode reach, COD availability, and TAT</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT: SEARCH CONTROLS --- */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Pincode Lookup */}
          <Card className="p-6 border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pincode Lookup</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 6-digit Pincode"
                  className="pl-12 h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white font-bold transition-all"
                />
              </div>
              <Button 
                onClick={check} 
                disabled={loading}
                className="h-12 px-6 rounded-xl bg-slate-900 font-bold shadow-lg shadow-slate-200"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Check"}
              </Button>
            </div>
          </Card>

          {/* TAT Estimator */}
          <Card className="p-6 border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">TAT Estimation (ETA)</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input 
                placeholder="Origin" 
                value={tatOrigin}
                onChange={(e) => setTatOrigin(e.target.value)}
                className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold"
              />
              <Input 
                placeholder="Destination" 
                value={tatDest}
                onChange={(e) => setTatDest(e.target.value)}
                className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold"
              />
            </div>
            <Button 
              onClick={checkTat} 
              disabled={tatLoading}
              variant="outline"
              className="w-full h-12 rounded-xl border-slate-200 font-bold gap-2 text-indigo-600 hover:bg-indigo-50"
            >
              {tatLoading ? <Loader2 className="animate-spin" size={18} /> : <><Clock size={18} /> Check Delivery Time</>}
            </Button>

            {tatResult !== null && (
              <div className="mt-2 p-4 bg-indigo-900 rounded-2xl text-white flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Estimated Delivery</p>
                  <p className="text-xl font-black">{tatResult === 0 ? "Same Day" : `${tatResult} Days`}</p>
                </div>
                <Calendar className="opacity-20" size={32} />
              </div>
            )}
          </Card>
        </div>

        {/* --- RIGHT: RESULTS VIEW --- */}
        <div className="lg:col-span-7">
          {postal ? (
            <div className="space-y-6">
              {/* Location Header Card */}
              <Card className="p-8 border-none shadow-2xl shadow-slate-200 rounded-[2.5rem] bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Building2 size={120} /></div>
                <div className="relative z-10">
                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 mb-2 uppercase tracking-tight">Active Reach</Badge>
                  <h2 className="text-3xl font-black text-slate-900">{postal.city}</h2>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">
                    {postal.district}, {postal.state_code} • {pin}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <StatusItem label="COD" active={postal.cod === "Y"} />
                    <StatusItem label="Prepaid" active={postal.pre_paid === "Y"} />
                    <StatusItem label="Pickup" active={postal.pickup === "Y"} />
                    <StatusItem label="ODA" active={postal.is_oda === "Y"} negative />
                  </div>
                </div>
              </Card>

              {/* Hubs / Centers List */}
              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Building2 size={14} /> Associated Centers
                  </h3>
                  <Badge variant="outline" className="bg-white rounded-lg">{postal.center?.length || 0} Hubs</Badge>
                </div>
                <div className="max-h-[300px] overflow-auto divide-y divide-slate-50">
                  {postal.center?.map((c: any, idx: number) => (
                    <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                      <div>
                        <p className="font-black text-slate-900">{c.cn}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sort Code: {c.sort_code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-indigo-600 uppercase">Last Sync</p>
                        <p className="text-xs font-medium text-slate-400">{c.ud?.split("T")[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 space-y-4">
              {data && !postal ? (
                <>
                  <XCircle className="text-rose-200" size={64} />
                  <div>
                    <p className="text-lg font-black text-rose-500">Unserviceable Area</p>
                    <p className="text-sm text-slate-400 font-medium">Delhivery does not currently operate in pincode {pin}.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                    <Search size={32} />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-400">Pincode Intelligence</p>
                    <p className="text-sm text-slate-400 font-medium">Search a pincode to see network details and hubs.</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* --- SUB-COMPONENTS --- */

function StatusItem({ label, active, negative = false }: { label: string, active: boolean, negative?: boolean }) {
  // ODA (Out of Delivery Area) is "bad" if active, so we flip the colors for it
  const isGood = negative ? !active : active;
  
  return (
    <div className={clsx(
      "p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all",
      isGood ? "bg-emerald-50/50 border-emerald-100" : "bg-rose-50/50 border-rose-100"
    )}>
      {isGood ? (
        <CheckCircle2 size={16} className="text-emerald-600" />
      ) : (
        <XCircle size={16} className="text-rose-600" />
      )}
      <p className={clsx(
        "text-[10px] font-black uppercase tracking-widest",
        isGood ? "text-emerald-700" : "text-rose-700"
      )}>{label}</p>
    </div>
  );
}