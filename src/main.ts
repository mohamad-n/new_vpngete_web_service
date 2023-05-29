import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import { PrismaService } from './package.modules/prisma/prisma.service';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { CommonException } from './interceptors/exception/error.interceptor';
import configuration from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: configuration().NODE_ENV === 'development' ? configuration().DEV_ORIGINS : configuration().PROD_ORIGINS,
      credentials: true,
      //
      methods: ['GET', 'PUT', 'POST', 'DELETE'],
    },

    logger: ['error', 'warn', 'verbose', 'debug', 'log'],
  });

  Sentry.init({
    dsn: configuration().SENTRY.DSN,
    environment: configuration().NODE_ENV,
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api/v2');

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  //----- run server on port -----
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { excludeExtraneousValues: true },
      // disableErrorMessages: false,
      exceptionFactory: (errors) => {
        // console.log('>>>>>>>>>>>', errors);
        const messagesObjects = errors[0]?.constraints || errors[0]?.children[0]?.constraints;

        const message = Object.keys(messagesObjects)
          .map((key, index) => {
            return messagesObjects[key];
          })
          .pop();
        throw new CommonException({ message, errorCode: 9000 });
      },
    })
  );
  await app.listen(configuration().PORT);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
