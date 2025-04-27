import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from 'jwt/jwt.module';
import { RedisModule } from 'redis/redis.module';
import { MailerModule } from 'mailer/mailer.module';
import { EncryptionModule } from 'encryption/encryption.module';
import { LibrariesModule } from './libraries/libraries.module';
import { AuthorsModule } from './authors/authors.module';

@Module({
  imports: [
    DrizzleModule,
    UsersModule,
    AuthModule,
    JwtModule,
    RedisModule,
    MailerModule,
    EncryptionModule,
    LibrariesModule,
    AuthorsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
