import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  username: string;
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
