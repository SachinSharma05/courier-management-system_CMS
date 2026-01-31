import { api } from '@/lib/api/axios';

export type BulkGroup = {
  code: string;
  awbs: {
    awb: string;
    reference_number: string | null;
    origin_pincode: string | null;
    destination_pincode: string | null;
    booked_at: string | null;
  }[];
};

export async function bulkTrackDtdc(groups: BulkGroup[]) {
  const res = await api.post('/admin/tracking/bulk/dtdc', {
    groups,
  });
  return res.data;
}

export async function bulkTrackDelhivery(groups: BulkGroup[]) {
  const res = await api.post('/admin/tracking/delhivery/bulk', {
    groups,
  });
  return res.data;
}