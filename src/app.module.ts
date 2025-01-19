import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { BooksModule } from './books/books.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';
import { EncryptionModule } from './encryption/encryption.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from './jwt/jwt.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    DrizzleModule,
    BooksModule,
    RedisModule,
    UsersModule,
    EncryptionModule,
    AuthModule,
    JwtModule,
    MailerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
