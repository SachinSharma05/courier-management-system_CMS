export type BulkAwbDto = {
  awb: string;
  reference_number?: string | null;
  origin_pincode?: string | null;
  destination_pincode?: string | null;
  booked_at?: string | null;
};

export type BulkGroupDto = {
  code: string;
  awbs: BulkAwbDto[];
};

export type BulkUploadDto = {
  groups: BulkGroupDto[];
};
