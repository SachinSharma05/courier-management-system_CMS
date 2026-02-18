'use client';

import { 
  Users2, UserPlus, Search, Briefcase, Wallet, 
  Calendar, IndianRupee, HandCoins, Clock, 
  X, Info, Plus
} from 'lucide-react';
import { useEffect, useMemo, useState, ChangeEvent, ReactNode } from 'react';
import clsx from 'clsx';
import { 
  getEmployeesOverview, 
  markAttendance, 
  createAdvance, 
  paySalary, 
  createEmployee,
  createHoliday,
  updateEmployee,
} from '@/hooks/useEmployees';
import { AttendanceStatus, DrawerType, Employee, InputValue } from '../interface/adminInterface';

/* ================= MAIN PAGE ================= */
export default function EmployeesPage() {
  const [activeTab, setActiveTab] = useState<'directory' | 'attendance' | 'payroll'>('directory');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerType, setDrawerType] = useState<DrawerType>('add');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  const stats = useMemo(() => ({
    present: employees.filter(e => e.attendance_status === 'present').length,
    absent: employees.filter(e => e.attendance_status === 'absent').length,
    offs: employees.filter(e => e.attendance_status === 'half_day').length,
    holidays: employees.filter(e => e.attendance_status === 'leave').length
  }), [employees]);

  const filteredEmployees = useMemo(() => 
    employees.filter(e => 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (e.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    ),
    [employees, searchTerm]
  );

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployeesOverview();
      setEmployees(Array.isArray(data) ? data : (data?.rows || []));
    } catch (error) { 
      setEmployees([]); 
    } finally { 
      setLoading(false); 
    }
  };
  
  useEffect(() => { loadEmployees(); }, []);

  const openAction = (type: DrawerType, emp: Employee) => {
    setDrawerType(type);
    setSelectedEmp(emp);
    setIsDrawerOpen(true);
  };

  return (
    <div className="p-2 space-y-2 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* ───────────────── HEADER ───────────────── */}
      <header className="mb-4 flex items-center justify-between rounded-2xl border border-slate-300 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 bg-orange-600 items-center justify-center rounded-xl text-white shadow-lg shadow-slate-200">
            <Users2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Staff Command Center</h1>
            <p className="text-xs font-medium text-slate-500">Operations & Human Resources</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
             <input 
                placeholder="Find staff..." 
                className="w-64 rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
             />
          </div>
          <button onClick={() => { setDrawerType('holidays'); setSelectedEmp(null); setIsDrawerOpen(true); }} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Calendar size={14} /> Holidays
          </button>
          <button 
            onClick={() => { 
              setSelectedEmp({ id: 0, name: '', phone: '', is_active: true, base_salary: 0, advance_balance: 0, net_due: 0, attendance_list: [], advances: [] } as Employee); 
              setDrawerType('add'); 
              setIsDrawerOpen(true); 
            }} 
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2 text-[10px] font-black uppercase text-white hover:bg-black transition-all shadow-md active:scale-95"
          >
            <UserPlus size={14} /> Add Member
          </button>
        </div>
      </header>

      {/* ───────────────── SUB-NAV & STATS ───────────────── */}
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-300 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
          <TabBtn active={activeTab === 'directory'} onClick={() => setActiveTab('directory')} label="Directory" icon={<Briefcase size={12}/>} />
          <TabBtn active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} label="Attendance" icon={<Clock size={12}/>} />
          <TabBtn active={activeTab === 'payroll'} onClick={() => setActiveTab('payroll')} label="Payroll" icon={<Wallet size={12}/>} />
        </div>

        {activeTab === 'attendance' && (
          <div className="flex gap-2">
            <StatChip label="Present" count={stats.present} color="emerald" />
            <StatChip label="Absent" count={stats.absent} color="red" />
            <StatChip label="Holidays" count={stats.holidays} color="indigo" />
          </div>
        )}
      </div>

      {/* ───────────────── DATA GRID ───────────────── */}
      <main className="flex-1 overflow-auto">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <Th>Staff Member</Th>
                {activeTab === 'directory' && (
                  <>
                    <Th>Designation</Th>
                    <Th>Department</Th>
                    <Th>Status</Th>
                  </>
                )}
                {activeTab === 'attendance' && (
                  <>
                    <Th>Log (Today)</Th>
                    <Th>Daily Status</Th>
                    <Th>History</Th>
                  </>
                )}
                {activeTab === 'payroll' && (
                  <>
                    <Th className="text-right">Base Salary</Th>
                    <Th className="text-right">Advance</Th>
                    <Th className="text-right">Net Due</Th>
                  </>
                )}
                <Th className="text-right pr-6">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={10} className="py-24 text-center text-slate-400 text-[10px] font-black animate-pulse uppercase tracking-[0.3em]">Hydrating_Records...</td></tr>
              ) : filteredEmployees.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/80 group transition-colors">
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-[11px] font-black text-indigo-600 shadow-sm uppercase">
                        {e.name.substring(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 leading-none mb-1">{e.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold tracking-tight">{e.phone}</span>
                      </div>
                    </div>
                  </Td>

                  {activeTab === 'directory' && (
                    <>
                      <Td><span className="text-xs font-bold text-slate-700">{e.designation ?? '—'}</span></Td>
                      <Td><span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">{e.department}</span></Td>
                      <Td><StatusBadge status={e.is_active ? 'Active' : 'Disabled'} /></Td>
                    </>
                  )}

                  {activeTab === 'attendance' && (
                    <>
                      <Td>
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-slate-700">{formatTime(e.check_in)}</span>
                           <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Check-In</span>
                        </div>
                      </Td>
                      <Td>
                        <AttendanceStatusChip status={e.attendance_status} />
                      </Td>
                      <Td>
                         <button onClick={() => { setSelectedEmp(e); setIsCalendarOpen(true); }} className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all">Logs</button>
                      </Td>
                    </>
                  )}

                  {activeTab === 'payroll' && (
                    <>
                      <Td className="text-right text-xs font-bold font-mono">₹{Number(e.base_salary).toLocaleString()}</Td>
                      <Td className="text-right text-xs font-bold font-mono text-red-500">₹{Number(e.advance_balance ?? 0).toLocaleString()}</Td>
                      <Td className="text-right text-xs font-black font-mono text-slate-900">₹{(Number(e.base_salary) - Number(e.advance_balance ?? 0)).toLocaleString()}</Td>
                    </>
                  )}

                  <Td className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      {activeTab === 'directory' && (
                        <button onClick={() => openAction('edit', e)} className="px-3 py-1.5 rounded-lg text-[10px] font-black bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white uppercase transition-all">Manage</button>
                      )}
                      {activeTab === 'attendance' && (
                        <button onClick={() => openAction('attendance', e)} className="px-4 py-1.5 rounded-lg text-[10px] font-black bg-indigo-600 text-white hover:bg-indigo-700 uppercase shadow-sm transition-all">Mark</button>
                      )}
                      {activeTab === 'payroll' && (
                        <div className="flex gap-1">
                          <button onClick={() => openAction('advance', e)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all border border-transparent hover:border-amber-100" title="Advance"><HandCoins size={16}/></button>
                          <button onClick={() => openAction('pay', e)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all border border-transparent hover:border-emerald-100" title="Pay"><IndianRupee size={16}/></button>
                        </div>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* ───────────────── MODALS ───────────────── */}
      {isCalendarOpen && selectedEmp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsCalendarOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Monthly Log Archive</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{selectedEmp.name}</p>
              </div>
              <button onClick={() => setIsCalendarOpen(false)} className="p-2 hover:bg-white rounded-xl text-slate-400 border border-transparent hover:border-slate-200 transition-all"><X size={20} /></button>
            </div>
            <div className="p-0 max-h-[60vh] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 sticky top-0 border-b border-slate-100">
                  <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Check-In</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {selectedEmp.attendance_list?.map((log, idx) => (
                    <tr key={idx} className="text-[11px] hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-6 font-bold text-slate-700">{log.date}</td>
                      <td className="py-3 px-6">
                         <span className={clsx(
                           "px-2 py-0.5 rounded text-[8px] font-black uppercase", 
                           log.status === 'present' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                         )}>
                            {log.status}
                         </span>
                      </td>
                      <td className="py-3 px-6 text-slate-500 font-mono">{formatTime(log.check_in)}</td>
                    </tr>
                  ))}
                  {(!selectedEmp.attendance_list || selectedEmp.attendance_list.length === 0) && (
                    <tr><td colSpan={3} className="py-12 text-center text-[10px] font-bold text-slate-400 uppercase">No logs recorded for this period</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────── DRAWER ───────────────── */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)} />
          <aside className="relative w-full max-w-[480px] bg-white shadow-2xl animate-in slide-in-from-right duration-500 ease-in-out flex flex-col">
            <EmployeeDrawer 
                type={drawerType} 
                employee={selectedEmp} 
                onClose={() => setIsDrawerOpen(false)} 
                onSaved={loadEmployees} 
            />
          </aside>
        </div>
      )}
    </div>
  );
}

/* ================= DRAWER COMPONENT ================= */
function EmployeeDrawer({ type, employee, onClose, onSaved }: { type: DrawerType, employee: Employee | null, onClose: () => void, onSaved: () => Promise<void> }) {
  const [amount, setAmount] = useState<number>(0);
  const [remarks, setRemarks] = useState<string>('');
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [holidayData, setHolidayData] = useState({ name: '', date: new Date().toISOString().slice(0, 10) });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>('present');

  const [formData, setFormData] = useState({ 
    employee_code: '', 
    name: '', 
    email: '', 
    designation: 'Staff', 
    phone: '', 
    department: 'Operations', 
    base_salary: 0, 
    joining_date: new Date().toISOString().slice(0, 10), 
    salary_type: 'Monthly', 
    is_active: true 
  });

  useEffect(() => {
    if ((type === 'edit' || type === 'advance' || type === 'pay' || type === 'attendance' || type === 'holidays') && employee) {
      setFormData({ 
        employee_code: employee.employee_code || '', 
        name: employee.name || '', 
        email: employee.email || '', 
        designation: employee.designation || 'Staff', 
        phone: String(employee.phone || ''), 
        department: employee.department || 'Operations', 
        base_salary: Number(employee.base_salary) || 0, 
        joining_date: employee.joining_date || new Date().toISOString().slice(0, 10), 
        salary_type: employee.salary_type || 'Monthly', 
        is_active: !!employee.is_active 
      });
    }
  }, [employee, type]);

  const handleAction = async () => {
    setLoadingAction(true);
    try {
      if (type === 'add') await createEmployee({ ...formData, salary_type: formData.salary_type as "monthly" | "daily" });
      if (type === 'edit' && employee) await updateEmployee(employee.id, { ...formData, salary_type: formData.salary_type as "Monthly" | "Daily" | "Weekly" });
      if (type === 'holidays') await createHoliday(holidayData);
      if (type === 'attendance' && employee) await markAttendance({ employee_id: employee.id, date: selectedDate, status: selectedStatus });
      if (type === 'advance' && employee) await createAdvance({ employee_id: employee.id, amount, remarks });
      if (type === 'pay' && employee) {
        await paySalary({ 
          employee_id: employee.id, 
          salary_id: employee.salary_id ?? 0, 
          amount: amount || Number(employee.net_due), 
          payment_date: new Date().toISOString().slice(0, 10), 
          mode: 'bank' 
        });
      }
      await onSaved(); 
      onClose();
    } catch(e) { console.error(e); } 
    finally { setLoadingAction(false); }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2">{type} Entry</h2>
        <p className="text-2xl font-black text-slate-900">{employee?.name || (type === 'holidays' ? 'Public Holiday' : 'New Member')}</p>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-8">
        {(type === 'edit' || type === 'add') && (
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-50 border border-indigo-100">
              <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">Active Service Status</span>
              <button 
                onClick={() => setFormData({...formData, is_active: !formData.is_active})} 
                className={clsx("relative inline-flex h-6 w-12 items-center rounded-full transition-all", formData.is_active ? "bg-indigo-600" : "bg-slate-300")}
              >
                <span className={clsx("inline-block h-4 w-4 transform rounded-full bg-white transition-all shadow-sm", formData.is_active ? "translate-x-7" : "translate-x-1")} />
              </button>
            </div>
            <InputField label="Full Employee Name" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Email ID" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
              <InputField label="Contact Number" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Designation" value={formData.designation} onChange={(v) => setFormData({...formData, designation: v})} />
              <InputField label="Department" value={formData.department} onChange={(v) => setFormData({...formData, department: v})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <InputField label="Monthly Base Salary" type="number" value={formData.base_salary} onChange={(v) => setFormData({...formData, base_salary: +v})} />
               <InputField label="Joining Date" type="date" value={formData.joining_date} onChange={(v) => setFormData({...formData, joining_date: v})} />
            </div>
          </div>
        )}

        {type === 'attendance' && (
          <div className="space-y-8">
             <InputField label="Effective Date" type="date" value={selectedDate} onChange={(v) => setSelectedDate(v)} />
             <div className="grid grid-cols-2 gap-3">
                {(['present', 'absent', 'half_day', 'leave'] as const).map(s => (
                  <button key={s} onClick={() => setSelectedStatus(s)} className={clsx(
                    "py-5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all shadow-sm",
                    selectedStatus === s ? "bg-indigo-600 border-indigo-600 text-white scale-105 shadow-indigo-100" : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                  )}>{s.replace('_', ' ')}</button>
                ))}
             </div>
             <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
                <Info size={20} className="text-amber-600 shrink-0 mt-1" />
                <p className="text-xs font-bold text-amber-800 leading-relaxed uppercase tracking-tight">
                  This update will override any automated logs for <span className="underline">{selectedDate}</span>.
                </p>
             </div>
          </div>
        )}

        {type === 'advance' && employee && (
          <div className="space-y-8">
            <div className="p-8 bg-slate-900 rounded-2xl flex flex-col items-center text-white shadow-xl shadow-slate-200">
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-2">Liability Balance</span>
               <span className="text-3xl font-black text-amber-400 font-mono">₹{Number(employee.advance_balance).toLocaleString()}</span>
            </div>
            <InputField label="Disbursement Amount (INR)" type="number" value={amount} onChange={(v) => setAmount(+v)} placeholder="0.00" />
            <InputField label="Transaction Remarks" value={remarks} onChange={(v) => setRemarks(v)} placeholder="Payment reference..." />
            <div className="space-y-2 pt-4">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Recent Transactions</h3>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded bg-white">
                  {employee.advances?.length > 0 ? employee.advances.map((adv) => (
                   <div key={adv.id} className="flex justify-between p-3 text-[11px]">
                     <span className="font-bold">₹{adv.amount.toLocaleString()}</span>
                     <span className="text-slate-400 italic">{adv.remarks}</span>
                   </div>
                 )) : <div className="p-3 text-[10px] text-slate-400 text-center uppercase font-bold">No history found</div>}
               </div>
            </div>
          </div>
        )}

        {type === 'pay' && employee && (
          <div className="space-y-8">
             <div className="p-8 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-6">Net Settlement Calculation</p>
                <div className="space-y-4 font-bold">
                   <div className="flex justify-between items-center"><span>Gross Salary</span> <span>₹{Number(employee.base_salary).toLocaleString()}</span></div>
                   <div className="flex justify-between items-center text-indigo-200"><span>Advance Deduction</span> <span>- ₹{Number(employee.advance_balance).toLocaleString()}</span></div>
                   <div className="h-px bg-white/20 my-2" />
                   <div className="flex justify-between items-center text-xl font-black">
                      <span>FINAL PAYOUT</span> 
                      <span className="text-white">₹{Number(employee.net_due).toLocaleString()}</span>
                   </div>
                </div>
             </div>
             <InputField label="Payment Adjustment (Override)" type="number" value={amount} onChange={(v) => setAmount(+v)} placeholder={String(employee.net_due)} />
          </div>
        )}

        {type === 'holidays' && (
          <div className="space-y-8">
             <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl space-y-4">
                <h3 className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2"><Plus size={14}/> Define Corporate Holiday</h3>
                <InputField label="Event Label" value={holidayData.name} onChange={(v) => setHolidayData({...holidayData, name: v})} placeholder="e.g. Founder's Day" />
                <InputField label="Scheduled Date" type="date" value={holidayData.date} onChange={(v) => setHolidayData({...holidayData, date: v})} />
             </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
        <button onClick={onClose} className="flex-1 px-6 py-4 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-all">Discard Changes</button>
        <button 
          onClick={handleAction} 
          disabled={loadingAction} 
          className="flex-1 px-6 py-4 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
        >
          {loadingAction ? 'Processing...' : 'Authorize Action'}
        </button>
      </div>
    </div>
  );
}

/* ================= ATOMIC UI HELPERS ================= */

function TabBtn({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: ReactNode }) {
  return (
    <button onClick={onClick} className={clsx(
      "flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all", 
      active ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
    )}>
      {icon} {label}
    </button>
  );
}

function StatChip({ label, count, color }: { label: string, count: number, color: 'emerald' | 'red' | 'indigo' }) {
  const c = { 
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100", 
    red: "bg-rose-50 text-rose-600 border-rose-100", 
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100" 
  };
  return (
    <div className={clsx("flex items-center gap-2 px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase shadow-sm", c[color])}>
      {label} <span className="text-xs bg-white/50 px-2 py-0.5 rounded-md ml-1 font-mono">{count}</span>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text", placeholder = "" }: { label: string, value: InputValue, onChange: (v: string) => void, type?: string, placeholder?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
      <input 
        type={type} placeholder={placeholder} value={value} 
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} 
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 bg-slate-50 transition-all" 
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const active = status === 'Active';
  return (
    <div className={clsx("flex items-center gap-2 px-3 py-1 rounded-lg border w-fit", active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200")}>
      <div className={clsx("h-1.5 w-1.5 rounded-full", active ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
      <span className="text-[9px] font-black uppercase tracking-wider">{status}</span>
    </div>
  );
}

function AttendanceStatusChip({ status }: { status: string | null | undefined }) {
  if (!status) return <span className="text-[10px] font-bold text-slate-300 italic tracking-tight uppercase">NOT MARKED</span>;
  const colors: Record<string, string> = {
    present: "bg-emerald-50 text-emerald-600 border-emerald-100",
    absent: "bg-rose-50 text-rose-600 border-rose-100",
    half_day: "bg-amber-50 text-amber-600 border-amber-100",
    leave: "bg-indigo-50 text-indigo-600 border-indigo-100",
    holiday: "bg-orange-50 text-orange-600 border-orange-100"
  };
  return (
    <span className={clsx("px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest", colors[status.toLowerCase()] || "bg-slate-50 text-slate-500")}>
      {status.replace('_', ' ')}
    </span>
  );
}

const formatTime = (iso: string | null | undefined) => iso ? new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : "--:--";
const Th = ({ children, className }: { children: ReactNode, className?: string }) => <th className={clsx("px-6 py-5 text-left text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]", className)}>{children}</th>;
const Td = ({ children, className }: { children: ReactNode, className?: string }) => <td className={clsx("px-6 py-5 text-xs", className)}>{children}</td>;