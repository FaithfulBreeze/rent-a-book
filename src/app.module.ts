import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { DrizzleProvider } from './drizzle/drizzle.service';
import { BooksModule } from './books/books.module';

@Module({
  imports: [DrizzleModule, BooksModule],
  controllers: [],
  providers: [DrizzleProvider],
})
export class AppModule {}
