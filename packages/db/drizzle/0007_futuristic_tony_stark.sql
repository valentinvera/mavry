CREATE TYPE "public"."feature_classification" AS ENUM('core', 'support', 'later', 'no_for_now', 'unclassified');--> statement-breakpoint
CREATE TYPE "public"."feature_status" AS ENUM('needs_clarity', 'candidate', 'planned', 'in_progress', 'cooked', 'ready', 'shipped', 'cut');--> statement-breakpoint
CREATE TABLE "cut" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"feature_id" uuid NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"reason" text NOT NULL,
	"reconsider_when" text
);
--> statement-breakpoint
CREATE TABLE "feature" (
	"classification" "feature_classification" DEFAULT 'unclassified' NOT NULL,
	"confidence" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_from_idea_id" uuid,
	"dependencies_note" text,
	"description" text,
	"effort" integer,
	"hypothesis_fit" integer,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"impact" integer,
	"priority_reason" text,
	"priority_score" integer,
	"problem" text,
	"project_id" uuid NOT NULL,
	"risk" integer,
	"stage_fit" integer,
	"status" "feature_status" DEFAULT 'needs_clarity' NOT NULL,
	"title" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_segment" text,
	CONSTRAINT "feature_confidence_check" CHECK ("feature"."confidence" is null or "feature"."confidence" between 1 and 5),
	CONSTRAINT "feature_effort_check" CHECK ("feature"."effort" is null or "feature"."effort" between 1 and 5),
	CONSTRAINT "feature_hypothesis_fit_check" CHECK ("feature"."hypothesis_fit" is null or "feature"."hypothesis_fit" between 1 and 5),
	CONSTRAINT "feature_impact_check" CHECK ("feature"."impact" is null or "feature"."impact" between 1 and 5),
	CONSTRAINT "feature_risk_check" CHECK ("feature"."risk" is null or "feature"."risk" between 1 and 5),
	CONSTRAINT "feature_stage_fit_check" CHECK ("feature"."stage_fit" is null or "feature"."stage_fit" between 1 and 5)
);
--> statement-breakpoint
ALTER TABLE "cut" ADD CONSTRAINT "cut_feature_id_feature_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."feature"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cut" ADD CONSTRAINT "cut_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feature" ADD CONSTRAINT "feature_created_from_idea_id_idea_id_fk" FOREIGN KEY ("created_from_idea_id") REFERENCES "public"."idea"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feature" ADD CONSTRAINT "feature_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cut_feature_id_idx" ON "cut" USING btree ("feature_id");--> statement-breakpoint
CREATE INDEX "cut_project_id_idx" ON "cut" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "feature_project_id_idx" ON "feature" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "feature_project_classification_idx" ON "feature" USING btree ("project_id","classification");