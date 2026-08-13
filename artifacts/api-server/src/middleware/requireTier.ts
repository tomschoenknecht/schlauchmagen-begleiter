import type { Request, Response, NextFunction } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { TIER_RANK, effectiveTier } from "../lib/stripe";

/** Erlaubt die Route nur ab dem angegebenen Mindest-Tier (aktives Abo vorausgesetzt). */
export function requireTier(min: "basis" | "deluxe") {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.userId));
    const tier = effectiveTier(user ?? {});
    if (TIER_RANK[tier] < TIER_RANK[min]) {
      res.status(402).json({
        error: "Upgrade erforderlich",
        requiredTier: min,
        tier,
      });
      return;
    }
    next();
  };
}
