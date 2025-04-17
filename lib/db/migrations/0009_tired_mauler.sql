CREATE TABLE IF NOT EXISTS "duration" (
	"level" integer PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "urgency" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "urgency" CASCADE;--> statement-breakpoint
-- ALTER TABLE "todo" DROP CONSTRAINT "todo_urgency_urgency_level_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo" ADD CONSTRAINT "todo_duration_duration_level_fk" FOREIGN KEY ("duration") REFERENCES "public"."duration"("level") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
