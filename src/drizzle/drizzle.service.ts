import { FactoryProvider } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from 'drizzle/schema';
import 'dotenv/config';

export const DrizzleService: FactoryProvider = {
  provide: 'DrizzleService',
  useFactory: async () => await drizzle(process.env.DATABASE_URL!, { schema }),
};
