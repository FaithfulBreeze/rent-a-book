import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import {
  getMockDrizzleProvider,
  startContainer,
  stopContainer,
} from 'src/__mock__/testdatabase';
import { getCreateAuthorDto } from 'src/__mock__';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

describe('AuthorsService', () => {
  let service: AuthorsService;

  beforeAll(async () => {
    await startContainer();
  }, 10 * 1000);

  afterAll(async () => {
    await stopContainer();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DrizzleModule],
      providers: [AuthorsService, getMockDrizzleProvider()],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a author', async () => {
    const [createdAuthor] = await service.create(getCreateAuthorDto('Aiden'));
    expect(createdAuthor).toHaveProperty('id');
  });

  it('should return all authors', async () => {
    const createAuthorDtoOne: CreateAuthorDto = getCreateAuthorDto('Bob');
    const createAuthorDtoTwo: CreateAuthorDto = getCreateAuthorDto('Josh');
    await service.create(createAuthorDtoOne);
    await service.create(createAuthorDtoTwo);

    const author = await service.findAll();
    expect(author.length).toBeGreaterThan(0);
  });

  it('should return book by id', async () => {
    const [createdAuthor] = await service.create(getCreateAuthorDto('Roger'));
    const { id } = createdAuthor;
    const [foundAuthor] = await service.findOne(id);
    expect(foundAuthor).toHaveProperty('id', id);
  });

  it('should remove the book', async () => {
    const [createdAuthor] = await service.create(getCreateAuthorDto('Bob'));
    const { id } = createdAuthor;
    await service.remove(id);
    const [foundAuthor] = await service.findOne(id);
    expect(foundAuthor).toBeUndefined();
  });

  it('should update a book', async () => {
    const [createdAuthor] = await service.create(getCreateAuthorDto('Aiden'));
    const { id } = createdAuthor;
    const updateAuthorDto: UpdateAuthorDto = {
      id,
      name: 'Name updated',
    };
    await service.update(id, updateAuthorDto);
    const [foundAuthor] = await service.findOne(id);
    expect(foundAuthor.name).toBe('Name updated');
  });
});
