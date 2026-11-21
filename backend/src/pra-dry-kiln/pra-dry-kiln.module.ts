import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PraDryKilnService } from './pra-dry-kiln.service';
import { PraDryKilnController } from './pra-dry-kiln.controller';

@Module({
  imports: [PrismaModule],
  providers: [PraDryKilnService],
  controllers: [PraDryKilnController],
})
export class PraDryKilnModule {}