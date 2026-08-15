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
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: WAITLIST_EMAIL_MAX_LENGTH })
      .notNull()
      .unique(),
    source: varchar("source", { length: WAITLIST_SOURCE_MAX_LENGTH }),
    confirmedAt: timestamp("confirmed_at"),
    confirmationTokenHash: varchar("confirmation_token_hash", { length: 64 }),
    confirmationSentAt: timestamp("confirmation_sent_at"),
    confirmationExpiresAt: timestamp("confirmation_expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("waitlist_entry_confirmation_token_hash_idx").on(
      table.confirmationTokenHash
    ),
  ]
)
