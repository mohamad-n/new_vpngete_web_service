import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { VpsController } from './vps.controller';
import { PrivateVpsService } from './private.vps.service';
import { PublicVpsService } from './public.vps.service';
import { AxiosModule } from 'src/package.modules/axios/axios.module';

// import { ManageModule } from "../manage/manage.module";

@Module({
  imports: [AxiosModule],
  controllers: [VpsController],
  providers: [PrivateVpsService, PublicVpsService],
})
export class VpsModule {}
