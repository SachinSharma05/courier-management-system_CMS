import { Module } from '@nestjs/common';
import { ClientLimitsController } from './clients/client-limits.controller';

@Module({
  controllers: [
    ClientLimitsController,
  ],
})
export class AdminModule {}