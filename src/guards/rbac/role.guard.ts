import { Injectable, CanActivate, ExecutionContext, NotFoundException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from './role.decorator';
import { SessionRole } from './role.enum';
import { CommonException } from 'src/interceptors/exception/error.interceptor';
import { userCredentialDto } from '../session.auth/auth/user.auth.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<SessionRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) {
      return true;
    }
    const { authInfo } = context.switchToHttp().getRequest();

    await this.checkPermission(requiredRoles, authInfo);

    // await this.checkHandlerPermission(context.getHandler().name, authInfo);

    return true;
  }

  checkPermission(requiredRoles: SessionRole[], authInfo: userCredentialDto): Promise<void> {
    if (requiredRoles.some((role) => authInfo?.role?.includes(role))) {
      return Promise.resolve();
    }
    throw new CommonException({ message: 'unauthorized', errorCode: 1005 }, HttpStatus.UNAUTHORIZED);
  }
}
