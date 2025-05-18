import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'drizzle/schema';
import { CreateLibraryDto } from './dto/create-library.dto';
import { eq } from 'drizzle-orm';
import { UpdateLibraryDto } from './dto/update-library.dto';

@Injectable()
export class LibrariesRepository {
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
