CREATE TYPE "public"."rating" AS ENUM('1', '2', '3', '4', '5');--> statement-breakpoint
CREATE TABLE "authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(30) NOT NULL,
	"rating" "rating" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(30) NOT NULL,
	"description" varchar NOT NULL,
	"price_per_day" real NOT NULL,
	"author_id" uuid NOT NULL,
	"rating" "rating" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "libraries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"library_name" varchar(30) NOT NULL,
	"stock_id" uuid NOT NULL,
	CONSTRAINT "libraries_library_name_unique" UNIQUE("library_name")
);
--> statement-breakpoint
CREATE TABLE "stock" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_id" uuid NOT NULL,
	"quantity" integer DEFAULT 0,
	"available" integer DEFAULT 0,
	"borrowed" integer DEFAULT 0,
	CONSTRAINT "stock_book_id_unique" UNIQUE("book_id")
);
--> statement-breakpoint
CREATE TABLE "stock_history" (
	"book_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"borrow_end_date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(30) NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"library_id" uuid,
	"has_library" boolean DEFAULT false NOT NULL,
	"access_token" varchar,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "libraries" ADD CONSTRAINT "libraries_stock_id_stock_id_fk" FOREIGN KEY ("stock_id") REFERENCES "public"."stock"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "stock_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_history" ADD CONSTRAINT "stock_history_book_id_stock_book_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."stock"("book_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_history" ADD CONSTRAINT "stock_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_library_id_libraries_id_fk" FOREIGN KEY ("library_id") REFERENCES "public"."libraries"("id") ON DELETE no action ON UPDATE no action;