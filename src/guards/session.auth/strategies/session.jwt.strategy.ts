import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import configuration from 'src/config/configuration';

@Injectable()
export class SessionJwtStrategy extends PassportStrategy(Strategy, 'session-jwt') {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        return req.cookies['access_token'];
      },
      ignoreExpiration: false,
      secretOrKey: configuration().SESSION_AUTH_JWT,
    });
  }

  async validate(payload: any) {
    try {
      return { data: payload, message: null };
    } catch (error) {
      return { data: null, message: error };
    }
  }
}
