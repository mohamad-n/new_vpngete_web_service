import { ThrottlerModule } from '@nestjs/throttler';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 30,
    }),
  ],
})
export class RateLimiterModule {}
