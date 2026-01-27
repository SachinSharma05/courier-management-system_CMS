import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';

/* =========================
   ADMIN / ASSOCIATE
========================= */

export function useAllComplaints() {
  return useQuery({
    queryKey: ['complaints', 'admin'],
    queryFn: async () => {
      const res = await api.get('/admin/complaints');
      return res.data;
    },
  });
}

export function useUpdateComplaintStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: number;
      status: 'open' | 'in_progress' | 'resolved';
      resolution_comment?: string;
    }) => {
      const res = await api.patch(
        `/admin/complaints/${params.id}`,
        {
          status: params.status,
          resolution_comment: params.resolution_comment ?? null,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints', 'admin'] });
    },
  });
}

