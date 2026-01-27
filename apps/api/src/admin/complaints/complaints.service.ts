import { Injectable } from "@nestjs/common";
import { eq, desc } from 'drizzle-orm';
import { CreateComplaintDto } from "./dto/create-complaint.dto";
import { complaints, users } from "../../db/schema";
import { db } from "../../db";

@Injectable()
export class ComplaintsService {
  async create(clientId: number, dto: CreateComplaintDto) {
    await db.insert(complaints).values({
      client_id: clientId,
      awb: dto.awb,
      message: dto.message,
    });

    return { ok: true };
  }

  async findMyComplaints(clientId: number) {
    return db
      .select()
      .from(complaints)
      .where(eq(complaints.client_id, clientId))
      .orderBy(desc(complaints.created_at));
  }

  async findAll() {
    return db
      .select({
        id: complaints.id,
        awb: complaints.awb,
        message: complaints.message,
        resolution_comment: complaints.resolution_comment,
        resolved_at: complaints.resolved_at,
        status: complaints.status,
        created_at: complaints.created_at,
        updated_at: complaints.updated_at,
        client: users.company_name,
      })
      .from(complaints)
      .leftJoin(users, eq(users.id, complaints.client_id))
      .orderBy(desc(complaints.created_at));
  }

  async updateStatus(
    id: number,
    status: string,
    resolutionComment?: string,
    ) {
    await db
        .update(complaints)
        .set({
        status,
        resolution_comment:
            status === 'resolved' ? resolutionComment ?? null : null,
        resolved_by: status === 'resolved' ? 0 : null,
        resolved_at: status === 'resolved' ? new Date() : null,
        updated_at: new Date(),
        })
        .where(eq(complaints.id, id));

    return { ok: true };
    }
}