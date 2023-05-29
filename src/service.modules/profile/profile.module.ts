import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AxiosModule } from 'src/package.modules/axios/axios.module';

// import { ManageModule } from "../manage/manage.module";

@Module({
  imports: [AxiosModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
