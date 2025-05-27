CREATE TABLE IF NOT EXISTS "not_interested_movie" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" char(8) NOT NULL,
	"tmdb_id" integer NOT NULL,
	"media_type" varchar(10) NOT NULL,
	"title" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "not_interested_movie" ADD CONSTRAINT "not_interested_movie_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
