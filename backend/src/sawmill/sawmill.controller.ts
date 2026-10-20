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
import { SawmillService } from './sawmill.service';
import { CreateSawmillDto } from './dto/create-sawmill.dto';
import { CreatePlankDto } from './dto/create-plank.dto';
import { UpdatePlankDto } from './dto/update-plank.dto';

@Controller('sawmill')
export class SawmillController {
  constructor(private readonly sawmillService: SawmillService) {}

  @Get()
  findAll(
    @Query('sortimen') sortimen?: string,
    @Query('stage') stage?: string,
  ) {
    return this.sawmillService.findAll(sortimen, stage);
  }

  @Get('planks')
  findAllPlanks() {
    return this.sawmillService.findAllPlanks();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sawmillService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSawmillDto) {
    return this.sawmillService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any,
  ) {
    return this.sawmillService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sawmillService.remove(id);
  }

  @Post(':id/plank')
  addPlank(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePlankDto,
  ) {
    return this.sawmillService.addPlank(id, dto);
  }

  @Patch('plank/:idPlank')
  updatePlank(
    @Param('idPlank', ParseIntPipe) idPlank: number,
    @Body() dto: UpdatePlankDto,
  ) {
    return this.sawmillService.updatePlank(idPlank, dto);
  }

  @Delete('plank/:idPlank')
  removePlank(@Param('idPlank', ParseIntPipe) idPlank: number) {
    return this.sawmillService.removePlank(idPlank);
  }
}
