import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  password: string;
  @ValidateIf((o) => o.hasLibrary == true)
  @IsNotEmpty()
  @IsUUID()
  libraryId: string;
  @IsBoolean()
  @IsNotEmpty()
  hasLibrary: boolean;
}
