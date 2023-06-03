import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { ExpoPushService } from './expo.push.service';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
// import { MailController } from './mail.controller';

// import { ManageModule } from "../manage/manage.module";

@Module({
  imports: [],
  controllers: [MessageController],
  providers: [MessageService, ExpoPushService],
  exports: [MessageService],
})
export class MessageModule {}
