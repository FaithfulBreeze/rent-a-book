import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'drizzle/schema';
import { and, eq, getTableColumns, ilike, SQL } from 'drizzle-orm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksRepository {
  constructor(@Inject('DrizzleService') private readonly db: NodePgDatabase<typeof schema>) {}

  async create(createBookDto: CreateBookDto) {
    return (await this.db.insert(schema.books).values(createBookDto).returning())[0];
  }

  async findAll(limit?: number, offset?: number, author?: string, name?: string, includeAuthor?: boolean) {
    const filters: SQL[] = [];

    if (name) filters.push(ilike(schema.books.name, `%${name}%`));
    if (author) filters.push(eq(schema.books.authorId, author));
    //eslint-disable-next-line  @typescript-eslint/no-unused-vars
    const { content, authorId, ...fields } = getTableColumns(schema.books);

    if (includeAuthor) {
      const authorColumns = getTableColumns(schema.authors);
      return await this.db
        .select({ ...fields, author: { ...authorColumns } })
        .from(schema.books)
        .where(and(...filters))
        .limit(limit || 10)
        .offset(offset || 0)
        .fullJoin(schema.authors, eq(schema.books.authorId, schema.authors.id));
    }

    return await this.db
      .select(fields)
      .from(schema.books)
      .where(and(...filters))
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
