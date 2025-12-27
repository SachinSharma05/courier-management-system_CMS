import { api } from "@/lib/api/axios";
import { useQuery } from "@tanstack/react-query";

export function useTracking(awb?: string) {
  return useQuery({
    queryKey: ['tracking', awb],
    queryFn: async () => {
      const res = await api.get('/admin/tracking', {
        params: { awb },
      });
      return res.data;
    },
    enabled: !!awb,
    staleTime: 30_000,
  });
}