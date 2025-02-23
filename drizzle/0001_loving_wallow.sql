CREATE TABLE "authors" (
	"id" uuid DEFAULT gen_random_uuid(),
	"name" varchar(50),
	"rating" "rating" DEFAULT '1'
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" uuid DEFAULT gen_random_uuid(),
	"name" varchar(30),
	"description" varchar(120),
	"rating" "rating" DEFAULT '1',
	"author_id" uuid,
	"library_id" uuid,
	"stock_id" uuid
);
--> statement-breakpoint
CREATE TABLE "borrow_history" (
	"id" uuid DEFAULT gen_random_uuid(),
	"stock_id" uuid,
	"user_id" uuid
);
--> statement-breakpoint
CREATE TABLE "libraries" (
	"id" uuid DEFAULT gen_random_uuid(),
	"name" varchar(30) NOT NULL,
	"rating" "rating" DEFAULT '1',
	CONSTRAINT "libraries_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "stocks" (
	"id" uuid DEFAULT gen_random_uuid(),
	"quantity" integer DEFAULT 0,
	"borrowed" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_library_id_libraries_id_fk" FOREIGN KEY ("library_id") REFERENCES "public"."libraries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_stock_id_stocks_id_fk" FOREIGN KEY ("stock_id") REFERENCES "public"."stocks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow_history" ADD CONSTRAINT "borrow_history_stock_id_stocks_id_fk" FOREIGN KEY ("stock_id") REFERENCES "public"."stocks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow_history" ADD CONSTRAINT "borrow_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_library_id_libraries_id_fk" FOREIGN KEY ("library_id") REFERENCES "public"."libraries"("id") ON DELETE no action ON UPDATE no action;