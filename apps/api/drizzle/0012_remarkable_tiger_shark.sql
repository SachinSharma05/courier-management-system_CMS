ALTER TABLE "complaints" ADD COLUMN "resolution_comment" text;--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "resolved_by" integer;--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "resolved_at" timestamp;