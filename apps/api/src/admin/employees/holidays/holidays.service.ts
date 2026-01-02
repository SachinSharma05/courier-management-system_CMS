import { Injectable } from "@nestjs/common";
import { db } from "../../../db";
import { holidays } from "../../../db/schema";
import { CreateHolidayDto } from "../dto/create-holiday.dto";

@Injectable()
export class HolidaysService {

  findAll() {
    return db.select().from(holidays).orderBy(holidays.date);
  }

  create(dto: CreateHolidayDto) {
    return db
      .insert(holidays)
      .values({
        date: dto.date,
        name: dto.name,
        is_optional: dto.is_optional ?? false,
      })
      .returning();
  }
}