import { Router } from "express";
import { db, appointmentsTable } from "@workspace/db";
import { eq, asc, and } from "drizzle-orm";
import {
  ListAppointmentsResponse,
  CreateAppointmentBody,
  DeleteAppointmentParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/appointments", async (req, res) => {
  const rows = await db
    .select()
    .from(appointmentsTable)
    .where(eq(appointmentsTable.userId, req.userId))
    .orderBy(asc(appointmentsTable.date));
  const parsed = ListAppointmentsResponse.parse(
    rows.map((r) => ({
      ...r,
      date: r.date.toISOString(),
    })),
  );
  res.json(parsed);
});

router.post("/appointments", async (req, res) => {
  const body = CreateAppointmentBody.parse(req.body);
  const [row] = await db
    .insert(appointmentsTable)
    .values({ ...body, date: new Date(body.date), userId: req.userId })
    .returning();
  res.status(201).json({
    ...row,
    date: row.date.toISOString(),
  });
});

router.delete("/appointments/:id", async (req, res) => {
  const { id } = DeleteAppointmentParams.parse({ id: Number(req.params.id) });
  await db
    .delete(appointmentsTable)
    .where(and(eq(appointmentsTable.id, id), eq(appointmentsTable.userId, req.userId)));
  res.status(204).send();
});

export default router;
