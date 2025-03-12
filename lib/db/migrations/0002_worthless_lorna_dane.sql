ALTER TABLE "todo" ADD COLUMN "importance" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "todo" ADD COLUMN "urgency" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "todo" ADD COLUMN "duration" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "todo" ADD COLUMN "score" integer DEFAULT 0 NOT NULL;