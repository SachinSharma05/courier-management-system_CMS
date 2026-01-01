import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';

@Controller('admin/credentials')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin')
export class CredentialsController {
  constructor(private readonly service: CredentialsService) {}

  /**
   * GET credentials for a client + provider
   * (values masked by default)
   */
  @Get()
  async list(
    @Query('clientId') clientId: number,
    @Query('provider') provider: string,
  ) {
    return this.service.getCredentials(clientId, provider);
  }

  /**
   * CREATE credential (first time)
   */
  @Post()
  async create(@Body() dto: CreateCredentialDto) {
    return this.service.createCredential(dto);
  }

  /**
   * UPDATE credential value
   */
  @Patch()
  async update(@Body() dto: UpdateCredentialDto) {
    return this.service.updateCredential(dto);
  }
}