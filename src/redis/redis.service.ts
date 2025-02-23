import { Inject, Injectable } from '@nestjs/common';
import { RedisStore } from 'cache-manager-redis-yet';

@Injectable()
export class RedisService {
  constructor(@Inject('CACHE_MANAGER') private readonly cache: RedisStore) {}

  async storeValidationCode(email: string, code: string) {
    await this.cache.set(email, code, 60 * 1000);
  }

  async getValidationCode(email: string) {
    return await this.cache.get(email);
  }
}
