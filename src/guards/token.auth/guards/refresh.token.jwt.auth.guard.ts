import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { CommonException } from 'src/interceptors/exception/error.interceptor';

@Injectable()
export class RefreshTokenJwtAuthGuard extends AuthGuard('jwt-refresh') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info, context) {
    const authInfo = user;
    // console.log('info ', info);
    // console.log('user', user);
    // console.log(context.getClass());
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new CommonException({ message: 'unauthorized' });
    }

    if (!authInfo) {
      throw new CommonException({ message: 'malformed refresh token' });
    }

    const request = context.switchToHttp().getRequest();
    request.authInfo = authInfo;

    // }
    return user;
  }
}
