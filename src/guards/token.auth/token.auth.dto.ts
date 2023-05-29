import { IsDefined, IsOptional, IsString, IsNotEmpty, Matches, IsNumber } from 'class-validator';
import { Expose, Type, Transform } from 'class-transformer';
import { DeviceOS } from '@prisma/client';

export class refreshTokenPayloadDto {
  @IsDefined()
  @Expose()
  clientUuid: string;
  @IsDefined()
  @Expose()
  refreshToken: string;
  @IsDefined()
  @Expose()
  refreshTokenId: number;
}

export class clientRegistrationDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Expose()
  deviceSpecificId: string;
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Expose()
  deviceManufacturer: string;
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Expose()
  @Transform(({ value }) => value?.toUpperCase())
  deviceOs: DeviceOS;
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Expose()
  deviceOsVersion: string;
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Expose()
  appVersion: string;
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Expose()
  deviceModelName: string;
  @Expose()
  @IsDefined()
  @IsString()
  email: string;
  @Expose()
  @IsDefined()
  @IsString()
  password: string;
  @Expose()
  timeZone?: string;
}

export class clientDto {
  @IsDefined()
  @Expose()
  @IsString()
  clientUuid: string;
}

export class appVersionDto {
  @Expose()
  version?: string;
  @Expose()
  build?: string;
  @Expose()
  productionMode?: boolean;
}
