import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDryKilnDto {
  @IsString()
  @IsOptional()
  id_log?: string;

  @IsString()
  @IsOptional()
  kodeLog?: string;

  @IsString()
  @IsOptional()
  id_plank?: string;

  @IsString()
  @IsOptional()
  kodePlank?: string;

  @IsNumber()
  @IsOptional()
  idPlank?: number;

  @IsString()
  @IsOptional()
  sortimen?: string;

  @IsString()
  @IsOptional()
  grade?: string;

  @IsNumber()
  @IsNotEmpty()
  panjang: number;

  @IsNumber()
  @IsNotEmpty()
  lebar: number;

  @IsNumber()
  @IsNotEmpty()
  tinggi: number;

  @IsNumber()
  @IsOptional()
  volume?: number;

  @IsString()
  @IsOptional()
  stage?: string;

  @IsOptional()
  date?: string | Date;

  @IsOptional()
  tanggalMasuk?: string | Date;
}
