
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
} from '../../generated/prisma/client';

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
    await this.findOne(id);

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
    await this.findOne(id);

    return this.prisma.transaksiPembelian.update({
      where: { idPembelian: id },
      data: { deletedAt: new Date() },
    });
  }

  async approve(
  id: number,
  idUserManager: number,
  catatan?: string,
) {
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

    if (pembelian.detailPembelian.length === 0) {
      throw new BadRequestException(
        'Detail pembelian tidak boleh kosong',
      );
    }
    const totalUpdate = await tx.transaksiPembelian.updateMany({
  where: {
    idPembelian: id,
    statusVerifikasi: StatusVerifikasi.PENDING,
  },
  data: {
    statusVerifikasi: StatusVerifikasi.DISETUJUI,
    statusPembelian: StatusPembelian.DISETUJUI,
  },
});

if (totalUpdate.count === 0) {
  throw new BadRequestException(
    'Transaksi pembelian sudah diproses',
  );
}
await tx.approval.create({
  data: {
    idUserManager,
    idPembelian: id,
    status: StatusVerifikasi.DISETUJUI,
    keteranganCatatan: catatan,
  },
  });
  for (const detail of pembelian.detailPembelian) {
  const panjang = Number(detail.panjang);
  const diameter = Number(detail.diameter);

  const radiusMeter = diameter / 200;
  const panjangMeter = panjang / 100;

  const volume = Number(
    (Math.PI * Math.pow(radiusMeter, 2) * panjangMeter).toFixed(3),
  );

  for (let i = 0; i < detail.jumlahDipesan; i++) {
    const stok = await tx.stokLog.create({
      data: {
        idPembelian: id,
        asalSortimen: detail.asalSortimen,
        panjang,
        diameter,
        dimensiLog: detail.dimensiLog,
        volumeLog: volume,
        statusLog: 'Log',
        suplier: pembelian.supplier.namaSupplier,
        harga: detail.hargaPerLog,
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

  return {
    message: 'Transaksi pembelian berhasil disetujui',
    jumlahStokMasuk: pembelian.detailPembelian.reduce(
      (total, detail) => total + detail.jumlahDipesan,
      0,
    ),
  };
});
}
async reject(
  id: number,
  idUserManager: number,
  catatan?: string,
) {
  return this.prisma.$transaction(async (tx) => {
    const pembelian = await tx.transaksiPembelian.findFirst({
      where: {
        idPembelian: id,
        deletedAt: null,
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

    const totalUpdate = await tx.transaksiPembelian.updateMany({
      where: {
        idPembelian: id,
        statusVerifikasi: StatusVerifikasi.PENDING,
      },
      data: {
        statusVerifikasi: StatusVerifikasi.DITOLAK,
        statusPembelian: StatusPembelian.DITOLAK,
      },
    });

    if (totalUpdate.count === 0) {
      throw new BadRequestException(
        'Transaksi pembelian sudah diproses',
      );
    }

    await tx.approval.create({
      data: {
        idUserManager,
        idPembelian: id,
        status: StatusVerifikasi.DITOLAK,
        keteranganCatatan: catatan,
      },
    });

    return {
      message: 'Transaksi pembelian berhasil ditolak',
    };
  });
}
}



