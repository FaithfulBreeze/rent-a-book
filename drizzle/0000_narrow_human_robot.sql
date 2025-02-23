CREATE TYPE "public"."rating" AS ENUM('1', '2', '3', '4', '5');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid DEFAULT gen_random_uuid(),
	"username" varchar(15) NOT NULL,
	"name" varchar(50) NOT NULL,
	"email" varchar(30) NOT NULL,
	"password" varchar NOT NULL,
	"access_token" varchar,
	"library_id" uuid,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
