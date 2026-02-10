'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  Package, User, MapPin, Download, Loader2, AlertCircle, Hash, 
  Terminal, Database, Activity, ShieldCheck, Timer, Navigation, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import clsx from 'clsx';
import { api } from '@/lib/api/axios';
import { ActionResult, FloatingInputProps, PincodeInfo } from '@/app/admin/interface/adminInterface';

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
    weight_gm: "",
    product_name: "",
    declared_value: "",
    payment_mode: "Prepaid",
    shipping_mode: "Surface",
    pickup_pincode: DEFAULT_PICKUP_PIN
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pinInfo, setPinInfo] = useState<PincodeInfo | null>(null);
  const [tatInfo, setTatInfo] = useState<string | null>(null);
  const [pinLoading, setPinLoading] = useState(false);

  // ───────────────── LOGIC: PINCODE & TAT (RESTORED) ─────────────────
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
          mot: form.shipping_mode === 'Surface' ? 'S' : 'E',
        },
      }).then(r => r.data);
      setTatInfo(t?.data?.tat ?? null);
    } catch (err) {
      console.error("Telemetry Sync Failed:", err);
    } finally {
      setPinLoading(false);
    }
  }, [form.shipping_mode]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchPinAndTat(form.customer_pincode), 500);
    return () => clearTimeout(timeout);
  }, [form.customer_pincode, fetchPinAndTat]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        shipments: [{
            add: form.customer_address,
            phone: form.customer_phone,
            payment_mode: form.payment_mode,
            name: form.customer_name,
            pin: form.customer_pincode,
            order: form.order_id,
            total_amount: Number(form.declared_value),
            products_desc: form.product_name,
            cod_amount: form.payment_mode === "COD" ? Number(form.declared_value) : 0,
            order_date: new Date().toISOString(),
            shipping_mode: form.shipping_mode,
            weight: Number(form.weight_gm),
            length: Number(form.length_cm),
            breadth: Number(form.breadth_cm),
            height: Number(form.height_cm),
            seller_name: "VARIABLEINSTINCT",
            seller_add: "Indore Center",
        }],
        pickup_location: {
          name: "VARIABLEINSTINCT_PICKUP",
          pin: form.pickup_pincode,
        }
      };

      const { data } = await api.post('/delhivery/create-shipment', payload);
      if (data.success === false) throw new Error(data.error || "Creation Failed");
      setResult(data);
      setForm(prev => ({ ...prev, order_id: generateOrderId() }));
    } catch (err) {
      setError(`Failed to create shipment ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, val: string) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 bg-[#0F172A] flex items-center justify-center text-white rounded-2xl shadow-xl shadow-indigo-100">
            <Database size={28} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Initialize Shipment</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
              <Terminal size={12} className="text-indigo-500" /> Delhivery_Kernel_Push
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* FORM SIDE */}
        <div className="xl:col-span-8 space-y-8">
          
          <SectionModule icon={<User size={18}/>} title="01 Consignee Identity">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FloatingInput label="Full Name" value={form.customer_name} onChange={(v: string) => updateField('customer_name', v)} />
              <FloatingInput label="Contact Phone" value={form.customer_phone} onChange={(v: string) => updateField('customer_phone', v)} />
              <div className="md:col-span-2">
                <FloatingInput label="Email Address" value={form.customer_email} onChange={(v: string) => updateField('customer_email', v)} />
              </div>
              <div className="md:col-span-2">
                <FloatingInput label="Delivery Address String" value={form.customer_address} onChange={(v: string) => updateField('customer_address', v)} />
              </div>
              <div className="relative">
                <FloatingInput label="Destination Pincode" value={form.customer_pincode} onChange={(v: string) => updateField('customer_pincode', v)} />
                {pinLoading && <Loader2 className="absolute right-4 top-10 animate-spin text-indigo-500" size={16} />}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Protocol</Label>
                <Select value={form.payment_mode} onValueChange={(v) => updateField('payment_mode', v)}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-xs uppercase shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="Prepaid" className="text-xs font-bold uppercase">Prepaid V1</SelectItem>
                    <SelectItem value="COD" className="text-xs font-bold uppercase">Cash On Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SectionModule>

          <SectionModule icon={<Package size={18}/>} title="02 Package Telemetry">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FloatingInput label="Product Description" value={form.product_name} onChange={(v: string) => updateField('product_name', v)} />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Courier Type</Label>
                <div className="flex gap-3">
                  {['Surface', 'Express'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => updateField('shipping_mode', mode)}
                      className={clsx(
                        "flex-1 py-3 text-[11px] font-black uppercase tracking-widest border transition-all rounded-xl",
                        form.shipping_mode === mode 
                          ? "bg-[#0F172A] text-white border-slate-900 shadow-lg shadow-slate-200" 
                          : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <FloatingInput label="Declared Value (INR)" value={form.declared_value} onChange={(v: string) => updateField('declared_value', v)} />
              <FloatingInput label="Dead Weight (GM)" value={form.weight_gm} onChange={(v: string) => updateField('weight_gm', v)} />
              
              <div className="md:col-span-2 grid grid-cols-3 gap-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                 <FloatingInput label="Len (CM)" value={form.length_cm} onChange={(v: string) => updateField('length_cm', v)} />
                 <FloatingInput label="Wid (CM)" value={form.breadth_cm} onChange={(v: string) => updateField('breadth_cm', v)} />
                 <FloatingInput label="Hei (CM)" value={form.height_cm} onChange={(v: string) => updateField('height_cm', v)} />
              </div>
            </div>
          </SectionModule>

          {/* SUBMIT BUTTON SECTION */}
          <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-[#0F172A] rounded-2xl shadow-2xl shadow-slate-300">
            <div className="hidden md:block">
              <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.25em]">Ready For Deployment</p>
              <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase">Validating schema via core engine...</p>
            </div>
            <Button 
              onClick={handleSubmit} 
              disabled={loading} 
              className="w-full md:w-auto px-10 py-7 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-indigo-900/20"
            >
              {loading ? <Loader2 className="animate-spin mr-3" /> : <ShieldCheck className="mr-3" size={20} />}
              Initialize Manifest
            </Button>
          </div>
        </div>

        {/* SIDEBAR: CONTEXT & TELEMETRY */}
        <div className="xl:col-span-4 space-y-8">
          
          <SectionModule icon={<Navigation size={18}/>} title="System Context">
            <div className="space-y-4">
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Active Order ID</Label>
                <p className="text-sm font-mono font-black text-slate-900 tracking-tight">{form.order_id}</p>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Pickup Node Logic</Label>
                <Input 
                  value={form.pickup_pincode} 
                  onChange={(e) => updateField('pickup_pincode', e.target.value)} 
                  className="h-11 font-mono text-xs font-black border-slate-100 bg-white rounded-lg focus-visible:ring-indigo-500" 
                />
              </div>
            </div>
          </SectionModule>

          {/* TELEMETRY MATRIX */}
          <div className="bg-[#0F172A] p-7 rounded-2xl shadow-xl space-y-8">
             <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                    <Globe size={16} className="text-indigo-500" /> Route Telemetry
                </h3>
                {pinLoading && <Activity size={14} className="text-indigo-500 animate-pulse" />}
             </div>

             <div className="space-y-6">
                <TelemetryRow 
                    label="Destination Node" 
                    value={pinInfo ? `${pinInfo.city}, ${pinInfo.inc}` : 'Waiting For Input...'} 
                    sub={pinInfo ? `District: ${pinInfo.district}` : 'Pincode required'}
                    icon={<MapPin size={16} />}
                />
                <TelemetryRow 
                    label="Estimated TAT" 
                    value={tatInfo ? `${tatInfo} Days` : 'N/A'} 
                    sub={`Transport Mode: ${form.shipping_mode}`}
                    icon={<Timer size={16} />}
                    highlight={!!tatInfo}
                />
                <TelemetryRow 
                    label="Serviceability" 
                    value={pinInfo ? 'ACTIVE' : 'OFFLINE'} 
                    sub={pinInfo ? 'Pre-paid & COD Enabled' : 'Validation pending'}
                    icon={<Activity size={16} />}
                    color={pinInfo ? 'text-emerald-400' : 'text-slate-600'}
                />
             </div>
          </div>

          {error && (
            <div className="p-6 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl shadow-sm animate-in zoom-in-95">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Protocol Error</span>
              </div>
              <p className="text-xs font-bold leading-relaxed">{error}</p>
            </div>
          )}

          {result && (
            <div className="p-8 bg-emerald-950 border border-emerald-800 text-white rounded-2xl shadow-2xl shadow-emerald-200/50 animate-in slide-in-from-top-4">
               <div className="flex items-center gap-4 mb-8">
                  <div className="h-12 w-12 bg-emerald-500 rounded-xl flex items-center justify-center text-emerald-950 shadow-lg shadow-emerald-500/20">
                    <Hash size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Shipment Deployed</p>
                    <h4 className="text-2xl font-mono font-black tracking-tighter">{result.awb}</h4>
                  </div>
               </div>
               <div className="space-y-3 mb-8">
                  <ResultRow label="Network" value={result.upload_wbn} />
                  <ResultRow label="Dest Node" value={result.destination_node} />
                  <ResultRow label="Route Map" value={result.route} />
               </div>
               <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-[11px] uppercase tracking-[0.15em] h-12 rounded-xl transition-all">
                 <Download size={18} className="mr-2" /> Export Waybill PDF
               </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────── MODERN COMPONENTS ───────────────── */

function TelemetryRow({ label, value, sub, icon, highlight, color }: 
    { label: string, value: string | number, sub: string | number, icon: React.ReactNode, highlight?: boolean, color?: string }) {
    return (
        <div className="flex gap-5 group">
            <div className={clsx(
                "h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 transition-all",
                highlight ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]" : "border-slate-800 bg-slate-800/50 text-slate-500"
            )}>
                {icon}
            </div>
            <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
                <p className={clsx("text-sm font-mono font-black uppercase tracking-tight", color || "text-white")}>{value}</p>
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tight">{sub}</p>
            </div>
        </div>
    );
}

function SectionModule({ icon, title, children }: { icon: ReactNode, title: string, children: ReactNode }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transition-all hover:border-indigo-100">
      <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
        <div className="p-2.5 bg-white border border-slate-100 text-indigo-500 rounded-xl shadow-sm">{icon}</div>
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">{title}</h2>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
}

function FloatingInput<T extends string | number>({ 
  label, 
  value, 
  onChange, 
  type = "text" 
}: FloatingInputProps<T>) {
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</Label>
      <Input 
        value={value} 
        onChange={(e) => {
          const val = e.target.value;
          // If the type is number, convert the string value back to a Number
          const finalValue = type === "number" ? (Number(val) as T) : (val as T);
          onChange(finalValue);
        }}
        className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus-visible:bg-white focus-visible:ring-indigo-500 font-bold text-xs text-slate-900 uppercase tracking-tight transition-all" 
      />
    </div>
  );
}

function ResultRow({ label, value }: { label: string, value: string | number | null | undefined }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-emerald-900/30 last:border-0">
      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">{label}</span>
      <span className="text-xs font-mono font-bold text-emerald-50 tracking-tight">{value || 'N/A'}</span>
    </div>
  );
}