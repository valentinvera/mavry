// Temporary helper for local auth testing. Not part of the app.
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL ?? "")

const [command, arg] = process.argv.slice(2)

if (command === "latest-otp") {
  const cutoff = arg ?? new Date(0).toISOString()
  const rows = await sql`
    select value, created_at, expires_at
    from verification
    where expires_at > now() and created_at >= ${cutoff}::timestamptz
    order by created_at desc
    limit 1
  `
  console.log(JSON.stringify(rows[0] ?? null))
} else if (command === "2fa-secret") {
  const rows = await sql`
    select tf.secret
    from two_factor tf
    join "user" u on u.id = tf.user_id
    where u.email = ${arg ?? ""}
    limit 1
  `
  console.log(JSON.stringify(rows[0] ?? null))
} else if (command === "verify") {
  const rows = await sql`
    update "user" set email_verified = true
    where email = ${arg ?? ""}
    returning id
  `
  console.log(JSON.stringify({ verified: rows.length }))
} else if (command === "user") {
  const rows = await sql`
    select id, email, email_verified as "emailVerified",
           two_factor_enabled as "twoFactorEnabled", name
    from "user"
    where email = ${arg ?? ""}
  `
  console.log(JSON.stringify(rows[0] ?? null))
} else if (command === "cleanup") {
  const rows =
    await sql`delete from "user" where email = ${arg ?? ""} returning id`
  console.log(JSON.stringify({ deleted: rows.length }))
} else {
  console.error("unknown command")
  process.exit(1)
}
