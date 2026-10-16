
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.supplier.findMany({
      orderBy: { idSupplier: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.supplier.findUnique({
      where: { idSupplier: id },
    });
  }

  async create(data: CreateSupplierDto) {
    return this.prisma.supplier.create({ data });
  }

  async update(id: number, data: UpdateSupplierDto) {
    return this.prisma.supplier.update({
      where: { idSupplier: id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.supplier.delete({
      where: { idSupplier: id },
    });
  }
}
