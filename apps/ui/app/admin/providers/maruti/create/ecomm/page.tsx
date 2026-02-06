"use client";

import React, { Activity, useState } from 'react';
import { 
  Package, MapPin, CreditCard, Plus, Trash2, 
  Save, Truck, Info, 
  Hash,
  ChevronDown,
  Box,
  Zap
} from 'lucide-react';
import clsx from 'clsx';
import { useMaruti } from '@/hooks/useMaruti'; // Your hook

// export default function CreateMarutiOrder() {
//   const { createEcommOrder } = useMaruti();
//   const [loading, setLoading] = useState(false);

//   // Initial State based on your Payload
//   const [form, setForm] = useState<any>({
//     orderId: `MAR-${Date.now().toString().slice(-6)}`,
//     orderSubtype: "FORWARD",
//     readyToPick: false,
//     orderCreatedAt: new Date().toISOString(),
//     currency: "INR",
//     amount: 0,
//     weight: 0,
//     lineItems: [{ name: '', price: 0, weight: 0, quantity: 1, sku: '', unitPrice: 0 }],
//     paymentType: "COD",
//     paymentStatus: "PENDING",
//     shippingAddress: { name: '', email: '', phone: '', address1: '', city: '', state: '', zip: '', country: 'India' },
//     pickupAddress: { name: '', email: '', phone: '', address1: '', city: '', state: '', zip: '', country: 'India' },
//     // Simplified for demo - usually you'd have billing/return toggle
//     gst: 5,
//     deliveryPromise: "AIR",
//     discount: 0,
//     length: 0, height: 0, width: 0
//   });

//   const addLineItem = () => {
//     setForm({
//       ...form,
//       lineItems: [...form.lineItems, { name: '', price: 0, weight: 0, quantity: 1, sku: '', unitPrice: 0 }]
//     });
//   };

//   const removeLineItem = (index: number) => {
//     const items = [...form.lineItems];
//     items.splice(index, 1);
//     setForm({ ...form, lineItems: items });
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       await createEcommOrder(form);
//       alert("Order Generated Successfully");
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto space-y-6 pb-20">
//       {/* HEADER */}
//       <div className="flex items-center justify-between border-b border-slate-200 pb-4">
//         <div>
//           <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Generate_Ecomm_Order</h1>
//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Maruti_Air_Courier // Forward_Logistics_Module</p>
//         </div>
//         <button 
//           onClick={handleSubmit}
//           disabled={loading}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg transition-all"
//         >
//           {loading ? 'Processing...' : <><Save size={16}/> Commit_Order_To_Node</>}
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* LEFT COLUMN: DATA ENTRY */}
//         <div className="lg:col-span-2 space-y-6">
          
//           {/* SECTION 1: CORE TELEMETRY */}
//           <FormSection title="01_Order_Telemetry" icon={<Info size={14}/>}>
//             <div className="grid grid-cols-2 gap-4 p-4">
//               <Input label="External_Order_ID" value={form.orderId} onChange={(v: string) => setForm({...form, orderId: v})} />
//               <Select 
//                 label="Order_Subtype" 
//                 options={['FORWARD', 'REVERSE']} 
//                 value={form.orderSubtype} 
//                 onChange={(v: string) => setForm({...form, orderSubtype: v})} 
//               />
//               <div className="grid grid-cols-3 gap-2 col-span-2">
//                 <Input label="Length (cm)" type="number" value={form.length} onChange={(v: string) => setForm({...form, length: v})} />
//                 <Input label="Width (cm)" type="number" value={form.width} onChange={(v: string) => setForm({...form, width: v})} />
//                 <Input label="Height (cm)" type="number" value={form.height} onChange={(v: string) => setForm({...form, height: v})} />
//               </div>
//             </div>
//           </FormSection>

//           {/* SECTION 2: LINE ITEMS (REPEATER) */}
//           <FormSection title="02_Consignment_Payload" icon={<Package size={14}/>}>
//             <div className="p-4 space-y-4">
//               {form.lineItems.map((item: any, idx: number) => (
//                 <div key={idx} className="flex gap-2 items-end border-b border-slate-100 pb-4 group">
//                    <div className="flex-1 grid grid-cols-4 gap-2">
//                       <Input label="SKU" value={item.sku} onChange={(v: string) => {
//                         const items = [...form.lineItems];
//                         items[idx].sku = v;
//                         setForm({...form, lineItems: items});
//                       }} />
//                       <Input label="Item_Name" className="col-span-2" value={item.name} onChange={(v: string) => {
//                         const items = [...form.lineItems];
//                         items[idx].name = v;
//                         setForm({...form, lineItems: items});
//                       }} />
//                       <Input label="Qty" type="number" value={item.quantity} onChange={(v: number) => {
//                         const items = [...form.lineItems];
//                         items[idx].quantity = v;
//                         setForm({...form, lineItems: items});
//                       }} />
//                    </div>
//                    <button onClick={() => removeLineItem(idx)} className="p-2 text-rose-400 hover:text-rose-600 mb-1">
//                      <Trash2 size={16}/>
//                    </button>
//                 </div>
//               ))}
//               <button onClick={addLineItem} className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800">
//                 <Plus size={14}/> Add_Item_Node
//               </button>
//             </div>
//           </FormSection>

