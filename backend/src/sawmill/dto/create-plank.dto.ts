import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePlankDto {
  @IsString()
  @IsOptional()
  kodePlank?: string;

  @IsString()
  @IsOptional()
  id_plank?: string;

  @IsNumber()
  @IsOptional()
  idSawmill?: number;

  @IsNumber()
  @IsOptional()
  idLogAsal?: number;

  @IsString()
  @IsNotEmpty()
  gradePapan: string;

  @IsNumber()
  @IsNotEmpty()
  tinggi: number;

  @IsNumber()
  @IsNotEmpty()
  lebar: number;

  @IsNumber()
  @IsNotEmpty()
  panjang: number;

  @IsNumber()
  @IsOptional()
  volumePlank?: number;

  @IsString()
  @IsOptional()
  stage?: string;

  @IsString()
  @IsOptional()
  sortimen?: string;
}
