import { IsDefined, IsOptional, IsString, IsNotEmpty, Matches, IsEmail, IsNumber, IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import { Expose, Type, Transform } from 'class-transformer';

export class settingIosVersionDto {
  @IsDefined()
  @Expose()
  @IsString()
  version: string;
  @IsDefined()
  @Expose()
  @IsString()
  link: string;
  @IsDefined()
  @Expose()
  changes: string[];
}

// export class versionChangesDto {
//   @IsDefined()
//   @Expose()
//   @IsString()
//   changes: string;
// }

export class settingVersionDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => settingIosVersionDto)
  @Expose()
  public ios?: settingIosVersionDto;
}
