import { IsDefined, IsOptional, IsString, IsNotEmpty, Matches, IsNumber, IsBoolean } from 'class-validator';
import { Expose, Type, Transform } from 'class-transformer';

// export interface ClientDto extends Client {
//   subscription?: Subscription[] | undefined;
// }

export class vpsCreateDto {
  @IsDefined()
  @Expose()
  @IsString()
  ip: string;
  @IsDefined()
  @Expose()
  @IsString()
  port: string;
  @IsDefined()
  @Expose()
  @IsString()
  key: string;
  @IsDefined()
  @Expose()
  @IsString()
  name: string;
}

export class vpsUpdateDto extends vpsCreateDto {
  @IsDefined()
  @Expose()
  @IsNumber()
  id: number;
  @Expose()
  isActive: boolean;
  @Expose()
  scannable: boolean;
}
