import { 
  DailyBookingTrend, 
  DashboardSummary, 
  ProviderPerformance, 
  ProviderShare, 
  ShipmentAgeing, 
  StuckShipment, 
  YesterdayBookings } 
from '@/app/admin/interface/adminInterface';
import { api } from '@/lib/api/axios';

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

export async function getDailyBookingTrend(days: number = 7): Promise<DailyBookingTrend[]> {
  const res = await api.get(`/admin/dashboard/get-daily-booking-trend?days=${days}`);
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
