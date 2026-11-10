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
import { LogService } from './log.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.decorator';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  findAll(
    @Query('sortimen') sortimen?: string,
    @Query('stage') stage?: string,
  ) {
    return this.logService.findAll(sortimen, stage);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.logService.findOne(id);
  }

  @Roles(Role.ADMIN_KANTOR)
  @Post()
  create(@Body() dto: CreateLogDto) {
    return this.logService.create(dto);
  }

  @Roles(Role.ADMIN_KANTOR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLogDto,
  ) {
    return this.logService.update(id, dto);
  }

  @Roles(Role.ADMIN_KANTOR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.logService.remove(id);
  }
}
