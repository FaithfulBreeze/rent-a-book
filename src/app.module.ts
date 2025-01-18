import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { BooksModule } from './books/books.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DrizzleModule, BooksModule, RedisModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
