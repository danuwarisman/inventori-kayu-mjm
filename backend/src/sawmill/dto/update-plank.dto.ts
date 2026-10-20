import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePlankDto {
  @IsString()
  @IsOptional()
  kodePlank?: string;

  @IsString()
  @IsOptional()
  gradePapan?: string;

  @IsNumber()
  @IsOptional()
  tinggi?: number;

  @IsNumber()
  @IsOptional()
  lebar?: number;

  @IsNumber()
  @IsOptional()
  panjang?: number;

  @IsNumber()
  @IsOptional()
  volumePlank?: number;

  @IsString()
  @IsOptional()
  stage?: string;
}
