import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'drizzle/schema';
import { CreateUserDto } from './dto/create-user.dto';
import { eq, getTableColumns } from 'drizzle-orm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject('DrizzleService')
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  createUser(createUserDto: Omit<CreateUserDto, 'confirmPassword'>) {
    return this.db.insert(schema.users).values(createUserDto).returning();
  }

  getUserData(field: 'email' | 'id' | 'username', value: string) {
    const { accessToken, password, ...columns } = getTableColumns(schema.users);
    return this.db.select(columns).from(schema.users).where(eq(schema.users[field], value));
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.db.update(schema.users).set(updateUserDto).where(eq(schema.users.id, id)).returning();
  }

  removeUser(id: string) {
    return this.db.delete(schema.users).where(eq(schema.users.id, id));
  }
}
