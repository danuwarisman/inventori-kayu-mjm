import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSawmillDto } from './dto/create-sawmill.dto';
import { CreatePlankDto } from './dto/create-plank.dto';
import { UpdatePlankDto } from './dto/update-plank.dto';

@Injectable()
export class SawmillService {
  constructor(private readonly prisma: PrismaService) {}

  private mapSawmill(item: any) {
    const log = item.stokLog;
    const kodeSawmill = item.kodeSawmill || `SWM-${item.idSawmill}`;
    const kodeLog = log?.kodeLog || (log?.idLog ? `L-${log.idLog}` : 'L-0');
    const sortimen = log?.asalSortimen || 'Sortimen A';

    const mappedPlanks = (item.planks || []).map((p: any) => ({
      idPlank: p.idPlank,
      id_plank: p.kodePlank || `P-${p.idPlank}`,
      kodePlank: p.kodePlank || `P-${p.idPlank}`,
      sortimen: sortimen,
      grade: p.gradePapan,
      gradePapan: p.gradePapan,
      tinggi: p.tinggi ? Number(p.tinggi) : 0,
      lebar: p.lebar ? Number(p.lebar) : 0,
      panjang: p.panjang ? Number(p.panjang) : 0,
      volume: p.volumePlank ? Number(p.volumePlank) : 0,
      volumePlank: p.volumePlank ? Number(p.volumePlank) : 0,
      stage: p.stage || 'Sawmill',
    }));

    return {
      idSawmill: item.idSawmill,
      id_sawmill: kodeSawmill,
      kodeSawmill: kodeSawmill,
      idLog: item.idLog,
      id_log_asal: kodeLog,
      sortimen: sortimen,
      panjang: log?.panjang ? Number(log.panjang) : 0,
      diameter: log?.diameter ? Number(log.diameter) : 0,
      volume_total: log?.volumeLog ? Number(log.volumeLog) : 0,
      stage: item.statusSawmill,
      statusSawmill: item.statusSawmill,
      tanggal: item.tanggalProses
        ? new Date(item.tanggalProses).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      suplier: log?.suplier || 'PT. Suplier',
      harga: log?.harga ? Number(log.harga) : 0,
      planks: mappedPlanks,
    };
  }

  async findAll(sortimen?: string, stage?: string) {
    const where: any = {};
    if (stage && stage !== 'All Stage') {
      where.statusSawmill = stage;
    }
    if (sortimen && sortimen !== 'All Sortimen') {
      where.stokLog = { asalSortimen: sortimen };
    }

    const items = await this.prisma.prosesSawmill.findMany({
      where,
      include: {
        stokLog: true,
        planks: {
          orderBy: { idPlank: 'asc' },
        },
      },
      orderBy: { idSawmill: 'desc' },
    });

    return items.map((i) => this.mapSawmill(i));
  }

  async findOne(id: number) {
    const item = await this.prisma.prosesSawmill.findUnique({
      where: { idSawmill: id },
      include: {
        stokLog: true,
        planks: {
          orderBy: { idPlank: 'asc' },
        },
      },
    });
    if (!item) {
      throw new NotFoundException(`Sawmill #${id} tidak ditemukan`);
    }
    return this.mapSawmill(item);
  }

  async create(dto: CreateSawmillDto) {
    let logId = dto.idLog;

    // If no existing logId is passed, find or create the log
    if (!logId) {
      if (dto.id_log_asal) {
        const found = await this.prisma.stokLog.findFirst({
          where: { kodeLog: dto.id_log_asal },
        });
        if (found) {
          logId = found.idLog;
        }
      }

      if (!logId) {
        const p = Number(dto.panjang) || 200;
        const d = Number(dto.diameter) || 30;
        let vol = dto.volume_total;
        if (!vol) {
          const rM = d / 200;
          const lM = p / 100;
          vol = Number((Math.PI * Math.pow(rM, 2) * lM).toFixed(3));
        }

        const newLog = await this.prisma.stokLog.create({
          data: {
            kodeLog: dto.id_log_asal || undefined,
            asalSortimen: dto.sortimen || 'Sortimen A',
            panjang: p,
            diameter: d,
            dimensiLog: `${p} x ${d}`,
            volumeLog: vol,
            statusLog: 'Sawmill',
            suplier: dto.suplier || 'PT. Suplier',
            harga: dto.harga ? Number(dto.harga) : 0,
          },
        });
        logId = newLog.idLog;
      }
    }

    const status = dto.stage || 'Sawmill';
    const sawmill = await this.prisma.prosesSawmill.create({
      data: {
        idLog: logId,
        kodeSawmill: dto.kodeSawmill || undefined,
        statusSawmill: status,
        tanggalProses: dto.tanggal ? new Date(dto.tanggal) : new Date(),
      },
      include: {
        stokLog: true,
        planks: true,
      },
    });

    if (!sawmill.kodeSawmill) {
      const code = `SWM-${new Date().getFullYear()}-${sawmill.idSawmill}`;
      await this.prisma.prosesSawmill.update({
        where: { idSawmill: sawmill.idSawmill },
        data: { kodeSawmill: code },
      });
    }

    // If initial planks provided
    if (dto.planks && Array.isArray(dto.planks) && dto.planks.length > 0) {
      for (const p of dto.planks) {
        const t = Number(p.tinggi) || 0;
        const w = Number(p.lebar) || 0;
        const l = Number(p.panjang) || 0;
        let v = Number(p.volume);
        if (!v && t && w && l) {
          v = Number(((t * w * l) / 1000000).toFixed(3));
        }

        await this.prisma.plank.create({
          data: {
            idSawmill: sawmill.idSawmill,
            idLogAsal: logId,
            kodePlank: p.id_plank || undefined,
            gradePapan: p.grade || p.gradePapan || 'Grade A',
            dimensiPlank: `${t} x ${w} x ${l}`,
            tinggi: t,
            lebar: w,
            panjang: l,
            volumePlank: v || 0,
            stage: 'Sawmill',
          },
        });
      }
    }

    return this.findOne(sawmill.idSawmill);
  }

