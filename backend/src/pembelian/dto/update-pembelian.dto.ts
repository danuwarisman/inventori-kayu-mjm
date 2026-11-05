
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class UpdatePembelianDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  idSupplier?: number;

  @IsDateString()
  @IsOptional()
  tanggalBeli?: string;
}
