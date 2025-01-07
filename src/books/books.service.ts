import { Inject, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { desc, eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema';

@Injectable()
export class BooksService {
  constructor(
    @Inject('DrizzleProvider')
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  create(createBookDto: CreateBookDto) {
    return this.db.insert(schema.books).values([createBookDto]).returning()
  }

  findAll(limit: string, skip: string) {
    return this.db
      .select()
      .from(schema.books)
      .limit(+limit || 50)
      .offset(+skip || 0)
      .orderBy(desc(schema.books.rating))
  }

  findOne(id: string) {
    return this.db.select().from(schema.books).where(eq(schema.books.id, id))
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    return this.db.update(schema.books).set(updateBookDto).where(eq(schema.books.id, id)).returning()
  }

  remove(id: string) {
    return this.db.delete(schema.books).where(eq(schema.books.id, id));
  }
}
