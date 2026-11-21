
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { PraDryKilnService } from './pra-dry-kiln.service';
import { CreatePaletDto } from './dto/create-palet.dto';
import { UpdatePaletDto } from './dto/update-palet.dto';

@Controller('pra-dry-kiln/palet')
export class PraDryKilnController {
  constructor(
    private readonly praDryKilnService: PraDryKilnService,
  ) {}

  @Post()
  create(@Body() dto: CreatePaletDto) {
    return this.praDryKilnService.create(dto);
  }

  @Get()
  findAll() {
    return this.praDryKilnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.praDryKilnService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaletDto,
  ) {
    return this.praDryKilnService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.praDryKilnService.remove(id);
  }
}
