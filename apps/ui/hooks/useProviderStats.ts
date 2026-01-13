// apps/ui/hooks/useProviderStats.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';

export function useProviderStats(provider: string) {
  return useQuery({
    queryKey: ['provider-stats', provider],
    queryFn: async () => {
      const { data } = await api.get(
        `/admin/providers/stats/${provider}/stats`,
        { params: { provider } },
      );
      return data;
    },
    refetchInterval: 60_000, // auto refresh every 1 min
  });
}
