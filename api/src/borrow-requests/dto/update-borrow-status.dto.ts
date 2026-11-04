import { IsEnum, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export enum BorrowStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
}

export class UpdateBorrowStatusDto {
  @IsEnum(BorrowStatusEnum)
  @IsNotEmpty()
  status: BorrowStatusEnum;

  @IsOptional()
  @IsDateString()
  returnDate?: string;
}
