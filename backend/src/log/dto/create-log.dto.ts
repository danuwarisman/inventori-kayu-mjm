import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLogDto {
  @IsString()
  @IsOptional()
  kodeLog?: string;

  @IsString()
  @IsOptional()
  id_log?: string;

  @IsString()
  @IsNotEmpty()
  asalSortimen: string;

  @IsNumber()
  @IsNotEmpty()
  panjang: number;

  @IsNumber()
  @IsNotEmpty()
  diameter: number;

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
