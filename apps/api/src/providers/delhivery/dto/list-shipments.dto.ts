// dto/list-shipments.dto.ts
export class ListShipmentsDto {
  page?: number = 1;
  limit?: number = 20;
  status?: string;
  search?: string;
}