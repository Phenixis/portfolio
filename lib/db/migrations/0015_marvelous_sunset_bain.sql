-- ALTER TABLE "todo" RENAME TO "task";--> statement-breakpoint
-- ALTER TABLE "todo_after" RENAME TO "task_to_do_after";--> statement-breakpoint
-- ALTER TABLE "task_to_do_after" RENAME COLUMN "after_id" TO "after_task_id";--> statement-breakpoint
ALTER TABLE "task_to_do_after" RENAME COLUMN "todo_id" TO "task_id";--> statement-breakpoint
-- ALTER TABLE "task" DROP CONSTRAINT "todo_importance_importance_level_fk";
-- --> statement-breakpoint
-- ALTER TABLE "task" DROP CONSTRAINT "todo_duration_duration_level_fk";
-- --> statement-breakpoint
-- ALTER TABLE "task" DROP CONSTRAINT "todo_project_title_project_title_fk";
-- --> statement-breakpoint
-- -- ALTER TABLE "task_to_do_after" DROP CONSTRAINT "todo_after_task_id_task_id_fk";
-- > statement-breakpoint
-- ALTER TABLE "task_to_do_after" DROP CONSTRAINT "todo_after_after_id_task_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task" ADD CONSTRAINT "task_importance_importance_level_fk" FOREIGN KEY ("importance") REFERENCES "public"."importance"("level") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task" ADD CONSTRAINT "task_duration_duration_level_fk" FOREIGN KEY ("duration") REFERENCES "public"."duration"("level") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task" ADD CONSTRAINT "task_project_title_project_title_fk" FOREIGN KEY ("project_title") REFERENCES "public"."project"("title") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_to_do_after" ADD CONSTRAINT "task_to_do_after_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_to_do_after" ADD CONSTRAINT "task_to_do_after_after_task_id_task_id_fk" FOREIGN KEY ("after_task_id") REFERENCES "public"."task"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
