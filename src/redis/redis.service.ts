import { CacheStore } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(@Inject('CACHE_MANAGER') private readonly cache: CacheStore) {}

  async storeValidationCode(id: string, code: string) {
    await this.cache.set(id, code, 60 * 1000);
  }

  async getValidationCode(id: string) {
    return await this.cache.get(id);
  }
}
