import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'drizzle/schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @Inject('DrizzleService')
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  getUser(loginDto: LoginDto) {
    return this.db.select().from(schema.users).where(eq(schema.users.email, loginDto.email));
  }
}
