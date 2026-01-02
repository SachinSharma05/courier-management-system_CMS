import { Injectable } from "@nestjs/common";
import { ApproveLeaveDto } from "../dto/approve-leave.dto";
import { RejectLeaveDto } from "../dto/reject-leave.dto";
import { ApplyLeaveDto } from "../dto/apply-leave.dto";
import { db } from '../../../db';
import { employeeLeaves } from '../../../db/schema';
import { eq } from "drizzle-orm";

@Injectable()
export class LeavesService {
  /* ========== APPLY ========== */

  async apply(dto: ApplyLeaveDto) {
    return db
      .insert(employeeLeaves)
      .values({
        employee_id: dto.employee_id,
        from_date: dto.from_date,
        to_date: dto.to_date,
        type: dto.type,
        status: 'pending',
        reason: dto.reason,
      })
      .returning();
  }

  /* ========== ADMIN ========== */

  findAll() {
    return db.select().from(employeeLeaves);
  }

  async approve(id: number, dto: ApproveLeaveDto) {
    return db
      .update(employeeLeaves)
      .set({
        status: 'approved',
        reason: dto.remarks,
      })
      .where(eq(employeeLeaves.id, id))
      .returning();
  }

  async reject(id: number, dto: RejectLeaveDto) {
    return db
      .update(employeeLeaves)
      .set({
        status: 'rejected',
        reason: dto.remarks,
      })
      .where(eq(employeeLeaves.id, id))
      .returning();
  }
}
