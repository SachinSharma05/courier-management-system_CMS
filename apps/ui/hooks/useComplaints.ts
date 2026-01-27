import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';

/* =========================
   CLIENT (MY COMPLAINTS)
========================= */

export function useMyComplaints() {
  return useQuery({
    queryKey: ['complaints', 'my'],
    queryFn: async () => {
      const res = await api.get('/complaints/my');
      return res.data;
    },
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { awb: string; message: string }) => {
      const res = await api.post('/complaints', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints', 'my'] });
    },
  });
}
