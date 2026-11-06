import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ApprovalPembelianDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  catatan?: string;
}