import { Module } from '@nestjs/common';
import { SawmillController } from './sawmill.controller';
import { SawmillService } from './sawmill.service';

@Module({
  controllers: [SawmillController],
  providers: [SawmillService],
  exports: [SawmillService],
})
export class SawmillModule {}
