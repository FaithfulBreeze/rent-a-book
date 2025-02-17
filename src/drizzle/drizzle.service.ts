import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export const DrizzleProvider = {
  provide: 'DrizzleProvider',
  useFactory: async () => await drizzle(process.env.DATABASE_URL, { schema }),
  export: 'DrizzleProvicer',
};
