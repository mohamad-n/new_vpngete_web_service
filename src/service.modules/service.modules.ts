export * from './client/client.modules';
import { Module } from '@nestjs/common';
// import { AxiosModule } from 'src/package.modules/axios/axios.module';
import { StaticServeModule } from './serve.static/serve.static.module';
// import { UploadModule } from './upload/upload.module';
import { ClientModule } from './client/client.modules';
// import { SubscriptionModule } from './subscription/subscription.module';
import { UserModule } from './user/user.module';
import { VpsModule } from './vps/vps.module';
// import { SupportModule } from './support/support.module';
// import { ProfileModule } from './profile/profile.module';
// import { MailModule } from './mail/mail.module';
// import { SettingModule } from './setting/setting.module';
// import { TasksModule } from './task/task.module';
// import { ScheduleModule } from '@nestjs/schedule';
// import { VoucherModule } from './voucher/voucher.module';

@Module({
  imports: [
    // ScheduleModule.forRoot(),
    // TasksModule,
    ClientModule,
    UserModule,
    // SubscriptionModule,
    // UploadModule,
    StaticServeModule,
    VpsModule,
    // SupportModule,
    // ProfileModule,
    // MailModule,
    // SettingModule,
    // VoucherModule,
  ],
  exports: [ServiceModule],
})
export class ServiceModule {}
