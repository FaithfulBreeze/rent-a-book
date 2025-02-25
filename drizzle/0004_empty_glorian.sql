ALTER TABLE "books" DROP CONSTRAINT "books_library_id_libraries_id_fk";
--> statement-breakpoint
ALTER TABLE "books" DROP CONSTRAINT "books_stock_id_stocks_id_fk";
--> statement-breakpoint
ALTER TABLE "borrow_history" DROP CONSTRAINT "borrow_history_stock_id_stocks_id_fk";
--> statement-breakpoint
ALTER TABLE "borrow_history" DROP CONSTRAINT "borrow_history_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_library_id_libraries_id_fk" FOREIGN KEY ("library_id") REFERENCES "public"."libraries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_stock_id_stocks_id_fk" FOREIGN KEY ("stock_id") REFERENCES "public"."stocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow_history" ADD CONSTRAINT "borrow_history_stock_id_stocks_id_fk" FOREIGN KEY ("stock_id") REFERENCES "public"."stocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow_history" ADD CONSTRAINT "borrow_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;