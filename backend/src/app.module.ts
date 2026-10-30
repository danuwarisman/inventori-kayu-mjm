import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SupplierModule } from './supplier/supplier.module';
import { LogModule } from './log/log.module';
import { SawmillModule } from './sawmill/sawmill.module';
import { DryKilnModule } from './dry-kiln/dry-kiln.module';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    PrismaModule,
    SupplierModule,
    LogModule,
    SawmillModule,
    DryKilnModule,
    AuthModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}