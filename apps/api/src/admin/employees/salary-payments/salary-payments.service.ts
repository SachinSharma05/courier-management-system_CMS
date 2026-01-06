import { Injectable, BadRequestException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from '../../../db';
import {
  employeeSalary,
  employeeSalaryPayments,
  employeeAdvances,
} from '../../../db/schema';
import { PaySalaryDto } from '../dto/pay-salary.dto';

@Injectable()
export class SalaryPaymentsService {
  async pay(dto: PaySalaryDto) {
    const [salary] = await db
      .select()
      .from(employeeSalary)
      .where(eq(employeeSalary.id, dto.salary_id));

    if (!salary) {
      throw new BadRequestException('Salary record not found');
    }

    const payments = await db
      .select()
      .from(employeeSalaryPayments)
      .where(eq(employeeSalaryPayments.salary_id, salary.id));

    const totalPaid = payments.reduce((s, p) => s + p.amount, 0);

    if (totalPaid + dto.amount > salary.net_salary) {
      throw new BadRequestException('Payment exceeds net salary');
    }

    // settle advances
    let remaining = dto.amount;

    const advances = await db
      .select()
      .from(employeeAdvances)
      .where(
        and(
          eq(employeeAdvances.employee_id, dto.employee_id),
          eq(employeeAdvances.is_settled, false),
        ),
      )
      .orderBy(employeeAdvances.date);

    for (const adv of advances) {
      if (remaining <= 0) break;

      const settle = Math.min(adv.amount, remaining);

      await db
        .update(employeeAdvances)
        .set({ is_settled: true })
        .where(eq(employeeAdvances.id, adv.id));

      remaining -= settle;
    }

    const [payment] = await db
      .insert(employeeSalaryPayments)
      .values({
        employee_id: dto.employee_id,
        salary_id: dto.salary_id,
        amount: dto.amount,
        payment_date: dto.payment_date,
        mode: dto.mode,
        remarks: dto.remarks,
      })
      .returning();

    if (totalPaid + dto.amount === salary.net_salary) {
      await db
        .update(employeeSalary)
        .set({ is_locked: true })
        .where(eq(employeeSalary.id, salary.id));
    }

    return payment;
  }
}