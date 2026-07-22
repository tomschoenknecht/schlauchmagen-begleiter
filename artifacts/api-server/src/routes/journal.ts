import { Router } from "express";
import { db, journalTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import {
  ListJournalEntriesResponse,
  CreateJournalEntryBody,
  DeleteJournalEntryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/journal", async (req, res) => {
  const rows = await db
    .select()
    .from(journalTable)
    .where(eq(journalTable.userId, req.userId))
    .orderBy(desc(journalTable.createdAt));
  const parsed = ListJournalEntriesResponse.parse(
    rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  );
  res.json(parsed);
});

router.post("/journal", async (req, res) => {
  const body = CreateJournalEntryBody.parse(req.body);
  const [row] = await db
    .insert(journalTable)
    .values({ ...body, userId: req.userId })
    .returning();
  res.status(201).json({
    ...row,
    createdAt: row.createdAt.toISOString(),
  });
});

router.delete("/journal/:id", async (req, res) => {
  const { id } = DeleteJournalEntryParams.parse({ id: Number(req.params.id) });
  await db
    .delete(journalTable)
    .where(and(eq(journalTable.id, id), eq(journalTable.userId, req.userId)));
  res.status(204).send();
});

export default router;
