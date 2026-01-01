import { api } from '@/lib/api/axios';

export type ClientOption = {
  id: number;
  name: string;
};

export type CreateClientDto = {
  companyName: string;
  email?: string;
  phone?: string;
  role: string;
  isActive: boolean;
}

export type UpdateClientDto = {
  companyName?: string;
  companyAddress?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  providers?: string[];
  isActive?: boolean;
}

export async function getClients(): Promise<ClientOption[]> {
  const res = await api.get('/admin/clients');
  return res.data;
}

export async function createClient(payload: CreateClientDto) {
  const res = await api.post('/admin/clients', payload);
  return res.data;
}

export async function updateClient(
  clientId: number,
  payload: UpdateClientDto,
) {
  const res = await api.patch(`/admin/clients/${clientId}`, payload);
  return res.data;
}
