
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDetailPembelianDto } from './create-detail-pembelian.dto';

export class CreatePembelianDto {
  @IsInt()
  @Min(1)
  idSupplier: number;

  @IsInt()
  @Min(1)
  idUser: number;

  @IsDateString()
  tanggalBeli: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateDetailPembelianDto)
  detailPembelian: CreateDetailPembelianDto[];
}
