export async function trackShipment(trackingNo: string) {
  return Promise.resolve({
    trackingNo,
    status: 'In Transit',
    lastUpdate: '2025-01-10 14:32',
  });
}