import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { getMockRedisService } from 'src/__mock__';
import { CacheModule } from '@nestjs/cache-manager';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

describe('AuthorsController', () => {
  let controller: AuthorsController;

  const mockAuthorsService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DrizzleModule, CacheModule.register()],
      controllers: [AuthorsController],
      providers: [
        { provide: AuthorsService, useValue: mockAuthorsService },
        getMockRedisService(),
      ],
    }).compile();

    controller = module.get<AuthorsController>(AuthorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create with createAuthorDto', async () => {
    const createAuthorDto: CreateAuthorDto = {
      name: 'Bob Doe',
      rating: '3',
    };
    await controller.create(createAuthorDto);
    expect(mockAuthorsService.create).toHaveBeenCalledWith(createAuthorDto);
  });

  it('should call findOne with id: "4"', async () => {
    await controller.findOne({ id: '4' });
    expect(mockAuthorsService.findOne).toHaveBeenCalledWith('4');
  });

  it('should call findAll', async () => {
    await controller.findAll();
    expect(mockAuthorsService.findOne).toHaveBeenCalled();
  });

  it('should call update with updateAuthorDto', async () => {
    const updateAuthorDto: UpdateAuthorDto = {
      id: '3',
      rating: '5',
    };
    await controller.update({ id: '3' }, updateAuthorDto);
    expect(mockAuthorsService.update).toHaveBeenCalledWith(
      '3',
      updateAuthorDto,
    );
  });

  it('should call remove with id: "2"', async () => {
    await controller.remove({ id: '2' });
    expect(mockAuthorsService.remove).toHaveBeenCalledWith('2');
  });
});
