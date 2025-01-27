import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { RedisModule } from 'src/redis/redis.module';
import { getCreateUserDto, getUpdateUserDto } from 'src/__mock__';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DrizzleModule,
        RedisModule,
        EncryptionModule,
        JwtModule,
        MailerModule,
      ],
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create with createUserDto', async () => {
    const createUserDto = getCreateUserDto();
    await controller.create(createUserDto, undefined);
    expect(mockUsersService.create).toHaveBeenCalledWith(
      createUserDto,
      undefined,
    );
  });

  it('should call findOne with id: "4"', async () => {
    await controller.findOne('4');
    expect(mockUsersService.findOne).toHaveBeenCalledWith('4');
  });

  it('should call update with id: "3" and updateUserDto', async () => {
    const updateUserDto = getUpdateUserDto();
    await controller.update('3', updateUserDto);
    expect(mockUsersService.update).toHaveBeenCalledWith('3', updateUserDto);
  });

  it('should call remove with id: "2"', async () => {
    await controller.remove('2');
    expect(mockUsersService.remove).toHaveBeenCalledWith('2');
  });
});
