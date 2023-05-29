// import { Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {}

import { ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../session.auth.decorator';
import { CommonException } from 'src/interceptors/exception/error.interceptor';

@Injectable()
export class SessionJwtAuthGuard extends AuthGuard('session-jwt') {
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
    // console.log('info ===>', info);
    // console.log('user', user);
    // console.log('err', err);

    const authInfo = user;

    // console.log(context.getClass());
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new CommonException({ message: 'unauthorized' }, HttpStatus.UNAUTHORIZED);
    }

    if (!authInfo.data) {
      throw new CommonException({ message: authInfo.message }, HttpStatus.UNAUTHORIZED);
    }

    const request = context.switchToHttp().getRequest();
    request.authInfo = authInfo.data;
    // const { allowableRoles } = context.switchToHttp().getRequest();

    // if (!allowableRoles.includes(user.role)) {
    //   throw new UnauthorizedException('unaouthorized user');
    // }
    return user;
  }
}
