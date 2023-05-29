import { Subscription, Client } from '@prisma/client';
import { IsDefined, IsOptional, IsString, IsNotEmpty, Matches, IsEmail, IsNumber, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Expose, Type, Transform, plainToClass, plainToInstance } from 'class-transformer';
import { clientRegistrationDto } from 'src/guards/token.auth/token.auth.dto';

export class verifyReceiptIosDto {
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
  transactionId: string;
  @IsDefined()
  @Expose()
  @IsString()
  transactionReceipt: string;
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

export class receiptIosDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => clientRegistrationDto)
  @Expose()
  deviceInfo?: clientRegistrationDto;
  @Expose()
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => verifyReceiptIosDto)
  info: verifyReceiptIosDto;
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
