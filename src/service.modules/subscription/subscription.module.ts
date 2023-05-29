import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { ClientModule } from '../service.modules';

// import { ManageModule } from "../manage/manage.module";

@Module({
  imports: [ClientModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
