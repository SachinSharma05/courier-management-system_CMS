import { api } from '@/lib/api/axios';

/* =========================
   EXISTING TYPES
========================= */

export type DashboardSummary = {
  totalShipments: number;
  delivered: number;
  inTransit: number;
  rto: number;
  activeClients: number;
};

export type ProviderPerformance = {
  provider: string;
  activeShipments: number;
  avgTatDays: number | null;
  rtoRate: number;
  healthScore: number;
};

/* =========================
   NEW TYPES
========================= */

export type ShipmentAgeing = {
  fresh: number;
  aging_24_48: number;
  aging_48_plus: number;
};

export type DailyBookingTrend = {
  day: string;
  total: number;
};

export type ProviderShare = {
  provider: string;
  total: number;
};

export type StuckShipment = {
  awb: string;
  provider: string;
  current_status: string | null;
  last_status_at: string;
};

export type YesterdayBookings = {
  total: number;
};

/* =========================
   HOOK FUNCTIONS
========================= */

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await api.get('/admin/dashboard/summary');
  return res.data;
}

export async function getProviderPerformance(): Promise<ProviderPerformance[]> {
  const res = await api.get('/admin/dashboard/performance');
  return res.data;
}

export async function getShipmentAgeing(): Promise<ShipmentAgeing> {
  const res = await api.get('/admin/dashboard/shipment-ageing');
  return res.data;
}

export async function getDailyBookingTrend(): Promise<DailyBookingTrend[]> {
  const res = await api.get('/admin/dashboard/daily-booking-trend');
  return res.data;
}

export async function getProviderShare(): Promise<ProviderShare[]> {
  const res = await api.get('/admin/dashboard/provider-share');
  return res.data;
}

export async function getStuckShipments(): Promise<StuckShipment[]> {
  const res = await api.get('/admin/dashboard/stuck-shipments');
  return res.data;
}

export async function getYesterdayBookings(): Promise<YesterdayBookings> {
  const res = await api.get('/admin/dashboard/yesterday-bookings');
  return res.data;
}
