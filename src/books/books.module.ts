import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { AuthorsModule } from 'src/authors/authors.module';

@Module({
  imports: [AuthorsModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
