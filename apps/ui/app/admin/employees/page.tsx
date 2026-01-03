'use client';

import { 
  Users2, UserPlus, Search, Briefcase, Building, MoreHorizontal,
  Wallet, Headphones, Settings2,
  Calendar, IndianRupee, HandCoins, PlaneTakeoff, Clock, 
  X, Save, Download, CheckCircle2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { 
  getEmployeesOverview, 
  markAttendance, 
  createAdvance, 
  paySalary, 
  downloadPayslip,
  createEmployee,
  createHoliday,
  updateEmployee } from '@/hooks/useEmployees';

/* ================= TYPES ================= */
type Employee = {
  id: number;
  name: string;
  email?: string;
  designation?: string;
  department?: string;
  is_active: boolean;
  base_salary: number;
  attendance_status: string;
  check_in: string;
  check_out: string;
  advance_balance?: number;
  net_due?: number;
};

/* ================= PAGE ================= */
export default function EmployeesPage() {
  const [activeTab, setActiveTab] = useState<'directory' | 'attendance' | 'payroll'>('directory');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'edit' | 'attendance' | 'advance' | 'pay' | 'add' | 'holidays'>('add');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  /* ================= LOAD ================= */
  const loadEmployees = async () => {
  setLoading(true);
    try {
      const data = await getEmployeesOverview();
      
      // Ensure 'data' is an array before setting it
      if (Array.isArray(data)) {
        setEmployees(data);
      } else if (data && typeof data === 'object' && 'rows' in data) {
        // Handle the case where the raw result object was returned
        setEmployees(data.rows as Employee[]);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error("Failed to load employees", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadEmployees();
  }, []);

  const openAction = ( type: 'edit' | 'attendance' | 'advance' | 'pay', emp: Employee) => {
    setDrawerType(type);
    setSelectedEmp(emp);
    setIsDrawerOpen(true);
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 relative">
      
      {/* ───────────────── DRAWER COMPONENT ───────────────── */}
      {isDrawerOpen && selectedEmp && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white shadow-2xl border-l border-slate-100 animate-in slide-in-from-right duration-300">
            <EmployeeDrawer 
              type={drawerType} 
              employee={selectedEmp} 
              onClose={() => setIsDrawerOpen(false)} 
              onSaved={loadEmployees}
            />
          </div>
        </div>
      )}

      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-cyan-600 flex items-center justify-center text-white shadow-lg shadow-cyan-200">
            <Users2 size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Directory</h1>
            <p className="text-sm text-slate-500 font-medium">Manage internal logistics staff and operational roles.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setDrawerType('holidays'); setIsDrawerOpen(true); }}
            className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            <Calendar size={16} /> Holidays
          </button>
  
          <button 
            onClick={() => { 
              setSelectedEmp({ id: 0, name: '', is_active: true, base_salary: 0 }); // Empty state for new staff
              setDrawerType('add'); 
              setIsDrawerOpen(true); 
            }}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-md active:scale-95"
          >
            <UserPlus size={18} /> Add Staff Member
          </button>
        </div>
      </div>

      {/* ───────────────── TABS (NEW) ───────────────── */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit border border-slate-200">
        <TabBtn active={activeTab === 'directory'} onClick={() => setActiveTab('directory')} label="Directory" icon={<Users2 size={14}/>} />
        <TabBtn active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} label="Attendance" icon={<Clock size={14}/>} />
        <TabBtn active={activeTab === 'payroll'} onClick={() => setActiveTab('payroll')} label="Payroll & Advance" icon={<Wallet size={14}/>} />
      </div>

      {/* ───────────────── QUICK DEPT SUMMARY ───────────────── */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DeptStat label="Operations" count={14} color="blue" icon={<Briefcase size={16}/>} />
        <DeptStat label="Support" count={8} color="green" icon={<Headphones size={16}/>} />
        <DeptStat label="Finance" count={4} color="amber" icon={<Wallet size={16}/>} />
        <DeptStat label="On Leave" count={2} color="purple" icon={<PlaneTakeoff size={16}/>} />
      </div> */}

      {/* ───────────────── FILTERS ───────────────── */}
      {/* <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            placeholder={`Search staff by name or email...`}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/40 transition-all"
          />
        </div>
        <select className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 outline-none bg-white hover:border-slate-300">
          <option>All Departments</option>
          <option>Operations</option>
          <option>Customer Support</option>
          <option>Finance</option>
        </select>
        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all border border-slate-100">
          <Settings2 size={18} />
        </button>
      </div> */}

      {/* ───────────────── EMPLOYEES TABLE ───────────────── */}
      <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
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
                    <Th>Status Today</Th>
                    <Th>Check-In</Th>
                    <Th>Leaves</Th>
                  </>
                )}
                {activeTab === 'payroll' && (
                  <>
                    <Th>Base Salary</Th>
                    <Th>Advance Taken</Th>
                    <Th>Net Due</Th>
                  </>
                )}
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={6} className="p-10 text-center text-slate-400 font-medium">Loading data...</td></tr>
              ) : employees.map((e) => (
                <tr key={e.id} className="group hover:bg-slate-50/80 transition-colors">
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-700 font-black text-xs border border-white shadow-sm shrink-0">
                        {e.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-tight">{e.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{e.email}</span>
                      </div>
                    </div>
                  </Td>

                  {activeTab === 'directory' && (
                    <>
                      <Td><span className="text-xs font-bold text-slate-700">{e.designation ?? '—'}</span></Td>
                      <Td>
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-xs">
                          <Building size={14} className="text-slate-300" /> {e.department}
                        </div>
                      </Td>
                      <Td><StatusBadge status={e.is_active ? 'Active' : 'Disabled'} /></Td>
                    </>
                  )}

                  {activeTab === 'attendance' && (
                    <>
                      <Td>
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black border ${
                          e.attendance_status === 'present' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          e.attendance_status ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400'
                        }`}>
                          {e.attendance_status?.toUpperCase() || 'NOT MARKED'}
                        </span>
                      </Td>
                      <Td><span className="text-xs font-medium text-slate-500">{e.check_in ?? "-- : --"}</span></Td>
                      <Td><span className="text-xs font-bold text-slate-700">{e.check_out ?? "-- : --"}</span></Td>
                    </>
                  )}

                  {activeTab === 'payroll' && (
                    <>
                      <Td>
                        <span className="text-xs font-bold text-slate-900">
                          ₹{Number(e.base_salary).toLocaleString()}
                        </span>
                      </Td>
                      <Td>
                        <span className="text-xs font-bold text-red-500">
                          ₹{Number(e.advance_balance ?? 0).toLocaleString()}
                        </span>
                      </Td>
                      <Td>
                        <span className="text-xs font-black text-slate-900 underline decoration-cyan-400 underline-offset-4">
                          {/* Just calculate, don't assign with '=' */}
                          ₹{(Number(e.base_salary) - Number(e.advance_balance ?? 0)).toLocaleString()}
                        </span>
                      </Td>
                    </>
                  )}

                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {activeTab === 'directory' && (
                        <button onClick={() => openAction('edit', e)} className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200">EDIT</button>
                      )}
                      {activeTab === 'attendance' && (
                        <button onClick={() => openAction('attendance', e)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-cyan-600 text-white hover:bg-cyan-700">
                          <Clock size={12}/> MARK
                        </button>
                      )}
                      {activeTab === 'payroll' && (
                        <div className="flex gap-1">
                          <button onClick={() => openAction('advance', e)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Add Advance"><HandCoins size={16}/></button>
                          <button onClick={() => openAction('pay', e)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Process Pay"><IndianRupee size={16}/></button>
                        </div>
                      )}
                      <button className="p-2 text-slate-300 hover:text-slate-600"><MoreHorizontal size={18} /></button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── DRAWER CONTENT ───────────────── */
const ATTENDANCE_MAP = {
  Present: 'present',
  Absent: 'absent',
  'Half Day': 'half_day',
  Holiday: 'leave',
} as const;

function EmployeeDrawer({
  type,
  employee,
  onClose,
  onSaved,
}: {
  type: 'edit' | 'attendance' | 'advance' | 'pay' | 'add' | 'holidays';
  employee: Employee;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [amount, setAmount] = useState<number>(0);
  const [remarks, setRemarks] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [holidayData, setHolidayData] = useState({ name: '', date: '' });

  // State for Add Employee Form
  const [formData, setFormData] = useState({
    employee_code: '',
    name: '',
    email: '',
    designation: 'Staff',
    phone: '',
    department: 'Operations',
    base_salary: 0,
    joining_date: new Date().toISOString().slice(0, 10),
    salary_type: 'Fixed'
  });

  const submitAddEmployee = async () => {
    setLoadingAction(true);
    await createEmployee(formData); 
    await onSaved(); // Refresh the list
    setLoadingAction(false);
    onClose();
  };

  const submitHoliday = async () => {
    setLoadingAction(true);
    await createHoliday(holidayData);
    setLoadingAction(false);
    onClose();
  };

  const submitAttendance = async (label: keyof typeof ATTENDANCE_MAP) => {
    setLoadingAction(true);
    await markAttendance({
      employee_id: employee.id,
      date: new Date().toISOString().slice(0, 10),
      status: ATTENDANCE_MAP[label],
    });
    await onSaved();
    setLoadingAction(false);
    onClose();
  };

  const submitAdvance = async () => {
    setLoadingAction(true);
    await createAdvance({ employee_id: employee.id, amount, remarks });
    await onSaved();
    setLoadingAction(false);
    onClose();
  };

  const submitPay = async () => {
    setLoadingAction(true);
    await paySalary({
      employee_id: employee.id,
      salary_id: 0, // latest salary snapshot
      amount: amount || (employee.net_due ?? employee.base_salary),
      payment_date: new Date().toISOString().slice(0, 10),
      mode: 'bank',
    });
    await onSaved();
    setLoadingAction(false);
    onClose();
  };

  const submitUpdate = async () => {
    if (!employee?.id) return;

    setLoadingAction(true);
    try {
      // Pass employee.id as the first argument, and the form data as the second
      await updateEmployee(employee.id, formData); 
      
      await onSaved(); 
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoadingAction(false);
    }
  };

  useEffect(() => {
  if (type === 'edit' && employee) {
    setFormData({
      name: employee.name || '',
      email: employee.email || '',
      designation: employee.designation || 'Support',
      phone: (employee as any).phone || '',
      department: employee.department || 'Operations',
      base_salary: employee.base_salary || 0,
      joining_date: (employee as any).joining_date || new Date().toISOString().slice(0, 10),
      salary_type: (employee as any).salary_type || 'Monthly'
    });
  }
}, [employee, type]);

  const download = async () => {
  try{
      const res = await downloadPayslip({
        employee_id: employee.id,
        month: new Date().toISOString().slice(0, 7),
      });

    const url = window.URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Payslip-${employee.name}.pdf`;
      a.click();
    } catch (e) { console.error("Download failed", e); }
  }

  if (!employee) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {type === 'edit' && 'Edit Employee'}
            {type === 'attendance' && 'Daily Attendance'}
            {type === 'advance' && 'New Advance'}
            {type === 'pay' && 'Salary Payment'}
            {type === 'add' && 'Add New Staff'}
            {type === 'holidays' && 'Upcoming Holidays'}
          </h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">{employee.name}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400"><X size={20}/></button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {type === 'edit' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Profile Header for Edit Mode */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-2">
              <div className="h-12 w-12 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-bold">
                {formData.name?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Updating Profile</p>
                <p className="text-sm font-bold text-slate-700">{employee?.employee_code || 'No Code'}</p>
              </div>
            </div>

            {/* Form Fields - Reusing your Add logic but with 'value' binding */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                <input 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm outline-none focus:border-cyan-500 transition-all" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                <input 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm outline-none focus:border-cyan-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</label>
                  <select 
                    value={formData.designation}
                    onChange={e => setFormData({...formData, designation: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm outline-none focus:border-cyan-500 bg-white"
                  >
                    <option>Manager</option>
                    <option>Marketing Executive</option>
                    <option>Computer Operator</option>
                    <option>Delivery Boy</option>
                    <option>Support</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</label>
                  <input 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm outline-none focus:border-cyan-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</label>
                  <select 
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm outline-none focus:border-cyan-500 bg-white"
                  >
                    <option>Operations</option>
                    <option>Support</option>
                    <option>Finance</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Salary</label>
                  <input 
                    type="number"
                    value={formData.base_salary}
                    onChange={e => setFormData({...formData, base_salary: +e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm outline-none focus:border-cyan-500" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {type === 'attendance' && (
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-3">
               {(Object.keys(ATTENDANCE_MAP) as Array<keyof typeof ATTENDANCE_MAP>).map(status => (
                 <button 
                    key={status}
                    disabled={loadingAction}
                    onClick={() => submitAttendance(status)}
                    className="p-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-xs font-bold text-slate-600 hover:border-cyan-500 hover:text-cyan-600 hover:bg-white transition-all">
                   {status}
                 </button>
               ))}
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase">Check-in Note</label>
               <textarea className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500" rows={3} placeholder="Late entry due to..." />
             </div>
          </div>
        )}

        {type === 'advance' && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex justify-between items-center">
               <span className="text-xs font-bold text-amber-700">Current Balance</span>
               <span className="text-sm font-black text-amber-700">₹{employee.advance_balance ?? 0}</span>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Advance Amount (₹)</label>
              <input type="number" onChange={e => setAmount(+e.target.value)} className="w-full px-4 py-4 rounded-xl border-2 border-slate-100 font-bold text-lg outline-none focus:border-cyan-500" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason</label>
              <input onChange={e => setRemarks(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm outline-none focus:border-cyan-500" placeholder="e.g. Medical, Travel" />
            </div>
          </div>
        )}

        {type === 'pay' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
               <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Payout Snapshot</p>
               <div className="space-y-3">
                 <div className="flex justify-between text-sm font-medium"><span>Base Salary</span><span>₹{employee.base_salary}</span></div>
                 <div className="flex justify-between text-sm font-medium text-red-400"><span>Advance Adjustment</span><span>- ₹{employee.advance_balance ?? 0}</span></div>
                 <div className="border-t border-slate-700 pt-3 flex justify-between text-xl font-black text-cyan-400"><span>Net Payable</span><span>₹{(Number(employee.base_salary) - Number(employee.advance_balance ?? 0)).toLocaleString()}</span></div>
               </div>
            </div>
            <button onClick={download} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-cyan-500 hover:text-cyan-600 font-bold text-sm transition-all group">
               <Download size={18} className="group-hover:translate-y-0.5 transition-transform" /> Download Signed Payslip
            </button>
          </div>
        )}

        {/* ADD EMPLOYEE FORM */}
        {type === 'add' && (
          <div className="space-y-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
              <input 
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm outline-none focus:border-cyan-500" 
                placeholder="Enter full name" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
              <input 
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm outline-none focus:border-cyan-500" 
                placeholder="email@company.com" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</label>
                <select 
                  onChange={e => setFormData({...formData, designation: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm outline-none focus:border-cyan-500 bg-white"
                >
                  <option>Manager</option>
                  <option>Marketing Executive</option>
                  <option>Computer Operator</option>
                  <option>Delivery Boy</option>
                  <option>Support</option>
                </select>
              </div>
              <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</label>
              <input 
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm outline-none focus:border-cyan-500" 
                placeholder="+91-9874563210" 
              />
            </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</label>
                <select 
                  onChange={e => setFormData({...formData, department: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm outline-none focus:border-cyan-500 bg-white"
                >
                  <option>Operations</option>
                  <option>Support</option>
                  <option>Finance</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Salary</label>
                <input 
                  type="number"
                  onChange={e => setFormData({...formData, base_salary: +e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm outline-none focus:border-cyan-500" 
                  placeholder="0" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Joining Date</label>
                <input 
                  type="date"
                  value={formData.joining_date}
                  onChange={e => setFormData({...formData, joining_date: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm outline-none focus:border-cyan-500 bg-white" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Salary Type</label>
                <select 
                  onChange={e => setFormData({...formData, salary_type: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm outline-none focus:border-cyan-500 bg-white"
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* HOLIDAYS LIST + ADD NEW */}
        {type === 'holidays' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add Custom Holiday</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Holiday Name"
                  onChange={e => setHolidayData({...holidayData, name: e.target.value})}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-cyan-500"
                />
                <input 
                  type="date"
                  onChange={e => setHolidayData({...holidayData, date: e.target.value})}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-cyan-500"
                />
              </div>
              <button 
                onClick={submitHoliday}
                className="w-full py-2 rounded-xl bg-cyan-50 text-cyan-600 text-[10px] font-black uppercase hover:bg-cyan-100 transition-all"
              >
                + Add to Calendar
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Upcoming Schedule</label>
              <div className="space-y-2">
                {['Republic Day - Jan 26', 'Holi - March 14'].map((h, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-bold text-slate-700">{h.split(' - ')[0]}</span>
                    <span className="text-[10px] font-black text-slate-400">{h.split(' - ')[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
        <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition-all">DISCARD</button>
        <button 
          onClick={() => {
            if (type === 'advance') submitAdvance();
            else if (type === 'pay') submitPay();
            else if (type === 'add') submitAddEmployee();
            else if (type === 'holidays') submitHoliday();
            else if (type === 'edit') submitUpdate();
            else if (type === 'attendance') submitAttendance('Present'); // You must pass a label!
          }}
          disabled={loadingAction}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
          {loadingAction ? 'Processing...' : <><Save size={16} /> CONFIRM</>}
        </button>
      </div>
    </div>
  );
}

/* ───────────────── REUSED COMPONENTS ───────────────── */

function TabBtn({ active, onClick, label, icon }: any) {
  return (
    <button onClick={onClick} className={clsx(
      "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
      active ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
    )}>
      {icon} {label}
    </button>
  );
}

function StatusBadge({ status }: { status: 'Active' | 'Disabled' }) {
  const isActive = status === 'Active';
  return (
    <div className={clsx("flex items-center gap-1.5 px-2 py-1 rounded-full w-fit border", isActive ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-slate-50 border-slate-100 text-slate-400")}>
      <div className={clsx("h-1 w-1 rounded-full", isActive ? "bg-emerald-500" : "bg-slate-300")} />
      <span className="text-[10px] font-bold uppercase tracking-tight">{status}</span>
    </div>
  );
}

// function DeptStat({ label, count, color, icon }: any) {
//   const colors: any = {
//     blue: "text-blue-600 bg-blue-50 border-blue-100",
//     green: "text-emerald-600 bg-emerald-50 border-emerald-100",
//     amber: "text-amber-600 bg-amber-50 border-amber-100",
//     purple: "text-purple-600 bg-purple-50 border-purple-100",
//   };
//   return (
//     <div className={clsx("flex items-center justify-between p-3 rounded-2xl border shadow-sm", colors[color])}>
//       <div className="flex items-center gap-3">
//         <div className="p-2 rounded-lg bg-white/50">{icon}</div>
//         <span className="text-xs font-bold">{label}</span>
//       </div>
//       <span className="text-lg font-black">{count}</span>
//     </div>
//   );
// }

function Th({ children, className }: any) { return <th className={clsx("px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400", className)}>{children}</th>; }
function Td({ children, className }: any) { return <td className={clsx("px-6 py-4 text-sm", className)}>{children}</td>; }