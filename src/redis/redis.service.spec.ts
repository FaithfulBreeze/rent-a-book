import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { getMockRedisService } from 'src/__mock__';

describe('RedisService', () => {
  let service: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [getMockRedisService()],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should store and retrieve data', async () => {
    await service.storeValidationCode('abc', '123')
    const result = await service.getValidationCode('abc')
    expect(result).toBe('123')
  })
});
