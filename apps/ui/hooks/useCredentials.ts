import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import toast from 'react-hot-toast';

/* -----------------------------
   Types
------------------------------ */

export type Credential = {
  id: number;
  key: string;           // env_key
  provider: string;
  createdAt: string;
};

type CreateCredentialPayload = {
  clientId: number;
  provider: string;
  key: string;
  value: string;
};

type UpdateCredentialPayload = {
  id: number;
  value: string;
};

/* -----------------------------
   Fetch credentials
------------------------------ */
export function useCredentials(
  clientId?: number,
  provider?: string,
) {
  return useQuery({
    queryKey: ['credentials', clientId, provider],
    enabled: !!clientId && !!provider,
    queryFn: async (): Promise<Credential[]> => {
      const res = await api.get('/admin/credentials', {
        params: { clientId, provider },
      });
      return res.data;
    },
    staleTime: 30_000,
  });
}

/* -----------------------------
   Create credential
------------------------------ */
export function useCreateCredential() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCredentialPayload) => {
      const res = await api.post('/admin/credentials', payload);
      return res.data;
    },
    onSuccess: (_, vars) => {
      toast.success('Credential saved');
      qc.invalidateQueries({
        queryKey: ['credentials', vars.clientId, vars.provider],
      });
    },
    onError: () => {
      toast.error('Failed to save credential');
    },
  });
}

/* -----------------------------
   Update credential
------------------------------ */
export function useUpdateCredential(
  clientId: number,
  provider: string,
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateCredentialPayload) => {
      const res = await api.patch('/admin/credentials', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Credential updated');
      qc.invalidateQueries({
        queryKey: ['credentials', clientId, provider],
      });
    },
    onError: () => {
      toast.error('Failed to update credential');
    },
  });
}