CREATE TYPE "public"."project_stage" AS ENUM('idea', 'discovery', 'mvp_scope', 'building', 'beta', 'launched', 'growing');--> statement-breakpoint
CREATE TABLE "project" (
	"already_built" text,
	"already_started" boolean DEFAULT false NOT NULL,
	"archived_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"description" text NOT NULL,
	"goal_30_days" text NOT NULL,
	"hypothesis" text NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"launch_blocker" text,
	"main_problem" text NOT NULL,
	"name" text NOT NULL,
	"owner_id" text NOT NULL,
	"scope_creep_concern" text,
	"stage" "project_stage" DEFAULT 'idea' NOT NULL,
	"target_user" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "project_owner_id_idx" ON "project" USING btree ("owner_id");