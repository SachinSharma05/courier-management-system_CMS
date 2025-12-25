import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';

export type Consignment = {
  id: number;
  awb: string;
  provider: string;
  status: string;
  booked: string;
  lastUpdated: string;
  origin: string;
  destination: string;
  createdAt: string;
  client: string;
};

export function useConsignments(params) {
  return useQuery({
    queryKey: [
      'consignments',
      params.page,
      params.limit,
      params.awb,
      params.clientId,
      params.provider,
      params.status,
      params.from,
      params.to,
    ],
    queryFn: async () => {
      const res = await api.get('/admin/consignments', { params });
      return res.data;
    },
    keepPreviousData: true,
    staleTime: 30_000,          // 👈 important
    refetchOnWindowFocus: false
  });
}