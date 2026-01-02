import PDFDocument from 'pdfkit';
import { Injectable } from '@nestjs/common';
import { GeneratePayslipDto } from '../dto/generate-payslip.dto';
import { db } from '../../../db';
import { employeeAttendance, employees, employeeSalary, employeeSalaryPayments } from '../../../db/schema';
import { eq, like, and } from 'drizzle-orm';

@Injectable()
export class PayslipService {

  async generate(dto: GeneratePayslipDto): Promise<Buffer> {
    const employee = await this.getEmployee(dto.employee_id);
    const salary = await this.getSalary(dto.employee_id, dto.month);
    const attendance = await this.getAttendance(dto.employee_id, dto.month);
    const payments = await this.getPayments(salary.id);

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => null);

    /* ===== HEADER ===== */
    doc.fontSize(18).text('PAYSLIP', { align: 'center' });
    doc.moveDown();

    /* ===== COMPANY ===== */
    doc.fontSize(10).text('Your Company Name');
    doc.text(`Payslip for: ${dto.month}`);
    doc.moveDown();

    /* ===== EMPLOYEE ===== */
    doc.fontSize(12).text('Employee Details', { underline: true });
    doc.fontSize(10);
    doc.text(`Name: ${employee.name}`);
    doc.text(`Employee Code: ${employee.employee_code}`);
    doc.text(`Designation: ${employee.designation ?? '-'}`);
    doc.moveDown();

    /* ===== ATTENDANCE ===== */
    doc.fontSize(12).text('Attendance Summary', { underline: true });
    doc.fontSize(10);
    doc.text(`Payable Days: ${attendance.payableDays}`);
    doc.text(`Leaves Taken: ${attendance.leaveDays}`);
    doc.moveDown();

    /* ===== SALARY ===== */
    doc.fontSize(12).text('Salary Details', { underline: true });
    doc.fontSize(10);
    doc.text(`Gross Salary: ₹${salary.gross_salary}`);
    doc.text(`Deductions: ₹${salary.deductions}`);
    doc.text(`Net Salary: ₹${salary.net_salary}`);
    doc.moveDown();

    /* ===== PAYMENTS ===== */
    doc.fontSize(12).text('Payment Summary', { underline: true });
    doc.fontSize(10);

    payments.forEach(p => {
      doc.text(`₹${p.amount} paid on ${p.payment_date} (${p.mode})`);
    });

    doc.moveDown();
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`);

    doc.end();

    return Buffer.concat(buffers);
  }

  /* ===== Helpers ===== */

  private async getEmployee(employee_id: number) {
    const [emp] = await db.select().from(employees).where(eq(employees.id, employee_id));
    return emp;
  }

  private async getSalary(employee_id: number, month: string) {
    const [salary] = await db
      .select()
      .from(employeeSalary)
      .where(
        and(
          eq(employeeSalary.employee_id, employee_id),
          eq(employeeSalary.month, month),
        ),
      );

    if (!salary) throw new Error('Salary not generated');
    return salary;
  }

  private async getAttendance(employee_id: number, month: string) {
    const rows = await db
      .select()
      .from(employeeAttendance)
      .where(
        and(
          eq(employeeAttendance.employee_id, employee_id),
          like(employeeAttendance.date, `${month}%`),
        ),
      );

    let payableDays = 0;
    let leaveDays = 0;

    rows.forEach(r => {
      if (r.status === 'present') payableDays += 1;
      if (r.status === 'half_day') payableDays += 0.5;
      if (r.status === 'leave') leaveDays += 1;
    });

    return { payableDays, leaveDays };
  }

  private async getPayments(salary_id: number) {
    return db
      .select()
      .from(employeeSalaryPayments)
      .where(eq(employeeSalaryPayments.salary_id, salary_id));
  }
}