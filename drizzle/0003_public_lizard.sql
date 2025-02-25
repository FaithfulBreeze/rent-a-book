ALTER TABLE "users" DROP CONSTRAINT "users_library_id_libraries_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_library_id_libraries_id_fk" FOREIGN KEY ("library_id") REFERENCES "public"."libraries"("id") ON DELETE set null ON UPDATE no action;