import { Subscription, Client } from '@prisma/client';
import { IsDefined, IsOptional, IsString, IsNotEmpty, Matches, IsEmail, IsNumber, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Expose, Type, Transform, plainToClass, plainToInstance } from 'class-transformer';
import { clientRegistrationDto } from 'src/guards/token.auth/token.auth.dto';

export class chargeDto {
  @IsDefined()
  @Expose()
  @IsNumber()
  amount: number;
  @IsDefined()
  @Expose()
  @IsNumber()
  agentId: number;
}

export class createVoucherDto {
  @IsDefined()
  @Expose()
  @IsString()
  alias: string;
  @IsDefined()
  @Expose()
  @IsNumber()
  duration: number;
  @IsDefined()
  @Expose()
  @IsNumber()
  validationDurationInHour: number;
}

export class verifyAlreadyReceiptIosDto {
  @IsDefined()
  @Expose()
  @IsString()
  productId: string;
  @IsDefined()
  @Expose()
  transactionDate: bigint;
  @IsDefined()
  @Expose()
  @IsString()
  transactionReceipt: string;
  @IsDefined()
  @Expose()
  @IsString()
  originalTransactionIdentifierIOS: string;
  @IsDefined()
  @Expose()
  originalTransactionDateIOS: bigint;
}

export class recheckReceiptIosDto {
  @Expose()
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => clientRegistrationDto)
  deviceInfo: clientRegistrationDto;
  @Expose()
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => verifyAlreadyReceiptIosDto)
  info: verifyAlreadyReceiptIosDto;
}
