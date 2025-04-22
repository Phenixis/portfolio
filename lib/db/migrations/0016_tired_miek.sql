CREATE TABLE IF NOT EXISTS "series_group" (
	"id" serial PRIMARY KEY NOT NULL,
	"workout_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "serie" DROP CONSTRAINT "serie_workout_id_workout_id_fk";
--> statement-breakpoint
ALTER TABLE "serie" RENAME COLUMN "workout_id" TO "series_group_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "series_group" ADD CONSTRAINT "series_group_workout_id_workout_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workout"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serie" ADD CONSTRAINT "serie_series_group_id_series_group_id_fk" FOREIGN KEY ("series_group_id") REFERENCES "public"."series_group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
