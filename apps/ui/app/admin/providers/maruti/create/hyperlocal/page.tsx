"use client";

import React, { Activity, useState } from 'react';
import { 
  Zap, MapPin, Navigation, ShoppingBag, 
  Trash2, Plus, Clock, Store,
  ChevronDown,
  Navigation2,
  Globe,
  Hash
} from 'lucide-react';
import { useMaruti } from '@/hooks/useMaruti';
import clsx from 'clsx';

// export default function MarutiHyperlocalBooking() {
//   const { createHyperlocalOrder } = useMaruti();
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState<any>({
//     orderId: `HYP-${Date.now().toString().slice(-6)}`,
//     orderNumber: "",
//     orderSubtype: "FORWARD",
//     orderCreatedAt: new Date().toISOString(),
//     currency: "INR",
//     amount: 0,
//     weight: 0,
//     lineItems: [{ name: '', price: 0, weight: 0, quantity: 1, sku: '', unitPrice: 0 }],
//     paymentType: "COD",
//     paymentStatus: "PENDING",
//     remarks: "",
//     shippingAddress: { name: '', email: '', phone: '', address1: '', city: '', state: '', zip: '', country: 'India', latitude: 0, longitude: 0 },
//     pickupAddress: { name: '', email: '', phone: '', address1: '', city: '', state: '', zip: '', country: 'India', latitude: 0, longitude: 0 },
//     deliveryPromise: "90_MIN_DELIVERY",
//     returnableOrder: true,
//     channelCode: "",
//     length: 10, height: 10, width: 10
//   });

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       await createHyperlocalOrder(form);
//       alert("Hyperlocal Node Initialized Successfully");
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto space-y-6 pb-20">
//       {/* HEADER: HYPERLOCAL BRANDING */}
//       <div className="flex items-center justify-between border-b-2 border-amber-500/20 pb-4">
//         <div className="flex items-center gap-3">
//           <div className="bg-amber-500 p-2 rounded-sm text-white animate-pulse">
//             <Zap size={20} fill="currentColor" />
//           </div>
//           <div>
//             <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Hyperlocal_Rapid_Booking</h1>
//             <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-1 italic">Service_Promise: {form.deliveryPromise}</p>
//           </div>
//         </div>
//         <button 
//           onClick={handleSubmit}
//           className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-2xl transition-all"
//         >
//           {loading ? 'SYNCING...' : 'INITIALIZE_INSTANT_DELIVERY'}
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
//         {/* LEFT: ORDER SETTINGS (COL-4) */}
//         <div className="lg:col-span-4 space-y-6">
//           <FormSection title="Store_Context" icon={<Store size={14}/>}>
//             <div className="p-4 space-y-4">
//               <Input label="External_Order_No" value={form.orderNumber} onChange={(v: string) => setForm({...form, orderNumber: v})} />
//               <Input label="Store_Channel_Code" value={form.channelCode} onChange={(v: string) => setForm({...form, channelCode: v})} />
//               <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200">
//                  <label className="text-[10px] font-black text-slate-500 uppercase">Returnable_Order</label>
//                  <input 
//                     type="checkbox" 
//                     checked={form.returnableOrder} 
//                     onChange={(e) => setForm({...form, returnableOrder: e.target.checked})}
//                     className="accent-amber-500 h-4 w-4"
//                  />
//               </div>
//             </div>
//           </FormSection>

//           <FormSection title="SLA_Configuration" icon={<Clock size={14}/>}>
//              <div className="p-4 space-y-4">
//                <Select 
//                  label="Delivery_Promise" 
//                  options={['90_MIN_DELIVERY', 'SAME_DAY', '2_HOUR_EXPRESS']} 
//                  value={form.deliveryPromise} 
//                  onChange={(v: string) => setForm({...form, deliveryPromise: v})} 
//                />
//                <Input label="Instruction_Remarks" value={form.remarks} onChange={(v: string) => setForm({...form, remarks: v})} />
//              </div>
//           </FormSection>
//         </div>

//         {/* CENTER: ADDRESS & GEO (COL-8) */}
//         <div className="lg:col-span-8 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* PICKUP */}
//             <FormSection title="Pickup_Hub (Geospatial)" icon={<Navigation size={14}/>}>
//               <div className="p-4 space-y-3">
//                 <Input label="Hub_Name" value={form.pickupAddress.name} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, name: v}})} />
//                 <div className="grid grid-cols-2 gap-2">
//                   <Input label="Lat" value={form.pickupAddress.latitude} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, latitude: v}})} />
//                   <Input label="Long" value={form.pickupAddress.longitude} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, longitude: v}})} />
//                 </div>
//                 <textarea 
//                    placeholder="WAREHOUSE_STREET_LEVEL_ADDRESS"
//                    className="w-full text-[11px] font-bold p-2 bg-slate-50 border border-slate-200 outline-none focus:border-amber-500 min-h-[60px]"
//                    onChange={(e) => setForm({...form, pickupAddress: {...form.pickupAddress, address1: e.target.value}})}
//                 />
//               </div>
//             </FormSection>

//             {/* DELIVERY */}
//             <FormSection title="Customer_Drop (Geospatial)" icon={<MapPin size={14}/>}>
//               <div className="p-4 space-y-3">
//                 <Input label="Customer_Name" value={form.shippingAddress.name} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, name: v}})} />
//                 <div className="grid grid-cols-2 gap-2">
//                   <Input label="Lat" value={form.shippingAddress.latitude} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, latitude: v}})} />
//                   <Input label="Long" value={form.shippingAddress.longitude} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, longitude: v}})} />
//                 </div>
//                 <textarea 
//                    placeholder="DESTINATION_STREET_LEVEL_ADDRESS"
//                    className="w-full text-[11px] font-bold p-2 bg-slate-50 border border-slate-200 outline-none focus:border-amber-500 min-h-[60px]"
//                    onChange={(e) => setForm({...form, shippingAddress: {...form.shippingAddress, address1: e.target.value}})}
//                 />
//               </div>
//             </FormSection>
//           </div>

//           {/* LINE ITEMS */}
//           <FormSection title="Consignment_Contents" icon={<ShoppingBag size={14}/>}>
//              <div className="p-4 space-y-3">
//                 {form.lineItems.map((item: any, idx: number) => (
//                    <div key={idx} className="grid grid-cols-6 gap-2 items-center bg-slate-50 p-2 border border-slate-100">
//                       <div className="col-span-2"><Input label="Item_Name" value={item.name} onChange={(v: string) => {
//                         const itm = [...form.lineItems]; itm[idx].name = v; setForm({...form, lineItems: itm});
//                       }} /></div>
//                       <Input label="SKU" value={item.sku} onChange={(v: string) => {
//                         const itm = [...form.lineItems]; itm[idx].sku = v; setForm({...form, lineItems: itm});
//                       }} />
//                       <Input label="Price" type="number" value={item.price} onChange={(v: number) => {
//                         const itm = [...form.lineItems]; itm[idx].price = v; setForm({...form, lineItems: itm});
//                       }} />
//                       <Input label="Qty" type="number" value={item.quantity} onChange={(v: number) => {
//                         const itm = [...form.lineItems]; itm[idx].quantity = v; setForm({...form, lineItems: itm});
//                       }} />
//                       <button onClick={() => {
//                         const itm = [...form.lineItems]; itm.splice(idx,1); setForm({...form, lineItems: itm});
//                       }} className="pt-4 text-rose-500 flex justify-center"><Trash2 size={16}/></button>
//                    </div>
//                 ))}
//                 <button onClick={() => setForm({...form, lineItems: [...form.lineItems, { name: '', price: 0, weight: 0, quantity: 1, sku: '', unitPrice: 0 }]})} 
//                         className="text-[10px] font-black uppercase text-amber-600 mt-2 flex items-center gap-1">
//                   <Plus size={14}/> Add_Item
//                 </button>
//              </div>
//           </FormSection>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ───────────────── UI COMPONENTS ───────────────── */

// function FormSection({ title, children, icon }: any) {
//   return (
//     <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
//       <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
//         <span className="text-amber-500">{icon}</span>
//         <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{title}</h3>
//       </div>
//       {children}
//     </div>
//   );
// }

// function Input({ label, type = "text", value, onChange }: any) {
//   return (
//     <div className="flex flex-col gap-1">
//       <label className="text-[9px] font-black text-slate-400 uppercase">{label}</label>
//       <input 
//         type={type}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="bg-white border border-slate-200 px-2 py-1.5 text-[11px] font-bold outline-none focus:border-amber-500 transition-colors"
//       />
//     </div>
//   );
// }

// function Select({ label, options, value, onChange }: any) {
//   return (
//     <div className="flex flex-col gap-1">
//       <label className="text-[9px] font-black text-slate-400 uppercase">{label}</label>
//       <select 
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="bg-white border border-slate-200 px-2 py-1.5 text-[11px] font-black outline-none"
//       >
//         {options.map((o: any) => <option key={o} value={o}>{o}</option>)}
//       </select>
//     </div>
//   );
// }
export default function MarutiHyperlocalBooking() {
  const { createHyperlocalOrder } = useMaruti();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<any>({
    orderId: `HYP-${Date.now().toString().slice(-6)}`,
    orderNumber: "",
    orderSubtype: "FORWARD",
    orderCreatedAt: new Date().toISOString(),
    currency: "INR",
    amount: 0,
    weight: 0,
    lineItems: [{ name: '', price: 0, weight: 0, quantity: 1, sku: '', unitPrice: 0 }],
    paymentType: "COD",
    paymentStatus: "PENDING",
    remarks: "",
    shippingAddress: { name: '', email: '', phone: '', address1: '', city: '', state: '', zip: '', country: 'India', latitude: 0, longitude: 0 },
    pickupAddress: { name: '', email: '', phone: '', address1: '', city: '', state: '', zip: '', country: 'India', latitude: 0, longitude: 0 },
    deliveryPromise: "90_MIN_DELIVERY",
    returnableOrder: true,
    channelCode: "",
    length: 10, height: 10, width: 10
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createHyperlocalOrder(form);
      alert("Hyperlocal Node Initialized Successfully");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ───────────────── HEADER: RAPID PROTOCOL ───────────────── */}
      <div className="flex items-end justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-5">
          <div className="bg-amber-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200 animate-pulse">
            <Zap size={28} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.25em] flex items-center gap-2">
               Instant Dispatch Engine
            </h2>
            <h1 className="text-2xl font-bold text-slate-900 mt-1 uppercase tracking-tighter">Hyperlocal Rapid Booking</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              Service_Promise: <span className="text-amber-600 italic">{form.deliveryPromise}</span>
            </p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#0F172A] hover:bg-black text-white px-10 h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Activity className="animate-spin" size={18}/> : <Navigation2 size={18} fill="currentColor"/>}
          Initialize_Instant_Delivery
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ───────────────── LEFT: CONTEXT & SLA (COL-4) ───────────────── */}
        <div className="lg:col-span-4 space-y-8">
          <FormSection title="Store_Context" icon={<Store size={16}/>}>
            <div className="p-8 space-y-5">
              <Input label="External Order No" value={form.orderNumber} onChange={(v: string) => setForm({...form, orderNumber: v})} icon={<Hash size={14}/>} />
              <Input label="Channel Code" value={form.channelCode} onChange={(v: string) => setForm({...form, channelCode: v})} icon={<Globe size={14}/>} />
              
              <div className="flex items-center justify-between p-5 bg-amber-50/50 border border-amber-100 rounded-2xl">
                 <div className="flex flex-col">
                    <label className="text-[10px] font-black text-amber-900 uppercase">Returnable Order</label>
                    <span className="text-[8px] font-bold text-amber-600 uppercase tracking-tighter">Enable reverse pickup node</span>
                 </div>
                 <input 
                    type="checkbox" 
                    checked={form.returnableOrder} 
                    onChange={(e) => setForm({...form, returnableOrder: e.target.checked})}
                    className="h-6 w-6 accent-amber-500 cursor-pointer"
                 />
              </div>
            </div>
          </FormSection>

          <FormSection title="SLA_Configuration" icon={<Clock size={16}/>}>
             <div className="p-8 space-y-5">
               <Select 
                 label="Delivery Promise" 
                 options={['90_MIN_DELIVERY', 'SAME_DAY', '2_HOUR_EXPRESS']} 
                 value={form.deliveryPromise} 
                 onChange={(v: string) => setForm({...form, deliveryPromise: v})} 
               />
               <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Rider Instructions</label>
                  <textarea 
                    value={form.remarks}
                    placeholder="E.G. CONTACTLESS DELIVERY..."
                    className="w-full text-[11px] font-bold p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-amber-500 transition-all min-h-[100px] resize-none uppercase"
                    onChange={(e) => setForm({...form, remarks: e.target.value})}
                  />
               </div>
             </div>
          </FormSection>
        </div>

        {/* ───────────────── RIGHT: GEO-ADDRESS & CONTENTS (COL-8) ───────────────── */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PICKUP HUB */}
            <FormSection title="Pickup Hub (Geospatial)" icon={<Navigation size={16}/>}>
              <div className="p-8 space-y-5">
                <Input label="Hub Name" value={form.pickupAddress.name} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, name: v}})} />
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <Input label="Latitude" value={form.pickupAddress.latitude} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, latitude: v}})} />
                  <Input label="Longitude" value={form.pickupAddress.longitude} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, longitude: v}})} />
                </div>
                <textarea 
                   placeholder="WAREHOUSE / STORE STREET ADDRESS"
                   className="w-full text-[12px] font-bold p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-amber-500 transition-all min-h-[80px] resize-none uppercase"
                   onChange={(e) => setForm({...form, pickupAddress: {...form.pickupAddress, address1: e.target.value}})}
                />
              </div>
            </FormSection>

            {/* CUSTOMER DROP */}
            <FormSection title="Customer Drop (Geospatial)" icon={<MapPin size={16}/>}>
              <div className="p-8 space-y-5">
                <Input label="Customer Name" value={form.shippingAddress.name} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, name: v}})} />
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <Input label="Latitude" value={form.shippingAddress.latitude} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, latitude: v}})} />
                  <Input label="Longitude" value={form.shippingAddress.longitude} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, longitude: v}})} />
                </div>
                <textarea 
                   placeholder="DESTINATION STREET / LANDMARK"
                   className="w-full text-[12px] font-bold p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-amber-500 transition-all min-h-[80px] resize-none uppercase"
                   onChange={(e) => setForm({...form, shippingAddress: {...form.shippingAddress, address1: e.target.value}})}
                />
              </div>
            </FormSection>
          </div>

          {/* CONSIGNMENT CONTENTS */}
          <FormSection title="Consignment_Contents" icon={<ShoppingBag size={16}/>}>
             <div className="p-8 space-y-4">
                {form.lineItems.map((item: any, idx: number) => (
                   <div key={idx} className="flex gap-4 items-center bg-slate-50/50 p-5 rounded-[1.5rem] border border-slate-100 group transition-all hover:bg-white hover:border-amber-200">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                         <Input label="Item_Name" className="md:col-span-2" value={item.name} onChange={(v: string) => {
                           const itm = [...form.lineItems]; itm[idx].name = v; setForm({...form, lineItems: itm});
                         }} />
                         <Input label="SKU" value={item.sku} onChange={(v: string) => {
                           const itm = [...form.lineItems]; itm[idx].sku = v; setForm({...form, lineItems: itm});
                         }} />
                         <Input label="Price (₹)" type="number" value={item.price} onChange={(v: number) => {
                           const itm = [...form.lineItems]; itm[idx].price = v; setForm({...form, lineItems: itm});
                         }} />
                         <Input label="Qty" type="number" value={item.quantity} onChange={(v: number) => {
                           const itm = [...form.lineItems]; itm[idx].quantity = v; setForm({...form, lineItems: itm});
                         }} />
                      </div>
                      <button onClick={() => {
                        const itm = [...form.lineItems]; itm.splice(idx,1); setForm({...form, lineItems: itm});
                      }} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                        <Trash2 size={18}/>
                      </button>
                   </div>
                ))}
                <button onClick={() => setForm({...form, lineItems: [...form.lineItems, { name: '', price: 0, weight: 0, quantity: 1, sku: '', unitPrice: 0 }]})} 
                        className="text-[11px] font-black uppercase text-amber-600 flex items-center gap-2 hover:bg-amber-50 px-5 py-3 rounded-xl transition-all w-fit">
                  <Plus size={16} strokeWidth={3}/> Add_Payload_Item
                </button>
             </div>
          </FormSection>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── UI ATOMS (RAPID THEME) ───────────────── */

function FormSection({ title, children, icon }: any) {
  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
      <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3">
        <span className="text-amber-500">{icon}</span>
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Input({ label, type = "text", value, onChange, className, icon }: any) {
  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={clsx(
            "w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-[12px] font-bold outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all uppercase",
            icon && "pl-10"
          )}
        />
      </div>
    </div>
  );
}

function Select({ label, options, value, onChange }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-[12px] font-black outline-none appearance-none focus:bg-white focus:border-amber-500 transition-all cursor-pointer uppercase"
        >
          {options.map((o: any) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}