ALTER TABLE "books" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "author_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "content" varchar NOT NULL;