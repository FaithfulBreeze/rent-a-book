import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { RedisModule } from 'redis/redis.module';
import { MailerModule } from 'mailer/mailer.module';

@Module({
  imports: [DrizzleModule, RedisModule, MailerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
