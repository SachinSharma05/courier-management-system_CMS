import { Job } from 'bullmq';
import { db } from '../db';
import { consignments, trackingEvents } from '../db/schema';
import { eq, desc, inArray, sql } from 'drizzle-orm';
import { DtdcBulkAdapter, mapDtdcStatus } from '@cms/shared';
import { trackingQueue } from '../queues/tracking.queue';

const dtdc = new DtdcBulkAdapter();

export async function processDtdcSingleTrack(job: Job) {
  const { awb } = job.data as { awb: string };

  const [row] = await db
    .select()
    .from(consignments)
    .where(eq(consignments.awb, awb))
    .limit(1);

  if (
    !row ||
    ['DELIVERED','RTO_DELIVERED','CANCELLED','LOST']
      .includes(row.normalized_status ?? '')
  ) return;

  const json = await dtdc.trackPublicSingle(awb);

  // 🔴 FIX: Public single uses `details[]`
  if (!Array.isArray(json?.details) || json.details.length < 1) return;

  const lastKnownTime = row.last_status_at?.getTime() ?? 0;

  const events = json.details
    .map(d => {
      const ts =
        d.strActionDate && d.strActionTime
          ? new Date(
              `${d.strActionDate.split('-').reverse().join('-')}T${d.strActionTime}`
            )
          : null;

      return ts && ts.getTime() > lastKnownTime
        ? {
            consignment_id: row.id,
            awb,
            provider: 'DTDC',
            status: d.strAction ?? '',
            location: d.strDestination ?? d.strOrigin ?? null,
            remarks: d.sTrRemarks ?? null,
            event_time: ts,
            raw: d,
          }
        : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.event_time!.getTime() - b.event_time!.getTime());

  if (!events.length) return;

  await db.insert(trackingEvents).values(events).onConflictDoNothing();

  const bookedAt = parseDtdcDateTime(
    json.header?.strBookedDate,
    json.header?.strBookedTime
  );

  const latest = events[events.length - 1];
  const { normalized, group } = mapDtdcStatus(latest.status);

  await db.update(consignments).set({
    booked_at: row.booked_at ?? parseDtdcDateTime(json.header?.strBookedDate) ?? bookedAt,
    current_status: latest.status,
    normalized_status: normalized,
    status_group: group,
    last_status_at: latest.event_time,
    origin: row.origin ?? json.header?.strOrigin ?? null,
    destination: row.destination ?? json.header?.strDestination ?? null,
  }).where(eq(consignments.id, row.id));
}

export async function processDtdcAuthSingle(job: Job) {
  const { awb, token, customerCode } = job.data;

  const res = await dtdc.trackAuthSingle({
    awb,
    token,
    customerCode,
  });

  if (!res?.trackHeader || !Array.isArray(res.trackDetails)) return;

  const [row] = await db
    .select()
    .from(consignments)
    .where(eq(consignments.awb, awb))
    .limit(1);

  if (
    !row ||
    ['DELIVERED','RTO_DELIVERED','CANCELLED','LOST']
      .includes(row.normalized_status ?? '')
  ) return;

  /* ---------------- HEADER ---------------- */
  const header = res.trackHeader;

  const bookedAt = parseDtdcDateTime(
    header.strBookedDate,
    header.strBookedTime
  );

  const lastStatusAt = parseDtdcDateTime(
    header.strStatusTransOn,
    header.strStatusTransTime
  );

  const { normalized, group } = mapDtdcStatus(header.strStatus);

  /* ---------------- EVENTS ---------------- */
  const lastKnown = row.last_status_at?.getTime() ?? 0;

  const events = res.trackDetails
    .map(t => ({
      consignment_id: row.id,
      provider: 'DTDC',
      awb,
      status: t.strAction ?? '',
      location: t.strOrigin ?? null,
      remarks: t.sTrRemarks ?? t.strRemarks ?? null,
      event_time: parseDtdcDateTime(
        t.strActionDate,
        t.strActionTime
      ),
    }))
    .filter(e => e.event_time && e.event_time.getTime() > lastKnown)
    .sort((a, b) => a.event_time!.getTime() - b.event_time!.getTime());

  if (events.length) {
    await db.insert(trackingEvents).values(events).onConflictDoNothing();
  }

  /* ---------------- CONSIGNMENT UPDATE ---------------- */
  await db.update(consignments).set({
    reference_number: row.reference_number ?? header.strRefNo ?? null,
    origin: row.origin ?? header.strOrigin ?? null,
    destination: row.destination ?? header.strDestination ?? null,
    booked_at: row.booked_at ?? parseDtdcDateTime(header.strBookedDate) ?? bookedAt,
    expected_delivery_date: header.strExpectedDeliveryDate
      ? parseDtdcDateTime(header.strExpectedDeliveryDate)
      : null,
    current_status: header.strStatus,
    normalized_status: normalized,
    status_group: group,
    last_status_at: lastStatusAt,
    tracking_locked_at: null,
    updated_at: sql`NOW()`,
  }).where(eq(consignments.id, row.id));
}

export async function processDtdcPublicBatch(job: Job) {
  const { awbs } = job.data;

  const res = await dtdc.trackPublicBatch(awbs);
  if (!Array.isArray(res.headers)) return;

  const updates = [];
  const escalate: string[] = [];

  for (const h of res.headers) {
    const awb = String(h.shipmentNo).trim();
    const status = h.currentStatusDescription ?? h.status ?? '';
    if (!awb || !status) continue;

    const { normalized, group } = mapDtdcStatus(status);

    updates.push({
      awb,
      current_status: status,
      normalized_status: normalized,
      status_group: group,
      last_status_at: new Date(), // ✅ FIX
    });

    if (!['DELIVERED','RTO_DELIVERED','CANCELLED','LOST'].includes(normalized)) {
      escalate.push(awb);
    }
  }

  if (updates.length) {
    await bulkUpdatePublicConsignments(updates);
  }

  for (const awb of escalate) {
    await trackingQueue.add('DTDC_SINGLE_TRACK', { awb });
  }
}

async function bulkUpdatePublicConsignments(
  updates: Array<{
    awb: string;
    current_status: string;
    normalized_status: string;
    status_group: string;
    last_status_at: Date;
  }>
) {
  if (!updates.length) return;

  const awbs = updates.map(u => u.awb);

  const currentStatusCase = sql.join(
    updates.map(
      u => sql`WHEN ${consignments.awb} = ${u.awb} THEN ${u.current_status}`
    ),
    sql` `
  );

  const normalizedStatusCase = sql.join(
    updates.map(
      u => sql`WHEN ${consignments.awb} = ${u.awb} THEN ${u.normalized_status}`
    ),
    sql` `
  );

  const statusGroupCase = sql.join(
    updates.map(
      u => sql`WHEN ${consignments.awb} = ${u.awb} THEN ${u.status_group}`
    ),
    sql` `
  );

  const lastStatusAtCase = sql.join(
    updates.map(
      u => sql`WHEN ${consignments.awb} = ${u.awb} THEN ${u.last_status_at}`
    ),
    sql` `
  );

  await db.execute(sql`
    UPDATE ${consignments}
    SET
      current_status = CASE ${currentStatusCase} ELSE current_status END,
      normalized_status = CASE ${normalizedStatusCase} ELSE normalized_status END,
      status_group = CASE ${statusGroupCase} ELSE status_group END,
      last_status_at = CASE ${lastStatusAtCase} ELSE last_status_at END
    WHERE ${consignments.awb} IN (${sql.join(awbs, sql`, `)});
  `);
}


// ------------------------------------------
// PARSERS (UNCHANGED)
// ------------------------------------------
function parseDtdcDateTime(date?: string, time?: string): Date | null {
  if (!date) return null;

  // DDMMYYYY → YYYY-MM-DD
  const d = date.slice(0, 2);
  const m = date.slice(2, 4);
  const y = date.slice(4, 8);

  const hh = time?.slice(0, 2) ?? '00';
  const mm = time?.slice(2, 4) ?? '00';

  const dt = new Date(`${y}-${m}-${d}T${hh}:${mm}:00`);
  return isNaN(dt.getTime()) ? null : dt;
}
