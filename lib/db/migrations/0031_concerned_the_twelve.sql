CREATE TABLE IF NOT EXISTS "movie" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" char(8) DEFAULT '00000000' NOT NULL,
	"tmdb_id" integer NOT NULL,
	"media_type" varchar(10) NOT NULL,
	"title" varchar(500) NOT NULL,
	"overview" text,
	"poster_path" varchar(500),
	"backdrop_path" varchar(500),
	"release_date" varchar(20),
	"vote_average" real,
	"vote_count" integer,
	"popularity" real,
	"original_language" varchar(10),
	"genres" text,
	"runtime" integer,
	"status" varchar(50),
	"user_rating" real,
	"user_comment" text,
	"watch_status" varchar(20) DEFAULT 'will_watch' NOT NULL,
	"watched_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "daily_mood" ALTER COLUMN "mood" SET DEFAULT -1;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movie" ADD CONSTRAINT "movie_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
