
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePembelianDto } from './dto/create-pembelian.dto';
import { UpdatePembelianDto } from './dto/update-pembelian.dto';
import {
  StatusVerifikasi,
  StatusPembelian,
} from '../../generated/prisma/enums';

@Injectable()
export class PembelianService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.transaksiPembelian.findMany({
      where: { deletedAt: null },
      include: {
        supplier: true,
        user: {
          select: {
            id: true,
            username: true,
            nama: true,
          },
        },
        detailPembelian: true,
      },
      orderBy: { idPembelian: 'desc' },
    });
  }

  async findOne(id: number) {
    const pembelian = await this.prisma.transaksiPembelian.findFirst({
      where: {
        idPembelian: id,
        deletedAt: null,
      },
      include: {
        supplier: true,
        user: {
          select: {
            id: true,
            username: true,
            nama: true,
          },
        },
        detailPembelian: true,
        approvals: true,
      },
    });

    if (!pembelian) {
      throw new NotFoundException('Transaksi pembelian tidak ditemukan');
    }

    return pembelian;
  }

  async create(data: CreatePembelianDto) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { idSupplier: data.idSupplier },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier tidak ditemukan');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: data.idUser },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('User tidak ditemukan atau sudah dihapus');
    }

    return this.prisma.transaksiPembelian.create({
      data: {
        idSupplier: data.idSupplier,
        idUser: data.idUser,
        tanggalBeli: new Date(data.tanggalBeli),
        detailPembelian: {
          create: data.detailPembelian,
        },
      },
      include: {
        supplier: true,
        user: {
          select: {
            id: true,
            username: true,
            nama: true,
          },
        },
        detailPembelian: true,
      },
    });
  }

  async update(id: number, data: UpdatePembelianDto) {
  const pembelian = await this.findOne(id);

  if (pembelian.statusVerifikasi !== StatusVerifikasi.PENDING) {
    throw new BadRequestException(
      'Transaksi pembelian yang sudah diproses tidak dapat diubah',
    );
  }

    if (data.idSupplier !== undefined) {
      const supplier = await this.prisma.supplier.findUnique({
        where: { idSupplier: data.idSupplier },
      });

      if (!supplier) {
        throw new NotFoundException('Supplier tidak ditemukan');
      }
    }

    return this.prisma.transaksiPembelian.update({
      where: { idPembelian: id },
      data: {
        ...(data.idSupplier !== undefined && {
          idSupplier: data.idSupplier,
        }),
        ...(data.tanggalBeli !== undefined && {
          tanggalBeli: new Date(data.tanggalBeli),
        }),
      },
      include: {
        supplier: true,
        detailPembelian: true,
      },
    });
  }

  async remove(id: number) {
  const pembelian = await this.findOne(id);

  if (pembelian.statusVerifikasi !== StatusVerifikasi.PENDING) {
    throw new BadRequestException(
      'Transaksi pembelian yang sudah diproses tidak dapat dihapus',
    );
  }

  return this.prisma.transaksiPembelian.update({
    where: { idPembelian: id },
    data: { deletedAt: new Date() },
  });
}
  async approval(
    id: number,
    idUserManager: number,
    data: { status: StatusVerifikasi; keteranganCatatan?: string },
  ) {
    if (
      data.status !== StatusVerifikasi.DISETUJUI &&
      data.status !== StatusVerifikasi.DITOLAK
    ) {
      throw new BadRequestException(
        'Status approval hanya boleh DISETUJUI atau DITOLAK',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const pembelian = await tx.transaksiPembelian.findFirst({
        where: {
          idPembelian: id,
          deletedAt: null,
        },
        include: {
          supplier: true,
          detailPembelian: true,
        },
      });

      if (!pembelian) {
        throw new NotFoundException(
          'Transaksi pembelian tidak ditemukan',
        );
      }

      if (pembelian.statusVerifikasi !== StatusVerifikasi.PENDING) {
        throw new BadRequestException(
          'Transaksi pembelian sudah diproses',
        );
      }

      await tx.approval.create({
        data: {
          idUserManager,
          idPembelian: id,
          status: data.status,
          keteranganCatatan: data.keteranganCatatan,
        },
      });

      // Stok hanya dibuat jika pembelian disetujui
      if (data.status === StatusVerifikasi.DISETUJUI) {
        for (const detail of pembelian.detailPembelian) {
          const panjang = Number(detail.panjang);
          const diameter = Number(detail.diameter);

          const radiusMeter = diameter / 200;
          const panjangMeter = panjang / 100;

          const volumeLog = Number(
            (
              Math.PI *
              Math.pow(radiusMeter, 2) *
              panjangMeter
            ).toFixed(3),
          );

          for (let i = 0; i < detail.jumlahDipesan; i++) {
            const stok = await tx.stokLog.create({
              data: {
                idPembelian: id,
                asalSortimen: detail.asalSortimen,
                panjang,
                diameter,
                dimensiLog: detail.dimensiLog,
                volumeLog,
                statusLog: 'Log',
                suplier: pembelian.supplier.namaSupplier,
                harga: detail.hargaPerLog,
                tanggalMasuk: new Date(),
              },
            });

            await tx.stokLog.update({
              where: { idLog: stok.idLog },
              data: {
                kodeLog: `L-${new Date().getFullYear()}-${stok.idLog}`,
              },
            });
          }
        }
      }

      return tx.transaksiPembelian.update({
        where: { idPembelian: id },
        data: {
          statusVerifikasi: data.status,
          statusPembelian:
            data.status === StatusVerifikasi.DISETUJUI
              ? StatusPembelian.DISETUJUI
              : StatusPembelian.DITOLAK,
        },
        include: {
          supplier: true,
          detailPembelian: true,
          approvals: true,
          stokLogs: true,
        },
      });
    });
  }
}
