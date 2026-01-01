import { useState, useEffect } from 'react';
import { X, Save, Shield, Building2, User as UserIcon, Phone } from 'lucide-react';
import { createClient, updateClient } from '@/lib/api/clients.api';

export function ClientDrawer({ client, onClose, onRefresh }: any) {
  const isEdit = !!client?.id;
  const [formData, setFormData] = useState({
    username: '', email: '', password: '',
    company_name: '', contact_person: '', phone: '',
    is_active: true,
  });

  useEffect(() => {
    if (client) {
      setFormData({
        ...formData,
        ...client,
        company_name: client.company_name || '',
        contact_person: client.contact_person || '',
      });
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) await updateClient(client.id, formData);
      else await createClient(formData);
      onRefresh();
      onClose();
    } catch (err) { alert("Failed to save client"); }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer Body */}
      <div className="relative w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 border-b flex items-center justify-between bg-slate-50">
            <h2 className="text-xl font-bold text-slate-900">{isEdit ? 'Update Client' : 'New Client'}</h2>
            <button type="button" onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full"><X size={20}/></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <Input label="Company Name" icon={<Building2 size={16}/>} value={formData.company_name} onChange={(v) => setFormData({...formData, company_name: v})} />
            {!isEdit && (
              <>
                <Input label="Username" icon={<UserIcon size={16}/>} value={formData.username} onChange={(v) => setFormData({...formData, username: v})} />
                <Input label="Password" type="password" icon={<Shield size={16}/>} value={formData.password} onChange={(v) => setFormData({...formData, password: v})} />
              </>
            )}
            <Input label="Contact Person" value={formData.contact_person} onChange={(v) => setFormData({...formData, contact_person: v})} />
            <Input label="Phone" icon={<Phone size={16}/>} value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="text-sm font-bold text-slate-700">Account Active</span>
              <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} className="w-5 h-5 accent-emerald-500" />
            </div>
          </div>

          <div className="p-6 border-t bg-slate-50">
            <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">
              <Save size={18}/> {isEdit ? 'Save Changes' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", icon }: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-500 uppercase">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-3 text-slate-400">{icon}</div>}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={`w-full border rounded-xl py-2.5 ${icon ? 'pl-10' : 'px-4'} font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none`} />
      </div>
    </div>
  );
}