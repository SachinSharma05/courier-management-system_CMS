import { useQuery } from '@tanstack/react-query';
import { getClients, ClientOption } from '@/lib/api/clients.api';

export function useClients() {
  return useQuery<ClientOption[]>({
    queryKey: ['clients'],
    queryFn: getClients,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30,    // 30 minutes (Renamed from cacheTime)
  });
}