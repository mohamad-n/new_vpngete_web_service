import { Subscription, Client } from '@prisma/client';
import { IsDefined, IsOptional, IsString, IsNotEmpty, Matches, IsEmail, IsNumber } from 'class-validator';
import { Expose, Type, Transform } from 'class-transformer';

export class getProfileDto {
  @IsDefined()
  @Expose()
  @IsNumber()
  id: number;
}
