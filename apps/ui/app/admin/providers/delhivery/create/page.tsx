'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Package, 
  User, 
  MapPin,
  Truck, 
  Info, 
  Download,
  Loader2,
  AlertCircle,
  ArrowRight,
  Hash,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import clsx from 'clsx';
import { api } from '@/lib/api/axios';

const DEFAULT_PICKUP_PIN = "452010";
const generateOrderId = () => `VI-${Date.now()}`;

export default function CreateDelhiveryShipmentPage() {
  const [form, setForm] = useState({
    order_id: generateOrderId(),
    channel: "VARIABLEINSTINCT C2C",
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    customer_address: "",
    customer_pincode: "",
    length_cm: "",
    breadth_cm: "",
    height_cm: "",
    weight_kg: "",
    service_type: "surface",
    payment_mode: "prepaid",
    cod_amount: 0,
  });

  const [errors, setErrors] = useState<any>({});
  const [estimate, setEstimate] = useState<any>(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [pinInfo, setPinInfo] = useState<any>(null);
  const [pinLoading, setPinLoading] = useState(false);
  const [tatInfo, setTatInfo] = useState<number | null>(null);
  const [computations, setComputations] = useState({ volumetric_kg: 0, chargeable_kg: 0 });

  function update(k: string, v: any) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e: any) => ({ ...e, [k]: null }));
  }

  // --- LOGIC: Volumetric Calculation ---
  useEffect(() => {
    const l = Number(form.length_cm || 0);
    const b = Number(form.breadth_cm || 0);
    const h = Number(form.height_cm || 0);
    const actual = Number(form.weight_kg || 0);
    const volumetric_kg = +((l * b * h) / 5000).toFixed(3);
    const chargeable_kg = Math.max(actual, volumetric_kg);
    setComputations({ volumetric_kg, chargeable_kg });
  }, [form.length_cm, form.breadth_cm, form.height_cm, form.weight_kg]);

  // --- API: Fetch Pin & TAT ---
  const fetchPinAndTat = useCallback(async (pin: string) => {
    if (!/^\d{6}$/.test(pin)) return;
    setPinLoading(true);
    try {
      const p = await api.get(`/providers/delhivery/pincode?pin=${pin}`).then(r => r.data);
      setPinInfo(p?.delivery_codes?.[0]?.postal_code ?? p ?? null);
      const t = await api.get('/providers/delhivery/tat', {
        params: {
          origin_pin: DEFAULT_PICKUP_PIN,
          destination_pin: pin,
          mot: 'S',
        },
      }).then(r => r.data);
      setTatInfo(t?.data?.tat ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setPinLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchPinAndTat(form.customer_pincode), 500);
    return () => clearTimeout(timeout);
  }, [form.customer_pincode, fetchPinAndTat]);

  const submit = async () => {
    setSubmitting(true);
    // ... validation logic
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Package className="text-orange-600" size={36} />
              Create Shipment
            </h1>
            <p className="text-slate-500 font-medium mt-1">Delhivery Direct Express Integration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT: FORM --- */}
          <div className="lg:col-span-8 space-y-6">

            {/* 0. Order Information (The Missing Columns) */}
            <Card className="p-8 border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white space-y-6">
              <SectionHeader icon={<Hash size={18} />} title="Order Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 ml-1">Channel</Label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input 
                      value={form.channel} 
                      disabled 
                      className="h-12 pl-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-slate-900"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 ml-1">Order ID</Label>
                  <Input 
                    value={form.order_id} 
                    onChange={v => update('order_id', v.target.value)} 
                    disabled
                    className="h-12 rounded-xl border-slate-100 bg-slate-50/50 font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
            </Card>
            
            {/* 1. Customer Card */}
            <Card className="p-8 border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white space-y-6">
              <SectionHeader icon={<User size={18} />} title="Customer Details" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fixed: Added :string type to v */}
                <FloatingInput label="Full Name" value={form.customer_name} onChange={(v: string) => update('customer_name', v)} />
                <FloatingInput label="Phone Number" value={form.customer_phone} onChange={(v: string) => update('customer_phone', v)} />
              </div>
              <FloatingInput label="Full Delivery Address" value={form.customer_address} onChange={(v: string) => update('customer_address', v)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingInput label="Pincode" value={form.customer_pincode} onChange={(v: string) => update('customer_pincode', v)} />
                <FloatingInput label="Email (Optional)" value={form.customer_email} onChange={(v: string) => update('customer_email', v)} />
              </div>
            </Card>

            {/* 2. Package Card */}
            <Card className="p-8 border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white space-y-6">
              <SectionHeader icon={<Package size={18} />} title="Package Dimensions" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FloatingInput label="Length (cm)" value={form.length_cm} onChange={(v: any) => update('length_cm', v)} />
                <FloatingInput label="Breadth (cm)" value={form.breadth_cm} onChange={(v: any) => update('breadth_cm', v)} />
                <FloatingInput label="Height (cm)" value={form.height_cm} onChange={(v: any) => update('height_cm', v)} />
                <FloatingInput label="Weight (kg)" value={form.weight_kg} onChange={(v: any) => update('weight_kg', v)} />
              </div>

              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-lg text-white"><Info size={16} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Calculated Billing Weight</p>
                    <p className="text-xl font-black text-indigo-900">{computations.chargeable_kg} kg</p>
                  </div>
                </div>
                <div className="text-right text-xs text-indigo-400 font-medium">
                  Volumetric: {computations.volumetric_kg}kg<br/>Actual: {form.weight_kg || 0}kg
                </div>
              </div>
            </Card>

            {/* 3. Shipping Options */}
            <Card className="p-8 border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white space-y-6">
              <SectionHeader icon={<Truck size={18} />} title="Service & Payment" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase text-slate-400">Shipping Mode</Label>
                  <div className="flex gap-2">
                    {['surface', 'express'].map(mode => (
                      <button 
                        key={mode}
                        onClick={() => update('service_type', mode)}
                        className={clsx(
                          "flex-1 py-3 rounded-xl font-bold text-sm capitalize transition-all border",
                          form.service_type === mode ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200" : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                        )}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase text-slate-400">Payment Mode</Label>
                  <Select value={form.payment_mode} onValueChange={v => update('payment_mode', v)}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-100 font-bold bg-slate-50/50">
                      <SelectValue placeholder="Select Payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prepaid">Prepaid</SelectItem>
                      <SelectItem value="cod">Cash on Delivery (COD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Button 
              onClick={submit} 
              disabled={submitting}
              className="w-full bg-slate-900 hover:bg-black text-white rounded-2xl h-16 font-black text-lg shadow-2xl shadow-slate-300 transition-all"
            >
              {submitting ? <Loader2 className="animate-spin mr-2" /> : <ArrowRight className="mr-2" />}
              Create Order & Generate AWB
            </Button>
          </div>

          {/* --- RIGHT: INSIGHTS STICKY --- */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 border-none shadow-2xl shadow-slate-200 rounded-[2rem] bg-white sticky top-10 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><MapPin size={120} /></div>
              
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <Info size={18} className="text-indigo-600" />
                Live Insights
              </h3>

              <div className="space-y-6 relative z-10">
                <InsightRow label="Destination" loading={pinLoading}>
                  {pinInfo ? (
                    <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                      <p className="text-sm font-bold text-slate-700">{pinInfo.city}, {pinInfo.state}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={pinInfo.cod === 'Y' ? 'default' : 'destructive'} className="rounded-md text-[10px]">COD: {pinInfo.cod === 'Y' ? 'Yes' : 'No'}</Badge>
                        <Badge variant="outline" className="rounded-md text-[10px] bg-white italic">ODA: {pinInfo.is_oda === 'Y' ? 'Yes' : 'No'}</Badge>
                      </div>
                    </div>
                  ) : <p className="text-xs text-slate-400">Enter a valid pincode...</p>}
                </InsightRow>

                <InsightRow label="Expected Delivery">
                  <p className="text-2xl font-black text-slate-900">{tatInfo ? `${tatInfo} Days` : '--'}</p>
                </InsightRow>

                <InsightRow label="Freight Estimate">
                  {estimate ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span>Total Payable</span>
                        <span className="text-indigo-600">₹{estimate[0]?.total_amount}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 space-y-1">
                        <div className="flex justify-between"><span>Base Freight</span><span>₹{estimate[0]?.change_f}</span></div>
                        <div className="flex justify-between"><span>Fuel Surcharge</span><span>₹{estimate[0]?.change_fsc}</span></div>
                      </div>
                    </div>
                  ) : <p className="text-xs text-slate-400 italic">Complete dimensions to estimate</p>}
                </InsightRow>

                {result?.success && (
                  <div className="pt-6 border-t border-dashed border-slate-200 space-y-3">
                    <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl flex items-center gap-3">
                      <AlertCircle size={20} />
                      <div className="text-xs font-bold leading-tight">AWB Generated Successfully!<br/>{result.awb}</div>
                    </div>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2 h-12">
                      <Download size={16} /> Download Label
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function SectionHeader({ icon, title }: { icon: any, title: string }) {
  return (
    <div className="flex items-center gap-3 pb-2 border-b border-slate-50">
      <div className="p-2 bg-slate-100 rounded-xl text-slate-600">{icon}</div>
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">{title}</h2>
    </div>
  );
}

function FloatingInput({ label, value, onChange, error }: any) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-bold text-slate-500 ml-1">{label}</Label>
      <Input 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className={clsx(
          "h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium",
          error && "border-red-500 bg-red-50"
        )}
      />
    </div>
  );
}

function InsightRow({ label, children, loading }: any) {
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</Label>
      {loading ? <Loader2 className="animate-spin text-slate-300" size={20} /> : children}
    </div>
  );
}