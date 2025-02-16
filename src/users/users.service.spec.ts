import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { MailerModule } from 'src/mailer/mailer.module';
import {
  getCreateUserDto,
  getMockMailerService,
  getMockRedisService,
} from 'src/__mock__';
import {
  getMockDrizzleProvider,
  getDatabaseInstance,
  startContainer,
  getSchema,
  stopContainer,
} from 'src/__mock__/testdatabase';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from 'src/redis/redis.service';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  const schema = getSchema();
  let service: UsersService;
  let redisService: RedisService;
  let drizzleProvider: NodePgDatabase<typeof schema>;

  beforeAll(async () => {
    await startContainer();
  }, 50 * 1000);

  afterAll(async () => {
    await stopContainer();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DrizzleModule,
        CacheModule.register(),
        EncryptionModule,
        JwtModule,
        MailerModule,
      ],
      providers: [
        UsersService,
        getMockDrizzleProvider(),
        getMockRedisService(),
        getMockMailerService(),
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    drizzleProvider = getDatabaseInstance();
    redisService = module.get<RedisService>(RedisService);
    await drizzleProvider.delete(schema.users);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(redisService).toBeDefined();
  });

  it('should send email validation code', async () => {
    const createUserDto = getCreateUserDto('Steve');
    const { message } = (await service.create(createUserDto)) as {
      message: string;
    };
    expect(message).toBe(
      'An email validation code was sent to your email, send it back as a query value on field (validation_code), the code will expire in 1 minute',
    );
  });

  it('should throw if validation code is invalid or expired', async () => {
    const createUserDto = getCreateUserDto('John');
    await service.create(createUserDto);
    const validationCode = 'invalid_validation_code';
    try {
      await service.create(getCreateUserDto('John'), validationCode);
    } catch (error) {
      expect(error.message).toBe('Code not valid or expired');
    }
  });

  it('should create a user', async () => {
    const createUserDto = getCreateUserDto('Johanne');
    await service.create(createUserDto);
    const validationCode = redisService.getValidationCode(
      createUserDto.email,
    ) as unknown as string;
    const data = await service.create(
      getCreateUserDto('Johanne'),
      validationCode,
    );
    expect(data[0]).toHaveProperty('id');
  });

  it('should throw error if email already taken', async () => {
    const createUserDto = getCreateUserDto('Johanne');
    createUserDto.email = 'johannedoe@gmail.com';
    try {
      await service.create(createUserDto);
    } catch (error) {
      expect(error.message).toBe('Email already in use');
    }
  });

  it('should throw error if password != confirmPassword', async () => {
    const createUserDto = getCreateUserDto('Steve');
    createUserDto.password = 'differentPassword';
    try {
      await service.create(createUserDto);
    } catch (error) {
      expect(error.message).toBe('Passwords does not match');
    }
  });

  it(`should find user by id`, async () => {
    const [createdUser] = await drizzleProvider
      .insert(schema.users)
      .values(getCreateUserDto('Bill'))
      .returning();
    const { id } = createdUser;
    const [foundUser] = await service.findOne(id);
    expect(foundUser).toHaveProperty('name', 'Bill Doe');
  });

  it('should update a user', async () => {
    const [createdUser] = await drizzleProvider
      .insert(schema.users)
      .values(getCreateUserDto('Bill'))
      .returning();
    const { id } = createdUser;
    const updateUserDto: UpdateUserDto = {
      name: 'Jane Doe',
    };
    await service.update(id, updateUserDto);
    const [updatedUser] = await drizzleProvider
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));
    expect(updatedUser).toHaveProperty('name', 'Jane Doe');
  });

  it('should remove a user', async () => {
    const [createdUser] = await drizzleProvider
      .insert(schema.users)
      .values(getCreateUserDto('Bill'))
      .returning();
    const { id } = createdUser;
    await service.remove(id);
    const foundData = await drizzleProvider
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));
    expect(foundData).toHaveLength(0);
  });
});
