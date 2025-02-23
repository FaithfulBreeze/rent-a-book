import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { RedisModule } from 'redis/redis.module';

@Module({
  imports: [DrizzleModule, RedisModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
