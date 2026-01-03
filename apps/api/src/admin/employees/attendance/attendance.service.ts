import { Injectable } from "@nestjs/common";
import { db } from '../../../db';
import { employeeAttendance } from '../../../db/schema';
import { and, eq } from "drizzle-orm";
import { MarkAttendanceDto } from "../dto/mark-attendance.dto";
import { CheckInDto } from "../dto/check-in.dto";
import { CheckOutDto } from "../dto/check-out.dto";

@Injectable()
export class AttendanceService {
  findAll() {
    return db.select().from(employeeAttendance);
  }

  /* ========== MANUAL ========== */

  async mark(dto: MarkAttendanceDto) {
  return db
    .insert(employeeAttendance)
    .values({
      employee_id: dto.employee_id,
      date: dto.date,
      status: dto.status,
      check_in: dto.check_in ? new Date(dto.check_in) : undefined,
      check_out: dto.check_out ? new Date(dto.check_out) : undefined,
    })
    .onConflictDoUpdate({
      target: [employeeAttendance.employee_id, employeeAttendance.date],
      set: {
        status: dto.status,
        check_in: dto.check_in ? new Date(dto.check_in) : undefined,
        check_out: dto.check_out ? new Date(dto.check_out) : undefined,
      },
    })
    .returning();
  }

  async bulkMark(records: MarkAttendanceDto[]) {
    return Promise.all(records.map(r => this.mark(r)));
  }

  /* ========== AUTO ========== */

  async checkIn(dto: CheckInDto) {
    const date = dto.timestamp.split('T')[0];

    return db
      .insert(employeeAttendance)
      .values({
        employee_id: dto.employee_id,
        date,
        status: 'present',
        check_in: new Date(dto.timestamp),
      })
      .onConflictDoNothing();
  }


  async checkOut(dto: CheckOutDto) {
    const date = dto.timestamp.split('T')[0];

    return db
      .update(employeeAttendance)
      .set({
        check_out: new Date(dto.timestamp),
      })
      .where(
        and(
          eq(employeeAttendance.employee_id, dto.employee_id),
          eq(employeeAttendance.date, date),
        ),
      )
      .returning();
  }
}