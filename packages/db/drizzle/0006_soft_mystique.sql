CREATE TYPE "public"."idea_source" AS ENUM('web', 'mobile', 'user_feedback', 'competitor', 'personal_note', 'other');--> statement-breakpoint
CREATE TYPE "public"."idea_status" AS ENUM('new', 'needs_clarity', 'candidate', 'later', 'rejected', 'converted');--> statement-breakpoint
CREATE TABLE "idea" (
	"converted_feature_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"note" text,
	"project_id" uuid NOT NULL,
	"source" "idea_source" DEFAULT 'web' NOT NULL,
	"status" "idea_status" DEFAULT 'new' NOT NULL,
	"title" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "idea" ADD CONSTRAINT "idea_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idea_project_id_idx" ON "idea" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idea_project_status_idx" ON "idea" USING btree ("project_id","status");