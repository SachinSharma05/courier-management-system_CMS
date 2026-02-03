export type MarutiLoginResponse = {
  access_token: string;
  expires_in: number; // seconds (likely 86400)
};

export type StoredMarutiToken = {
  access_token: string;
  expires_at: Date;
};