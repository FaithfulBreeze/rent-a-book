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

  createLibrary(createLibraryDto: CreateLibraryDto) {
    return this.db.insert(schema.libraries).values(createLibraryDto).returning();
  }

  getAllLibraries() {
    return this.db.select().from(schema.libraries);
  }

  getLibraryData(field: 'name' | 'id', value: string) {
    return this.db.select().from(schema.libraries).where(eq(schema.libraries[field], value));
  }

  updateLibrary(id: string, updateLibraryDto: UpdateLibraryDto) {
    return this.db.update(schema.libraries).set(updateLibraryDto).where(eq(schema.libraries.id, id)).returning();
  }

  removeLibrary(id: string) {
    return this.db.delete(schema.libraries).where(eq(schema.libraries.id, id));
  }
}
