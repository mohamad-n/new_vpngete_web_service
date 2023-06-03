import { ConflictException, SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { appVersionDto, clientDto } from './token.auth.dto';

export const IS_PUBLIC_KEY = 'isPublic';
export const PublicForTokenBase = () => SetMetadata(IS_PUBLIC_KEY, true);

export const AuthInfo = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.authInfo;
});

export const GetClientUniqueIds = createParamDecorator((data: unknown, ctx: ExecutionContext): clientDto => {
  const request = ctx.switchToHttp().getRequest();
  const {
    authInfo: { clientUuid },
  } = request;

  return { clientUuid };
});

export const GetClientAppVersionInfo = createParamDecorator((data: unknown, ctx: ExecutionContext): appVersionDto => {
  const request = ctx.switchToHttp().getRequest();

  const appVersionString = request.headers['x-app-version'];
  if (appVersionString && JSON.parse(appVersionString)) {
    const appVersion = JSON.parse(appVersionString);

    // console.log('>>>>>>>>>>>', appVersion?.productionMode);
    return { version: appVersion?.version, build: appVersion?.build, productionMode: appVersion?.productionMode };
  }
  return null;
});
export const GetClientRefreshTokenInfo = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const {
    authInfo: { clientUuid, refreshToken, refreshTokenId },
  } = ctx.switchToHttp().getRequest();
  return { clientUuid, refreshToken, refreshTokenId };
});
