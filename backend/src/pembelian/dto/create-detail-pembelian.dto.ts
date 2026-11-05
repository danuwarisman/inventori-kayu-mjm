
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateDetailPembelianDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  asalSortimen: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  panjang: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  diameter: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  dimensiLog: string;

  @IsInt()
  @Min(1)
  jumlahDipesan: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  hargaPerLog: number;
}
