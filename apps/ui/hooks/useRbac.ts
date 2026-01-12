// hooks/useRbac.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';

export type RolePermissionPayload = {
  roleId: string;
  permissions: {
    permissionKey: string;
    canRead: boolean;
    canWrite: boolean;
    canFull: boolean;
  }[];
};

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => api.get('/rbac/roles').then(r => r.data),
  });
}

export function useUpdateRole() {
  return useMutation({
    mutationFn: ({ roleId, permissions }: RolePermissionPayload) =>
      api.post(`/rbac/roles/${roleId}`, { permissions }),
  });
}
