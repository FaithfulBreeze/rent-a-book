import { date, integer, pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const rating = pgEnum('rating', ['1', '2', '3', '4', '5']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 15 }).unique().notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  email: varchar('email', { length: 30 }).unique().notNull(),
  password: varchar('password').notNull(),
  accessToken: varchar('access_token'),
  libraryId: uuid('library_id').references(() => libraries.id, { onDelete: 'set null' }),
  authorProfile: uuid('author_profile').references(() => authors.id, { onDelete: 'set null' }),
});

export const libraries = pgTable('libraries', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 30 }).notNull().unique(),
  rating: rating().default('1').notNull(),
});

export const books = pgTable('books', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 30 }),
  description: varchar('description', { length: 120 }),
  rating: rating().default('1').notNull(),
  authorId: uuid('author_id').references(() => authors.id),
  filePath: varchar('file_path').notNull(),
});

export const authors = pgTable('authors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }),
  rating: rating().default('1').notNull(),
});

export const stocks = pgTable('stocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  quantity: integer('quantity').default(0),
  borrowed: integer('borrowed').default(0),
});

export const bookLibraryStock = pgTable('book_library_stocl', {
  libraryId: uuid('library_id').references(() => libraries.id, { onDelete: 'cascade' }),
  stockId: uuid('stock_id').references(() => stocks.id, { onDelete: 'cascade' }),
  bookId: uuid('stock_id').references(() => books.id, { onDelete: 'cascade' }),
});

export const borrowHistory = pgTable('borrow_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  stockId: uuid('stock_id').references(() => stocks.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  borrowEndDate: date('borrow_end_date').notNull(),
});
