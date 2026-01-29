export interface DtdcPriceTatPayload {
  pickupPincode: string;
    deliveryPincode: string;
    srcCity: string;
    srcState: string;
    destCity: string;
    destState: string;
    weight: string;
    courierType: string;
    isQRBooking: boolean;
}