import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'drizzle/schema';
import { RepositoryFindOne } from 'common/interfaces/repository-find-one/repository-find-one.interface';
import { User } from 'users/entities/user.entity';

@Injectable()
export class AuthRepository implements RepositoryFindOne<User> {
  constructor(
    @Inject('DrizzleService')
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findOne(value: string) {
    return (await this.db.select().from(schema.users).where(eq(schema.users.email, value)))[0];
  }
}
