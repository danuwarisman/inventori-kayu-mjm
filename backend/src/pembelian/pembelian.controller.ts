
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { PembelianService } from './pembelian.service';
import { CreatePembelianDto } from './dto/create-pembelian.dto';
import { UpdatePembelianDto } from './dto/update-pembelian.dto';
import { Request } from 'express';
import { Roles, Role } from '../auth/roles.decorator';
import { ApprovalPembelianDto } from './dto/approval-pembelian.dto';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    role: string;
  };
}

@Controller('pembelian')
export class PembelianController {
  constructor(private readonly pembelianService: PembelianService) {}

  @Get()
  findAll() {
    return this.pembelianService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pembelianService.findOne(id);
  }

  @Post()
  create(@Body() data: CreatePembelianDto) {
    return this.pembelianService.create(data);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePembelianDto,
  ) {
    return this.pembelianService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pembelianService.remove(id);
  }
    @Roles(Role.MANAGER)
  @Patch(':id/approve')
  approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ApprovalPembelianDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.pembelianService.approve(
      id,
      req.user.userId,
      data.catatan,
    );
  }

  @Roles(Role.MANAGER)
  @Patch(':id/reject')
  reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ApprovalPembelianDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.pembelianService.reject(
      id,
      req.user.userId,
      data.catatan,
    );
  }
}
