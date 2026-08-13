import { db } from "@mavry/db"
import { waitlistEntry } from "@mavry/db/schema/waitlist"
import { TRPCError } from "@trpc/server"
import { Input, Mutation, Router } from "nestjs-trpc"
import {
  type JoinWaitlistInput,
  type JoinWaitlistOutput,
  joinWaitlistInputSchema,
  joinWaitlistOutputSchema,
} from "../contracts/waitlist"

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
