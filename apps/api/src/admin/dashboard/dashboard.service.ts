import { Injectable } from '@nestjs/common';
import { db } from '../../db';
import { sql, eq, and } from 'drizzle-orm';
import { consignments } from '../../db/schema';
import { users } from '../../db/schema';

@Injectable()
export class DashboardService {

  async getSummary(filters: {
    clientId?: number;
    provider?: string;
    from?: string;
    to?: string;
  }) {
    const where = [];

    if (filters.clientId)
      where.push(eq(consignments.client_id, filters.clientId));

    if (filters.provider)
      where.push(eq(consignments.provider, filters.provider));

    if (filters.from)
      where.push(sql`${consignments.created_at} >= ${filters.from}`);

    if (filters.to)
      where.push(sql`${consignments.created_at} <= ${filters.to}`);

    const rows = await db.execute(sql`
      SELECT
        COUNT(*)::int AS total,

        COUNT(*) FILTER (
          WHERE
            LOWER(current_status) LIKE '%deliver%'
            AND LOWER(current_status) NOT LIKE '%rto%'
            AND LOWER(current_status) NOT LIKE '%undeliver%'
            AND LOWER(current_status) NOT LIKE '%redeliver%'
        )::int AS delivered,

        COUNT(*) FILTER (
          WHERE LOWER(current_status) LIKE '%rto%'
        )::int AS rto,

        COUNT(*) FILTER (
          WHERE
            LOWER(current_status) NOT LIKE '%deliver%'
            AND LOWER(current_status) NOT LIKE '%rto%'
        )::int AS pending

      FROM consignments
      ${where.length ? sql`WHERE ${sql.join(where, sql` AND `)}` : sql``}
    `);

    const clientsCount = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(users)
      .where(
        and(
            eq(users.is_active, true),
            eq(users.role, 'client')
           )
        );

    return {
      totalShipments: Number(rows.rows[0].total),
      delivered: Number(rows.rows[0].delivered),
      inTransit: Number(rows.rows[0].pending),
      rto: Number(rows.rows[0].rto),
      activeClients: Number(clientsCount[0].count),
    };
  }

  async getLiveOps() {
  const rows = await db.execute(sql`
    SELECT
        COUNT(*)::int AS total,

        COUNT(*) FILTER (
          WHERE
            LOWER(current_status) LIKE '%deliver%'
            AND LOWER(current_status) NOT LIKE '%rto%'
            AND LOWER(current_status) NOT LIKE '%undeliver%'
            AND LOWER(current_status) NOT LIKE '%redeliver%'
        )::int AS delivered,

        COUNT(*) FILTER (
          WHERE LOWER(current_status) LIKE '%rto%'
        )::int AS rto,

        COUNT(*) FILTER (
          WHERE
            LOWER(current_status) NOT LIKE '%deliver%'
            AND LOWER(current_status) NOT LIKE '%rto%'
        )::int AS pending,

        consignments.provider,
        u.company_name,
        MAX(last_status_at) AS last_status_at

      FROM consignments
    JOIN users u ON u.id = consignments.client_id
    GROUP BY consignments.provider, u.company_name
    ORDER BY MAX(last_status_at) DESC
  `);

  return rows.rows.map((r: any) => ({
    provider: r.provider,
    client: r.company_name,
    inTransit: Number(r.pending),
    delivered: Number(r.delivered),
    failed: Number(r.rto),
    lastSync: r.last_sync,
  }));
}

  async getAlerts() {
    return [
        {
        type: 'DLQ',
        entity: 'DTDC',
        message: 'Tracking retry failed for 3 consignments',
        createdAt: new Date().toISOString(),
        },
        {
        type: 'CREDENTIAL',
        entity: 'Client B',
        message: 'API key expired',
        createdAt: new Date().toISOString(),
        },
    ];
    }
}