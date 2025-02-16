import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateAuthorDto } from 'src/authors/dto/create-author.dto';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  title: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsNumber()
  @IsNotEmpty()
  pricePerDay: number;
  @ValidateIf((o) => !o.author)
  @IsNotEmpty()
  authorId: string;
  @IsNumberString()
  @IsNotEmpty()
  rating: '1' | '2' | '3' | '4' | '5';

  @ValidateIf((o) => o.author)
  @ValidateNested()
  @Type(() => CreateAuthorDto)
  author: CreateAuthorDto;
}
