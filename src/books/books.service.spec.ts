import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { getCreateBookDto, getMockRedisService } from 'src/__mock__';
import {
  getDatabaseInstance,
  getMockDrizzleProvider,
  getSchema,
  startContainer,
  stopContainer,
} from 'src/__mock__/testdatabase';
import { AuthorsService } from 'src/authors/authors.service';
import { CreateBookDto } from './dto/create-book.dto';
import { CacheModule } from '@nestjs/cache-manager';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BooksService', () => {
  const schema = getSchema();
  let service: BooksService;
  let drizzleProvider: NodePgDatabase<typeof schema>;
  const mockAuthorsService = {
    provide: AuthorsService,
    useValue: {
      create: jest.fn((dto) =>
        drizzleProvider.insert(schema.authors).values(dto).returning(),
      ),
    },
  };

  beforeAll(async () => {
    await startContainer();
  }, 50 * 1000);

  afterAll(async () => {
    await stopContainer();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DrizzleModule, CacheModule.register()],
      providers: [
        getMockRedisService(),
        BooksService,
        getMockDrizzleProvider(),
        mockAuthorsService,
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    drizzleProvider = getDatabaseInstance();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a book without author object', async () => {
    const [createdAuthor] = await drizzleProvider
      .insert(schema.authors)
      .values({ name: 'Jeff Doe', rating: '4' })
      .returning();
    const [createdBook] = await service.create(
      getCreateBookDto('Book one', createdAuthor.id),
    );
    expect(createdBook).toHaveProperty('id');
  });

  it('should create a book with author object', async () => {
    const createBookDto: CreateBookDto = {
      ...getCreateBookDto('Book two'),
      author: { name: 'Jot Doe', rating: '3' },
    };
    const [createdBook] = await service.create(createBookDto);
    expect(createdBook).toHaveProperty('id');
  });

  it('should return all books', async () => {
    const createBookDtoOne: CreateBookDto = {
      ...getCreateBookDto('Book three'),
      author: { name: 'Jote Doe', rating: '3' },
    };
    const createBookDtoTwo: CreateBookDto = {
      ...getCreateBookDto('Book four'),
      author: { name: 'Joy Doe', rating: '3' },
    };
    await service.create(createBookDtoOne);
    await service.create(createBookDtoTwo);

    const books = await service.findAll('50', '0');
    expect(books.length).toBeGreaterThan(0);
  });

  it('should return book by id', async () => {
    const [createdBook] = await service.create({
      ...getCreateBookDto('Book two'),
      author: { name: 'Yong pin', rating: '5' },
    });
    const { id } = createdBook;
    const [foundBook] = await service.findOne(id);
    expect(foundBook).toHaveProperty('id', id);
  });

  it('should remove the book', async () => {
    const [createdBook] = await service.create({
      ...getCreateBookDto('Book four'),
      author: { name: 'Tenj huan', rating: '2' },
    });
    const { id } = createdBook;
    await service.remove(id);
    const [foundBook] = await service.findOne(id);
    expect(foundBook).toBeUndefined();
  });

  it('should update a book', async () => {
    const [createdBook] = await service.create({
      ...getCreateBookDto('Book four'),
      author: { name: 'Homun Taij', rating: '5' },
    });
    const { id } = createdBook;
    const updateBookDto: UpdateBookDto = {
      id,
      title: 'Book updated',
    };
    await service.update(id, updateBookDto);
    const [foundBook] = await service.findOne(id);
    expect(foundBook.title).toBe('Book updated');
  });
});
