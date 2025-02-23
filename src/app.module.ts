import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { RedisModule } from 'redis/redis.module';
import { MailerModule } from 'mailer/mailer.module';
import { EncryptionModule } from 'encryption/encryption.module';

@Module({
  imports: [DrizzleModule, RedisModule, MailerModule, EncryptionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
