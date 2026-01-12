// apps/api/src/rbac/rbac.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';

@Controller('rbac')
export class RbacController {
  constructor(private readonly service: RbacService) {}

  @Get('roles')
  getRoles() {
    return this.service.getRolesWithPermissions();
  }

  @Post('roles/:roleId')
  updateRolePermissions(
    @Param('roleId') roleId: string,
    @Body() body: UpdateRolePermissionsDto,
  ) {
    return this.service.updateRolePermissions(roleId, body);
  }
}
