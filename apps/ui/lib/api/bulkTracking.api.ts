import { BulkGroup } from '@/app/admin/interface/adminInterface';
import { api } from '@/lib/api/axios';

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