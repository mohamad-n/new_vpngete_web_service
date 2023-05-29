import { Module, Global } from '@nestjs/common';
import { DateService } from './date.service';
import { IteratorService } from './iterator.service';
import { RandomService } from './random';
import { UtilsService } from './utils.service';
import { TransformService } from './transform.service';

@Global()
@Module({
  providers: [RandomService, IteratorService, UtilsService, DateService, TransformService],
  exports: [RandomService, IteratorService, UtilsService, DateService, TransformService],
})
export class UtilsModule {}
