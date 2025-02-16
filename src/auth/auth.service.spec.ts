import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { EncryptionModule } from 'src/encryption/encryption.module';
import {
  getDatabaseInstance,
  getMockDrizzleProvider,
  getSchema,
  startContainer,
  stopContainer,
} from 'src/__mock__/testdatabase';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { getCreateUserDto, getMockEncryptionService } from 'src/__mock__';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  const schema = getSchema();
  let drizzleProvider: NodePgDatabase<typeof schema>;

  beforeAll(async () => {
    await startContainer();
  }, 50 * 1000);

  afterAll(async () => {
    await stopContainer();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DrizzleModule, EncryptionModule],
      providers: [
        AuthService,
        getMockDrizzleProvider(),
        getMockEncryptionService(),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    drizzleProvider = getDatabaseInstance();
    await drizzleProvider.delete(schema.users);
    await drizzleProvider.insert(schema.users).values(getCreateUserDto('John'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error if email was not found', async () => {
    const loginDto: LoginDto = {
      email: 'johndoewrongmail@gmail.com',
      password: 'password',
    };
    try {
      await service.login(loginDto);
    } catch (error) {
      expect(error.message).toBe('Not Found');
    }
  });
  it('should throw error if passwords does not match', async () => {
    const loginDto: LoginDto = {
      email: 'johndoe@gmail.com',
      password: 'password',
    };
    try {
      await service.login(loginDto);
    } catch (error) {
      expect(error.message).toBe('Passwords does not match');
    }
  });
  it('should return user id if success on login', async () => {
    const loginDto: LoginDto = {
      email: 'johndoe@gmail.com',
      password: 'password',
    };
    const id = await service.login(loginDto);
    expect(id).toBeDefined();
  });
});
