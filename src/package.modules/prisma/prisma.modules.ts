import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
@Global()
@Module({
  // imports: [PrismaService],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
