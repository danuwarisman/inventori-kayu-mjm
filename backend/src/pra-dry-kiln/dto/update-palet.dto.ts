import {
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsDateString,
  IsInt,
  IsPositive,
  IsOptional,
} from 'class-validator';

export class UpdatePaletDto {
  @IsDateString()
  @IsOptional()
  tanggalSticking?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @IsOptional()
  idPlanks?: number[];
}