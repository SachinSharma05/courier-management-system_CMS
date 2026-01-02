import { Inject, Injectable } from "@nestjs/common";
import { db } from '../../db';
import { employees } from '../../db/schema';
import { eq } from "drizzle-orm";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";

@Injectable()
export class EmployeesService {

  findAll() {
    return db.select().from(employees);
  }

  create(dto: CreateEmployeeDto) {
    return db.insert(employees).values(dto).returning();
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
