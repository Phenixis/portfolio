CREATE TABLE IF NOT EXISTS "todo_after" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" integer NOT NULL,
	"after_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo_after" ADD CONSTRAINT "todo_after_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."todo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo_after" ADD CONSTRAINT "todo_after_after_id_task_id_fk" FOREIGN KEY ("after_id") REFERENCES "public"."todo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
