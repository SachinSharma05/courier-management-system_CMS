import { Module } from '@nestjs/common';
import { DlqController } from './dlq/dlq.controller';
import { ClientLimitsController } from './clients/client-limits.controller';

@Module({
  controllers: [
    DlqController,
    ClientLimitsController,
  ],
})
export class AdminModule {}