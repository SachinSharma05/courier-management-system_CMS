import { api } from '@/lib/api/axios';

export type BulkGroup = {
  code: string;
  awbs: string[];
};

export async function bulkTrackDtdc(groups: BulkGroup[]) {
  const res = await api.post('/admin/tracking/bulk/dtdc', {
    groups,
  });
  return res.data;
}

export async function bulkTrackDelhivery(groups: BulkGroup[]) {
  const awbs = groups.flatMap(g => g.awbs);

  const res = await api.post('/admin/tracking/delhivery/bulk', {
    clientId: 1,
    awbs,
  });
  return res.data;
}