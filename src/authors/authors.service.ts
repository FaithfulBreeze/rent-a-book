import { Inject, Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthorsService {
  constructor(
    @Inject('DrizzleProvider')
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}
  create(createAuthorDto: CreateAuthorDto) {
    return this.db.insert(schema.authors).values(createAuthorDto).returning();
  }

  findAll() {
    return this.db.select().from(schema.authors);
  }

  findOne(id: string) {
    return this.db
      .select()
      .from(schema.authors)
      .where(eq(schema.authors.id, id));
  }

  update(id: string, updateAuthorDto: UpdateAuthorDto) {
    return this.db
      .update(schema.authors)
      .set(updateAuthorDto)
      .where(eq(schema.authors.id, id));
  }

  remove(id: string) {
    return this.db.delete(schema.authors).where(eq(schema.authors.id, id));
  }
}
