import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/drizzle/schema';
import { eq, getTableColumns } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(
    @Inject('DrizzleProvider')
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return this.db.insert(schema.users).values(createUserDto).returning();
  }

  findOne(id: string) {
    const { password, email, accessToken, ...columns } = getTableColumns(
      schema.users,
    );
    return this.db
      .select(columns)
      .from(schema.users)
      .where(eq(schema.users.id, id));
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.db
      .update(schema.users)
      .set(updateUserDto)
      .where(eq(schema.users.id, id));
  }

  remove(id: string) {
    return this.db.delete(schema.users).where(eq(schema.users.id, id));
  }
}
