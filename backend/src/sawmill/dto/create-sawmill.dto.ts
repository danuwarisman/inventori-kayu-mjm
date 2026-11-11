
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePlankDto } from './create-plank.dto';

export class CreateSawmillDto {
  @IsString()
  @IsOptional()
  kodeSawmill?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  idLog?: number;

  @IsString()
  @IsOptional()
  id_log_asal?: string;

  @IsString()
  @IsOptional()
  sortimen?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  panjang?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  diameter?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  volume_total?: number;

  @IsString()
  @IsOptional()
  stage?: string;

  @IsString()
  @IsOptional()
  suplier?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  harga?: number;

  @IsDateString()
  @IsOptional()
  tanggal?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePlankDto)
  @IsOptional()
  planks?: CreatePlankDto[];
}
