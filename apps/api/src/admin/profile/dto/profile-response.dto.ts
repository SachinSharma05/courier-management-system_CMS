export class ProfileResponseDto {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  isActive: boolean;
  createdAt: Date;
}