import { IsNumber, IsString } from 'class-validator';

export class CreateCredentialDto {
  @IsNumber()
  clientId: number;

  @IsString()
  provider: string;

  @IsString()
  key: string;        // e.g. api_token, customer_code

  @IsString()
  value: string;     // raw value (will be encrypted)
}