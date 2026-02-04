import { Injectable } from '@nestjs/common';
import { db } from '../../db';
import { sql } from 'drizzle-orm';

@Injectable()
export class DashboardService {

  /* =========================
     SUMMARY
  ========================= */
  async getSummary() {
    const [shipmentRows, clientRows] = await Promise.all([
      db.execute(sql`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (
            WHERE status_group ILIKE '%deliver%' 
              AND status_group NOT ILIKE '%rto%'
          )::int AS delivered,
          COUNT(*) FILTER (WHERE status_group ILIKE '%rto%')::int AS rto
        FROM consignments
      `),

      db.execute(sql`
        SELECT COUNT(*)::int AS count
        FROM users
        WHERE is_active = true
          AND role = 'client'
      `),
    ]);

    const s = shipmentRows.rows[0];
    const clients = clientRows.rows[0];

    const total = Number(s.total);
    const delivered = Number(s.delivered);
    const rto = Number(s.rto);

    return {
      totalShipments: total,
      delivered,
      inTransit: total-delivered-rto, // Calculated for consistency
      rto,
      activeClients: Number(clients.count),
    };
  }

  /* =========================
     PROVIDER PERFORMANCE
  ========================= */
  async getProviderPerformance() {
    // Optimized to group and calculate in one pass
    const rows = await db.execute(sql`
      SELECT 
        provider,
        COUNT(*)::int AS active_shipments,
        ROUND(
          AVG(EXTRACT(EPOCH FROM (last_status_at - created_at)) / 86400)
          FILTER (
            WHERE status_group ILIKE '%deliver%' 
               OR status_group ILIKE '%rto%'
          )::numeric,
          1
        ) AS avg_tat,
        ROUND(
          (COUNT(*) FILTER (WHERE status_group ILIKE '%rto%')::float
          / NULLIF(COUNT(*), 0)::float * 100)::numeric,
          1
        ) AS rto_rate
      FROM consignments
      GROUP BY provider
    `);

    return rows.rows.map((r: any) => {
      const rtoRate = Number(r.rto_rate) || 0;
      const tat = Number(r.avg_tat) || 0;

      const healthScore = Math.max(
        0,
        Math.min(100, 100 - rtoRate * 2 - tat * 3),
      );

      return {
        name: r.provider ?? 'UNKNOWN',
        activeShipments: r.active_shipments,
        tat: r.avg_tat ?? null,
        rto: rtoRate,
        healthScore: healthScore
      };
    });
  }

  /* =========================
     SHIPMENT AGEING
  ========================= */
  async shipmentAgeing() {
    const rows = await db.execute(sql`
      SELECT
        COUNT(*) FILTER (WHERE last_status_at >= NOW() - INTERVAL '24 hours')::int AS fresh,
        COUNT(*) FILTER (
          WHERE last_status_at < NOW() - INTERVAL '24 hours'
            AND last_status_at >= NOW() - INTERVAL '48 hours'
        )::int AS aging_24_48,
        COUNT(*) FILTER (WHERE last_status_at < NOW() - INTERVAL '48 hours')::int AS aging_48_plus
      FROM consignments
      WHERE status_group NOT ILIKE '%deliver%'
    `);

    return rows.rows[0];
  }

  /* =========================
     DAILY BOOKING TREND
  ========================= */
  async dailyBookingTrend() {
    const rows = await db.execute(sql`
      SELECT
        DATE(created_at) AS day,
        COUNT(*)::int AS total
      FROM consignments
      WHERE created_at >= CURRENT_DATE - INTERVAL '14 days'
      GROUP BY day
      ORDER BY day
    `);

    return rows.rows;
  }

  /* =========================
     PROVIDER SHARE
  ========================= */
  async providerShare() {
    const rows = await db.execute(sql`
      SELECT
        provider,
        COUNT(*)::int AS total
      FROM consignments
      GROUP BY provider
    `);

    return rows.rows;
  }

  /* =========================
     STUCK SHIPMENTS
  ========================= */
  async stuckShipments() {
    const rows = await db.execute(sql`
      SELECT
        awb,
        provider,
        current_status,
        last_status_at
      FROM consignments
      WHERE last_status_at < NOW() - INTERVAL '48 hours'
        AND status_group NOT ILIKE '%deliver%'
      ORDER BY last_status_at ASC
      LIMIT 10
    `);

    return rows.rows;
  }

  /* =========================
     YESTERDAY BOOKINGS
  ========================= */
  async yesterdayBookings() {
    const rows = await db.execute(sql`
      SELECT COUNT(*)::int AS total
      FROM consignments
      WHERE created_at >= CURRENT_DATE - INTERVAL '1 day'
        AND created_at < CURRENT_DATE
    `);

    return { total: rows.rows[0].total };
  }
}