import { api } from '@/lib/api/axios';

export type ProviderOption = {
  id: number;
  name: string;
};

export async function getProviders(): Promise<ProviderOption[]> {
  const res = await api.get('/admin/providers');
  return res.data;
}