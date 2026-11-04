import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateBorrowRequestDto {
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
