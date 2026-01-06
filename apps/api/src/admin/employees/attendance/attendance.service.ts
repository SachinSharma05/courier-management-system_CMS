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
  // 1. Get the real "Now" in the server's context
  const now = new Date();
  
  // 2. Create the Check-In time. 
  // If dto.check_in exists, use it. Otherwise, use 'now'.
  const checkIn = dto.check_in ? new Date(dto.check_in) : now;

  // 3. Create Check-Out (Check-in + 9 hours)
  const checkOut = new Date(checkIn.getTime() + 9 * 60 * 60 * 1000);

  return db
    .insert(employeeAttendance)
    .values({
      employee_id: dto.employee_id,
      date: dto.date,
      status: dto.status,
      check_in: checkIn, 
      check_out: checkOut,
    })
    .onConflictDoUpdate({
      target: [employeeAttendance.employee_id, employeeAttendance.date],
      set: {
        status: dto.status,
        check_in: checkIn,
        check_out: checkOut,
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