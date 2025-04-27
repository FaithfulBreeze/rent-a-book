import { Inject, Injectable } from '@nestjs/common';
import { RepositoryCreate } from 'common/interfaces/repository-create/repository-create.interface';
import { Author } from './entities/author.entity';
import { RepositoryFindOne } from 'common/interfaces/repository-find-one/repository-find-one.interface';
import { RepositoryFindAll } from 'common/interfaces/repository-find-all/repository-find-all.interface';
import { RepositoryRemove } from 'common/interfaces/repository-remove/repository-remove.interface';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'drizzle/schema';
import { CreateAuthorDto } from './dto/create-author.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthorsRepository
  implements RepositoryCreate<Author>, RepositoryFindOne<Author>, RepositoryFindAll<Author>, RepositoryRemove
{
  constructor(@Inject('DrizzleService') private readonly db: NodePgDatabase<typeof schema>) {}

  async create(createAuthorDto: CreateAuthorDto) {
    return (await this.db.insert(schema.authors).values(createAuthorDto).returning())[0];
  }

  async findAll(limit?: number, offset?: number) {
    return await this.db
      .select()
      .from(schema.authors)
      .limit(limit || 10)
      .offset(offset || 0);
  }

  async findOne(field: 'name' | 'id', value: string) {
    return (await this.db.select().from(schema.authors).where(eq(schema.authors[field], value)))[0];
  }

  async remove(id: string) {
    await this.db.delete(schema.authors).where(eq(schema.authors.id, id));
  }
}
