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

// TODO(auth): daftarkan APP_GUARD AuthGuard('jwt') di providers agar seluruh
// endpoint terlindungi, lalu pakai @Public() untuk route publik seperti login.
// Lihat catatan lengkap di src/auth/auth.module.ts.
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