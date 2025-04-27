import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmpty, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  authorProfile?: string;
  @IsString()
  libraryId?: string;
  @IsString()
  acessToken?: string;
}
