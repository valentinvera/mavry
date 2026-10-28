import { db } from "@mavry/db"
import type { INestApplication } from "@nestjs/common"
import { sql } from "drizzle-orm"
import type { Express, Request, Response } from "express"

const HEALTH_ROUTE = "/api/health"

export const registerHealthRoute = (app: INestApplication): void => {
  const express: Express = app.getHttpAdapter().getInstance()

  express.get(HEALTH_ROUTE, async (_request: Request, response: Response) => {
    try {
      await db.execute(sql`select 1`)
      response.status(200).json({
        database: "ok",
        status: "ok",
        timestamp: new Date().toISOString(),
      })
    } catch {
      response.status(503).json({
        database: "unavailable",
        status: "degraded",
        timestamp: new Date().toISOString(),
      })
    }
  })
}
