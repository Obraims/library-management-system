import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  spaceId: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsDateString()
  @IsNotEmpty()
  endTime: string;

  @IsOptional()
  @IsString()
  purpose?: string;
}
