import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { StatusVerifikasi } from '../../../generated/prisma/enums';

export class ApprovalPembelianDto {
  @IsEnum(StatusVerifikasi)
  status!: StatusVerifikasi;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  keteranganCatatan?: string;
}