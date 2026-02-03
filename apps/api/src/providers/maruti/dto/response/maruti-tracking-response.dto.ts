export interface MarutiTrackingResponse {
  orderStatus?: string;
  status?: string;
  currentStatus?: string;

  // keep extra fields open but typed
  history?: Array<{
    status: string;
    location?: string;
    timestamp?: string;
  }>;
}