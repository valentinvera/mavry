import { env } from "@mavry/env/api"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import {
  account,
  accountRelations,
  passkey,
  passkeyRelations,
  session,
  sessionRelations,
  twoFactor,
  twoFactorRelations,
  user,
  userRelations,
  verification,
} from "./schema/auth"
import { project, projectRelations } from "./schema/projects"
import { waitlistEntry } from "./schema/waitlist"

const schema = {
  account,
  accountRelations,
  passkey,
  passkeyRelations,
  project,
  projectRelations,
  session,
  sessionRelations,
  twoFactor,
  twoFactorRelations,
  user,
  userRelations,
  verification,
  waitlistEntry,
}

export function createDb() {
  const sql = neon(env.DATABASE_URL)
  return drizzle(sql, { schema })
}

export const db = createDb()

export type Database = ReturnType<typeof createDb>
