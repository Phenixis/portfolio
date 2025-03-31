ALTER TABLE "exercice" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "exercice" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "exercice" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "seance" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "seance" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "seance" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "seance_exercice" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "seance_exercice" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "seance_exercice" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "serie" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "serie" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "serie" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "workout" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "workout" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "workout" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "workout_exercice" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "workout_exercice" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "workout_exercice" ADD COLUMN "deleted_at" timestamp;