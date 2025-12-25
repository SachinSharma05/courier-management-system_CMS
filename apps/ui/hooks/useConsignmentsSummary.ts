import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';

export function useConsignmentsSummary(clientId?: number) {
  return useQuery({
    queryKey: ['consignments-summary', clientId],
    queryFn: async () => {
      const res = await api.get('/admin/consignments/summary', {
        params: clientId ? { clientId } : {},
      });
      return res.data;
    },
    enabled: !!clientId,        // 👈 IMPORTANT
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}