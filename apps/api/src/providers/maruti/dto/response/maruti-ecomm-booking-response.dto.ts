export interface MarutiEcommBookingResponse {
  success?: boolean;
  awbNumber?: string;
  cAwbNumber?: string;
  message?: string;

  // keep extra fields flexible
  [key: string]: unknown;
}