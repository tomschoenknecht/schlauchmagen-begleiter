import { Router } from "express";
import { db, requirementsTable, appointmentsTable, journalTable, weightTable } from "@workspace/db";
import { eq, gte, count, asc, desc, and } from "drizzle-orm";
import { GetOverviewResponse } from "@workspace/api-zod";

const router = Router();

router.get("/stats/overview", async (req, res) => {
  const uid = req.userId;
  const now = new Date();

  const totalReqs = await db
    .select({ c: count() })
    .from(requirementsTable)
    .where(eq(requirementsTable.userId, uid));

  const completedCount = await db
    .select({ c: count() })
    .from(requirementsTable)
    .where(and(eq(requirementsTable.userId, uid), eq(requirementsTable.completed, true)));

  const upcomingAppts = await db
    .select({ c: count() })
    .from(appointmentsTable)
    .where(and(eq(appointmentsTable.userId, uid), gte(appointmentsTable.date, now)));

  const journalCount = await db
    .select({ c: count() })
    .from(journalTable)
    .where(eq(journalTable.userId, uid));

  const latestWeightRows = await db
    .select()
    .from(weightTable)
    .where(eq(weightTable.userId, uid))
    .orderBy(desc(weightTable.recordedAt))
    .limit(1);

  const firstWeightRows = await db
    .select()
    .from(weightTable)
    .where(eq(weightTable.userId, uid))
    .orderBy(asc(weightTable.recordedAt))
    .limit(1);

  const parsed = GetOverviewResponse.parse({
    totalRequirements: totalReqs[0]?.c ?? 0,
    completedRequirements: completedCount[0]?.c ?? 0,
    upcomingAppointments: upcomingAppts[0]?.c ?? 0,
    journalCount: journalCount[0]?.c ?? 0,
    latestWeight: latestWeightRows[0] ? Number(latestWeightRows[0].weightKg) : null,
    startWeight: firstWeightRows[0] ? Number(firstWeightRows[0].weightKg) : null,
  });

  res.json(parsed);
});

export default router;
