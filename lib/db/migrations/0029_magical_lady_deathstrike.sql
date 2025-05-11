ALTER TABLE "user" ADD COLUMN "note_draft_title" varchar(255) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "note_draft_content" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "note_draft_project_title" varchar(255) DEFAULT '' NOT NULL;