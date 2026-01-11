import { Module } from '@nestjs/common';
import { BulkTrackingController } from './bulk-tracking.controller';
import { BulkTrackingService } from './bulk-tracking.service';
import { DtdcBulkAdapter } from '@cms/shared';

@Module({
    controllers: [BulkTrackingController],
    providers: [BulkTrackingService, DtdcBulkAdapter]
})

export class BulkTrackingModule {}