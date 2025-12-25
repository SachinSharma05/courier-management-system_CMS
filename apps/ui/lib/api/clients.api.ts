import { api } from '@/lib/api/axios';

export type ClientOption = {
  id: number;
  name: string;
};

export async function getClients(): Promise<ClientOption[]> {
  const res = await api.get('/admin/clients');
  return res.data;
}