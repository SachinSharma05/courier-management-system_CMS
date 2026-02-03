"use client";

import React, { useState } from 'react';
import { 
  Package, MapPin, CreditCard, Plus, Trash2, 
  Save, Truck, Info, 
  Hash
} from 'lucide-react';
import clsx from 'clsx';
import { useMaruti } from '@/hooks/useMaruti'; // Your hook

export default function CreateMarutiOrder() {
  const { createEcommOrder } = useMaruti();
  const [loading, setLoading] = useState(false);

  // Initial State based on your Payload
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
    // Simplified for demo - usually you'd have billing/return toggle
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
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Generate_Ecomm_Order</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Maruti_Air_Courier // Forward_Logistics_Module</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg transition-all"
        >
          {loading ? 'Processing...' : <><Save size={16}/> Commit_Order_To_Node</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: DATA ENTRY */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SECTION 1: CORE TELEMETRY */}
          <FormSection title="01_Order_Telemetry" icon={<Info size={14}/>}>
            <div className="grid grid-cols-2 gap-4 p-4">
              <Input label="External_Order_ID" value={form.orderId} onChange={(v: string) => setForm({...form, orderId: v})} />
              <Select 
                label="Order_Subtype" 
                options={['FORWARD', 'REVERSE']} 
                value={form.orderSubtype} 
                onChange={(v: string) => setForm({...form, orderSubtype: v})} 
              />
              <div className="grid grid-cols-3 gap-2 col-span-2">
                <Input label="Length (cm)" type="number" value={form.length} onChange={(v: string) => setForm({...form, length: v})} />
                <Input label="Width (cm)" type="number" value={form.width} onChange={(v: string) => setForm({...form, width: v})} />
                <Input label="Height (cm)" type="number" value={form.height} onChange={(v: string) => setForm({...form, height: v})} />
              </div>
            </div>
          </FormSection>

          {/* SECTION 2: LINE ITEMS (REPEATER) */}
          <FormSection title="02_Consignment_Payload" icon={<Package size={14}/>}>
            <div className="p-4 space-y-4">
              {form.lineItems.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-2 items-end border-b border-slate-100 pb-4 group">
                   <div className="flex-1 grid grid-cols-4 gap-2">
                      <Input label="SKU" value={item.sku} onChange={(v: string) => {
                        const items = [...form.lineItems];
                        items[idx].sku = v;
                        setForm({...form, lineItems: items});
                      }} />
                      <Input label="Item_Name" className="col-span-2" value={item.name} onChange={(v: string) => {
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
                   <button onClick={() => removeLineItem(idx)} className="p-2 text-rose-400 hover:text-rose-600 mb-1">
                     <Trash2 size={16}/>
                   </button>
                </div>
              ))}
              <button onClick={addLineItem} className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800">
                <Plus size={14}/> Add_Item_Node
              </button>
            </div>
          </FormSection>

          {/* SECTION 3: ADDRESS MATRIX */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSection title="Pickup_Source" icon={<MapPin size={14}/>}>
              <div className="p-4 space-y-3">
                <Input label="Contact_Name" value={form.pickupAddress.name} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, name: v}})} />
                <Input label="Phone" value={form.pickupAddress.phone} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, phone: v}})} />
                <Input label="Zip_Code" value={form.pickupAddress.zip} onChange={(v: string) => setForm({...form, pickupAddress: {...form.pickupAddress, zip: v}})} />
                <textarea 
                   placeholder="FULL_ADDRESS_STREET_HOUSE_NO"
                   className="w-full text-[11px] font-bold p-2 bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 min-h-[80px]"
                   onChange={(e) => setForm({...form, pickupAddress: {...form.pickupAddress, address1: e.target.value}})}
                />
              </div>
            </FormSection>

            <FormSection title="Delivery_Destination" icon={<Truck size={14}/>}>
              <div className="p-4 space-y-3">
                <Input label="Customer_Name" value={form.shippingAddress.name} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, name: v}})} />
                <Input label="Phone" value={form.shippingAddress.phone} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, phone: v}})} />
                <Input label="Zip_Code" value={form.shippingAddress.zip} onChange={(v: string) => setForm({...form, shippingAddress: {...form.shippingAddress, zip: v}})} />
                <textarea 
                   placeholder="STREET_LOCALITY_LANDMARK"
                   className="w-full text-[11px] font-bold p-2 bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 min-h-[80px]"
                   onChange={(e) => setForm({...form, shippingAddress: {...form.shippingAddress, address1: e.target.value}})}
                />
              </div>
            </FormSection>
          </div>
        </div>

        {/* RIGHT COLUMN: FINANCIALS & SUMMARY */}
        <div className="space-y-6">
           <FormSection title="Financial_Config" icon={<CreditCard size={14}/>}>
              <div className="p-4 space-y-4">
                <Select label="Payment_Mode" options={['COD', 'PREPAID']} value={form.paymentType} onChange={(v: string) => setForm({...form, paymentType: v})} />
                <Input label="Total_Invoice_Value" type="number" value={form.amount} onChange={(v: number) => setForm({...form, amount: v})} />
                <div className="grid grid-cols-2 gap-2">
                  <Input label="GST (%)" type="number" value={form.gst} onChange={(v: number) => setForm({...form, gst: v})} />
                  <Input label="Discount" type="number" value={form.discount} onChange={(v: number) => setForm({...form, discount: v})} />
                </div>
              </div>
           </FormSection>

           {/* LIVE SUMMARY TICKET */}
           <div className="bg-indigo-900 text-white p-6 rounded-sm shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-10">
               <Hash size={60} />
             </div>
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-indigo-300">Booking_Summary</h4>
             <div className="space-y-3">
               <SummaryRow label="Items_Count" value={form.lineItems.length} />
               <SummaryRow label="Total_Weight" value={`${form.lineItems.reduce((a:any, b:any) => a + (Number(b.weight) || 0), 0)}g`} />
               <SummaryRow label="Payment" value={form.paymentType} />
               <div className="border-t border-indigo-800 pt-3 mt-3">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase text-indigo-400">Grand_Total</span>
                    <span className="text-2xl font-mono font-black">₹{form.amount}</span>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── UI ATOMS ───────────────── */

function FormSection({ title, children, icon }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <span className="text-indigo-600">{icon}</span>
        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Input({ label, type = "text", value, onChange, className }: any) {
  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-50 border border-slate-200 px-2 py-1.5 text-[11px] font-bold outline-none focus:border-indigo-500 transition-colors"
      />
    </div>
  );
}

function Select({ label, options, value, onChange }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-50 border border-slate-200 px-2 py-1.5 text-[11px] font-black outline-none appearance-none"
      >
        {options.map((o: any) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SummaryRow({ label, value }: any) {
  return (
    <div className="flex justify-between text-[11px]">
      <span className="font-bold text-indigo-400 uppercase">{label}</span>
      <span className="font-mono font-black">{value}</span>
    </div>
  );
}