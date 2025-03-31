CREATE TABLE IF NOT EXISTS "exercice" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "seance" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "seance_exercice" (
	"id" serial PRIMARY KEY NOT NULL,
	"seance_id" integer NOT NULL,
	"exercice_id" integer NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "serie" (
	"id" serial PRIMARY KEY NOT NULL,
	"workout_id" integer NOT NULL,
	"exercice_id" integer NOT NULL,
	"poids" integer,
	"reps" integer,
	"exercice_position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workout" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"note" text,
	"seance_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workout_exercice" (
	"id" serial PRIMARY KEY NOT NULL,
	"workout_id" integer NOT NULL,
	"exercice_id" integer NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "seance_exercice" ADD CONSTRAINT "seance_exercice_seance_id_seance_id_fk" FOREIGN KEY ("seance_id") REFERENCES "public"."seance"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "seance_exercice" ADD CONSTRAINT "seance_exercice_exercice_id_exercice_id_fk" FOREIGN KEY ("exercice_id") REFERENCES "public"."exercice"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serie" ADD CONSTRAINT "serie_workout_id_workout_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workout"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serie" ADD CONSTRAINT "serie_exercice_id_exercice_id_fk" FOREIGN KEY ("exercice_id") REFERENCES "public"."exercice"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workout" ADD CONSTRAINT "workout_seance_id_seance_id_fk" FOREIGN KEY ("seance_id") REFERENCES "public"."seance"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workout_exercice" ADD CONSTRAINT "workout_exercice_workout_id_workout_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workout"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workout_exercice" ADD CONSTRAINT "workout_exercice_exercice_id_exercice_id_fk" FOREIGN KEY ("exercice_id") REFERENCES "public"."exercice"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
