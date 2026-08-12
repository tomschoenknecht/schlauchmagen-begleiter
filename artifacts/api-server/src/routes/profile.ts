import { Router } from "express";
import { db, userProfileTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

async function getOrCreateProfile(userId: string) {
  const rows = await db
    .select()
    .from(userProfileTable)
    .where(eq(userProfileTable.userId, userId))
    .limit(1);
  if (rows.length > 0) return rows[0];
  const [created] = await db
    .insert(userProfileTable)
    .values({ userId })
    .returning();
  return created;
}

router.get("/profile", async (req, res) => {
  const profile = await getOrCreateProfile(req.userId);
  res.json({
    surgeryDate: profile.surgeryDate ?? null,
    phase: profile.phase ?? null,
    onboardingCompleted: profile.onboardingCompleted,
  });
});

router.put("/profile", async (req, res) => {
  const { surgeryDate, phase, onboardingCompleted } = req.body as {
    surgeryDate?: string | null;
    phase?: string | null;
    onboardingCompleted?: boolean;
  };
  const profile = await getOrCreateProfile(req.userId);
  const [updated] = await db
    .update(userProfileTable)
    .set({
      ...(surgeryDate !== undefined && { surgeryDate: surgeryDate ?? null }),
      ...(phase !== undefined && { phase: phase ?? null }),
      ...(onboardingCompleted !== undefined && { onboardingCompleted }),
      updatedAt: new Date(),
    })
    .where(eq(userProfileTable.id, profile.id))
    .returning();
  res.json({
    surgeryDate: updated.surgeryDate ?? null,
    phase: updated.phase ?? null,
    onboardingCompleted: updated.onboardingCompleted,
  });
});

export default router;
