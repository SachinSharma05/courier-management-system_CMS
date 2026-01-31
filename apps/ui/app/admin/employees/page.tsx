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

/* ================= TYPES ================= */
type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave';

interface AttendanceEntry {
  date: string;
  status: AttendanceStatus;
  check_in: string | null;
  check_out: string | null;
}

interface AdvanceEntry {
  id: number;
  amount: number;
  date: string;
  remarks: string;
  is_settled: boolean;
}

interface Employee {
  id: number;
  employee_code?: string;
  name: string;
  email?: string;
  designation?: string;
  department?: string;
  is_active: boolean;
  base_salary: number;
  phone: string;
  attendance_status?: AttendanceStatus | null;
  check_in?: string | null;
  check_out?: string | null;
  advance_balance: string | number;
  net_due: string | number;
  salary_id?: number | null;
  net_salary?: number | null;
  joining_date?: string;
  salary_type?: string;
  attendance_list: AttendanceEntry[];
  advances: AdvanceEntry[];
}

type DrawerType = 'edit' | 'attendance' | 'advance' | 'pay' | 'add' | 'holidays';

/* ================= COMPONENTS ================= */

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
      // Adjusting to handle both array response and paginated response
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
    <div className="flex flex-col h-screen bg-white font-sans text-slate-900 overflow-hidden">
      
      {/* ───────────────── HEADER ───────────────── */}
      <header className="border-b border-slate-200 bg-slate-50/50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-900 text-white shadow-sm">
            <Users2 size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight uppercase">HR & Payroll System</h1>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Enterprise Resource Control</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group mr-2">
             <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
             <input 
                placeholder="Find staff..." 
                className="w-48 rounded border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs outline-none focus:border-indigo-500 focus:w-64 transition-all"
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
             />
          </div>
          <button onClick={() => { setDrawerType('holidays'); setSelectedEmp(null); setIsDrawerOpen(true); }} className="flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-all">
            <Calendar size={14} /> Holidays
          </button>
          <button 
            onClick={() => { 
              setSelectedEmp({ id: 0, name: '', phone: '', is_active: true, base_salary: 0, advance_balance: 0, net_due: 0, attendance_list: [], advances: [] } as Employee); 
              setDrawerType('add'); 
              setIsDrawerOpen(true); 
            }} 
            className="flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-[10px] font-black uppercase text-white hover:bg-indigo-700 transition-all shadow-sm"
          >
            <UserPlus size={14} /> Add Member
          </button>
        </div>
      </header>

      {/* ───────────────── SUB-NAV & STATS ───────────────── */}
      <div className="border-b border-slate-200 px-6 py-2 flex items-center justify-between bg-white">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded">
          <TabBtn active={activeTab === 'directory'} onClick={() => setActiveTab('directory')} label="Directory" icon={<Briefcase size={12}/>} />
          <TabBtn active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} label="Attendance" icon={<Clock size={12}/>} />
          <TabBtn active={activeTab === 'payroll'} onClick={() => setActiveTab('payroll')} label="Payroll" icon={<Wallet size={12}/>} />
        </div>

        {activeTab === 'attendance' && (
          <div className="flex gap-4">
            <StatChip label="Present" count={stats.present} color="emerald" />
            <StatChip label="Absent" count={stats.absent} color="red" />
            <StatChip label="Holidays" count={stats.holidays} color="indigo" />
          </div>
        )}
      </div>

      {/* ───────────────── DATA GRID ───────────────── */}
      <main className="flex-1 overflow-auto bg-white">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_rgba(0,0,0,0.1)]">
            <tr>
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
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={10} className="py-20 text-center text-slate-400 text-xs font-bold animate-pulse uppercase">Synchronizing Records...</td></tr>
            ) : filteredEmployees.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50/50 group transition-colors">
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded border border-slate-200 bg-white flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm">
                      {e.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 leading-none mb-1">{e.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{e.phone}</span>
                    </div>
                  </div>
                </Td>

                {activeTab === 'directory' && (
                  <>
                    <Td><span className="text-xs font-bold text-slate-700">{e.designation ?? '—'}</span></Td>
                    <Td><span className="text-xs font-medium text-slate-500">{e.department}</span></Td>
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
                      <span className={clsx(
                        "px-2 py-0.5 rounded border text-[9px] font-black uppercase tracking-widest",
                        e.attendance_status === 'present' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        e.attendance_status ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                      )}>
                        {e.attendance_status || 'NOT MARKED'}
                      </span>
                    </Td>
                    <Td>
                       <button onClick={() => { setSelectedEmp(e); setIsCalendarOpen(true); }} className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">Logs</button>
                    </Td>
                  </>
                )}

                {activeTab === 'payroll' && (
                  <>
                    <Td className="text-right text-xs font-bold">₹{Number(e.base_salary).toLocaleString()}</Td>
                    <Td className="text-right text-xs font-bold text-red-500">₹{Number(e.advance_balance ?? 0).toLocaleString()}</Td>
                    <Td className="text-right text-xs font-black text-slate-900">₹{(Number(e.base_salary) - Number(e.advance_balance ?? 0)).toLocaleString()}</Td>
                  </>
                )}

                <Td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {activeTab === 'directory' && (
                      <button onClick={() => openAction('edit', e)} className="px-3 py-1.5 rounded text-[10px] font-black bg-slate-100 text-slate-600 hover:bg-slate-200 uppercase tracking-wider">Manage</button>
                    )}
                    {activeTab === 'attendance' && (
                      <button onClick={() => openAction('attendance', e)} className="px-3 py-1.5 rounded text-[10px] font-black bg-indigo-600 text-white hover:bg-indigo-700 uppercase tracking-wider shadow-sm">Mark</button>
                    )}
                    {activeTab === 'payroll' && (
                      <div className="flex gap-1">
                        <button onClick={() => openAction('advance', e)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-all border border-transparent hover:border-amber-100" title="Advance"><HandCoins size={14}/></button>
                        <button onClick={() => openAction('pay', e)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-all border border-transparent hover:border-emerald-100" title="Pay"><IndianRupee size={14}/></button>
                      </div>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {/* ───────────────── MODALS ───────────────── */}
      {isCalendarOpen && selectedEmp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCalendarOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Attendance Trail</h3>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{selectedEmp.name}</p>
              </div>
              <button onClick={() => setIsCalendarOpen(false)} className="p-2 hover:bg-white rounded-lg text-slate-400 border border-transparent hover:border-slate-200 transition-all"><X size={18} /></button>
            </div>
            <div className="p-4 max-h-[50vh] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 sticky top-0">
                  <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="pb-2 px-2">Date</th>
                    <th className="pb-2 px-2">Status</th>
                    <th className="pb-2 px-2">Check-In</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {selectedEmp.attendance_list?.map((log, idx) => (
                    <tr key={idx} className="text-[11px] hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-2 font-bold text-slate-700">{log.date}</td>
                      <td className="py-3 px-2">
                         <span className={clsx("px-2 py-0.5 rounded text-[8px] font-black uppercase", log.status === 'present' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600')}>
                            {log.status}
                         </span>
                      </td>
                      <td className="py-3 px-2 text-slate-500">{formatTime(log.check_in)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────── DRAWER ───────────────── */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" onClick={() => setIsDrawerOpen(false)} />
          <aside className="relative w-full max-w-[450px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
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

interface EmployeeDrawerProps {
  type: DrawerType;
  employee: Employee | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
}

interface CreateEmloyee {
  employee_code: string;
  name: string;
  email?: string;
  phone?: string;
  designation?: string;
  department?: string;
  joining_date: string;
  salary_type: 'monthly' | 'daily';
  base_salary: number;
}

function EmployeeDrawer({ type, employee, onClose, onSaved }: EmployeeDrawerProps) {
  const [amount, setAmount] = useState<number>(0);
  const [remarks, setRemarks] = useState<string>('');
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [holidayData, setHolidayData] = useState<{name: string, date: string}>({ name: '', date: new Date().toISOString().slice(0, 10) });
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
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
    salary_type: 'Fixed', 
    is_active: true 
  });

  useEffect(() => {
    if ((type === 'edit' || type === 'advance' || type === 'pay' || type === 'attendance') && employee) {
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
      if (type === 'add') await createEmployee(formData as CreateEmloyee);
      if (type === 'edit' && employee) await updateEmployee(employee.id, formData as any);
      if (type === 'holidays') await createHoliday(holidayData);
      if (type === 'attendance' && employee) await markAttendance({ employee_id: employee.id, date: selectedDate, status: selectedStatus });
      if (type === 'advance' && employee) await createAdvance({ employee_id: employee.id, amount, remarks });
      if (type === 'pay' && employee) {
        await paySalary({ 
          employee_id: employee.id, 
          salary_id: employee.salary_id ?? 0, 
          amount: amount || (Number(employee.net_salary) ?? Number(employee.base_salary)), 
          payment_date: new Date().toISOString().slice(0, 10), 
          mode: 'bank' 
        });
      }
      await onSaved(); 
      onClose();
    } catch(e) { 
      console.error(e); 
    } finally { 
      setLoadingAction(false); 
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 mb-1">{type} Operation</h2>
          <p className="text-lg font-bold text-slate-900">{employee?.name || (type === 'holidays' ? 'Global Schedule' : 'New Record')}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white rounded-lg text-slate-400 border border-transparent hover:border-slate-200 transition-all"><X size={18} /></button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {(type === 'edit' || type === 'add') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded bg-indigo-50 border border-indigo-100 mb-4">
              <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">Operational Status</span>
              <button 
                onClick={() => setFormData({...formData, is_active: !formData.is_active})} 
                className={clsx("relative inline-flex h-5 w-10 items-center rounded-full transition-colors", formData.is_active ? "bg-indigo-600" : "bg-slate-300")}
              >
                <span className={clsx("inline-block h-3 w-3 transform rounded-full bg-white transition-transform", formData.is_active ? "translate-x-6" : "translate-x-1")} />
              </button>
            </div>
            <InputField label="Full Name" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Email Address" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
              <InputField label="Phone" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Designation" value={formData.designation} onChange={(v) => setFormData({...formData, designation: v})} />
              <InputField label="Department" value={formData.department} onChange={(v) => setFormData({...formData, department: v})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <InputField label="Base Salary" type="number" value={formData.base_salary} onChange={(v) => setFormData({...formData, base_salary: +v})} />
               <InputField label="Joining Date" type="date" value={formData.joining_date} onChange={(v) => setFormData({...formData, joining_date: v})} />
            </div>
          </div>
        )}

        {type === 'attendance' && (
          <div className="space-y-6">
             <div className="p-3 bg-amber-50 border border-amber-100 rounded text-[10px] font-bold text-amber-700 flex items-center gap-2 italic">
               <Info size={14}/> Manual attendance overrides automated system logs.
             </div>
             <InputField label="Attendance Date" type="date" value={selectedDate} onChange={(v) => setSelectedDate(v)} />
             <div className="grid grid-cols-2 gap-2">
                {(['present', 'absent', 'half_day', 'leave'] as const).map(s => (
                  <button 
                    key={s} 
                    onClick={() => setSelectedStatus(s)}
                    className={clsx(
                      "py-4 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all",
                      selectedStatus === s 
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-[1.02]" 
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
             </div>
             <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-3">
                <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold text-amber-700 leading-relaxed uppercase">
                  Marking as <span className="underline">{selectedStatus.replace('_',' ')}</span> for <span className="underline">{selectedDate}</span>.
                </p>
            </div>
          </div>
        )}

        {type === 'advance' && employee && (
          <div className="space-y-6">
            <div className="py-6 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center">
               <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Outstanding Balance</span>
               <span className="text-2xl font-black text-red-600">₹{Number(employee.advance_balance).toLocaleString() || 0}</span>
            </div>
            <InputField label="Disburse Amount (₹)" type="number" value={amount} onChange={(v) => setAmount(+v)} placeholder="0.00" />
            <InputField label="Reason / Remarks" value={remarks} onChange={(v) => setRemarks(v)} placeholder="Purpose of advance..." />
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
          <div className="space-y-6">
             <div className="p-6 bg-slate-900 rounded-lg text-white shadow-xl shadow-slate-200">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Payout Analysis</p>
                <div className="space-y-2 text-sm">
                   <div className="flex justify-between opacity-80"><span>Base Salary</span> <span>₹{Number(employee.base_salary).toLocaleString()}</span></div>
                   <div className="flex justify-between text-red-400"><span>Advance Recovery</span> <span>- ₹{Number(employee.advance_balance).toLocaleString()}</span></div>
                   <div className="border-t border-slate-700 pt-3 flex justify-between font-black text-indigo-400 text-lg">
                      <span>NET PAYABLE</span> 
                      <span>₹{Number(employee.net_due).toLocaleString()}</span>
                   </div>
                </div>
             </div>
             <div className="space-y-4">
                <InputField label="Payment Amount Override (Optional)" type="number" value={amount} onChange={(v) => setAmount(+v)} placeholder={String(employee.net_due)} />
                <button onClick={handleAction} className="w-full py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">Disburse Funds</button>
             </div>
          </div>
        )}

        {type === 'holidays' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 space-y-4">
              <h3 className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2"><Plus size={14}/> Define Holiday</h3>
              <InputField label="Holiday Name" value={holidayData.name} onChange={(v) => setHolidayData({...holidayData, name: v})} placeholder="e.g. Annual Day" />
              <InputField label="Date" type="date" value={holidayData.date} onChange={(v) => setHolidayData({...holidayData, date: v})} />
            </div>

            <div className="space-y-3">
               <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Global Schedule</h3>
               <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/30">
                  {['Republic Day (Jan 26)', 'Independence Day (Aug 15)', 'Christmas (Dec 25)'].map((h, i) => (
                    <div key={i} className="flex justify-between p-3 text-[11px]">
                       <span className="font-bold text-slate-700 uppercase">{h.split('(')[0]}</span>
                       <span className="text-slate-400 font-medium italic">({h.split('(')[1]}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
        <button onClick={onClose} className="flex-1 px-4 py-3 rounded border border-slate-200 bg-white text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-all">Discard</button>
        <button 
          onClick={handleAction} 
          disabled={loadingAction} 
          className="flex-1 px-4 py-3 rounded bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
        >
          {loadingAction ? 'Syncing...' : 'Confirm Action'}
        </button>
      </div>
    </div>
  );
}

/* ================= ATOMIC UI HELPERS ================= */

interface TabBtnProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: ReactNode;
}

function TabBtn({ active, onClick, label, icon }: TabBtnProps) {
  return (
    <button onClick={onClick} className={clsx("flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-wider transition-all", active ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-600")}>
      {icon} {label}
    </button>
  );
}

interface StatChipProps {
  label: string;
  count: number;
  color: 'emerald' | 'red' | 'indigo';
}

function StatChip({ label, count, color }: StatChipProps) {
  const c = { 
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100", 
    red: "bg-red-50 text-red-600 border-red-100", 
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100" 
  };
  return (
    <div className={clsx("flex items-center gap-2 px-3 py-1 rounded border text-[10px] font-black uppercase", c[color])}>
      {label}: <span className="text-xs">{count}</span>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
}

function InputField({ label, value, onChange, type = "text", placeholder = "" }: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value} 
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} 
        className="w-full rounded border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 bg-white" 
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const active = status === 'Active';
  return (
    <div className={clsx("flex items-center gap-1.5 px-2 py-0.5 rounded border w-fit", active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200")}>
      <div className={clsx("h-1 w-1 rounded-full", active ? "bg-emerald-500" : "bg-slate-300")} />
      <span className="text-[9px] font-black uppercase">{status}</span>
    </div>
  );
}

const formatTime = (iso: string | null | undefined) => iso ? new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : "--:--";

const Th = ({ children, className }: { children: ReactNode, className?: string }) => (
  <th className={clsx("px-6 py-3 text-left text-[9px] font-black uppercase text-slate-400 tracking-widest", className)}>
    {children}
  </th>
);

const Td = ({ children, className }: { children: ReactNode, className?: string }) => (
  <td className={clsx("px-6 py-4 text-xs font-medium", className)}>
    {children}
  </td>
);