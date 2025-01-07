import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsUUID } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsUUID()
  id: string;
}
