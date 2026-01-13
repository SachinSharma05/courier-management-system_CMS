import { CreateShipmentDto } from './dto/create-shipment.dto';

export function mapCreateShipment(dto: CreateShipmentDto) {
  return {
    shipments: [
      {
        order: dto.orderId,
        pin: dto.deliveryPin,
        origin: dto.pickupPin,
        consignee: dto.consignee,
        shipment_items: dto.items,
      },
    ],
  };
}