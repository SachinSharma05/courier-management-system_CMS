// apps/api/src/auth/permission.guard.ts
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PERMISSION_KEY } from './permission.decorator';

export class PermissionGuard implements CanActivate {
  reflector: any;
  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user; // from JWT
    const required = this.reflector.get(PERMISSION_KEY, ctx.getHandler());

    if (!required) return true;

    return user.permissions.some(
      p => p.key === required && (p.canRead || p.canFull),
    );
  }
}