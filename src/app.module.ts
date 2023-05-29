import { Module } from '@nestjs/common';
import { ServiceModule } from './service.modules/service.modules';
import { APP_INTERCEPTOR, APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response/response.interceptor';
import { CustomHttpException } from './interceptors/exception/error.interceptor';
// import { RolesGuard } from "./guards/rbac/role.guard";
// import { JwtAuthGuard } from "./guards/session.auth/guards/jwt.auth.guard";
import { UtilsModule } from './utils/utils.modules';
import { PrismaModule } from './package.modules/prisma/prisma.modules';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RateLimiterModule } from './guards/rate.limit/rate.limit.modules';
import { SentryInterceptor } from './interceptors/common/sentry.interceptor';

@Module({
  imports: [ServiceModule, UtilsModule, PrismaModule, RateLimiterModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: CustomHttpException,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
