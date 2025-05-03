import { Inject, Injectable } from '@nestjs/common';
import { RepositoryCreate } from 'common/interfaces/repository-create/repository-create.interface';

import { RepositoryFindOne } from 'common/interfaces/repository-find-one/repository-find-one.interface';
import { RepositoryFindAll } from 'common/interfaces/repository-find-all/repository-find-all.interface';
import { RepositoryRemove } from 'common/interfaces/repository-remove/repository-remove.interface';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'drizzle/schema';
import { eq, getTableColumns } from 'drizzle-orm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksRepository
  implements RepositoryCreate<Book>, RepositoryFindOne<Book>, RepositoryFindAll<Book>, RepositoryRemove
{
  constructor(@Inject('DrizzleService') private readonly db: NodePgDatabase<typeof schema>) {}

  async create(createBookDto: CreateBookDto) {
    return (await this.db.insert(schema.books).values(createBookDto).returning())[0];
  }

  async findAll(limit?: number, offset?: number, author?: string) {
    //eslint-disable-next-line  @typescript-eslint/no-unused-vars
    const { content, ...fields } = getTableColumns(schema.books);
    if (author) {
      return await this.db
        .select(fields)
        .from(schema.books)
        .where(eq(schema.books.authorId, author))
        .limit(limit || 10)
        .offset(offset || 0);
    }
    return await this.db
      .select(fields)
      .from(schema.books)
      .limit(limit || 10)
      .offset(offset || 0);
  }

  async findOne(field: 'name' | 'id', value: string) {
    return (await this.db.select().from(schema.books).where(eq(schema.books[field], value)))[0];
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    await this.db.update(schema.books).set(updateBookDto).where(eq(schema.books.id, id));
  }

  async remove(id: string) {
    await this.db.delete(schema.books).where(eq(schema.books.id, id));
  }
}
