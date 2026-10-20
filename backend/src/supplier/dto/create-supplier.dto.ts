import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  namaSupplier: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  alamatSupplier: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  kontakSupplier: string;
}
