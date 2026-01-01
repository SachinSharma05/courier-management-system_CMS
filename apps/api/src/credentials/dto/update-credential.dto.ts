import { IsNumber, IsString } from 'class-validator';

export class UpdateCredentialDto {
  @IsNumber()
  id: number;         // credential row id

  @IsString()
  value: string;     // new raw value
}