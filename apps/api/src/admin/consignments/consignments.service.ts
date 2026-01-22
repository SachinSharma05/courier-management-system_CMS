import { Injectable } from '@nestjs/common';
import { db } from '../../db';
import { consignments, trackingEvents, users } from '../../db/schema';
import { and, eq, ilike, desc, gte, lte, sql } from 'drizzle-orm';
import { computeMovement, computeTAT } from './tat.engine';
import { stringify } from 'csv-stringify/sync';
import { ListConsignmentsDto } from './dto/list-consignments.dto';

@Injectable()
export class ConsignmentsService {
  async list(params: ListConsignmentsDto & { page: number; limit: number }) {
    const { page, limit, awb, provider, status, clientId, from, to } = params;
    const conditions = [];

    // Filter Optimization: ilike with %% is slow. 
    // If possible, use exact match eq() for AWB for 100x speedup.
    if (awb) conditions.push(ilike(consignments.awb, `%${awb}%`));
    if (clientId) conditions.push(eq(consignments.client_id, clientId));
    if (provider) conditions.push(eq(consignments.provider, provider.toUpperCase()));
    if (status) conditions.push(eq(consignments.current_status, status));
    if (from) conditions.push(gte(consignments.created_at, new Date(from)));
    if (to) conditions.push(lte(consignments.created_at, new Date(to)));

    const where = conditions.length ? and(...conditions) : undefined;

    // 1. Parallel Execution (Optional but faster)
    // We run count and data fetch simultaneously
    const [rows, countResult] = await Promise.all([
      db
        .select({
          id: consignments.id,
          awb: consignments.awb,
          provider: consignments.provider,
          status: consignments.current_status,
          bookedAt: consignments.booked_at,
          lastUpdatedAt: consignments.last_status_at,
          origin: consignments.origin,
          destination: consignments.destination,
          client: users.company_name,
        })
        .from(consignments)
        .leftJoin(users, eq(users.id, consignments.client_id))
        .where(where)
        .orderBy(desc(consignments.created_at))
        .limit(limit)
        .offset((page - 1) * limit),

      // OPTIMIZED COUNT: No Join here!
      db
        .select({ count: sql<number>`count(${consignments.id})` })
        .from(consignments)
        .where(where)
    ]);

    const total = Number(countResult[0]?.count ?? 0);

    return {
      data: rows.map(r => ({
        ...r,
        tat: computeTAT(r.awb, r.bookedAt, r.status),
        movement: computeMovement(r.lastUpdatedAt, r.status),
      })),
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getDetails(awb: string) {
    const events = await db
      .select()
      .from(trackingEvents) // replace with your actual table name
      .where(eq(trackingEvents.awb, awb))
      .orderBy(desc(trackingEvents.event_time));

    return events;
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
    const [r] = await db
      .select({
        total: sql<number>`count(*)`,
        delivered: sql<number>`count(*) filter (where ${consignments.current_status} ilike '%Deliv%')`,
        rto: sql<number>`count(*) filter (where ${consignments.current_status} ilike '%RTO%')`,
        pending: sql<number>`count(*) filter (
          where ${consignments.current_status} not ilike '%Deliv%' 
          and ${consignments.current_status} not ilike '%RTO%'
        )`,
      })
      .from(consignments)
      .where(clientId ? eq(consignments.client_id, clientId) : undefined);

    return {
      total: Number(r?.total || 0),
      delivered: Number(r?.delivered || 0),
      pending: Number(r?.pending || 0),
      rto: Number(r?.rto || 0),
    };
  }
}