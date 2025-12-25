import { Injectable } from '@nestjs/common';
import { db } from '../../db';
import { consignments, users } from '../../db/schema';
import { and, eq, ilike, desc, gte, lte, sql } from 'drizzle-orm';
import { computeMovement, computeTAT } from './tat.engine';
import { stringify } from 'csv-stringify/sync';
import { ListConsignmentsDto } from './dto/list-consignments.dto';

interface ListParams {
  page: number;
  limit: number;
  awb?: string;
  provider?: string;
  status?: string;
  clientId?: number;
  from?: string;
  to?: string;
}

@Injectable()
export class ConsignmentsService {
  async list(params: ListConsignmentsDto & { page: number; limit: number }) {
    const { page, limit, awb, provider, status, clientId, from, to } = params;

    const conditions = [];

    if (awb) {
      conditions.push(ilike(consignments.awb, `%${awb}%`));
    }

    if (clientId) {
      conditions.push(eq(consignments.client_id, clientId));
    }

    if (provider) {
      conditions.push(eq(consignments.provider, provider.toLowerCase()));
    }

    if (status) {
      conditions.push(eq(consignments.current_status, status));
    }

    if (from) {
      conditions.push(gte(consignments.created_at, new Date(from)));
    }

    if (to) {
      conditions.push(lte(consignments.created_at, new Date(to)));
    }

    const where = conditions.length ? and(...conditions) : undefined;

    const rows = await db
      .select({
        id: consignments.id,
        awb: consignments.awb,
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
      .where(where)
      .orderBy(desc(consignments.created_at))
      .limit(limit)
      .offset((page - 1) * limit);

    const countResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(consignments)
      .leftJoin(users, eq(users.id, consignments.client_id))
      .where(where);

    const total = Number(countResult[0]?.count ?? 0);

    return {
      data: rows.map(r => ({
        id: r.id,
        awb: r.awb,
        client: r.client,
        provider: r.provider,
        status: r.status,
        bookedAt: r.bookedAt,
        lastUpdatedAt: r.lastUpdatedAt,
        origin: r.origin,
        destination: r.destination,

        tat: computeTAT(
          r.awb,
          r.bookedAt,
          r.status,
        ),

        movement: computeMovement(
          r.lastUpdatedAt,
          r.status,
        ),
      })),
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async exportCSV(params: ListConsignmentsDto) {
    const { awb, provider, status, clientId, from, to } = params;

    const conditions = [];

    if (awb) conditions.push(ilike(consignments.awb, `%${awb}%`));
    if (clientId) conditions.push(eq(consignments.client_id, Number(clientId)));
    if (provider) conditions.push(eq(consignments.provider, provider.toUpperCase()));
    if (status) conditions.push(eq(consignments.current_status, status.toUpperCase()));
    if (from) conditions.push(gte(consignments.created_at, new Date(from)));
    if (to) conditions.push(lte(consignments.created_at, new Date(to)));

    const where = conditions.length ? and(...conditions) : undefined;

    const rows = await db
      .select({
        awb: consignments.awb,
        client: users.company_name,
        provider: consignments.provider,
        status: consignments.current_status,
        origin: consignments.origin,
        destination: consignments.destination,
        bookedAt: consignments.booked_at,
        lastUpdatedAt: consignments.last_status_at,
      })
      .from(consignments)
      .leftJoin(users, eq(users.id, consignments.client_id))
      .where(where)
      .orderBy(desc(consignments.created_at));

    return stringify(
      rows.map(r => ({
        AWB: r.awb,
        Client: r.client,
        Provider: r.provider,
        Status: r.status,
        Origin: r.origin,
        Destination: r.destination,
        BookedAt: r.bookedAt,
        LastUpdated: r.lastUpdatedAt,
        TAT: computeTAT(r.awb, r.bookedAt, r.status),
        Movement: computeMovement(r.lastUpdatedAt, r.status),
      })),
      { header: true }
    );
  }

  async getSummary(clientId?: number) {
    const baseWhere = clientId
      ? eq(consignments.client_id, clientId)
      : undefined;

    const rows = await db.execute(sql`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE current_status = 'Delivered') as delivered,
        COUNT(*) FILTER (WHERE current_status not in ('Delivered', 'RTO')) as pending,
        COUNT(*) FILTER (WHERE current_status = 'RTO') as rto
      FROM consignments
      ${baseWhere ? sql`WHERE ${baseWhere}` : sql``}
    `);

    const r = rows.rows[0];

    return {
      total: Number(r.total),
      delivered: Number(r.delivered),
      pending: Number(r.pending),
      rto: Number(r.rto),
    };
  }
}