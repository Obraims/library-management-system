import { IsInt, IsNotEmpty, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsInt()
  @Min(1000)
  @Max(2100)
  publishedYr: number;

  @IsInt()
  @Min(0)
  totalCopies: number;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  genreId: string;
}
