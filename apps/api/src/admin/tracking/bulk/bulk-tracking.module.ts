import { Module } from '@nestjs/common';
import { BulkTrackingController } from './bulk-tracking.controller';
import { BulkTrackingService } from './bulk-tracking.service';
import { DtdcBulkAdapter } from './providers/dtdc.bulk.adapter';

@Module({
    controllers: [BulkTrackingController],
    providers: [BulkTrackingService, DtdcBulkAdapter]
})

export class BulkTrackingModule {}