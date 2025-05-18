import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'drizzle/schema';
import { CreateUserDto } from './dto/create-user.dto';
import { eq } from 'drizzle-orm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject('DrizzleService')
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createUserDto: Omit<CreateUserDto, 'confirmPassword'>) {
    return (await this.db.insert(schema.users).values(createUserDto).returning())[0];
  }

  async findOne(field: 'email' | 'id' | 'username', value: string) {
    return (await this.db.select().from(schema.users).where(eq(schema.users[field], value)))[0];
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return (await this.db.update(schema.users).set(updateUserDto).where(eq(schema.users.id, id)).returning())[0];
  }

  async remove(id: string) {
    await this.db.delete(schema.users).where(eq(schema.users.id, id));
  }
}
