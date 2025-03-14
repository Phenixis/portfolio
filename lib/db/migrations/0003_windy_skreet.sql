CREATE TABLE IF NOT EXISTS "meteo" (
	"day" varchar(10) PRIMARY KEY NOT NULL,
	"temperature" integer NOT NULL,
	"summary" varchar(255) NOT NULL,
	"icon" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
DROP TABLE "session" CASCADE;