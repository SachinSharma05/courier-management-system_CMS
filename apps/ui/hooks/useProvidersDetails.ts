import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';

type Params = {
  provider: string;
  page: number;
  limit: number;
  status?: string;
  search?: string;
};

// types/provider-shipment.ts

export type Shipment = {
  id: string;
  awb: string;
  provider: string;
  current_status: string;
  created_at: string;
};

export type ShipmentListResponse = {
  data: Shipment[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export function useProviderShipments(params: Params) {
  return useQuery<ShipmentListResponse>({
    queryKey: ['provider-shipments', params],
    queryFn: async () => {
      const { data } = await api.get(
        `/providers/${params.provider}/shipments`,
        { params },
      );
      console.log("Data", data);
      return data;
    },
    keepPreviousData: true,
  });
}

export async function providerPincode(pin: string){
  const res = await api.get(`/providers/delhivery/pincode`, { params: { pin } });
  return res.data;
}