//           {/* SECTION 3: ADDRESS MATRIX */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <FormSection title="Pickup_Source" icon={<MapPin size={14}/>}>
//               <div className="p-4 space-y-3">
//                 <Input label="Contact_Name" value={form.pickupAddress.name} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, name: v}})} />
//                 <Input label="Phone" value={form.pickupAddress.phone} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, phone: v}})} />
//                 <Input label="Zip_Code" value={form.pickupAddress.zip} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, zip: v}})} />
//                 <textarea 
//                    placeholder="FULL_ADDRESS_STREET_HOUSE_NO"
//                    className="w-full text-[11px] font-bold p-2 bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 min-h-[80px]"
//                    onChange={(e) => setForm({...form, pickupAddress: {...form.pickupAddress, address1: e.target.value}})}
//                 />
//               </div>
//             </FormSection>

//             <FormSection title="Delivery_Destination" icon={<Truck size={14}/>}>
//               <div className="p-4 space-y-3">
//                 <Input label="Customer_Name" value={form.shippingAddress.name} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, name: v}})} />
//                 <Input label="Phone" value={form.shippingAddress.phone} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, phone: v}})} />
//                 <Input label="Zip_Code" value={form.shippingAddress.zip} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, zip: v}})} />
//                 <textarea 
//                    placeholder="STREET_LOCALITY_LANDMARK"
//                    className="w-full text-[11px] font-bold p-2 bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 min-h-[80px]"
//                    onChange={(e) => setForm({...form, shippingAddress: {...form.shippingAddress, address1: e.target.value}})}
//                 />
//               </div>
//             </FormSection>
//           </div>
//         </div>

//         {/* RIGHT COLUMN: FINANCIALS & SUMMARY */}
//         <div className="space-y-6">
//            <FormSection title="Financial_Config" icon={<CreditCard size={14}/>}>
//               <div className="p-4 space-y-4">
//                 <Select label="Payment_Mode" options={['COD', 'PREPAID']} value={form.paymentType} onChange={(v: string) => setForm({...form, paymentType: v})} />
//                 <Input label="Total_Invoice_Value" type="number" value={form.amount} onChange={(v: number) => setForm({...form, amount: v})} />
//                 <div className="grid grid-cols-2 gap-2">
//                   <Input label="GST (%)" type="number" value={form.gst} onChange={(v: number) => setForm({...form, gst: v})} />
//                   <Input label="Discount" type="number" value={form.discount} onChange={(v: number) => setForm({...form, discount: v})} />
//                 </div>
//               </div>
//            </FormSection>

//            {/* LIVE SUMMARY TICKET */}
//            <div className="bg-indigo-900 text-white p-6 rounded-sm shadow-xl relative overflow-hidden">
//              <div className="absolute top-0 right-0 p-2 opacity-10">
//                <Hash size={60} />
//              </div>
//              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-indigo-300">Booking_Summary</h4>
//              <div className="space-y-3">
//                <SummaryRow label="Items_Count" value={form.lineItems.length} />
//                <SummaryRow label="Total_Weight" value={`${form.lineItems.reduce((a:any, b:any) => a + (Number(b.weight) || 0), 0)}g`} />
//                <SummaryRow label="Payment" value={form.paymentType} />
//                <div className="border-t border-indigo-800 pt-3 mt-3">
//                  <div className="flex justify-between items-end">
//                     <span className="text-[10px] font-black uppercase text-indigo-400">Grand_Total</span>
//                     <span className="text-2xl font-mono font-black">₹{form.amount}</span>
//                  </div>
//                </div>
//              </div>
//            </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ───────────────── UI ATOMS ───────────────── */

// function FormSection({ title, children, icon }: any) {
//   return (
//     <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
//       <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
//         <span className="text-indigo-600">{icon}</span>
//         <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{title}</h3>
//       </div>
//       {children}
//     </div>
//   );
// }

// function Input({ label, type = "text", value, onChange, className }: any) {
//   return (
//     <div className={clsx("flex flex-col gap-1", className)}>
//       <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{label}</label>
//       <input 
//         type={type}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="bg-slate-50 border border-slate-200 px-2 py-1.5 text-[11px] font-bold outline-none focus:border-indigo-500 transition-colors"
//       />
//     </div>
//   );
// }

