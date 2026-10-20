import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SupplierModule } from './supplier/supplier.module';
import { LogModule } from './log/log.module';
import { SawmillModule } from './sawmill/sawmill.module';
import { DryKilnModule } from './dry-kiln/dry-kiln.module';

@Module({
  imports: [
    PrismaModule,
    SupplierModule,
    LogModule,
    SawmillModule,
    DryKilnModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}