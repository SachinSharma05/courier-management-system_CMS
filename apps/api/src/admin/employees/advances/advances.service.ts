import { Injectable } from "@nestjs/common";
import { CreateAdvanceDto } from "../dto/create-advance.dto";
import { db } from "../../../db";
import { employeeAdvances } from "../../../db/schema";
import { eq, and, desc } from "drizzle-orm";

@Injectable()
export class AdvancesService {
  /* ================= CREATE ADVANCE ================= */

  create(dto: CreateAdvanceDto) {
    return db
      .insert(employeeAdvances)
      .values({
        employee_id: dto.employee_id,
        amount: dto.amount,
        date: new Date().toISOString().slice(0, 10),
        remarks: dto.remarks,
        is_settled: false,
      })
      .returning();
  }

  /* ================= LIST ADVANCES ================= */

  findByEmployee(employee_id: number) {
    return db
      .select()
      .from(employeeAdvances)
      .where(eq(employeeAdvances.employee_id, employee_id))
      .orderBy(desc(employeeAdvances.date));
  }

  /* ================= UNSETTLED TOTAL ================= */

  async getOutstanding(employee_id: number) {
    const rows = await db
      .select()
      .from(employeeAdvances)
      .where(
        and(
          eq(employeeAdvances.employee_id, employee_id),
          eq(employeeAdvances.is_settled, false),
        ),
      );

    return rows.reduce((sum, a) => sum + a.amount, 0);
  }
}