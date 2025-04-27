import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'drizzle/schema';

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(
    @Inject('DrizzleService')
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const [user] = await this.db.select().from(schema.users).where(eq(schema.users.id, req.user));
    if (!user.authorProfile) return false;
    req.author = user.authorProfile;
    return !!user.authorProfile;
  }
}
