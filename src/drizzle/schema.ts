import { pgEnum, pgTable, real, uuid, varchar } from 'drizzle-orm/pg-core';

export const rating = pgEnum('rating', ['1', '2', '3', '4', '5']);

export const books = pgTable('books', {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar('title', { length: 30 }).notNull(),
  description: varchar().notNull(),
  pricePerDay: real('price_per_day').notNull(),
  authorId: uuid().references(() => authors.id),
  rating: rating().notNull(),
});

export const authors = pgTable('authors', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar('name', { length: 30 }),
  rating: rating().notNull(),
});
