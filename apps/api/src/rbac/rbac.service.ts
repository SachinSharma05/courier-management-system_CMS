// apps/api/src/rbac/rbac.service.ts
import { eq, inArray } from 'drizzle-orm';
import { db } from '../db';
import { roles, permissions, rolePermissions } from '../db/schema';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';

export class RbacService {
  async getRolesWithPermissions() {
  const allPermissions = await db.select().from(permissions);
  const allRoles = await db.select().from(roles);

  const rolePerms = await db.select().from(rolePermissions);

  return allRoles.map(role => ({
    ...role,
    permissions: allPermissions.map(p => {
      const rp = rolePerms.find(
        r => r.roleId === role.id && r.permissionId === p.id,
      );

      return {
        permissionKey: p.key,
        canRead: rp?.canRead ?? false,
        canWrite: rp?.canWrite ?? false,
        canFull: rp?.canFull ?? false,
      };
    }),
  }));
}

  async updateRolePermissions(roleId: string, dto: UpdateRolePermissionsDto) {
    // 1. Fetch all permissions once to get their IDs based on the keys
    const allPermissions = await db
    .select({ id: permissions.id, key: permissions.key })
    .from(permissions)
    .where(
      inArray(
        permissions.key,
        dto.permissions.map((p) => p.permissionKey)
      )
    );

    // Create a quick lookup map for ID by Key
    const permMap = new Map(allPermissions.map((p) => [p.key, p.id]));

  // 2. Prepare the bulk data
  const valuesToInsert = dto.permissions.map((p) => {
    const permissionId = permMap.get(p.permissionKey);
    if (!permissionId) {
      throw new Error(`Permission key ${p.permissionKey} not found in database`);
    }
    return {
      roleId,
      permissionId,
      canRead: p.canRead,
      canWrite: p.canWrite,
      canFull: p.canFull,
    };
  });

  // 3. Execute as a Batch (This is Neon's way of doing transactions)
  // This sends everything in ONE HTTP request.
  await db.batch([
    db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId)),
    db.insert(rolePermissions).values(valuesToInsert),
  ]);

  return { success: true };
}
}