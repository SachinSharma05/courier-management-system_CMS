export interface DtdcServiceabilityRequest {
  origin_pincode: string;
  destination_pincode: string;
  product_type?: 'D' | 'N'; // D = Domestic, N = Non-doc
}

export interface DtdcServiceabilityRawResponse {
  status: boolean;
  message?: string;
  data?: any;
}