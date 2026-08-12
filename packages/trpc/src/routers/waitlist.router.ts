import { db } from "@mavry/db"
import { waitlistEntry } from "@mavry/db/schema/waitlist"
import { TRPCError } from "@trpc/server"
import { Input, Mutation, Router } from "nestjs-trpc"
import { z } from "zod"

const MAX_EMAIL_LENGTH = 320
const MAX_SOURCE_LENGTH = 100

export const joinWaitlistInputSchema = z.object({
  email: z.string().trim().toLowerCase().max(MAX_EMAIL_LENGTH).email(),
  source: z.string().trim().min(1).max(MAX_SOURCE_LENGTH).optional(),
})

export const joinWaitlistOutputSchema = z.object({
  success: z.literal(true),
  status: z.enum(["joined", "already_joined"]),
})

type JoinWaitlistInput = z.infer<typeof joinWaitlistInputSchema>
type JoinWaitlistOutput = z.infer<typeof joinWaitlistOutputSchema>

@Router({ alias: "waitlist" })
export class WaitlistRouter {
  @Mutation({
    input: joinWaitlistInputSchema,
    output: joinWaitlistOutputSchema,
  })
  async join(@Input() input: JoinWaitlistInput): Promise<JoinWaitlistOutput> {
    try {
      const insertedEntries = await db
        .insert(waitlistEntry)
        .values(input)
        .onConflictDoNothing({ target: waitlistEntry.email })
        .returning({ id: waitlistEntry.id })

      return {
        success: true,
        status: insertedEntries.length === 0 ? "already_joined" : "joined",
      }
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to join the waitlist",
      })
    }
  }
}
