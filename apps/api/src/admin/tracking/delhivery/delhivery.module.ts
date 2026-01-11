import { Module } from '@nestjs/common';
import { DelhiveryController } from './delhivery.controller';
import { DelhiveryService } from './delhivery.service';
import { DelhiveryBulkAdapter } from '@cms/shared';

@Module({
  controllers: [DelhiveryController],
  providers: [DelhiveryService, DelhiveryBulkAdapter],
})

export class DelhiveryModule {}