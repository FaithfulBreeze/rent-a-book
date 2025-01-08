import { IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  name: string;
  @IsNumberString()
  @IsNotEmpty()
  rating: '1' | '2' | '3' | '4' | '5';
}
