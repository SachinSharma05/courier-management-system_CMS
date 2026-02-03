export interface MarutiLabelInvoiceItem {
  awbNumber: string;
  invoiceUrl?: string;
  shippingLabelUrl?: string;
}

export interface MarutiLabelInvoiceResponse {
  success: boolean;
  message?: string;
  data?: MarutiLabelInvoiceItem[];
}