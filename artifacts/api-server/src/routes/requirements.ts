import { Router } from "express";
import { db, requirementsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListRequirementsResponse,
  ToggleRequirementParams,
  ToggleRequirementBody,
  ToggleRequirementResponse,
} from "@workspace/api-zod";

const router = Router();

const DEFAULT_REQUIREMENTS = [
  {
    title: "Hausarzt konsultieren",
    description: "Erstes Gespräch über die bariatrische OP und Überweisung an ein Adipositaszentrum beantragen.",
    category: "Vorbereitung",
    order: 1,
  },
  {
    title: "Klinikgespräch vereinbaren",
    description: "Beratungstermin in einem DGAV-zertifizierten Adipositaszentrum vereinbaren und wahrnehmen.",
    category: "Vorbereitung",
    order: 2,
  },
  {
    title: "Ernährungsberatung beginnen",
    description: "Mindestens 6 Monate Ernährungsberatung mit Dokumentation — Voraussetzung für die Krankenkassengenehmigung.",
    category: "Nachweise",
    order: 3,
  },
  {
    title: "BMI über mehrere Monate dokumentieren",
    description: "Regelmäßige Gewichtsmessungen beim Arzt über mindestens 6 Monate dokumentieren lassen.",
    category: "Nachweise",
    order: 4,
  },
  {
    title: "Multimodales Konzept absolvieren",
    description: "Kombiniertes Programm aus Ernährungs-, Bewegungs- und Verhaltenstherapie über 12 Monate.",
    category: "Nachweise",
    order: 5,
  },
  {
    title: "Psychologisches Gutachten",
    description: "Überweisung zum Psychologen beantragen. Das Gutachten schließt psychiatrische Kontraindikationen aus.",
    category: "Gutachten",
    order: 6,
  },
  {
    title: "Internistisches Gutachten",
    description: "Internistische Untersuchung mit Stellungnahme zur Operationsfähigkeit.",
    category: "Gutachten",
    order: 7,
  },
  {
    title: "Magenspiegelung (Gastroskopie)",
    description: "Ausschluss von Magenerkrankungen — Pflichtuntersuchung vor der OP.",
    category: "Untersuchungen",
    order: 8,
  },
  {
    title: "Schlaflabor-Untersuchung",
    description: "Ausschluss oder Diagnose eines Schlafapnoe-Syndroms — oft Voraussetzung für die Narkosefähigkeit.",
    category: "Untersuchungen",
    order: 9,
  },
  {
    title: "Antrag bei der Krankenkasse stellen",
    description: "Alle Unterlagen sammeln und Antrag auf Kostenübernahme einreichen. Frist: 5 Wochen für Genehmigung.",
    category: "Antrag",
    order: 10,
  },
  {
    title: "Genehmigung erhalten",
    description: "Schriftliche Bestätigung der Krankenkasse über die Kostenübernahme.",
    category: "Antrag",
    order: 11,
  },
  {
    title: "OP-Termin bestätigt",
    description: "OP-Datum festgelegt und schriftlich bestätigt.",
    category: "OP",
    order: 12,
  },
];

async function seedRequirementsForUser(userId: string) {
  await db.insert(requirementsTable).values(
    DEFAULT_REQUIREMENTS.map((r) => ({ ...r, userId, completed: false })),
  );
}

router.get("/requirements", async (req, res) => {
  const uid = req.userId;
  let rows = await db
    .select()
    .from(requirementsTable)
    .where(eq(requirementsTable.userId, uid))
    .orderBy(requirementsTable.order);

  if (rows.length === 0) {
    await seedRequirementsForUser(uid);
    rows = await db
      .select()
      .from(requirementsTable)
      .where(eq(requirementsTable.userId, uid))
      .orderBy(requirementsTable.order);
  }

  const parsed = ListRequirementsResponse.parse(
    rows.map((r) => ({
      ...r,
      completedAt: r.completedAt ? r.completedAt.toISOString() : null,
    })),
  );
  res.json(parsed);
});

router.patch("/requirements/:id/complete", async (req, res) => {
  const { id } = ToggleRequirementParams.parse({ id: Number(req.params.id) });
  const body = ToggleRequirementBody.parse(req.body);

  const [updated] = await db
    .update(requirementsTable)
    .set({
      completed: body.completed,
      completedAt: body.completed ? new Date() : null,
    })
    .where(and(eq(requirementsTable.id, id), eq(requirementsTable.userId, req.userId)))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const parsed = ToggleRequirementResponse.parse({
    ...updated,
    completedAt: updated.completedAt ? updated.completedAt.toISOString() : null,
  });
  res.json(parsed);
});

export default router;
