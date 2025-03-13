import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'drizzle/schema';
import { CreateLibraryDto } from './dto/create-library.dto';
import { eq } from 'drizzle-orm';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { RepositoryCreate } from 'common/interfaces/repository-create/repository-create.interface';
import { Library } from './entities/library.entity';
import { RepositoryFindAll } from 'common/interfaces/repository-find-all/repository-find-all.interface';
import { RepositoryFindOne } from 'common/interfaces/repository-find-one/repository-find-one.interface';
import { RepositoryUpdate } from 'common/interfaces/repository-update/repository-update.interface';
import { RepositoryRemove } from 'common/interfaces/repository-remove/repository-remove.interface';

@Injectable()
export class LibrariesRepository
  implements
    RepositoryCreate<Library>,
    RepositoryFindAll<Library>,
    RepositoryFindOne<Library>,
    RepositoryUpdate<Library>,
    RepositoryRemove
{
  constructor(
    @Inject('DrizzleService')
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createLibraryDto: CreateLibraryDto) {
    return (await this.db.insert(schema.libraries).values(createLibraryDto).returning())[0];
  }

  async findAll(limit?: number, offset?: number) {
    return await this.db
      .select()
      .from(schema.libraries)
      .limit(limit || 10)
      .offset(offset || 0);
  }

  async findOne(field: 'name' | 'id', value: string) {
    return (await this.db.select().from(schema.libraries).where(eq(schema.libraries[field], value)))[0];
  }

  async update(id: string, updateLibraryDto: UpdateLibraryDto) {
    return (
      await this.db.update(schema.libraries).set(updateLibraryDto).where(eq(schema.libraries.id, id)).returning()
    )[0];
  }

  async remove(id: string) {
    await this.db.delete(schema.libraries).where(eq(schema.libraries.id, id));
  }
}
