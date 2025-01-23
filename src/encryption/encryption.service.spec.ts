import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';
import { EncryptionModule } from './encryption.module';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EncryptionModule],
      providers: [EncryptionService],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
