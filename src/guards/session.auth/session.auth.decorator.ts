import { ConflictException, SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const PublicForSessionBase = () => SetMetadata(IS_PUBLIC_KEY, true);

export const AuthInfo = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.authInfo;
});

export const GetUserUniqueId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const {
    authInfo: { uniqueId, role },
  } = ctx.switchToHttp().getRequest();
  return { uniqueId, role };
});

export const GetTokenFromHeader = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const {
    headers: { authorization },
  } = ctx.switchToHttp().getRequest();

  if (!authorization) {
    throw new ConflictException('token not exist');
  }
  return authorization;
});

export const GetSecretFromHeader = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  // const request = ctx.switchToHttp().getRequest();
  // if (!request?.headers?.authorization) {
  //   throw new ConflictException('token not exist');
  // }
  // return request?.headers?.authorization;

  const {
    headers: { secret },
  } = ctx.switchToHttp().getRequest();

  if (!secret) {
    throw new ConflictException('secret not exist');
  }
  return secret;
});
