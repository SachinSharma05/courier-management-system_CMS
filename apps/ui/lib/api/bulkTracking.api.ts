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