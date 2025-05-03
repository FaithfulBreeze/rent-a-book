import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { AuthorsModule } from 'authors/authors.module';
import { AuthorsRepository } from 'authors/authors.repository';
import { UsersRepository } from 'users/users.repository';
import { BooksRepository } from './books.repository';
import { PdfModule } from 'pdf/pdf.module';

@Module({
  imports: [PdfModule],
  controllers: [BooksController],
  providers: [BooksService, BooksRepository, AuthorsRepository, UsersRepository],
})
export class BooksModule {}
