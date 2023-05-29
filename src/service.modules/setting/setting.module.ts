import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';

// import { ManageModule } from "../manage/manage.module";

@Module({
  imports: [],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {}
