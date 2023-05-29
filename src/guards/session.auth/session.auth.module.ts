import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SessionAuthService } from './session.auth.service';
import { SessionJwtStrategy } from './strategies/session.jwt.strategy';
import configuration from 'src/config/configuration';
import { UserAuthModule } from './auth/user.auth.module';

@Module({
  imports: [
    UserAuthModule,
    PassportModule,
    JwtModule.register({
      secret: configuration().SESSION_AUTH_JWT,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [SessionAuthService, SessionJwtStrategy],
  exports: [SessionAuthService],
})
export class SessionAuthModule {}
