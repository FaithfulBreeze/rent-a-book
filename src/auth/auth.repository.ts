import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'drizzle/schema';

@Injectable()
export class AuthRepository {
  constructor(
    @Inject('DrizzleService')
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findOne(value: string) {
    return (await this.db.select().from(schema.users).where(eq(schema.users.email, value)))[0];
  }
}
