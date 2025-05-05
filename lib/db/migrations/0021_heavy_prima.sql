ALTER TABLE "note" ADD COLUMN "salt" char(24);--> statement-breakpoint
ALTER TABLE "note" ADD COLUMN "iv" char(16);--> statement-breakpoint
ALTER TABLE "note" DROP COLUMN IF EXISTS "password";