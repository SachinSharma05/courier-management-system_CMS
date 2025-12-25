import { Injectable } from '@nestjs/common';
import { db } from '../../db';
import { trackingEvents } from '../../db/schema';
import { desc, eq } from 'drizzle-orm';

@Injectable()
export class TrackingService {
  async byAwb(awb: string) {
    return db
      .select()
      .from(trackingEvents)
      .where(eq(trackingEvents.awb, awb))
      .orderBy(desc(trackingEvents.event_time));
  }
}
