import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  rating: '1' | '2' | '3' | '4' | '5';
}
