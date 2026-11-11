import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
    const where: any = {
      deletedAt: null,
      stokLog: {
        deletedAt: null,
      },
    };

    if (stage && stage !== 'All Stage') {
      where.statusSawmill = stage;
    }

    if (sortimen && sortimen !== 'All Sortimen') {
      where.stokLog.asalSortimen = sortimen;
    }

    const items = await this.prisma.prosesSawmill.findMany({
      where,
      include: {
        stokLog: true,
        planks: {
          where: { deletedAt: null },
          orderBy: { idPlank: 'asc' },
        },
      },
      orderBy: { idSawmill: 'desc' },
    });

    return items.map((i) => this.mapSawmill(i));
  }


  
  async findOne(id: number) {
    const item = await this.prisma.prosesSawmill.findFirst({
      where: {
        idSawmill: id,
        deletedAt: null,
        stokLog: {
          deletedAt: null,
        },
      },
      include: {
        stokLog: true,
        planks: {
          where: { deletedAt: null },
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
    if (!dto.idLog && !dto.id_log_asal) {
      throw new BadRequestException(
        'ID Log atau kode Log wajib diisi',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const log = await tx.stokLog.findFirst({
        where: {
          ...(dto.idLog
            ? { idLog: dto.idLog }
            : { kodeLog: dto.id_log_asal }),
          deletedAt: null,
        },
      });

      if (!log) {
        throw new NotFoundException(
          'Log tidak ditemukan atau sudah dihapus',
        );
      }

      if (log.statusLog !== 'Log') {
        throw new BadRequestException(
          `Log ${log.kodeLog || log.idLog} tidak dapat diproses. Status saat ini: ${log.statusLog}`,
        );
      }

      const sawmill = await tx.prosesSawmill.create({
        data: {
          idLog: log.idLog,
          kodeSawmill: dto.kodeSawmill || undefined,
          statusSawmill: dto.stage || 'Sawmill',
          tanggalProses: dto.tanggal
            ? new Date(dto.tanggal)
            : new Date(),
        },
      });

      const kodeSawmill =
        dto.kodeSawmill ||
        `SWM-${new Date().getFullYear()}-${sawmill.idSawmill}`;

      const updatedSawmill = await tx.prosesSawmill.update({
        where: { idSawmill: sawmill.idSawmill },
        data: { kodeSawmill },
      });

      await tx.stokLog.update({
        where: { idLog: log.idLog },
        data: { statusLog: 'Sawmill' },
      });

      if (dto.planks && dto.planks.length > 0) {
        for (const p of dto.planks) {
          const tinggi = Number(p.tinggi);
          const lebar = Number(p.lebar);
          const panjang = Number(p.panjang);

          const volume =
            p.volumePlank ??
            Number(
              ((tinggi * lebar * panjang) / 1000000).toFixed(3),
            );

          await tx.plank.create({
            data: {
              idSawmill: updatedSawmill.idSawmill,
              idLogAsal: log.idLog,
              kodePlank: p.kodePlank || p.id_plank || undefined,
              gradePapan: p.gradePapan,
              dimensiPlank: `${tinggi} x ${lebar} x ${panjang}`,
              tinggi,
              lebar,
              panjang,
              volumePlank: volume,
              stage: p.stage || 'Sawmill',
            },
          });
        }
      }

      return updatedSawmill.idSawmill;
    }).then((id) => this.findOne(id));
  }


  
  async update(id: number, dto: any) {
    const existing = await this.prisma.prosesSawmill.findFirst({
      where: {
        idSawmill: id,
        deletedAt: null,
        stokLog: {
          deletedAt: null,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(
        `Sawmill #${id} tidak ditemukan atau sudah dihapus`,
      );
    }

    const updated = await this.prisma.prosesSawmill.update({
      where: { idSawmill: id },
      data: {
        ...(dto.stage || dto.statusSawmill
          ? { statusSawmill: dto.stage || dto.statusSawmill }
          : {}),
        ...(dto.kodeSawmill
          ? { kodeSawmill: dto.kodeSawmill }
          : {}),
      },
    });

    return this.findOne(updated.idSawmill);
  }


  
  async remove(id: number) {
    const sawmill = await this.prisma.prosesSawmill.findFirst({
      where: {
        idSawmill: id,
        deletedAt: null,
      },
    });

    if (!sawmill) {
      throw new NotFoundException(`Sawmill #${id} tidak ditemukan`);
    }

    await this.prisma.prosesSawmill.update({
      where: { idSawmill: id },
      data: { deletedAt: new Date() },
    });

    return {
      success: true,
      message: `Sawmill #${id} berhasil dihapus`,
    };
  }


  /* ---------------- Plank Handlers ---------------- */

  async addPlank(idSawmill: number, dto: CreatePlankDto) {
    const sawmill = await this.prisma.prosesSawmill.findFirst({
  where: {
    idSawmill,
    deletedAt: null,
    stokLog: {
      deletedAt: null,
    },
  },
});

if (!sawmill) {
  throw new NotFoundException(
    `Sawmill #${idSawmill} tidak ditemukan atau sudah dihapus`,
  );
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
    const existing = await this.prisma.plank.findFirst({
      where: {
        idPlank,
        deletedAt: null,
      },
      include: {
        detailPalet: {
          where: { deletedAt: null },
        },
        hasilDryKiln: {
          where: { deletedAt: null },
        },
        detailPenjualan: {
          where: { deletedAt: null },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Plank #${idPlank} tidak ditemukan`);
    }

    if (
      existing.detailPalet.length > 0 ||
      existing.hasilDryKiln.length > 0 ||
      existing.detailPenjualan.length > 0
    ) {
      throw new BadRequestException(
        'Plank tidak dapat diubah karena sudah digunakan pada proses Palet, Dry Kiln, atau Penjualan',
      );
    }

    const t =
      dto.tinggi !== undefined
        ? Number(dto.tinggi)
        : Number(existing.tinggi);

    const w =
      dto.lebar !== undefined
        ? Number(dto.lebar)
        : Number(existing.lebar);

    const l =
      dto.panjang !== undefined
        ? Number(dto.panjang)
        : Number(existing.panjang);

    let v = dto.volumePlank;

    if (
      v === undefined &&
      (dto.tinggi !== undefined ||
        dto.lebar !== undefined ||
        dto.panjang !== undefined)
    ) {
      v = Number(((t * w * l) / 1000000).toFixed(3));
    }

    return this.prisma.plank.update({
      where: { idPlank },
      data: {
        ...(dto.kodePlank ? { kodePlank: dto.kodePlank } : {}),
        ...(dto.gradePapan ? { gradePapan: dto.gradePapan } : {}),
        ...(dto.tinggi !== undefined ? { tinggi: t } : {}),
        ...(dto.lebar !== undefined ? { lebar: w } : {}),
        ...(dto.panjang !== undefined ? { panjang: l } : {}),
        ...(dto.tinggi !== undefined ||
        dto.lebar !== undefined ||
        dto.panjang !== undefined
          ? { dimensiPlank: `${t} x ${w} x ${l}` }
          : {}),
        ...(v !== undefined ? { volumePlank: v } : {}),
        ...(dto.stage ? { stage: dto.stage } : {}),
      },
    });
  }


  
  async removePlank(idPlank: number) {
    const plank = await this.prisma.plank.findFirst({
      where: {
        idPlank,
        deletedAt: null,
      },
      include: {
        detailPalet: {
          where: { deletedAt: null },
        },
        hasilDryKiln: {
          where: { deletedAt: null },
        },
        detailPenjualan: {
          where: { deletedAt: null },
        },
      },
    });

    if (!plank) {
      throw new NotFoundException(`Plank #${idPlank} tidak ditemukan`);
    }

    if (
      plank.detailPalet.length > 0 ||
      plank.hasilDryKiln.length > 0 ||
      plank.detailPenjualan.length > 0
    ) {
      throw new BadRequestException(
        'Plank tidak dapat dihapus karena sudah digunakan pada proses Palet, Dry Kiln, atau Penjualan',
      );
    }

    await this.prisma.plank.update({
      where: { idPlank },
      data: { deletedAt: new Date() },
    });

    return {
      success: true,
      message: `Plank #${idPlank} berhasil dihapus`,
    };
  }


  async findAllPlanks() {
  const planks = await this.prisma.plank.findMany({
    where: {
      deletedAt: null,
      stokLog: {
        deletedAt: null,
      },
    },
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
