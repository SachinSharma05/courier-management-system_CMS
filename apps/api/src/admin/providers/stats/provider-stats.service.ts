import { Injectable } from "@nestjs/common";
import { db } from "../../../db";
import { consignments } from "../../../db/schema";
import { sql, eq, or } from "drizzle-orm";

@Injectable()
export class ProviderStatsService {
  async getStats(provider: string) {
    const rows = await db
      .select({
        status: consignments.current_status,
        count: sql<number>`count(*)`,
      })
      .from(consignments)
      .where(sql`LOWER(${consignments.provider}) = ${provider.toLowerCase()}`)
      .groupBy(consignments.current_status);

    let total = 0;
    let delivered = 0;
    let rto = 0;
    let inTransit = 0;
    let ndr = 0;

    // 1. Map rows to a breakdown array for the UI Chart/List
    const breakdown = rows.map(r => ({
      label: r.status || 'Unknown Status',
      value: Number(r.count),
      group: classifyStatus(r.status || '').toLowerCase() 
    })).sort((a, b) => b.value - a.value); // Sort by highest count for better UX

    for (const r of rows) {
      const count = Number(r.count);
      total += count;

      const bucket = classifyStatus(r.status || '');

      if (bucket === 'DELIVERED') delivered += count;
      else if (bucket === 'RTO') rto += count;
      else if (bucket === 'NDR') ndr += count;
      else if (bucket === 'IN_TRANSIT') inTransit += count;
    }

    return {
      provider,
      total,
      delivered,
      inTransit,
      rto,
      ndr,
      breakdown, // Add the breakdown to the final response
    };
  }
}

function normalizeStatus(status?: string | null) {
  return (status ?? '').toLowerCase().trim();
}

function classifyStatus(rawStatus: string) {
  const status = normalizeStatus(rawStatus);

  // ✅ Delivered (highest priority)
  if (status.includes('delivered') && !status.includes('rto')) {
    return 'DELIVERED';
  }

  // 🔁 RTO (any return flow)
  if (
    status.includes('rto') ||
    status.includes('return')
  ) {
    return 'RTO';
  }

  // ⚠️ NDR / failed attempts
  if (
    status.includes('undelivered') ||
    status.includes('not delivered') ||
    status.includes('ndr') ||
    status.includes('wrong pincode') ||
    status.includes('non serviceable') ||
    status.includes('delivery attempted') ||
    status.includes('refused') ||
    status.includes('mis route')
  ) {
    return 'NDR';
  }

  // 🚚 Active / in-transit
  if (
    status.includes('in transit') ||
    status.includes('out for delivery') ||
    status.includes('manifest') ||
    status.includes('booked') ||
    status.includes('picked') ||
    status.includes('processing') ||
    status.includes('received') ||
    status.includes('reached') ||
    status.includes('stock scan')
  ) {
    return 'IN_TRANSIT';
  }

  // 🟡 Everything else
  return 'OTHER';
}