import {
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsDateString,
  IsInt,
  IsPositive,
} from 'class-validator';

export class CreatePaletDto {
  @IsDateString()
  tanggalSticking!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  idPlanks!: number[];
}