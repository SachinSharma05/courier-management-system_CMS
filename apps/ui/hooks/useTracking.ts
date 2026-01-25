import { api } from "@/lib/api/axios";
import { useQuery } from "@tanstack/react-query";

export function useTracking(awbs?: string) {
  return useQuery({
    // We include the string of AWBs in the key so that 
    // changing the search input refreshes the cache.
    queryKey: ['tracking', awbs], 
    queryFn: async () => {
      // The 'awbs' here is the comma-separated string from your input
      const res = await api.get('/admin/tracking', {
        params: { awb: awbs },
      });
      return res.data; // This now returns [{ consignment, timeline }, ...]
    },
    enabled: !!awbs && awbs.trim().length > 0,
    staleTime: 30_000, // 30 seconds
  });
}