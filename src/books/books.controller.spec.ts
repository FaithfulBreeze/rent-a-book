import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { getCreateBookDto, getMockRedisService } from 'src/__mock__';
import { CacheModule } from '@nestjs/cache-manager';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BooksController', () => {
  let controller: BooksController;

  const mockBooksService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DrizzleModule, CacheModule.register()],
      controllers: [BooksController],
      providers: [
        { provide: BooksService, useValue: mockBooksService },
        getMockRedisService(),
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create with createBookDto', async () => {
    const createBookDto = getCreateBookDto('Book one');
    await controller.create(createBookDto);
    expect(mockBooksService.create).toHaveBeenCalledWith(createBookDto);
  });

  it('should call findOne with id: "4"', async () => {
    await controller.findOne({ id: '4' });
    expect(mockBooksService.findOne).toHaveBeenCalledWith('4');
  });

  it('should call findAll', async () => {
    await controller.findAll({ limit: '10', skip: '5' });
    expect(mockBooksService.findAll).toHaveBeenCalledWith('10', '5');
  });

  it('should call update', async () => {
    const updateBookDto: UpdateBookDto = {
      id: '3',
      title: 'Book update',
    };
    await controller.update({ id: '3' }, updateBookDto);
    expect(mockBooksService.update).toHaveBeenCalledWith('3', updateBookDto);
  });

  it('should call remove with id: "2"', async () => {
    await controller.remove({ id: '2' });
    expect(mockBooksService.remove).toHaveBeenCalledWith('2');
  });
});
