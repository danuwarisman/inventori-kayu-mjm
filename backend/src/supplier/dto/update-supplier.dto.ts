import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSupplierDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  namaSupplier?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  alamatSupplier?: string;

  @IsString()
  @IsOptional()
  @MaxLength(15)
  kontakSupplier?: string;
}
