ALTER TABLE "todo" RENAME COLUMN "project_id" TO "project_title";--> statement-breakpoint
ALTER TABLE "todo" DROP CONSTRAINT IF EXISTS "todo_project_id_project_id_fk";
--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN IF EXISTS "id";
--> statement-breakpoint
ALTER TABLE "project" ADD PRIMARY KEY ("title");--> statement-breakpoint
ALTER TABLE "todo" ALTER COLUMN "project_title" TYPE VARCHAR(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo" ADD CONSTRAINT "todo_project_title_project_title_fk" FOREIGN KEY ("project_title") REFERENCES "public"."project"("title") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint