import { Module } from '@nestjs/common';
import { DelhiveryController } from './delhivery.controller';
import { DelhiveryService } from './delhivery.service';

@Module({
  controllers: [DelhiveryController],
  providers: [DelhiveryService],
  exports: [DelhiveryService],
})
export class DelhiveryC2CModule {}
