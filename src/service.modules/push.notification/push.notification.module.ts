import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { ExpoPushService } from './expo.push.service';
import { PushNotificationService } from './push.notification.service';
import { PushNotificationController } from './push.notification.controller';
// import { MailController } from './mail.controller';

// import { ManageModule } from "../manage/manage.module";

@Module({
  imports: [],
  controllers: [PushNotificationController],
  providers: [PushNotificationService, ExpoPushService],
  exports: [PushNotificationService],
})
export class PushNotificationModule {}
