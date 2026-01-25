import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../db';
import { consignments, trackingEvents } from '../../db/schema';
import { desc, inArray } from 'drizzle-orm';
import { computeMovement, computeTAT } from '../consignments/tat.engine';

@Injectable()
export class TrackingService {
  async trackMultipleByAwb(awbArray: string[]) {
    // 1. Fetch all consignments matching the AWB list
    const foundConsignments = await db
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
      .where(inArray(consignments.awb, awbArray));

    if (!foundConsignments.length) {
      throw new NotFoundException('No matching AWBs found');
    }

    // 2. Extract IDs to fetch all timeline events in one go
    const consignmentIds = foundConsignments.map((c) => c.id);

    const allEvents = await db
      .select({
        consignmentId: trackingEvents.consignment_id, // Need this to group them
        status: trackingEvents.status,
        description: trackingEvents.remarks,
        location: trackingEvents.location,
        eventAt: trackingEvents.event_time,
      })
      .from(trackingEvents)
      .where(inArray(trackingEvents.consignment_id, consignmentIds))
      .orderBy(desc(trackingEvents.event_time));

    // 3. Map events to their respective consignments
    return foundConsignments.map((c) => {
      const timeline = allEvents.filter((e) => e.consignmentId === c.id);
      
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
        timeline: timeline.map(({ consignmentId, ...event }) => event), // Remove ID from event object
      };
    });
  }
}