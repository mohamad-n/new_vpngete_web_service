import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TokenAuthService } from './token.auth.service';
import { AccessTokenJwtStrategy } from './strategies/access.token.jwt.strategy';
import { RefreshTokenJwtStrategy } from './strategies/refresh.token.jwt.strategy';
import { ClientAuthModule } from './auth/client.auth.module';

@Module({
  imports: [ClientAuthModule, PassportModule, JwtModule.register({})],
  providers: [TokenAuthService, AccessTokenJwtStrategy, RefreshTokenJwtStrategy],
  exports: [TokenAuthService],
})
export class TokenAuthModule {}
