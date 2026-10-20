import { Module } from '@nestjs/common';
import { DryKilnController } from './dry-kiln.controller';
import { DryKilnService } from './dry-kiln.service';

@Module({
  controllers: [DryKilnController],
  providers: [DryKilnService],
  exports: [DryKilnService],
})
export class DryKilnModule {}
