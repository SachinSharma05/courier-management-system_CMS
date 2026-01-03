import { Injectable } from "@nestjs/common";
import { PaySalaryDto } from "../dto/pay-salary.dto";
import { db } from "../../../db";
import { employeeAdvances, employeeSalary, employeeSalaryPayments } from "../../../db/schema";
import { eq, and } from "drizzle-orm";

@Injectable()
export class SalaryPaymentsService {

  async pay(dto: PaySalaryDto) {
    // 1️⃣ Fetch salary snapshot
    const [salary] = await db
      .select()
      .from(employeeSalary)
      .where(eq(employeeSalary.id, dto.salary_id));

    if (!salary) {
      throw new Error('Salary record not found');
    }

    // 2️⃣ Calculate already paid
    const payments = await db
      .select()
      .from(employeeSalaryPayments)
      .where(eq(employeeSalaryPayments.salary_id, salary.id));

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    if (totalPaid + dto.amount > salary.net_salary) {
      throw new Error('Payment exceeds net salary');
    }

    // 3️⃣ Auto-settle advances
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

      const settleAmount = Math.min(adv.amount, remaining);

      await db
        .update(employeeAdvances)
        .set({ is_settled: true })
        .where(eq(employeeAdvances.id, adv.id));

      remaining -= settleAmount;
    }

    // 4️⃣ Record salary payment
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

    // 5️⃣ Lock salary if fully paid
    if (totalPaid + dto.amount === salary.net_salary) {
      await db
        .update(employeeSalary)
        .set({ is_locked: true })
        .where(eq(employeeSalary.id, salary.id));
    }

    return payment;
  }
}