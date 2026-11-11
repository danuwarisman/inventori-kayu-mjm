
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreatePlankDto {
  @IsString()
  @IsOptional()
  kodePlank?: string;

  @IsString()
  @IsOptional()
  id_plank?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  idSawmill?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  idLogAsal?: number;

  @IsString()
  @IsNotEmpty()
  gradePapan!: string;

  @IsNumber()
  @IsPositive()
  tinggi!: number;

  @IsNumber()
  @IsPositive()
  lebar!: number;

  @IsNumber()
  @IsPositive()
  panjang!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  volumePlank?: number;

  @IsString()
  @IsOptional()
  stage?: string;

  @IsString()
  @IsOptional()
  sortimen?: string;
}
