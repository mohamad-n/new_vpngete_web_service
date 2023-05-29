import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configuration from 'src/config/configuration';
import { clientDto } from '../token.auth.dto';
import { ClientAuthService } from '../auth/client.auth.service';

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().TOKEN_AUTH_JWT,
    });
  }

  async validate(payload: clientDto) {
    return payload;
    // return this.clientAuthService.authenticateClient(payload);
  }
}