// function Select({ label, options, value, onChange }: any) {
//   return (
//     <div className="flex flex-col gap-1">
//       <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{label}</label>
//       <select 
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="bg-slate-50 border border-slate-200 px-2 py-1.5 text-[11px] font-black outline-none appearance-none"
//       >
//         {options.map((o: any) => <option key={o} value={o}>{o}</option>)}
//       </select>
//     </div>
//   );
// }

// function SummaryRow({ label, value }: any) {
//   return (
//     <div className="flex justify-between text-[11px]">
//       <span className="font-bold text-indigo-400 uppercase">{label}</span>
//       <span className="font-mono font-black">{value}</span>
//     </div>
//   );
// }
export default function CreateMarutiOrder() {
  const { createEcommOrder } = useMaruti();
  const [loading, setLoading] = useState(false);

  // Initial State preserved exactly as requested
  const [form, setForm] = useState<any>({
    orderId: `MAR-${Date.now().toString().slice(-6)}`,
    orderSubtype: "FORWARD",
    readyToPick: false,
    orderCreatedAt: new Date().toISOString(),
    currency: "INR",
    amount: 0,
    weight: 0,
    lineItems: [{ name: '', price: 0, weight: 0, quantity: 1, sku: '', unitPrice: 0 }],
    paymentType: "COD",
    paymentStatus: "PENDING",
    shippingAddress: { name: '', email: '', phone: '', address1: '', city: '', state: '', zip: '', country: 'India' },
    pickupAddress: { name: '', email: '', phone: '', address1: '', city: '', state: '', zip: '', country: 'India' },
    gst: 5,
    deliveryPromise: "AIR",
    discount: 0,
    length: 0, height: 0, width: 0
  });

  const addLineItem = () => {
    setForm({
      ...form,
      lineItems: [...form.lineItems, { name: '', price: 0, weight: 0, quantity: 1, sku: '', unitPrice: 0 }]
    });
  };

  const removeLineItem = (index: number) => {
    const items = [...form.lineItems];
    items.splice(index, 1);
    setForm({ ...form, lineItems: items });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createEcommOrder(form);
      alert("Order Generated Successfully");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex items-end justify-between border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.25em] flex items-center gap-2">
            <div className="h-1 w-4 bg-indigo-600 rounded-full" /> Logistics Node
          </h2>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Generate Ecomm Order</h1>
          <p className="text-sm text-slate-500 mt-1 uppercase font-bold tracking-tight opacity-70">
            Maruti_Air_Courier // Forward_Logistics_Module
          </p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#0F172A] hover:bg-black text-white px-8 h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Activity className="animate-spin" size={18}/> : <Save size={18}/>}
          Commit_Order_To_Node
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: DATA ENTRY */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECTION 1: CORE TELEMETRY */}
          <FormSection title="01_Order_Telemetry" icon={<Zap size={16}/>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
              <Input label="External Order ID" value={form.orderId} onChange={(v: string) => setForm({...form, orderId: v})} icon={<Hash size={14}/>} />
              <Select 
                label="Order Subtype" 
                options={['FORWARD', 'REVERSE']} 
                value={form.orderSubtype} 
                onChange={(v: string) => setForm({...form, orderSubtype: v})} 
              />
              <div className="grid grid-cols-3 gap-4 col-span-full bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <Input label="Length (cm)" type="number" value={form.length} onChange={(v: string) => setForm({...form, length: v})} />
                <Input label="Width (cm)" type="number" value={form.width} onChange={(v: string) => setForm({...form, width: v})} />
                <Input label="Height (cm)" type="number" value={form.height} onChange={(v: string) => setForm({...form, height: v})} />
              </div>
            </div>
          </FormSection>

          {/* SECTION 2: LINE ITEMS (REPEATER) */}
          <FormSection title="02_Consignment_Payload" icon={<Package size={16}/>}>
            <div className="p-8 space-y-4">
              {form.lineItems.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-50 group hover:bg-white hover:border-indigo-100 transition-all">
                   <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Input label="SKU" value={item.sku} onChange={(v: string) => {
                        const items = [...form.lineItems];
                        items[idx].sku = v;
                        setForm({...form, lineItems: items});
                      }} />
                      <Input label="Item Name" className="md:col-span-2" value={item.name} onChange={(v: string) => {
                        const items = [...form.lineItems];
                        items[idx].name = v;
                        setForm({...form, lineItems: items});
                      }} />
                      <Input label="Qty" type="number" value={item.quantity} onChange={(v: number) => {
                        const items = [...form.lineItems];
                        items[idx].quantity = v;
                        setForm({...form, lineItems: items});
                      }} />
                   </div>
                   <button onClick={() => removeLineItem(idx)} className="mt-4 p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                      <Trash2 size={18}/>
                   </button>
                </div>
              ))}
              <button onClick={addLineItem} className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
                <Plus size={16} strokeWidth={3}/> Add_Item_Node
              </button>
            </div>
          </FormSection>

          {/* SECTION 3: ADDRESS MATRIX */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormSection title="Pickup_Source" icon={<MapPin size={16}/>}>
              <div className="p-8 space-y-4">
                <Input label="Contact Name" value={form.pickupAddress.name} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, name: v}})} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Phone" value={form.pickupAddress.phone} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, phone: v}})} />
                  <Input label="Zip Code" value={form.pickupAddress.zip} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, zip: v}})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter ml-1">Full Address</label>
                  <textarea 
                    placeholder="STREET / HOUSE NO / HUB"
                    className="w-full text-[12px] font-bold p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all min-h-[100px] resize-none"
                    onChange={(e) => setForm({...form, pickupAddress: {...form.pickupAddress, address1: e.target.value}})}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection title="Delivery_Destination" icon={<Truck size={16}/>}>
              <div className="p-8 space-y-4">
                <Input label="Customer Name" value={form.shippingAddress.name} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, name: v}})} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Phone" value={form.shippingAddress.phone} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, phone: v}})} />
                  <Input label="Zip Code" value={form.shippingAddress.zip} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, zip: v}})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter ml-1">Street Landmark</label>
                  <textarea 
                    placeholder="HOUSE NO / APARTMENT / LANDMARK"
                    className="w-full text-[12px] font-bold p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all min-h-[100px] resize-none"
                    onChange={(e) => setForm({...form, shippingAddress: {...form.shippingAddress, address1: e.target.value}})}
                  />
                </div>
              </div>
            </FormSection>
          </div>
        </div>

        {/* RIGHT COLUMN: FINANCIALS & SUMMARY */}
        <div className="lg:col-span-4 space-y-8">
           <FormSection title="Financial_Config" icon={<CreditCard size={16}/>}>
              <div className="p-8 space-y-6">
                <Select label="Payment Mode" options={['COD', 'PREPAID']} value={form.paymentType} onChange={(v: string) => setForm({...form, paymentType: v})} />
                <Input label="Total Invoice Value" type="number" value={form.amount} onChange={(v: number) => setForm({...form, amount: v})} icon={<span className="text-[10px]">₹</span>} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="GST (%)" type="number" value={form.gst} onChange={(v: number) => setForm({...form, gst: v})} />
                  <Input label="Discount" type="number" value={form.discount} onChange={(v: number) => setForm({...form, discount: v})} />
                </div>
              </div>
           </FormSection>

           {/* LIVE SUMMARY TICKET */}
           <div className="bg-[#0F172A] text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col min-h-[400px]">
             <div className="bg-indigo-600 px-8 py-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100">Booking Summary</h4>
             </div>
             
             <div className="p-10 flex-1 flex flex-col justify-between">
               <div className="space-y-4">
                 <SummaryRow label="Items Count" value={form.lineItems.length} />
                 <SummaryRow label="Total Weight" value={`${form.lineItems.reduce((a:any, b:any) => a + (Number(b.weight) || 0), 0)}g`} />
                 <SummaryRow label="Payment Node" value={form.paymentType} />
                 <SummaryRow label="Service Level" value={form.deliveryPromise} />
               </div>

               <div className="mt-10 pt-8 border-t border-white/10">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Grand_Total</span>
                     <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-mono font-black italic tracking-tighter">₹{form.amount}</span>
                        <span className="text-xs font-bold text-white/40 uppercase">INR</span>
                     </div>
                  </div>
               </div>
             </div>

             <div className="absolute -bottom-10 -right-10 p-2 opacity-5 pointer-events-none rotate-12">
               <Box size={240} strokeWidth={1} />
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── UI ATOMS (MODERNIZED) ───────────────── */

function FormSection({ title, children, icon }: any) {
  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
      <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3">
        <span className="text-indigo-600">{icon}</span>
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
            "w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-[12px] font-bold outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all",
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
          className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-[12px] font-black outline-none appearance-none focus:bg-white focus:border-indigo-500 transition-all cursor-pointer uppercase"
        >
          {options.map((o: any) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center text-[11px] group">
      <span className="font-bold text-white/40 uppercase tracking-wider">{label}</span>
      <span className="font-mono font-black text-indigo-100">{value}</span>
    </div>
  );
}