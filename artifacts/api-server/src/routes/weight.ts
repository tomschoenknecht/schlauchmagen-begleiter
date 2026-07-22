import { Router } from "express";
import { db, weightTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  ListWeightEntriesResponse,
  CreateWeightEntryBody,
} from "@workspace/api-zod";

const router = Router();

router.get("/weight", async (req, res) => {
  const rows = await db
    .select()
    .from(weightTable)
    .where(eq(weightTable.userId, req.userId))
    .orderBy(asc(weightTable.recordedAt));
  const parsed = ListWeightEntriesResponse.parse(
    rows.map((r) => ({
      ...r,
      weightKg: Number(r.weightKg),
      recordedAt: r.recordedAt.toISOString(),
    })),
  );
  res.json(parsed);
});

router.post("/weight", async (req, res) => {
  const body = CreateWeightEntryBody.parse(req.body);
  const [row] = await db
    .insert(weightTable)
    .values({ weightKg: String(body.weightKg), userId: req.userId })
    .returning();
  res.status(201).json({
    ...row,
    weightKg: Number(row.weightKg),
    recordedAt: row.recordedAt.toISOString(),
  });
});

export default router;
