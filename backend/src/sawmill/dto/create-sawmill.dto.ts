import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSawmillDto {
  @IsString()
  @IsOptional()
  kodeSawmill?: string;

  @IsNumber()
  @IsOptional()
  idLog?: number;

  @IsString()
  @IsOptional()
  id_log_asal?: string;

  @IsString()
  @IsOptional()
  sortimen?: string;

  @IsNumber()
  @IsOptional()
  panjang?: number;

  @IsNumber()
  @IsOptional()
  diameter?: number;

  @IsNumber()
  @IsOptional()
  volume_total?: number;

  @IsString()
  @IsOptional()
  stage?: string;

  @IsString()
  @IsOptional()
  suplier?: string;

  @IsNumber()
  @IsOptional()
  harga?: number;

  @IsOptional()
  tanggal?: string | Date;

  @IsArray()
  @IsOptional()
  planks?: any[];
}
