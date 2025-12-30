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

// 1. Rename to reflect the new purpose
export type ProviderPerformance = {
  name: string;
  activeShipments: number;
  tat: string | number; // Average Turnaround Time in days
  rto: number;         // RTO percentage
  healthScore: number; // Calculated 0-100 score
};

// 2. Update the fetcher function
export async function getProviderPerformance(): Promise<ProviderPerformance[]> {
  const res = await api.get('/admin/dashboard/performance');
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