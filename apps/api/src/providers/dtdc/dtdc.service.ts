import { Injectable, BadRequestException } from '@nestjs/common';
import { ListShipmentsDto } from '../delhivery/dto/list-shipments.dto';
import { sql, desc, eq } from 'drizzle-orm';
import { consignments, users } from '../../db/schema';
import { db } from '../../db';
import { computeMovement, computeTAT } from '../../admin/consignments/tat.engine';

@Injectable()
export class DtdcService {
    
async listShipments(provider: string, q: ListShipmentsDto) {
  const page = Math.max(1, q.page);
  const limit = Math.min(100, q.limit);
  const offset = (page - 1) * limit;

  const where = [sql`${consignments.provider} = ${provider.toUpperCase()}`];

  if (q.status && q.status !== 'all') {
    where.push(sql`${consignments.current_status} = ${q.status}`);
  }

  if (q.search?.trim()) {
    where.push(
      sql`${consignments.awb} ILIKE ${`%${q.search.trim()}%`}`
    );
  }

  const finalWhere = sql.join(where, sql` AND `);

  const [rows, totalResult] = await Promise.all([
    db.select({
        id: consignments.id,
        awb: consignments.awb,
        reference_number: consignments.reference_number,
        provider: consignments.provider,
        status: consignments.current_status,
        bookedAt: consignments.booked_at,
        lastUpdatedAt: consignments.last_status_at,
        origin: consignments.origin,
        destination: consignments.destination,
        createdAt: consignments.created_at,
        client: users.company_name,
    })
      .from(consignments)
      .leftJoin(users, eq(users.id, consignments.client_id))
      .where(finalWhere)
      .orderBy(desc(consignments.created_at))
      .limit(limit)
      .offset(offset),

    db.select({ count: sql<number>`count(*)` })
      .from(consignments)
      .where(finalWhere),
  ]);

  // Enrich rows with TAT and Movement status
  const enrichedRows = rows.map(row => {
    const engineTatResult = computeTAT(row.awb, row.bookedAt, row.status); // Pass your row to the engine
    const engineMovementResult = computeMovement(row.lastUpdatedAt, row.status);
    return {
      ...row,
      client: row.client,
      tat_status: engineTatResult,       // e.g., "Critical", "On Time"
      movement_status: engineMovementResult,  // e.g., "Warning", "Delivered"
    };
  });

  const total = Number(totalResult[0]?.count ?? 0);

  return {
    data: enrichedRows,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

}