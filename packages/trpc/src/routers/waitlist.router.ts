import { Inject } from "@nestjs/common"
import { TRPCError } from "@trpc/server"
import { Ctx, Input, Mutation, Query, Router } from "nestjs-trpc"
import type { Context } from "../context"
import {
  type JoinWaitlistInput,
  type JoinWaitlistOutput,
  joinWaitlistInputSchema,
  joinWaitlistOutputSchema,
  type WaitlistConfirmedCountOutput,
  waitlistConfirmedCountOutputSchema,
} from "../contracts/waitlist"
import { WaitlistService } from "../services/waitlist.service"
import {
  WaitlistRateLimitExceededError,
  WaitlistRateLimitService,
} from "../services/waitlist-rate-limit.service"

type WaitlistErrorCode = "INTERNAL_SERVER_ERROR" | "TOO_MANY_REQUESTS"

const createWaitlistError = (
  code: WaitlistErrorCode,
  message: string,
  cause: unknown
): TRPCError => new TRPCError({ cause, code, message })

@Router({ alias: "waitlist" })
export class WaitlistRouter {
  private readonly waitlistService: WaitlistService
  private readonly rateLimitService: WaitlistRateLimitService

  constructor(
    @Inject(WaitlistService) waitlistService: WaitlistService,
    @Inject(WaitlistRateLimitService)
    rateLimitService: WaitlistRateLimitService
  ) {
    this.waitlistService = waitlistService
    this.rateLimitService = rateLimitService
  }

  @Query({ output: waitlistConfirmedCountOutputSchema })
  async confirmedCount(): Promise<WaitlistConfirmedCountOutput> {
    try {
      return await this.waitlistService.getConfirmedCount()
    } catch (error) {
      throw createWaitlistError(
        "INTERNAL_SERVER_ERROR",
        "Unable to load the waitlist count",
        error
      )
    }
  }

  @Mutation({
    input: joinWaitlistInputSchema,
    output: joinWaitlistOutputSchema,
  })
  async join(
    @Input() input: JoinWaitlistInput,
    @Ctx() context: Context
  ): Promise<JoinWaitlistOutput> {
    try {
      this.rateLimitService.assertJoinAllowed({
        clientAddress: context.clientAddress,
        email: input.email,
      })

      return await this.waitlistService.join(input)
    } catch (error) {
      if (error instanceof WaitlistRateLimitExceededError) {
        throw createWaitlistError(
          "TOO_MANY_REQUESTS",
          "Unable to join the waitlist. Try again later.",
          error
        )
      }

      throw createWaitlistError(
        "INTERNAL_SERVER_ERROR",
        "Unable to join the waitlist",
        error
      )
    }
  }
}
