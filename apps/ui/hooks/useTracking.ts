import { api } from "@/lib/api/axios";
import { useQuery } from "@tanstack/react-query";

export function useTracking(awb: string) {
  return useQuery({
    queryKey: ['tracking', awb],
    enabled: !!awb,
    queryFn: async () => {
      const res = await api.get(`/admin/tracking/${awb}`);
      return res.data;
    },
  });
}
