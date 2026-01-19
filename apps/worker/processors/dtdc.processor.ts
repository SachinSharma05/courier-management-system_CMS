import { Job } from 'bullmq';
import { db } from '../db';
import { consignments, trackingEvents } from '../db/schema';
import { eq, desc, inArray, sql } from 'drizzle-orm';
import { DtdcBulkAdapter, mapDtdcStatus } from '@cms/shared';
import { trackingQueue } from '../queues/tracking.queue';

const dtdc = new DtdcBulkAdapter();

export async function processDtdcSingleTrack(job: Job) {
  const { awb } = job.data as { awb: string };

  const row = await db
    .select({
      id: consignments.id,
      normalized_status: consignments.normalized_status,
      last_status_at: consignments.last_status_at,
    })
    .from(consignments)
    .where(eq(consignments.awb, awb))
    .limit(1);

  if (!row.length) return;

  if (
    ['DELIVERED', 'RTO_DELIVERED', 'CANCELLED', 'LOST']
      .includes(row[0].normalized_status ?? '')
  ) return;

  const consignmentId = row[0].id;
  const lastKnownTime = row[0].last_status_at?.getTime() ?? 0;

  const json = await dtdc.trackPublicSingle(awb);
  if (!json || !Array.isArray(json.statuses) || json.statuses.length < 2) {
    return;
  }

  const events = json.statuses
    .map(s => ({
      consignment_id: consignmentId,
      awb,
      provider: 'DTDC',
      status: s.statusDescription ?? '',
      location: s.actCityName ?? s.actBranchName ?? null,
      remarks: s.remarks ?? null,
      event_time: s.statusTimestamp
        ? new Date(s.statusTimestamp.replace(' ', 'T'))
        : null,
    }))
    .filter(e => e.event_time)
    .sort((a, b) => a.event_time!.getTime() - b.event_time!.getTime());

  const newEvents = events.filter(
    e => e.event_time!.getTime() > lastKnownTime
  );

  if (!newEvents.length) return;

  await db
    .insert(trackingEvents)
    .values(newEvents)
    .onConflictDoNothing();

  const latest = newEvents[newEvents.length - 1];
  const { normalized, group } = mapDtdcStatus(latest.status);

  await db.update(consignments).set({
    current_status: latest.status,
    normalized_status: normalized,
    status_group: group,
    last_status_at: latest.event_time,
  }).where(eq(consignments.id, consignmentId));
}

export async function processDtdcAuthBatch(job: Job) {
  const { awbs, token, customerCode } = job.data as {
    awbs: string[];
    token: string;
    customerCode: string;
  };

  const res = await dtdc.trackAuthBatch({
    awbs,
    token,
    customerCode,
  });

  if (!Array.isArray(res?.consignment)) return;

  const timelines = res.consignment
    .filter(c => Array.isArray(c.tracking) && c.tracking.length >= 2)
    .map(c => ({
      awb: c.cnno,
      origin: c.strOrigin ?? null,
      destination: c.strDestination ?? null,
      events: c.tracking,
    }));

  await processTimelinesBatch(timelines);
}

export async function processDtdcPublicBatch(job: Job) {
  const { awbs } = job.data as { awbs: string[] };

  const res = await dtdc.trackPublicBatch(awbs);
  if (!Array.isArray(res.headers)) return;

  const updates: Array<{
    awb: string;
    current_status: string;
    normalized_status: string;
    status_group: string;
    last_status_at: Date;
  }> = [];

  const escalate: string[] = [];

  for (const h of res.headers) {
    const awb = String(h.shipmentNo).trim();
    const status =
      h.currentStatusDescription ??
      h.status ??
      '';

    if (!awb || !status) continue;

    const { normalized, group } = mapDtdcStatus(status);

    updates.push({
      awb,
      current_status: status,
      normalized_status: normalized,
      status_group: group,
      last_status_at: null,
    });

    // Escalate ONLY for terminal states
    if (!['DELIVERED', 'RTO_DELIVERED', 'CANCELLED', 'LOST'].includes(normalized)) {
      escalate.push(awb);
    }
  }

  /* -------------------------------
     1️⃣ Bulk UPDATE (ONCE)
  ------------------------------- */
  if (updates.length) {
    await bulkUpdatePublicConsignments(updates);
  }

  /* -------------------------------
     2️⃣ Escalate to SINGLE (RARE)
  ------------------------------- */
  for (const awb of escalate) {
    await trackingQueue.add(
      'DTDC_SINGLE_TRACK',
      { awb },
      { removeOnComplete: true }
    );
  }
}

