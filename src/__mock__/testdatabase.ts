import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import * as schema from 'src/drizzle/schema';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
let container = new PostgreSqlContainer()
  .withDatabase('rent_a_book')
  .withUsername('rent_a_book')
  .withPassword('rent_a_book');
let db: any;
let startedContainer: StartedPostgreSqlContainer;
let pool: Pool;

export const startContainer = async () => {
  try {
    startedContainer = await container.start();
  } catch (error) {
    console.log(error);
  }
  pool = new Pool({
    host: startedContainer.getHost(),
    user: startedContainer.getUsername(),
    password: startedContainer.getPassword(),
    database: startedContainer.getDatabase(),
    port: startedContainer.getPort(),
  });
  db = drizzle(pool);
  await migrate(db, { migrationsFolder: 'drizzle' });
};
export const getMockDrizzleProvider = () => ({
  provide: 'DrizzleProvider',
  useFactory: async () => await db,
});
export const stopContainer = async () => {
  await pool.end();
  await startedContainer.stop();
};
export const getDatabaseInstance = (): NodePgDatabase<typeof schema> => db;
export const getSchema = () => schema;
