import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { RedisModule } from 'src/redis/redis.module';
import {
  getCreateUserDto,
  getMockDrizzleProvider,
  getMockMailerService,
  getMockRedisService,
} from 'src/__mock__';
import { RedisService } from 'src/redis/redis.service';
import { MailerService } from 'src/mailer/mailer.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockDrizzleProvider = getMockDrizzleProvider({ fakeInsert: true });
  const mockRedisService = getMockRedisService();
  const mockMailerService = getMockMailerService();

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DrizzleModule,
        RedisModule,
        EncryptionModule,
        JwtModule,
        MailerModule,
      ],
      providers: [
        UsersService,
        { provide: 'DrizzleProvider', useValue: mockDrizzleProvider },
        { provide: RedisService, useValue: mockRedisService },
        { provide: MailerService, useValue: mockMailerService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send email validation code', async () => {
    const createUserDto = getCreateUserDto();
    const { message } = (await service.create(createUserDto)) as {
      message: string;
    };
    expect(message).toBe(
      'An email validation code was sent to your email, send it back as a query value on field (validation_code), the code will expire in 1 minute',
    );
  });

  it('should throw if validation code is invalid or expired', async () => {
    const createUserDto = getCreateUserDto();
    await service.create(createUserDto);
    const validationCode = 'invalid_validation_code';
    try {
      await service.create(getCreateUserDto(), validationCode);
    } catch (error) {
      expect(error.message).toBe('Code not valid or expired');
    }
  });

  it('should create a user', async () => {
    const createUserDto = getCreateUserDto();
    await service.create(createUserDto);
    const validationCode = mockRedisService.getValidationCode(
      createUserDto.email,
    );
    expect(
      await service.create(getCreateUserDto(), validationCode),
    ).toHaveProperty('id');
  });

  it('should throw error if email already taken', async () => {
    const createUserDto = getCreateUserDto();
    createUserDto.email = 'josephdoe@gmail.com';
    try {
      await service.create(createUserDto);
    } catch (error) {
      expect(error.message).toBe('Email already in use');
    }
  });

  it('should throw error if password != confirmPassword', async () => {
    const createUserDto = getCreateUserDto();
    createUserDto.password = 'differentPassword';
    try {
      await service.create(createUserDto);
    } catch (error) {
      expect(error.message).toBe('Passwords does not match');
    }
  });

  it('should find user with id: "1"', async () => {
    expect(await service.findOne('1')).toHaveProperty('name', 'Joseph Doe');
  });

  it('should update a user', async () => {
    const userToBeUpdated = mockDrizzleProvider.users[0];
    expect(
      await service.update(userToBeUpdated.id, {
        email: 'updatedemail@gmail.com',
      }),
    ).toHaveProperty('email', 'updatedemail@gmail.com');
  });

  it('should remove a user', async () => {
    const userToBeDeleted = mockDrizzleProvider.users[0]
    await service.remove(userToBeDeleted.id)
    expect(mockDrizzleProvider.users.length).toBe(0)
  })
});
