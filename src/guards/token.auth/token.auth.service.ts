import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { CommonException } from 'src/interceptors/exception/error.interceptor';
import configuration from 'src/config/configuration';
import { clientDto } from './token.auth.dto';

@Injectable()
export class TokenAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokenForClient(payload: clientDto, refreshTokenId: number): Promise<any> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: configuration().TOKEN_AUTH_JWT,
        expiresIn: `${configuration().TOKEN_AUTH_EXP_IN_DAY}d`,
      }),
      this.jwtService.signAsync(
        { refreshTokenId, ...payload },
        {
          secret: configuration().TOKEN_REFRESH_AUTH_JWT,
          expiresIn: `${configuration().TOKEN_REFRESH_AUTH_EXP_IN_DAY}d`,
        }
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
