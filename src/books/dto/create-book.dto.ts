import { IsString, Length } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @Length(1, 30)
  name: string;
  @IsString()
  @Length(1, 120)
  description: string;
  @IsString()
  content: string;
  filename: string;
  authorId: string;
}
