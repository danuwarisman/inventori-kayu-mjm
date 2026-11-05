
import { Module } from '@nestjs/common';
import { PembelianController } from './pembelian.controller';
import { PembelianService } from './pembelian.service';

@Module({
  controllers: [PembelianController],
  providers: [PembelianService],
})
export class PembelianModule {}
