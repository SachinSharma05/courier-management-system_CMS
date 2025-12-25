import { ProviderKey } from '../constants/provider';

export interface CourierCredentials {
  apiKey: string;
  // later: username, password, token, etc.
}

export interface CourierTrackingEvent {
  status: string;
  location?: string;
  event_time: Date;
  raw: unknown;
}

export interface CourierAdapter {
  provider: ProviderKey;
  track(clientId: number, awb: string): Promise<{
    status: string;
    location?: string;
    event_time?: Date;
    raw: any;
  }>;
}
