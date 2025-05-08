ALTER TABLE "user" ADD COLUMN "dark_mode_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "dark_mode_start_hour" integer DEFAULT 19 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "dark_mode_end_hour" integer DEFAULT 6 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "dark_mode_start_minute" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "dark_mode_end_minute" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "dark_mode_override" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "override_expires_at" timestamp;