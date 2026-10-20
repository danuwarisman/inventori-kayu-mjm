import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DryKilnService } from './dry-kiln.service';
import { CreateDryKilnDto } from './dto/create-dry-kiln.dto';
import { UpdateDryKilnDto } from './dto/update-dry-kiln.dto';

@Controller('dry-kiln')
export class DryKilnController {
  constructor(private readonly dryKilnService: DryKilnService) {}

  @Get()
  findAll(
    @Query('sortimen') sortimen?: string,
    @Query('stage') stage?: string,
    @Query('date') date?: string,
  ) {
    return this.dryKilnService.findAll(sortimen, stage, date);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dryKilnService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDryKilnDto) {
    return this.dryKilnService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDryKilnDto,
  ) {
    return this.dryKilnService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.dryKilnService.remove(id);
  }
}
