import { Module, Global } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';

@Global()
@Module({
  controllers: [CredentialsController],
  providers: [CredentialsService],
})
export class CredentialsModule {}