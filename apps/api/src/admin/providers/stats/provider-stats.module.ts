import { Module } from '@nestjs/common';
import { ProviderStatsController } from './provider-stats.controller';
import { ProviderStatsService } from './provider-stats.service';

@Module({
    controllers: [ProviderStatsController],
    providers: [ProviderStatsService],
})

export class ProviderStatsModule {}