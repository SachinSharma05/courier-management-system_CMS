import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AuditModule } from './audit/audit.module';
import { ConsignmentsModule } from './admin/consignments/consignments.module';
import { DashboardModule } from './admin/dashboard/dashboard.module';
import { ClientsModule } from './admin/clients/clients.module';
import { ProvidersModule } from './admin/providers/providers.module';
import { TrackingModule } from './admin/tracking/tracking.module';
import { BulkTrackingModule } from './admin/tracking/bulk/bulk-tracking.module';
import { ProviderStatsModule } from './admin/providers/stats/provider-stats.module';
import { RateCardModule } from './admin/rate-cards/rate-cards.module';
import { CredentialsModule } from './credentials/credentials.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60, limit: 100 }],
    }),
    HealthModule,
    AuthModule,
    AdminModule,
    AuditModule,
    ConsignmentsModule,
    DashboardModule,
    ClientsModule,
    ProvidersModule,
    TrackingModule,
    BulkTrackingModule,
    ProviderStatsModule,
    RateCardModule,
    CredentialsModule,
  ],
  providers:[
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})

export class AppModule {}