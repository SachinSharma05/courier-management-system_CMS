import { Injectable } from "@nestjs/common";
import { db } from "../../../db";
import { consignments } from "../../../db/schema";
import { sql, eq, or } from "drizzle-orm";

@Injectable()
export class ProviderStatsService {
  async getStats(provider: string) {
    const rows = await db
      .select({
        status: consignments.status_group,
        count: sql<number>`count(*)`,
      })
      .from(consignments)
      .where(sql`LOWER(${consignments.provider}) = ${provider.toLowerCase()}`)
      .groupBy(consignments.status_group);

    let total = 0;
    let delivered = 0;
    let rto = 0;
    let inTransit = 0;
    let ndr = 0;

    const breakdown = rows
      .map(r => {
        const rawStatus = r.status?.trim() || 'Unknown Status';
        const bucket = classifyStatus(rawStatus);

        return {
          label: rawStatus,
          value: Number(r.count),
          group: bucket.toLowerCase(),
        };
      })
      .sort((a, b) => b.value - a.value);

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
      breakdown,
    };
  }
}

function normalizeStatus(status?: string | null) {
  return (status ?? '').toLowerCase().trim();
}

function classifyStatus(rawStatus: string) {
  const status = normalizeStatus(rawStatus);

  // 🔁 RTO (highest priority)
  if (
    status.includes('rto') ||
    status.includes('return') ||
    status.includes('rtb') ||
    status.includes('misroute')
  ) {
    return 'RTO';
  }

  // ⚠️ NDR / failed delivery
  if (
    status.includes('undelivered') ||
    status.includes('not delivered') ||
    status.includes('ndr') ||
    status.includes('wrong pincode') ||
    status.includes('non serviceable') ||
    status.includes('delivery attempted') ||
    status.includes('refused') ||
    status.includes('contact customer')
  ) {
    return 'NDR';
  }

  // ✅ Delivered (exact intent)
  if (status === 'delivered') {
    return 'DELIVERED';
  }

  // 🚚 In-transit / active
  if (
    status.includes('in_transit') ||
    status.includes('out for delivery') ||
    status.includes('manifest') ||
    status.includes('booked') ||
    status.includes('picked') ||
    status.includes('processing') ||
    status.includes('received') ||
    status.includes('reached') ||
    status.includes('scheduled') ||
    status.includes('destination') ||
    status.includes('stock scan')
  ) {
    return 'IN_TRANSIT';
  }

  return 'OTHER';
}
