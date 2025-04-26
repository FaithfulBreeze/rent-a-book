CREATE TABLE "book_library_stocl" (
	"library_id" uuid,
	"stock_id" uuid
);
--> statement-breakpoint
ALTER TABLE "books" DROP CONSTRAINT "books_library_id_libraries_id_fk";
--> statement-breakpoint
ALTER TABLE "books" DROP CONSTRAINT "books_stock_id_stocks_id_fk";
--> statement-breakpoint
ALTER TABLE "authors" ALTER COLUMN "rating" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "rating" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "libraries" ALTER COLUMN "rating" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "file_path" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "borrow_history" ADD COLUMN "borrow_end_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "author_profile" uuid;--> statement-breakpoint
ALTER TABLE "book_library_stocl" ADD CONSTRAINT "book_library_stocl_library_id_libraries_id_fk" FOREIGN KEY ("library_id") REFERENCES "public"."libraries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_library_stocl" ADD CONSTRAINT "book_library_stocl_stock_id_stocks_id_fk" FOREIGN KEY ("stock_id") REFERENCES "public"."stocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_library_stocl" ADD CONSTRAINT "book_library_stocl_stock_id_books_id_fk" FOREIGN KEY ("stock_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_author_profile_authors_id_fk" FOREIGN KEY ("author_profile") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" DROP COLUMN "library_id";--> statement-breakpoint
ALTER TABLE "books" DROP COLUMN "stock_id";