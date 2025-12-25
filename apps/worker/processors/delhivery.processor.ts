export async function pollDelhivery(awb: string) {
  // TEMP MOCK (replace with real API)
  return {
    status: 'In Transit',
    location: 'Delhi',
    event_time: new Date(),
    raw: {},
  };
}