async function processTimelinesBatch(
  timelines: Array<{
    awb: string;
    origin: string | null;
    destination: string | null;
    events: Array<{
      statusDescription?: string;
      actCityName?: string;
      actBranchName?: string;
      remarks?: string;
      statusTimestamp?: string;
    }>;
  }>
) {
  if (!timelines.length) return;

  const awbs = timelines.map(t => t.awb);

  /* -------------------------------
     1️⃣ Load consignments in ONE query
  ------------------------------- */
  const consignmentsRows = await db
    .select({
      id: consignments.id,
      awb: consignments.awb,
      normalized_status: consignments.normalized_status,
      last_status_at: consignments.last_status_at,
    })
    .from(consignments)
    .where(inArray(consignments.awb, awbs));

  const consignmentMap = new Map(
    consignmentsRows.map(r => [r.awb, r]),
  );

  const newEvents: typeof trackingEvents.$inferInsert[] = [];
  const updates: Array<{
    id: number;
    origin: string | null;
    destination: string | null;
    current_status: string;
    normalized_status: string;
    status_group: string;
    last_status_at: Date;
  }> = [];

  /* -------------------------------
     2️⃣ Build events + updates in memory
  ------------------------------- */
  for (const { awb, events, origin, destination } of timelines) {
    const row = consignmentMap.get(awb);
    if (!row) continue;

    if (
      ['DELIVERED', 'RTO_DELIVERED', 'CANCELLED', 'LOST']
        .includes(row.normalized_status ?? '')
    ) continue;

    const lastKnownTime = row.last_status_at?.getTime() ?? 0;

    const parsed = events
      .map(e => ({
        consignment_id: row.id,
        awb,
        provider: 'DTDC',
        status: e.statusDescription ?? '',
        location: e.actCityName ?? e.actBranchName ?? null,
        remarks: e.remarks ?? null,
        event_time: e.statusTimestamp
          ? new Date(e.statusTimestamp.replace(' ', 'T'))
          : null,
      }))
      .filter(e => e.event_time)
      .sort((a, b) => a.event_time!.getTime() - b.event_time!.getTime());

    const fresh = parsed.filter(
      e => e.event_time!.getTime() > lastKnownTime,
    );

    if (!fresh.length) continue;

    newEvents.push(...fresh);

    const latest = fresh[fresh.length - 1];
    const { normalized, group } = mapDtdcStatus(latest.status);

    updates.push({
      id: Number(row.id),
      origin,
      destination,
      current_status: latest.status,
      normalized_status: normalized,
      status_group: group,
      last_status_at: latest.event_time!,
    });
  }

  /* -------------------------------
     3️⃣ Bulk INSERT events (ONCE)
  ------------------------------- */
  if (newEvents.length) {
    await db
      .insert(trackingEvents)
      .values(newEvents)
      .onConflictDoNothing();
  }

  /* -------------------------------
     4️⃣ Bulk UPDATE consignments
  ------------------------------- */
  if (updates.length) {
    await bulkUpdateConsignments(updates);
  }
}

async function bulkUpdateConsignments(
  updates: Array<{
    id: number;
    origin: string | null;
    destination: string | null;
    current_status: string;
    normalized_status: string;
    status_group: string;
    last_status_at: Date;
  }>
) {
  if (!updates.length) return;

  const ids = updates.map(u => u.id);

  const currentStatusCase = sql.join(
    updates.map(
      u => sql`WHEN ${consignments.id} = ${u.id} THEN ${u.current_status}`
    ),
    sql` `
  );

  const normalizedStatusCase = sql.join(
    updates.map(
      u => sql`WHEN ${consignments.id} = ${u.id} THEN ${u.normalized_status}`
    ),
    sql` `
  );

  const statusGroupCase = sql.join(
    updates.map(
      u => sql`WHEN ${consignments.id} = ${u.id} THEN ${u.status_group}`
    ),
    sql` `
  );

  const lastStatusAtCase = sql.join(
    updates.map(
      u => sql`WHEN ${consignments.id} = ${u.id} THEN ${u.last_status_at}`
    ),
    sql` `
  );

  const originCase = sql.join(
    updates.map(
      u => sql`WHEN ${consignments.id} = ${u.id} THEN ${u.origin}`
    ),
    sql` `
  );

  const destinationCase = sql.join(
    updates.map(
      u => sql`WHEN ${consignments.id} = ${u.id} THEN ${u.destination}`
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
      origin = COALESCE(
        CASE ${originCase} ELSE origin END,
        origin
      ),
      destination = COALESCE(
        CASE ${destinationCase} ELSE destination END,
        destination
      ),
    WHERE ${consignments.id} IN (${sql.join(ids, sql`, `)});
  `);
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
