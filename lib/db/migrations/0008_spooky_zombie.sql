CREATE TABLE IF NOT EXISTS "urgency" (
	"level" integer PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
-- DO $$ BEGIN
--  ALTER TABLE "todo" ADD CONSTRAINT "todo_urgency_urgency_level_fk" FOREIGN KEY ("urgency") REFERENCES "public"."urgency"("level") ON DELETE no action ON UPDATE no action;
-- EXCEPTION
--  WHEN duplicate_object THEN null;
-- END $$;