  async update(id: number, dto: any) {
    const existing = await this.prisma.prosesSawmill.findUnique({
      where: { idSawmill: id },
    });
    if (!existing) {
      throw new NotFoundException(`Sawmill #${id} tidak ditemukan`);
    }

    const updated = await this.prisma.prosesSawmill.update({
      where: { idSawmill: id },
      data: {
        ...(dto.stage || dto.statusSawmill ? { statusSawmill: dto.stage || dto.statusSawmill } : {}),
        ...(dto.kodeSawmill ? { kodeSawmill: dto.kodeSawmill } : {}),
      },
    });

    return this.findOne(updated.idSawmill);
  }

  async remove(id: number) {
    await this.prisma.plank.deleteMany({
      where: { idSawmill: id },
    });
    await this.prisma.prosesSawmill.delete({
      where: { idSawmill: id },
    });
    return { success: true, message: `Sawmill #${id} berhasil dihapus` };
  }

  /* ---------------- Plank Handlers ---------------- */

  async addPlank(idSawmill: number, dto: CreatePlankDto) {
    const sawmill = await this.prisma.prosesSawmill.findUnique({
      where: { idSawmill },
    });
    if (!sawmill) {
      throw new NotFoundException(`Sawmill #${idSawmill} tidak ditemukan`);
    }

    const t = Number(dto.tinggi) || 0;
    const w = Number(dto.lebar) || 0;
    const l = Number(dto.panjang) || 0;
    let v = dto.volumePlank;
    if (v === undefined || v === null) {
      v = Number(((t * w * l) / 1000000).toFixed(3));
    }

    const plank = await this.prisma.plank.create({
      data: {
        idSawmill,
        idLogAsal: sawmill.idLog,
        kodePlank: dto.kodePlank || dto.id_plank || undefined,
        gradePapan: dto.gradePapan || 'Grade A',
        dimensiPlank: `${t} x ${w} x ${l}`,
        tinggi: t,
        lebar: w,
        panjang: l,
        volumePlank: v,
        stage: dto.stage || 'Sawmill',
      },
    });

    if (!plank.kodePlank) {
      const code = `P-${new Date().getFullYear()}-${plank.idPlank}`;
      const updated = await this.prisma.plank.update({
        where: { idPlank: plank.idPlank },
        data: { kodePlank: code },
      });
      return updated;
    }

    return plank;
  }

  async updatePlank(idPlank: number, dto: UpdatePlankDto) {
    const existing = await this.prisma.plank.findUnique({
      where: { idPlank },
    });
    if (!existing) {
      throw new NotFoundException(`Plank #${idPlank} tidak ditemukan`);
    }

    const t = dto.tinggi !== undefined ? Number(dto.tinggi) : Number(existing.tinggi);
    const w = dto.lebar !== undefined ? Number(dto.lebar) : Number(existing.lebar);
    const l = dto.panjang !== undefined ? Number(dto.panjang) : Number(existing.panjang);

    let v = dto.volumePlank;
    if (v === undefined && (dto.tinggi !== undefined || dto.lebar !== undefined || dto.panjang !== undefined)) {
      v = Number(((t * w * l) / 1000000).toFixed(3));
    }

    const updated = await this.prisma.plank.update({
      where: { idPlank },
      data: {
        ...(dto.kodePlank ? { kodePlank: dto.kodePlank } : {}),
        ...(dto.gradePapan ? { gradePapan: dto.gradePapan } : {}),
        ...(dto.tinggi !== undefined ? { tinggi: t } : {}),
        ...(dto.lebar !== undefined ? { lebar: w } : {}),
        ...(dto.panjang !== undefined ? { panjang: l } : {}),
        ...(dto.tinggi !== undefined || dto.lebar !== undefined || dto.panjang !== undefined
          ? { dimensiPlank: `${t} x ${w} x ${l}` }
          : {}),
        ...(v !== undefined ? { volumePlank: v } : {}),
        ...(dto.stage ? { stage: dto.stage } : {}),
      },
    });

    return updated;
  }

  async removePlank(idPlank: number) {
    await this.prisma.plank.delete({
      where: { idPlank },
    });
    return { success: true, message: `Plank #${idPlank} berhasil dihapus` };
  }

  async findAllPlanks() {
    const planks = await this.prisma.plank.findMany({
      include: {
        stokLog: true,
      },
      orderBy: { idPlank: 'desc' },
    });

    return planks.map((p) => ({
      idPlank: p.idPlank,
      id_plank: p.kodePlank || `P-${p.idPlank}`,
      kodePlank: p.kodePlank || `P-${p.idPlank}`,
      idLogAsal: p.idLogAsal,
      id_log: p.stokLog?.kodeLog || `L-${p.idLogAsal}`,
      sortimen: p.stokLog?.asalSortimen || 'Sortimen A',
      grade: p.gradePapan,
      tinggi: p.tinggi ? Number(p.tinggi) : 0,
      lebar: p.lebar ? Number(p.lebar) : 0,
      panjang: p.panjang ? Number(p.panjang) : 0,
      volume: p.volumePlank ? Number(p.volumePlank) : 0,
      stage: p.stage || 'Sawmill',
    }));
  }
}
