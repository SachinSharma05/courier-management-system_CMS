import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';

export function useRateCard(provider: string, service: string, clientId: number | null) {
  return useQuery({
    queryKey: ['rate-card', provider, service, clientId],
    queryFn: async () => {
      const res = await api.get('/admin/rate-cards', {
        params: {
          provider,
          serviceType: service.toLowerCase(),
          clientId,
        },
      });
      return res.data;
    },
    enabled: !!provider && !!service,
    staleTime: 60_000,
  });
}
