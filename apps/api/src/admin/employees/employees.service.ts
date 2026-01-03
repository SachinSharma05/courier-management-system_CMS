import { Injectable } from "@nestjs/common";
import { db } from '../../db';
import { employees } from '../../db/schema';
import { eq, desc, sql } from "drizzle-orm";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";

@Injectable()
export class EmployeesService {
  private async generateNextEmployeeCode(): Promise<string> {
    // 1. Get the last employee by ID or CreatedAt
    const lastEmployee = await db
      .select({ code: employees.employee_code })
      .from(employees)
      .orderBy(desc(employees.id))
      .limit(1);

    const prefix = `CMS-${new Date().getFullYear()}-`;
    
    if (lastEmployee.length === 0 || !lastEmployee[0].code) {
      return `${prefix}001`;
    }

    // 2. Extract number from "CMS-2026-005"
    const lastCode = lastEmployee[0].code;
    const parts = lastCode.split('-');
    const lastNumber = parseInt(parts[parts.length - 1], 10);

    // 3. Increment and Pad (e.g., 6 -> "006")
    const nextNumber = (lastNumber + 1).toString().padStart(3, '0');
    
    return `${prefix}${nextNumber}`;
  }

  findAll() {
    return db.select().from(employees);
  }

  async findOverview() {
    const today = new Date().toISOString().slice(0, 10);
    const month = today.slice(0, 7); // YYYY-MM

    const result = await db.execute(sql`
      SELECT
        e.id,
        e.name,
        e.email,
        e.designation,
        e.department,
        e.is_active,
        e.base_salary,

        -- attendance
        a.status AS attendance_status,
        a.check_in,

        -- advances
        COALESCE(SUM(
          CASE WHEN adv.is_settled = false THEN adv.amount ELSE 0 END
        ), 0) AS advance_balance,

        -- salary
        COALESCE(s.net_salary, e.base_salary)
          - COALESCE(SUM(sp.amount), 0) AS net_due

      FROM employees e

      -- today's attendance
      LEFT JOIN employee_attendance a
        ON a.employee_id = e.id
        AND a.date = ${today}

      -- advances
      LEFT JOIN employee_advances adv
        ON adv.employee_id = e.id

      -- salary snapshot (current month)
      LEFT JOIN employee_salary s
        ON s.employee_id = e.id
        AND s.month = ${month}

      -- salary payments
      LEFT JOIN employee_salary_payments sp
        ON sp.salary_id = s.id

      GROUP BY
        e.id,
        a.status,
        a.check_in,
        s.net_salary

      ORDER BY e.name ASC
    `);

    return result.rows || result;
  }

  async create(dto: CreateEmployeeDto) {
    // 1. Await the code generation
    const employee_code = await this.generateNextEmployeeCode();

    // 2. Merge the generated code with the DTO into a single object
    return db
      .insert(employees)
      .values({
        ...dto,
        employee_code: employee_code,
        // You can also ensure joining_date is set here if it's missing from the DTO
        joining_date: dto.joining_date ?? new Date().toISOString().slice(0, 10),
      })
      .returning();
  }

  update(id: number, dto: UpdateEmployeeDto) {
    return db
      .update(employees)
      .set(dto)
      .where(eq(employees.id, id))
      .returning();
  }

  disable(id: number) {
    return db
      .update(employees)
      .set({ is_active: false })
      .where(eq(employees.id, id));
  }
}
