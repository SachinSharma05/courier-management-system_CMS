import { Injectable, BadRequestException } from '@nestjs/common';
import { and, eq, gte, lte } from 'drizzle-orm';
import { db } from '../../../db';
import {
  employees,
  employeeAttendance,
  employeeLeaves,
  employeeSalary,
} from '../../../db/schema';
import { GenerateSalaryDto } from '../dto/generate-salary.dto';

@Injectable()
export class SalaryService {
  async generate(dto: GenerateSalaryDto) {
    const [year, month] = dto.month.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const startDate = `${dto.month}-01`;
    const endDate = new Date(year, month, 0).toISOString().slice(0, 10);

    const employeeList = dto.employee_id
      ? await db
          .select()
          .from(employees)
          .where(eq(employees.id, dto.employee_id))
      : await db.select().from(employees).where(eq(employees.is_active, true));

    if (employeeList.length === 0) {
      throw new BadRequestException('Employee not found');
    }

    const results = [];

    for (const emp of employeeList) {
      // prevent duplicate generation
      const existing = await db
        .select()
        .from(employeeSalary)
        .where(
          and(
            eq(employeeSalary.employee_id, emp.id),
            eq(employeeSalary.month, dto.month),
          ),
        );

      if (existing.length > 0) {
        results.push(existing[0]);
        continue;
      }

      const attendance = await db
        .select()
        .from(employeeAttendance)
        .where(
          and(
            eq(employeeAttendance.employee_id, emp.id),
            gte(employeeAttendance.date, startDate),
            lte(employeeAttendance.date, endDate),
          ),
        );

      const leaves = await db
        .select()
        .from(employeeLeaves)
        .where(
          and(
            eq(employeeLeaves.employee_id, emp.id),
            eq(employeeLeaves.status, 'approved'),
            gte(employeeLeaves.from_date, startDate),
            lte(employeeLeaves.to_date, endDate),
          ),
        );

      const perDay = emp.base_salary / daysInMonth;

      const absentDays = attendance.filter(
        a => a.status === 'absent',
      ).length;

      let unpaidLeaveDays = 0;
      for (const l of leaves) {
        if (l.type === 'unpaid') {
          unpaidLeaveDays +=
            (new Date(l.to_date).getTime() -
              new Date(l.from_date).getTime()) /
              (1000 * 60 * 60 * 24) +
            1;
        }
      }

      const deductionDays = absentDays + unpaidLeaveDays;
      const deductions = Math.round(perDay * deductionDays);

      const gross = emp.base_salary;
      const net = gross - deductions;

      const [salary] = await db
        .insert(employeeSalary)
        .values({
          employee_id: emp.id,
          month: dto.month,
          gross_salary: gross,
          deductions,
          net_salary: net,
          is_locked: false,
        })
        .returning();

      results.push(salary);
    }

    return results;
  }
}