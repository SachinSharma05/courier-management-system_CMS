import { api } from '@/lib/api/axios';

/* ================= EMPLOYEES ================= */

export async function getEmployees() {
  const res = await api.get('/admin/employees');
  return res.data;
}

export async function getEmployeesOverview() {
  const res = await api.get('/admin/employees/overview');
  return res.data;
}

export const deleteEmployee = async (id: number) => {
  const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
  return res.json();
};
/* ================= ATTENDANCE ================= */
export async function getAttendance() {
  const res = await api.get('/admin/employees/attendance');
  return res.data;
}

export async function markAttendance(payload: {
  employee_id: number;
  date: string;
  status: 'present' | 'absent' | 'half_day' | 'leave';
}) {
  const res = await api.post('/admin/employees/attendance/mark', payload);
  return res.data;
}

/* ================= ADVANCES ================= */
export async function getAdvances() {
  const res = await api.get('/admin/employees/advances');
  return res.data;
}

export async function createAdvance(payload: {
  employee_id: number;
  amount: number;
  remarks?: string;
}) {
  const res = await api.post('/admin/employees/advances', payload);
  return res.data;
}

/* ================= SALARY ================= */

export async function generateSalary(payload: {
  employee_id: number;
  month: string;
}) {
  const res = await api.post('/admin/employees/salary/generate', payload);
  return res.data;
}

export async function paySalary(payload: {
  employee_id: number;
  salary_id: number;
  amount: number;
  payment_date: string;
  mode: 'cash' | 'bank' | 'upi';
}) {
  const res = await api.post('/admin/employees/salary-payments/payments', payload);
  return res.data;
}

/* ================= PAYSLIP ================= */

export async function downloadPayslip(payload: {
  employee_id: number;
  month: string;
}) {
  return api.post('/admin/employees/payslip/generate', payload, {
    responseType: 'blob',
  });
}

export async function createEmployee(payload: {
  employee_code: string;
  name: string;
  email?: string;
  phone?: string;
  designation?: string;
  department?: string;
  joining_date: string;
  salary_type: 'monthly' | 'daily';
  base_salary: number;
}) {
  const res = await api.post('/admin/employees', payload);
  return res.data;
}

export async function getHolidays() {
  const res = await api.get('/admin/employees/holidays');
  return res.data;
}

export async function createHoliday(payload: {
  date: string;
  name: string;
  is_optional?: boolean;
}) {
  const res = await api.post('/admin/employees/holidays', payload);
  return res.data;
}

export async function updateEmployee(
  id: number, // Pass ID separately
  payload: {
    employee_code?: string;
    name?: string;
    email?: string;
    phone?: string;
    designation?: string;
    department?: string;
    joining_date?: string;
    salary_type?: 'Monthly' | 'Daily' | 'Weekly';
    base_salary?: number;
  }
) {
  const res = await api.patch(`/admin/employees/${id}`, payload);
  return res.data;
}