ALTER TABLE "authors" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "authors" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "borrow_history" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "borrow_history" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "libraries" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "libraries" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "stocks" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "stocks" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET NOT NULL;