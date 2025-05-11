CREATE TABLE IF NOT EXISTS "daily_mood" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" char(8) DEFAULT '00000000' NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"mood" integer DEFAULT 0 NOT NULL,
	"comment" varchar(5000) DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_mood" ADD CONSTRAINT "daily_mood_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
