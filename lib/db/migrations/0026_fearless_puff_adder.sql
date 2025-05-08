ALTER TABLE "user" ADD COLUMN "dark_mode_override" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "override_expires_at";