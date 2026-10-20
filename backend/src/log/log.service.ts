import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';

@Injectable()
export class LogService {
  constructor(private readonly prisma: PrismaService) {}

  private mapLog(item: any) {
    const p = item.panjang ? Number(item.panjang) : 0;
    const d = item.diameter ? Number(item.diameter) : 0;
    const v = item.volumeLog ? Number(item.volumeLog) : 0;
    const h = item.harga ? Number(item.harga) : 0;
    const kode = item.kodeLog || `L-${item.idLog}`;

    return {
      idLog: item.idLog,
      id_log: kode,
      kodeLog: kode,
      idPembelian: item.idPembelian,
      asalSortimen: item.asalSortimen,
      sortimen: item.asalSortimen,
      panjang: p,
      diameter: d,
      dimensiLog: item.dimensiLog,
      volumeLog: v,
      volume: v,
      statusLog: item.statusLog,
      stage: item.statusLog,
      suplier: item.suplier || '-',
      harga: h,
      tanggalMasuk: item.tanggalMasuk,
      tanggal_masuk: item.tanggalMasuk
        ? new Date(item.tanggalMasuk).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    };
  }

  async findAll(sortimen?: string, stage?: string) {
    const where: any = {};
    if (sortimen && sortimen !== 'All Sortimen') {
      where.asalSortimen = sortimen;
    }
    if (stage && stage !== 'All Stage') {
      where.statusLog = stage;
    }

    const logs = await this.prisma.stokLog.findMany({
      where,
      orderBy: { idLog: 'desc' },
    });

    return logs.map((log) => this.mapLog(log));
  }

  async findOne(id: number) {
    const log = await this.prisma.stokLog.findUnique({
      where: { idLog: id },
    });
    if (!log) {
      throw new NotFoundException(`Log #${id} tidak ditemukan`);
    }
    return this.mapLog(log);
  }

  async create(dto: CreateLogDto) {
    const p = Number(dto.panjang) || 0;
    const d = Number(dto.diameter) || 0;

    let vol = dto.volumeLog;
    if (vol === undefined || vol === null) {
      const rM = d / 200;
      const lM = p / 100;
      vol = Number((Math.PI * Math.pow(rM, 2) * lM).toFixed(3));
    }

    const sortimen = dto.asalSortimen || 'Sortimen A';
    const status = dto.statusLog || dto.stage || 'Log';
    const kode = dto.kodeLog || dto.id_log || undefined;
    const tanggal = dto.tanggalMasuk ? new Date(dto.tanggalMasuk) : new Date();

    const created = await this.prisma.stokLog.create({
      data: {
        kodeLog: kode,
        asalSortimen: sortimen,
        panjang: p,
        diameter: d,
        dimensiLog: `${p} x ${d}`,
        volumeLog: vol,
        statusLog: status,
        suplier: dto.suplier || 'PT. Suplier',
        harga: dto.harga ? Number(dto.harga) : 0,
        tanggalMasuk: tanggal,
      },
    });

    // If kodeLog was not given, we can optionally format it with id
    if (!created.kodeLog) {
      const formattedKode = `L-${new Date().getFullYear()}-${created.idLog}`;
      const updated = await this.prisma.stokLog.update({
        where: { idLog: created.idLog },
        data: { kodeLog: formattedKode },
      });
      return this.mapLog(updated);
    }

    return this.mapLog(created);
  }

  async update(id: number, dto: UpdateLogDto) {
    const existing = await this.prisma.stokLog.findUnique({
      where: { idLog: id },
    });
    if (!existing) {
      throw new NotFoundException(`Log #${id} tidak ditemukan`);
    }

    const p = dto.panjang !== undefined ? Number(dto.panjang) : Number(existing.panjang);
    const d = dto.diameter !== undefined ? Number(dto.diameter) : Number(existing.diameter);

    let vol = dto.volumeLog;
    if (vol === undefined && (dto.panjang !== undefined || dto.diameter !== undefined)) {
      const rM = d / 200;
      const lM = p / 100;
      vol = Number((Math.PI * Math.pow(rM, 2) * lM).toFixed(3));
    }

    const updated = await this.prisma.stokLog.update({
      where: { idLog: id },
      data: {
        ...(dto.kodeLog || dto.id_log ? { kodeLog: dto.kodeLog || dto.id_log } : {}),
        ...(dto.asalSortimen ? { asalSortimen: dto.asalSortimen } : {}),
        ...(dto.panjang !== undefined ? { panjang: p } : {}),
        ...(dto.diameter !== undefined ? { diameter: d } : {}),
        ...(dto.panjang !== undefined || dto.diameter !== undefined ? { dimensiLog: `${p} x ${d}` } : {}),
        ...(vol !== undefined ? { volumeLog: vol } : {}),
        ...(dto.statusLog || dto.stage ? { statusLog: dto.statusLog || dto.stage } : {}),
        ...(dto.suplier ? { suplier: dto.suplier } : {}),
        ...(dto.harga !== undefined ? { harga: Number(dto.harga) } : {}),
        ...(dto.tanggalMasuk ? { tanggalMasuk: new Date(dto.tanggalMasuk) } : {}),
      },
    });

    return this.mapLog(updated);
  }

  async remove(id: number) {
    const existing = await this.prisma.stokLog.findUnique({
      where: { idLog: id },
    });
    if (!existing) {
      throw new NotFoundException(`Log #${id} tidak ditemukan`);
    }

    // Also delete or cascade any related process sawmill if present
    await this.prisma.plank.deleteMany({
      where: { idLogAsal: id },
    });
    await this.prisma.prosesSawmill.deleteMany({
      where: { idLog: id },
    });

    await this.prisma.stokLog.delete({
      where: { idLog: id },
    });

    return { success: true, message: `Log #${id} berhasil dihapus` };
  }
}
