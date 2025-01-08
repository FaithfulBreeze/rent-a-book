import { IsUUID } from 'class-validator';

export class DeleteBookDto {
  @IsUUID()
  id: string;
}
