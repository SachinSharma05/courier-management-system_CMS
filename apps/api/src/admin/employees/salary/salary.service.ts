import { Injectable } from "@nestjs/common";
import { GenerateSalaryDto } from "../dto/generate-salary.dto";
import { db } from '../../../db';
import { employees, employeeLeaves, employeeAttendance, employeeSalary } from '../../../db/schema';
import { eq, like, and } from "drizzle-orm";

@Injectable()
export class SalaryService {
  async generate(dto: GenerateSalaryDto) {
    const [year, month] = dto.month.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();

    const employeeList = dto.employee_id
      ? await db
          .select()
          .from(employees)
          .where(eq(employees.id, dto.employee_id))
      : await db.select().from(employees).where(eq(employees.is_active, true));

    const results = [];

    for (const emp of employeeList) {
      const attendance = await db
        .select()
        .from(employeeAttendance)
        .where(
          and(
            eq(employeeAttendance.employee_id, emp.id),
            like(employeeAttendance.date, `${dto.month}%`)
          )
        );

      const leaves = await db
        .select()
        .from(employeeLeaves)
        .where(
          and(
            eq(employeeLeaves.employee_id, emp.id),
            eq(employeeLeaves.status, 'approved'),
            like(employeeLeaves.from_date, `${dto.month}%`)
          )
        );

      const payableDays = this.calculatePayableDays(attendance, leaves);

      let gross = 0;

      if (emp.salary_type === 'monthly') {
        gross = Math.round((emp.base_salary / daysInMonth) * payableDays);
      }

      if (emp.salary_type === 'daily') {
        gross = emp.base_salary * payableDays;
      }

      const [salary] = await db
        .insert(employeeSalary)
        .values({
          employee_id: emp.id,
          month: dto.month,
          gross_salary: gross,
          deductions: emp.base_salary - gross,
          net_salary: gross,
        })
        .returning();

      results.push(salary);
    }

    return results;
  }

  private calculatePayableDays(attendance: any[], leaves: any[]) {
    let days = 0;

    for (const a of attendance) {
      if (a.status === 'present') days += 1;
      if (a.status === 'half_day') days += 0.5;
      if (a.status === 'leave') days += 1;
    }

    for (const l of leaves) {
      if (l.type === 'unpaid') {
        const diff =
          (new Date(l.to_date).getTime() - new Date(l.from_date).getTime()) /
            (1000 * 60 * 60 * 24) +
          1;
        days -= diff;
      }
    }

    return Math.max(days, 0);
  }
}