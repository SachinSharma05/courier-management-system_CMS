import { api } from '@/lib/api/axios';

export type DashboardSummary = {
  totalShipments: number;
  delivered: number;
  inTransit: number;
  failed: number;
  rto: number;
  activeClients: number;
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await api.get('/admin/dashboard/summary');
  return res.data;
}

export type LiveOpsRow = {
  provider: string;
  client: string;
  inTransit: number;
  delivered: number;
  failed: number;
  lastSync: string;
};

export async function getLiveOps(): Promise<LiveOpsRow[]> {
  const res = await api.get('/admin/dashboard/live-ops');
  return res.data;
}

export type AlertItem = {
  type: 'DLQ' | 'CREDENTIAL';
  entity: string;
  message: string;
  createdAt: string;
};

export async function getAlerts(): Promise<AlertItem[]> {
  const res = await api.get('/admin/dashboard/alerts');
  return res.data;
}