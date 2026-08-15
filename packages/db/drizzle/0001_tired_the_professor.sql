ALTER TABLE "waitlist_entry" ADD COLUMN "confirmed_at" timestamp;--> statement-breakpoint
ALTER TABLE "waitlist_entry" ADD COLUMN "confirmation_token_hash" varchar(64);--> statement-breakpoint
ALTER TABLE "waitlist_entry" ADD COLUMN "confirmation_sent_at" timestamp;--> statement-breakpoint
ALTER TABLE "waitlist_entry" ADD COLUMN "confirmation_expires_at" timestamp;--> statement-breakpoint
CREATE UNIQUE INDEX "waitlist_entry_confirmation_token_hash_idx" ON "waitlist_entry" USING btree ("confirmation_token_hash");