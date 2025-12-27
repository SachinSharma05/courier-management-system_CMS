import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../db';
import { consignments, trackingEvents, users } from '../../db/schema';
import { desc, eq, and } from 'drizzle-orm';
import { computeMovement, computeTAT } from '../consignments/tat.engine';

@Injectable()
export class TrackingService {
  async trackByAwb(awb: string) {
    const consignment = await db
      .select({
        id: consignments.id,
        awb: consignments.awb,
        origin: consignments.origin,
        destination: consignments.destination,
        provider: consignments.provider,
        status: consignments.current_status,
        bookedAt: consignments.booked_at,
        lastUpdatedAt: consignments.last_status_at,
      })
      .from(consignments)
      .where(eq(consignments.awb, awb)
      )
      .limit(1);

    if (!consignment.length) {
      throw new NotFoundException('AWB not found');
    }

    const c = consignment[0];

    const events = await db
      .select({
        status: trackingEvents.status,
        description: trackingEvents.remarks,
        location: trackingEvents.location,
        eventAt: trackingEvents.event_time,
      })
      .from(trackingEvents)
      .where(eq(trackingEvents.consignment_id, c.id))
      .orderBy(desc(trackingEvents.event_time));

    return {
      consignment: {
        awb: c.awb,
        origin: c.origin,
        destination: c.destination,
        provider: c.provider,
        status: c.status,
        bookedAt: c.bookedAt,
        lastUpdatedAt: c.lastUpdatedAt,
        tat: computeTAT(c.awb, c.bookedAt, c.status),
        movement: computeMovement(c.lastUpdatedAt, c.status),
      },
      timeline: events,
    };
  }
}