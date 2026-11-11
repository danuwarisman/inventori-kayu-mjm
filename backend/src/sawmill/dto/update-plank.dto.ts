
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class UpdatePlankDto {
  @IsString()
  @IsOptional()
  kodePlank?: string;

  @IsString()
  @IsOptional()
  gradePapan?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  tinggi?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  lebar?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  panjang?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  volumePlank?: number;

  @IsString()
  @IsOptional()
  stage?: string;
}
