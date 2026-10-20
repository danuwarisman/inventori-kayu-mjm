import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDryKilnDto } from './dto/create-dry-kiln.dto';
import { UpdateDryKilnDto } from './dto/update-dry-kiln.dto';

@Injectable()
export class DryKilnService {
  constructor(private readonly prisma: PrismaService) {}

  private mapDryKiln(item: any) {
    const p = item.panjang ? Number(item.panjang) : 0;
    const w = item.lebar ? Number(item.lebar) : 0;
    const t = item.tinggi ? Number(item.tinggi) : 0;
    const v = item.volume ? Number(item.volume) : 0;
    const kodeLog = item.kodeLog || 'L-0';
    const kodePlank = item.kodePlank || `P-${item.idOven}`;

    return {
      idOven: item.idOven,
      id_log: kodeLog,
      id_plank: kodePlank,
      kodeOven: item.kodeOven,
      sortimen: item.sortimen || 'Sortimen A',
      panjang: p,
      lebar: w,
      tinggi: t,
      volume: v,
      grade: item.grade || 'Grade A',
      stage: item.stage || item.statusPengeringan || 'in-drykiln',
      statusPengeringan: item.statusPengeringan || item.stage || 'in-drykiln',
      date: item.tanggalMasuk
        ? new Date(item.tanggalMasuk).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      tanggalMasuk: item.tanggalMasuk,
      tanggalKeluar: item.tanggalKeluar,
    };
  }

  async findAll(sortimen?: string, stage?: string, date?: string) {
    const where: any = {};
    if (sortimen && sortimen !== 'All Sortimen') {
      where.sortimen = sortimen;
    }
    if (stage) {
      where.stage = stage;
    }

    const items = await this.prisma.dryKiln.findMany({
      where,
      orderBy: { idOven: 'desc' },
    });

    const mapped = items.map((i) => this.mapDryKiln(i));

    if (date) {
      return mapped.filter((i) => i.date === date);
    }

    return mapped;
  }

  async findOne(id: number) {
    const item = await this.prisma.dryKiln.findUnique({
      where: { idOven: id },
    });
    if (!item) {
      throw new NotFoundException(`Dry Kiln entry #${id} tidak ditemukan`);
    }
    return this.mapDryKiln(item);
  }

  async create(dto: CreateDryKilnDto) {
    const p = Number(dto.panjang) || 0;
    const w = Number(dto.lebar) || 0;
    const t = Number(dto.tinggi) || 0;
    let v = dto.volume;
    if (v === undefined || v === null) {
      v = Number(((t * w * p) / 1000000).toFixed(3));
    }

    const stage = dto.stage || 'in-drykiln';
    const entryDate = dto.date || dto.tanggalMasuk ? new Date(dto.date || dto.tanggalMasuk!) : new Date();

    const created = await this.prisma.dryKiln.create({
      data: {
        kodeLog: dto.kodeLog || dto.id_log || 'L-0',
        kodePlank: dto.kodePlank || dto.id_plank || undefined,
        idPlank: dto.idPlank || undefined,
        sortimen: dto.sortimen || 'Sortimen A',
        grade: dto.grade || 'Grade A',
        panjang: p,
        lebar: w,
        tinggi: t,
        volume: v,
        statusPengeringan: stage,
        stage: stage,
        tanggalMasuk: entryDate,
      },
    });

    if (!created.kodePlank) {
      const code = `P-${new Date().getFullYear()}-${created.idOven}`;
      const updated = await this.prisma.dryKiln.update({
        where: { idOven: created.idOven },
        data: { kodePlank: code },
      });
      return this.mapDryKiln(updated);
    }

    return this.mapDryKiln(created);
  }

  async update(id: number, dto: UpdateDryKilnDto) {
    const existing = await this.prisma.dryKiln.findUnique({
      where: { idOven: id },
    });
    if (!existing) {
      throw new NotFoundException(`Dry Kiln entry #${id} tidak ditemukan`);
    }

    const p = dto.panjang !== undefined ? Number(dto.panjang) : Number(existing.panjang);
    const w = dto.lebar !== undefined ? Number(dto.lebar) : Number(existing.lebar);
    const t = dto.tinggi !== undefined ? Number(dto.tinggi) : Number(existing.tinggi);

    let v = dto.volume;
    if (v === undefined && (dto.panjang !== undefined || dto.lebar !== undefined || dto.tinggi !== undefined)) {
      v = Number(((t * w * p) / 1000000).toFixed(3));
    }

    const updated = await this.prisma.dryKiln.update({
      where: { idOven: id },
      data: {
        ...(dto.id_log ? { kodeLog: dto.id_log } : {}),
        ...(dto.id_plank ? { kodePlank: dto.id_plank } : {}),
        ...(dto.sortimen ? { sortimen: dto.sortimen } : {}),
        ...(dto.grade ? { grade: dto.grade } : {}),
        ...(dto.panjang !== undefined ? { panjang: p } : {}),
        ...(dto.lebar !== undefined ? { lebar: w } : {}),
        ...(dto.tinggi !== undefined ? { tinggi: t } : {}),
        ...(v !== undefined ? { volume: v } : {}),
        ...(dto.stage ? { stage: dto.stage, statusPengeringan: dto.stage } : {}),
        ...(dto.date ? { tanggalMasuk: new Date(dto.date) } : {}),
      },
    });

    return this.mapDryKiln(updated);
  }

  async remove(id: number) {
    await this.prisma.dryKiln.delete({
      where: { idOven: id },
    });
    return { success: true, message: `Dry Kiln #${id} berhasil dihapus` };
  }
}
