import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { TokenAuthModule } from 'src/guards/token.auth/token.auth.module';
// import { ManageModule } from "../manage/manage.module";

@Module({
  imports: [TokenAuthModule],
  controllers: [ClientController],
  exports: [ClientService],
  providers: [ClientService],
})
export class ClientModule {}
// export class ClientModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(SecretValidationMiddleware)
//       .forRoutes(
//         { path: "client/identifier/token", method: RequestMethod.POST },
//         { path: "client/vocher", method: RequestMethod.POST },
//         { path: "client/refresh/token", method: RequestMethod.GET }
//       );
//   }
// }
