import { boolean, pgEnum, pgTable, real, uuid, varchar } from 'drizzle-orm/pg-core';

export const rating = pgEnum('rating', ['1', '2', '3', '4', '5']);

export const libraries = pgTable("libraries", {
  id: uuid().primaryKey().defaultRandom(),
  libraryName: varchar("library_name", { length: 30 }).notNull().unique(),
  stockId: uuid("stock_id").references(() => stock.id).notNull()
})

export const stock = pgTable("stock", {
  id: uuid().primaryKey().defaultRandom(),
  books: uuid().references(() => books.id)
})

export const books = pgTable('books', {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar('title', { length: 30 }).notNull(),
  description: varchar().notNull(),
  pricePerDay: real('price_per_day').notNull(),
  authorId: uuid('authorId').references(() => authors.id).notNull(),
  rating: rating().notNull(),
});

export const authors = pgTable('authors', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar('name', { length: 30 }).notNull(),
  rating: rating().notNull(),
});


export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar('name', { length: 30 }).notNull(),
  email: varchar().notNull().unique(),
  password: varchar().notNull(),
  libraryId: uuid('libraryId').references(() => libraries.id),
  hasLibrary: boolean('has_library').notNull().default(false),
  accessToken: varchar('access_token'),
})