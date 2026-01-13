export class CreateShipmentDto {
  orderId: string;
  pickupPin: string;
  deliveryPin: string;
  consignee: any;
  items: any[];
}