import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { ProfileController } from './profile.controller';
import { PrivateProfileService } from './private.profile.service';
import { AxiosModule } from 'src/package.modules/axios/axios.module';
import { PublicProfileService } from './public.profile.service';

// import { ManageModule } from "../manage/manage.module";

@Module({
  imports: [AxiosModule],
  controllers: [ProfileController],
  providers: [PrivateProfileService, PublicProfileService],
})
export class ProfileModule {}
