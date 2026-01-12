// apps/api/src/rbac/dto/update-role-permissions.dto.ts
export class UpdateRolePermissionsDto {
  permissions: {
    permissionKey: string;
    canRead: boolean;
    canWrite: boolean;
    canFull: boolean;
  }[];
}