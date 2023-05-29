import { Module } from '@nestjs/common';
import { UserAuthService } from './user.auth.service';

@Module({
  providers: [UserAuthService],
  exports: [UserAuthService],
})
export class UserAuthModule {}
