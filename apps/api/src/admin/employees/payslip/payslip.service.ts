import { Injectable, BadRequestException } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { and, eq } from 'drizzle-orm';
import { db } from '../../../db';
import {
  employees,
  employeeSalary,
  employeeSalaryPayments,
  employeeAdvances,
} from '../../../db/schema';
import { GeneratePayslipDto } from '../dto/generate-payslip.dto';

@Injectable()
export class PayslipService {
  async generate(dto: GeneratePayslipDto): Promise<Buffer> {
    const [emp] = await db
      .select()
      .from(employees)
      .where(eq(employees.id, dto.employee_id));

    if (!emp) throw new BadRequestException('Employee not found');

    const [salary] = await db
      .select()
      .from(employeeSalary)
      .where(
        and(
          eq(employeeSalary.employee_id, dto.employee_id),
          eq(employeeSalary.month, dto.month),
        ),
      );

    if (!salary)
      throw new BadRequestException('Salary not generated for this month');

    const payments = await db
      .select()
      .from(employeeSalaryPayments)
      .where(eq(employeeSalaryPayments.salary_id, salary.id));

    const advances = await db
      .select()
      .from(employeeAdvances)
      .where(
        and(
          eq(employeeAdvances.employee_id, emp.id),
          eq(employeeAdvances.is_settled, true),
        ),
      );

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => null);

    doc.fontSize(18).text('PAYSLIP', { align: 'center' });
    doc.moveDown();

    doc.fontSize(10).text(`Employee: ${emp.name}`);
    doc.text(`Month: ${dto.month}`);
    doc.moveDown();

    doc.text(`Gross Salary: ₹${salary.gross_salary}`);
    doc.text(`Deductions: ₹${salary.deductions}`);
    doc.text(`Net Salary: ₹${salary.net_salary}`);
    doc.moveDown();

    if (advances.length > 0) {
      const advTotal = advances.reduce((s, a) => s + a.amount, 0);
      doc.text(`Advance Adjusted: ₹${advTotal}`);
    }

    if (payments.length > 0) {
      payments.forEach(p => {
        doc.text(`Paid ₹${p.amount} on ${p.payment_date}`);
      });
    }

    doc.end();

    return Buffer.concat(buffers);
  }
}