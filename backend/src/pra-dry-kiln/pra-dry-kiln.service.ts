
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaletDto } from './dto/create-palet.dto';
import { UpdatePaletDto } from './dto/update-palet.dto';

@Injectable()
export class PraDryKilnService {
  constructor(private readonly prisma: PrismaService) {}

  // Validasi plank yang akan dimasukkan ke Palet
  private async validatePlanks(
    tx: any,
    idPlanks: number[],
    currentPaletId?: number,
  ) {
    const planks = await tx.plank.findMany({
      where: {
        idPlank: { in: idPlanks },
        deletedAt: null,
        stokLog: {
          deletedAt: null,
        },
      },
      include: {
        stokLog: true,
        detailPalet: {
          where: {
            deletedAt: null,
          },
        },
      },
    });

    if (planks.length !== idPlanks.length) {
      throw new BadRequestException(
        'Terdapat plank yang tidak ditemukan atau sudah tidak aktif.',
      );
    }

    for (const plank of planks) {
      const existingPalet = plank.detailPalet.find(
        (detail: any) => detail.idPalet !== currentPaletId,
      );

      if (existingPalet) {
        throw new BadRequestException(
          `Plank ID ${plank.idPlank} sudah terdaftar pada Palet lain.`,
        );
      }
    }

    const sortimens: string[] = [
    ...new Set<string>(
        planks.map((plank: any) => plank.stokLog.asalSortimen as string),
        ),
    ];

    const grades: string[] = [
    ...new Set<string>(
        planks.map((plank: any) => plank.gradePapan as string),
        ),
    ];

    if (sortimens.length !== 1) {
      throw new BadRequestException(
        'Semua plank dalam satu Palet harus memiliki sortimen yang sama.',
      );
    }

    if (grades.length !== 1) {
      throw new BadRequestException(
        'Semua plank dalam satu Palet harus memiliki grade yang sama.',
      );
    }

    const totalVolume = planks.reduce(
      (total: number, plank: any) =>
        total + Number(plank.volumePlank),
      0,
    );

    return {
      planks,
      sortimen: sortimens[0]!,
      grade: grades[0]!,
      totalVolume: Number(totalVolume.toFixed(3)),
    };
  }

  // Membuat Palet baru
  async create(dto: CreatePaletDto) {
    return this.prisma.$transaction(async (tx) => {
      const validated = await this.validatePlanks(
        tx,
        dto.idPlanks,
      );

      const palet = await tx.palet.create({
        data: {
          tanggalSticking: new Date(dto.tanggalSticking),
          statusPalet: 'Aktif',
          sortimen: validated.sortimen,
          grade: validated.grade,
          totalVolume: validated.totalVolume,
          stage: 'Pra-Dry Kiln',
          detailPalet: {
            create: dto.idPlanks.map((idPlank) => ({
              idPlank,
            })),
          },
        },
        include: {
          detailPalet: {
            include: {
              plank: {
                include: {
                  stokLog: true,
                },
              },
            },
          },
        },
      });

      // Perbarui stage plank
      await tx.plank.updateMany({
        where: {
          idPlank: { in: dto.idPlanks },
        },
        data: {
          stage: 'Pra-Dry Kiln',
        },
      });

      return palet;
    });
  }

  // Menampilkan semua Palet aktif
  async findAll() {
    return this.prisma.palet.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        idPalet: 'desc',
      },
      include: {
        detailPalet: {
          where: {
            deletedAt: null,
            plank: {
              deletedAt: null,
            },
          },
          include: {
            plank: {
              include: {
                stokLog: true,
              },
            },
          },
        },
      },
    });
  }

  // Menampilkan detail Palet
  async findOne(id: number) {
    const palet = await this.prisma.palet.findFirst({
      where: {
        idPalet: id,
        deletedAt: null,
      },
      include: {
        detailPalet: {
          where: {
            deletedAt: null,
            plank: {
              deletedAt: null,
            },
          },
          include: {
            plank: {
              include: {
                stokLog: true,
              },
            },
          },
        },
      },
    });

    if (!palet) {
      throw new NotFoundException(
        `Palet dengan ID ${id} tidak ditemukan.`,
      );
    }

    return palet;
  }

  // Mengubah tanggal atau isi Palet
  async update(id: number, dto: UpdatePaletDto) {
    return this.prisma.$transaction(async (tx) => {
      const palet = await tx.palet.findFirst({
        where: {
          idPalet: id,
          deletedAt: null,
        },
        include: {
          detailPalet: {
            where: {
              deletedAt: null,
            },
          },
        },
      });

      if (!palet) {
        throw new NotFoundException(
          `Palet dengan ID ${id} tidak ditemukan.`,
        );
      }

      // Jika plank tidak dikirim, gunakan plank yang saat ini terdaftar
      const idPlanks =
        dto.idPlanks ??
        palet.detailPalet.map((detail: any) => detail.idPlank);

      const validated = await this.validatePlanks(
        tx,
        idPlanks,
        id,
      );

      // Soft delete detail Palet lama
      await tx.detailPalet.updateMany({
        where: {
          idPalet: id,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      // Tambahkan detail Palet terbaru
      await tx.detailPalet.createMany({
        data: idPlanks.map((idPlank) => ({
          idPalet: id,
          idPlank,
        })),
      });

      // Plank yang sebelumnya ada tetapi dikeluarkan
      const plankLama = palet.detailPalet
        .map((detail: any) => detail.idPlank)
        .filter((idPlank: number) => !idPlanks.includes(idPlank));

      if (plankLama.length > 0) {
        await tx.plank.updateMany({
          where: {
            idPlank: { in: plankLama },
            stage: 'Pra-Dry Kiln',
          },
          data: {
            stage: 'Sawmill',
          },
        });
      }

      // Stage plank baru / plank yang tetap berada di Palet
      await tx.plank.updateMany({
        where: {
          idPlank: { in: idPlanks },
        },
        data: {
          stage: 'Pra-Dry Kiln',
        },
      });

      return tx.palet.update({
        where: {
          idPalet: id,
        },
        data: {
          ...(dto.tanggalSticking
            ? {
                tanggalSticking: new Date(
                  dto.tanggalSticking,
                ),
              }
            : {}),
          sortimen: validated.sortimen,
          grade: validated.grade,
          totalVolume: validated.totalVolume
        },
        include: {
          detailPalet: {
            where: {
              deletedAt: null,
            },
            include: {
              plank: {
                include: {
                  stokLog: true,
                },
              },
            },
          },
        },
      });
    });
  }

  // Soft delete Palet
  async remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const palet = await tx.palet.findFirst({
        where: {
          idPalet: id,
          deletedAt: null,
        },
        include: {
          detailPalet: {
            where: {
              deletedAt: null,
            },
          },
        },
      });

      if (!palet) {
        throw new NotFoundException(
          `Palet dengan ID ${id} tidak ditemukan.`,
        );
      }

      const idPlanks = palet.detailPalet.map(
        (detail: any) => detail.idPlank,
      );

      await tx.detailPalet.updateMany({
        where: {
          idPalet: id,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      await tx.palet.update({
        where: {
          idPalet: id,
        },
        data: {
          deletedAt: new Date(),
          statusPalet: 'Dihapus',
        },
      });

      // Kembalikan stage plank ke Sawmill
      if (idPlanks.length > 0) {
        await tx.plank.updateMany({
          where: {
            idPlank: { in: idPlanks },
            stage: 'Pra-Dry Kiln',
          },
          data: {
            stage: 'Sawmill',
          },
        });
      }

      return {
        message: `Palet ID ${id} berhasil dihapus.`,
      };
    });
  }
}
