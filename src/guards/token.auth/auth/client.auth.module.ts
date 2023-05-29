import { Module } from '@nestjs/common';
import { ClientAuthService } from './client.auth.service';

@Module({
  providers: [ClientAuthService],
  exports: [ClientAuthService],
})
export class ClientAuthModule {}
