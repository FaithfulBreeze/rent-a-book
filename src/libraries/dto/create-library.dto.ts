import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateLibraryDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  name: string;
}
