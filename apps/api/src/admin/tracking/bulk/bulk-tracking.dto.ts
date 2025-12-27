export type BulkGroupDto = {
  code: string;        // DTDC customer code
  awbs: string[];
};

export type BulkUploadDto = {
  groups: BulkGroupDto[];
};