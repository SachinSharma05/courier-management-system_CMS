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

export function useConsignments(params: any) {
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
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,          // 👈 important
    refetchOnWindowFocus: false
  });
}

export function useConsignmentEvents(awb?: string) {
  return useQuery({
    queryKey: ['consignment-events', awb],
    queryFn: async () => {
      const res = await api.get(`/admin/consignments/${awb}/details`);
      return res.data;
    },
    enabled: !!awb, 
    staleTime: 1000 * 60 * 5, 
  });
}

export function useConsignmentsSummary(clientId?: number) {
  return useQuery({
    queryKey: ['consignments-summary', clientId],
    queryFn: async () => {
      const res = await api.get('/admin/consignments/summary', {
        params: clientId ? { clientId } : {},
      });
      return res.data;
    },
    enabled: true,        // 👈 IMPORTANT
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}