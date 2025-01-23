import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { AuthorsModule } from './authors.module';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { RedisModule } from 'src/redis/redis.module';

describe('AuthorsService', () => {
  let service: AuthorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthorsModule, DrizzleModule, RedisModule],
      providers: [AuthorsService],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
