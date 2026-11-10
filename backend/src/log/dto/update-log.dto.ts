import {
  IsNumber,
  IsOptional,
  IsString,
  IsPositive,
  Min,
} from 'class-validator';

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
  @IsPositive()
  panjang?: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  diameter?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
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
  @Min(0)
  harga?: number;

  @IsOptional()
  tanggalMasuk?: string | Date;
}
