import { IsUUID } from 'class-validator';

export class DeleteAuthorDto {
    @IsUUID()
    id: string
}