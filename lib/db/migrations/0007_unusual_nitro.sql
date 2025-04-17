CREATE TABLE IF NOT EXISTS "importance" (
	"level" integer PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo" ADD CONSTRAINT "todo_importance_importance_level_fk" FOREIGN KEY ("importance") REFERENCES "public"."importance"("level") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
