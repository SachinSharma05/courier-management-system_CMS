import { Injectable } from '@nestjs/common';
import { db } from '../../db';
import { sql, eq, and } from 'drizzle-orm';
import { consignments } from '../../db/schema';
import { users } from '../../db/schema';

@Injectable()
export class DashboardService {
  async getSummary() {
    const rows = await db.execute(sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE LOWER(current_status) LIKE '%deliver%' AND LOWER(current_status) NOT LIKE '%rto%')::int AS delivered,
        COUNT(*) FILTER (WHERE LOWER(current_status) LIKE '%rto%')::int AS rto,
        
        -- NDR / DLQ Count
        COUNT(*) FILTER (
          WHERE LOWER(current_status) SIMILAR TO '%(undelivered|not delivered|ndr|wrong pincode|non serviceable|delivery attempted|refused|mis route)%'
        )::int AS ndr_count,

        -- OPTIMIZED: Avg TAT only for Completed Shipments (Delivered or RTO)
        ROUND(AVG(EXTRACT(EPOCH FROM (last_status_at - created_at))/86400) 
          FILTER (WHERE LOWER(current_status) LIKE '%deliver%' OR LOWER(current_status) LIKE '%rto%')::numeric, 1) AS global_tat,
      
        -- Aggregator Margin
        (COUNT(*) * 10)::int AS total_margin
      FROM consignments
    `);

    const clientsCount = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(users)
      .where(and(eq(users.is_active, true), eq(users.role, 'client')));

    const summary = rows.rows[0];

    return {
      totalShipments: Number(summary.total),
      delivered: Number(summary.delivered),
      inTransit: Number(summary.total) - Number(summary.delivered) - Number(summary.rto), // Calculated for consistency
      rto: Number(summary.rto),
      activeClients: Number(clientsCount[0].count),
      avgTat: summary.global_tat ? `${summary.global_tat} Days` : '—',
      margin: `₹${Number(summary.total_margin).toLocaleString()}`,
      dlqCount: Number(summary.ndr_count),
    };
  }

  async getProviderPerformance() {
    // Optimized to group and calculate in one pass
    const rows = await db.execute(sql`
      SELECT 
        provider,
        COUNT(*)::int AS active_shipments,
        ROUND(AVG(EXTRACT(EPOCH FROM (last_status_at - created_at))/86400) 
          FILTER (WHERE LOWER(current_status) LIKE '%deliver%' OR LOWER(current_status) LIKE '%rto%')::numeric, 1) AS avg_tat,
        ROUND((COUNT(*) FILTER (WHERE LOWER(current_status) LIKE '%rto%')::float / NULLIF(COUNT(*), 0)::float * 100)::numeric, 1) AS rto_rate
      FROM consignments
      GROUP BY provider
    `);

    return rows.rows.map((r: any) => {
      const rtoRate = Number(r.rto_rate) || 0;
      const tat = Number(r.avg_tat) || 0;
      // Health Score: Balanced penalty for RTO and slow delivery
      const healthScore = Math.max(0, Math.min(100, 100 - (rtoRate * 2) - (tat * 3)));

      return {
        name: r.provider?.toUpperCase() || 'UNKNOWN',
        activeShipments: r.active_shipments,
        tat: r.avg_tat || '—',
        rto: rtoRate,
        healthScore: healthScore
      };
    });
  }

  // Alerts remain as mock until you have a system_logs table
  async getAlerts() {
    // Ideally, this should pull from a 'system_logs' or 'dlq' table
    return [
      { type: 'DLQ', entity: 'DTDC', message: 'Tracking retry failed for 3 consignments', time: '2m ago' },
      { type: 'CREDENTIAL', entity: 'Client B', message: 'API key expired', time: '15m ago' },
    ];
  }
}