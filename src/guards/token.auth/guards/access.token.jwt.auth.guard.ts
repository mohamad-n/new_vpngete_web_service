// import { Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {}

import { ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../token.auth.decorator';
import { CommonException } from 'src/interceptors/exception/error.interceptor';

@Injectable()
export class AccessTokenJwtAuthGuard extends AuthGuard('jwt') {
  // canActivate(context: ExecutionContext) {
  //   // Add your custom authentication logic here
  //   // for example, call super.logIn(request) to establish a session.
  //   return super.canActivate(context);
  // }
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
  handleRequest(err, user, info, context) {
    const authInfo = user;
    // console.log('err ', err);

    // console.log('info ', info);
    // console.log('user', user);
    // console.log(context.getClass());

    // You can throw an exception based on either "info" or "err" arguments

    if (info?.message === 'jwt expired') {
      throw new CommonException({ message: 'ACCESS_TOKEN_EXPIRED' }, HttpStatus.UNAUTHORIZED);
    }

    if (err || !user) {
      throw err || new CommonException({ message: 'unauthorized' }, HttpStatus.UNAUTHORIZED);
    }

    if (!authInfo) {
      throw new CommonException({ message: 'malformed access token' }, HttpStatus.UNAUTHORIZED);
    }

    const request = context.switchToHttp().getRequest();
    request.authInfo = authInfo;
    // const { allowableRoles } = context.switchToHttp().getRequest();

    // if (!allowableRoles.includes(user.role)) {
    //   throw new UnauthorizedException('unauthorized user');
    // }
    return user;
  }
}
