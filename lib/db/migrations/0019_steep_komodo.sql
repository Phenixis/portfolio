ALTER TABLE "exercice" ADD COLUMN "user_id" char(8) DEFAULT '00000000' NOT NULL;--> statement-breakpoint
ALTER TABLE "meteo" ADD COLUMN "user_id" char(8) DEFAULT '00000000' NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "user_id" char(8) DEFAULT '00000000' NOT NULL;--> statement-breakpoint
ALTER TABLE "seance" ADD COLUMN "user_id" char(8) DEFAULT '00000000' NOT NULL;--> statement-breakpoint
ALTER TABLE "serie" ADD COLUMN "user_id" char(8) DEFAULT '00000000' NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "user_id" char(8) DEFAULT '00000000' NOT NULL;--> statement-breakpoint
ALTER TABLE "workout" ADD COLUMN "user_id" char(8) DEFAULT '00000000' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercice" ADD CONSTRAINT "exercice_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meteo" ADD CONSTRAINT "meteo_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "seance" ADD CONSTRAINT "seance_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serie" ADD CONSTRAINT "serie_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task" ADD CONSTRAINT "task_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workout" ADD CONSTRAINT "workout_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
