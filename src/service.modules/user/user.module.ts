import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SessionAuthModule } from 'src/guards/session.auth/session.auth.module';

@Module({
  imports: [SessionAuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
