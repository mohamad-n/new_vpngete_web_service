import { Subscription, Client, DeviceOS } from '@prisma/client';
import { IsDefined, IsOptional, IsString, IsNotEmpty, Matches, IsEmail } from 'class-validator';
import { Expose, Type, Transform } from 'class-transformer';

// export class clientResetPaswordRequestDto {
//   @IsDefined()
//   @Expose()
//   @IsString()
//   @Transform(({ value }) => value?.toLowerCase())
//   email: string;
// }

// export class clientResetPaswordVerifyDto {
//   @IsDefined()
//   @Expose()
//   @IsString()
//   password: string;
//   @IsDefined()
//   @Expose()
//   @IsString()
//   emailActivationCode: string;
//   @IsDefined()
//   @Expose()
//   @IsString()
//   uniqueId: string;
// }
