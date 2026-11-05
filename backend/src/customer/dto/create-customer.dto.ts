import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  namaCustomer!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  alamatCustomer!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  kontakCustomer!: string;
}