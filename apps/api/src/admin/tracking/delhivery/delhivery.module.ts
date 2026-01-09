import { Module } from '@nestjs/common';
import { DelhiveryController } from './delhivery.controller';
import { DelhiveryService } from './delhivery.service';

@Module({
  controllers: [DelhiveryController],
  providers: [DelhiveryService],
})

export class DelhiveryModule {}