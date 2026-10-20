import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLogDto {
  @IsString()
  @IsOptional()
  kodeLog?: string;

  @IsString()
  @IsOptional()
  id_log?: string;

  @IsString()
  @IsOptional()
  asalSortimen?: string;

  @IsNumber()
  @IsOptional()
  panjang?: number;

  @IsNumber()
  @IsOptional()
  diameter?: number;

  @IsNumber()
  @IsOptional()
  volumeLog?: number;

  @IsString()
  @IsOptional()
  statusLog?: string;

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
  tanggalMasuk?: string | Date;
}
