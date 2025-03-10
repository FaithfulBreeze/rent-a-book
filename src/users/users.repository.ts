import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'drizzle/schema';
import { CreateUserDto } from './dto/create-user.dto';
import { eq } from 'drizzle-orm';
import { UpdateUserDto } from './dto/update-user.dto';
import { RepositoryCreate } from 'common/interfaces/repository-create/repository-create.interface';
import { User } from './entities/user.entity';
import { RepositoryFindOne } from 'common/interfaces/repository-find-one/repository-find-one.interface';
import { RepositoryRemove } from 'common/interfaces/repository-remove/repository-remove.interface';
import { RepositoryUpdate } from 'common/interfaces/repository-update/repository-update.interface';

@Injectable()
export class UsersRepository
  implements RepositoryCreate<User>, RepositoryFindOne<User>, RepositoryUpdate<User>, RepositoryRemove
{
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
