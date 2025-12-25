import { useQuery } from '@tanstack/react-query';
import { getProviders, ProviderOption } from '@/lib/api/providers.api';

export function useProviders() {
  return useQuery<ProviderOption[]>({
    queryKey: ['providers'],
    queryFn: getProviders,
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });
}