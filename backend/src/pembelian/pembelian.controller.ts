
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
import { ApprovalPembelianDto } from './dto/approval-pembelian.dto';
import { Roles, Role } from '../auth/roles.decorator';

@Controller('pembelian')
export class PembelianController {
  constructor(private readonly pembelianService: PembelianService) {}

  @Get()
  @Roles(Role.ADMIN_KANTOR, Role.ADMIN_LAPANGAN, Role.MANAGER)
  findAll() {
    return this.pembelianService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN_KANTOR, Role.ADMIN_LAPANGAN, Role.MANAGER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pembelianService.findOne(id);
  }

 @Post()
  @Roles(Role.ADMIN_KANTOR, Role.ADMIN_LAPANGAN)
  create(@Body() data: CreatePembelianDto) {
    return this.pembelianService.create(data);
  }

  @Patch(':id')
  @Roles(Role.ADMIN_KANTOR, Role.ADMIN_LAPANGAN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePembelianDto,
  ) {
    return this.pembelianService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN_KANTOR, Role.ADMIN_LAPANGAN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pembelianService.remove(id);
  }

  @Post(':id/approval')
  @Roles(Role.MANAGER)
  approval(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ApprovalPembelianDto,
    @Req() req: { user: { userId: number } },
  ) {
    return this.pembelianService.approval(
      id,
      req.user.userId,
      data,
    );
  }
}
