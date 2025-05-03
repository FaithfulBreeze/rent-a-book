import { Author } from 'authors/entities/author.entity';
import { CreateBookDto } from 'books/dto/create-book.dto';

export interface ServicePdf {
  generate: (book: CreateBookDto, author: Author, filename: string) => string | Promise<string>;
  getPath(filename: string): string;
  remove(filename: string): void;
}
