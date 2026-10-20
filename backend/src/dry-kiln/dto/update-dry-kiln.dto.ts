import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDryKilnDto {
  @IsString()
  @IsOptional()
  id_log?: string;

  @IsString()
  @IsOptional()
  id_plank?: string;

  @IsString()
  @IsOptional()
  sortimen?: string;

  @IsString()
  @IsOptional()
  grade?: string;

  @IsNumber()
  @IsOptional()
  panjang?: number;

  @IsNumber()
  @IsOptional()
  lebar?: number;

  @IsNumber()
  @IsOptional()
  tinggi?: number;

  @IsNumber()
  @IsOptional()
  volume?: number;

  @IsString()
  @IsOptional()
  stage?: string;

  @IsOptional()
  date?: string | Date;
}
