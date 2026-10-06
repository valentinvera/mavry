import {
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import {
  WAITLIST_EMAIL_MAX_LENGTH,
  WAITLIST_SOURCE_MAX_LENGTH,
} from "./waitlist.constants"

export const waitlistEntry = pgTable(
  "waitlist_entry",
  {
    confirmationEmailId: varchar("confirmation_email_id", { length: 64 }),
    confirmationExpiresAt: timestamp("confirmation_expires_at"),
    confirmationSentAt: timestamp("confirmation_sent_at"),
    confirmationTokenHash: varchar("confirmation_token_hash", { length: 64 }),
    confirmedAt: timestamp("confirmed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    email: varchar("email", { length: WAITLIST_EMAIL_MAX_LENGTH })
      .notNull()
      .unique(),
    id: uuid("id").defaultRandom().primaryKey(),
    source: varchar("source", { length: WAITLIST_SOURCE_MAX_LENGTH }),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("waitlist_entry_confirmation_email_id_idx").on(
      table.confirmationEmailId
    ),
    uniqueIndex("waitlist_entry_confirmation_token_hash_idx").on(
      table.confirmationTokenHash
    ),
  ]
)
