import { IsDefined, IsEmail, IsOptional, IsString } from 'class-validator';
import { Expose, Type, Transform } from 'class-transformer';
import { SessionRole } from 'src/guards/rbac/role.enum';

export class userAuthDto {
  @IsDefined()
  @IsString()
  @IsEmail()
  @Expose()
  email: string;
  @IsDefined()
  @IsString()
  @Expose()
  password: SessionRole;
}

export type userInfoDto = {
  uniqueId: string;
  role: SessionRole;
};

export class userCredentialDto {
  @IsDefined()
  @Expose()
  uniqueId: string;
  @IsDefined()
  @Expose()
  role: SessionRole;
}
