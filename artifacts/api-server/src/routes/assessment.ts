import { Router } from "express";
import { db, assessmentTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { GetLatestAssessmentResponse, SubmitAssessmentBody } from "@workspace/api-zod";

const router = Router();

function computeRecommendation(input: {
  bmi: number;
  hasReflux: boolean;
  hasDiabetes: boolean;
  hasHypertension: boolean;
  hasSleepApnea: boolean;
  hasJointPain: boolean;
  hasHeartDisease: boolean;
  previousAbdominalSurgery: boolean;
}): {
  eligible: boolean;
  recommendation: string;
  reasoning: string;
  strengthsSchlauchmagen: string;
  strengthsBypass: string;
} {
  const { bmi, hasReflux, hasDiabetes, previousAbdominalSurgery } = input;

  const hasComorbidity =
    input.hasDiabetes ||
    input.hasHypertension ||
    input.hasSleepApnea ||
    input.hasJointPain ||
    input.hasHeartDisease;

  const eligible = bmi >= 40 || (bmi >= 35 && hasComorbidity);

  if (!eligible) {
    if (bmi >= 30 && bmi < 35) {
      return {
        eligible: false,
        recommendation: "nichtEligible",
        reasoning:
          "Ihr BMI liegt aktuell unter 35 kg/m². Die gesetzlichen Krankenkassen in Deutschland genehmigen bariatrische Eingriffe in der Regel erst ab einem BMI von 35 mit Begleiterkrankungen oder ab einem BMI von 40. Eine Gewichtsreduktion durch konservative Maßnahmen sowie regelmäßige ärztliche Begleitung sind der empfohlene erste Schritt.",
        strengthsSchlauchmagen:
          "Geringeres Operationsrisiko, kein Fremdmaterial, schnellere Erholung, keine Umleitung des Verdauungstrakts.",
        strengthsBypass:
          "Stärkerer Gewichtsverlust, sehr effektiv bei Typ-2-Diabetes, hilft bei schwerem Reflux.",
      };
    }
    return {
      eligible: false,
      recommendation: "nichtEligible",
      reasoning:
        "Basierend auf Ihren Angaben liegt Ihr BMI unterhalb der Schwellenwerte für eine Krankenkassengenehmigung (BMI ≥ 40 oder BMI ≥ 35 mit Begleiterkrankungen). Bitte sprechen Sie mit Ihrem Hausarzt über alternative Wege zur Gewichtsreduktion.",
      strengthsSchlauchmagen:
        "Geringeres Operationsrisiko, kein Fremdmaterial, schnellere Erholung, keine Umleitung des Verdauungstrakts.",
      strengthsBypass:
        "Stärkerer Gewichtsverlust, sehr effektiv bei Typ-2-Diabetes, hilft bei schwerem Reflux.",
    };
  }

  const bypassScore =
    (hasReflux ? 3 : 0) +
    (hasDiabetes ? 2 : 0) +
    (bmi >= 50 ? 1 : 0) +
    (previousAbdominalSurgery ? -1 : 0);

  const schlauchmageScore =
    (hasReflux ? 0 : 2) +
    (!previousAbdominalSurgery ? 1 : 0) +
    (bmi < 50 ? 1 : 0);

  let recommendation: string;
  let reasoning: string;

  if (bypassScore > schlauchmageScore + 1) {
    recommendation = "bypass";
    const reasons: string[] = [];
    if (hasReflux)
      reasons.push(
        "Sie haben Reflux/Sodbrennen angegeben — der Schlauchmagen kann Reflux verschlimmern, während der Magen-Bypass dieses Problem oft deutlich verbessert.",
      );
    if (hasDiabetes)
      reasons.push(
        "Bei Typ-2-Diabetes zeigt der Magen-Bypass die stärkste Remissionsrate (bis zu 80% der Patienten benötigen nach dem Eingriff keine Medikamente mehr).",
      );
    if (bmi >= 50)
      reasons.push(
        "Bei einem sehr hohen BMI erzielt der Magen-Bypass häufig einen stärkeren Gewichtsverlust.",
      );
    reasoning =
      "Aufgrund Ihrer individuellen Angaben ist der **Magen-Bypass** die empfohlene Operation für Sie. " +
      reasons.join(" ");
  } else if (schlauchmageScore >= bypassScore) {
    recommendation = "schlauchmagen";
    const reasons: string[] = [];
    if (!hasReflux)
      reasons.push(
        "Sie haben keinen ausgeprägten Reflux — der Schlauchmagen ist in diesem Fall sehr gut geeignet.",
      );
    if (!previousAbdominalSurgery)
      reasons.push(
        "Keine Voroperationen am Bauch erleichtern den Eingriff und reduzieren das Risiko.",
      );
    reasons.push(
      "Der Schlauchmagen ist technisch einfacher und hat ein geringeres Risikoprofil als der Magen-Bypass.",
    );
    reasoning =
      "Aufgrund Ihrer individuellen Angaben ist der **Schlauchmagen** die empfohlene Operation für Sie. " +
      reasons.join(" ");
  } else {
    recommendation = "grenzfall";
    reasoning =
      "Ihre Angaben zeigen, dass sowohl der Schlauchmagen als auch der Magen-Bypass in Frage kommen. Die endgültige Entscheidung sollte gemeinsam mit einem bariatrischen Chirurgen und Ihrem Behandlungsteam getroffen werden, da beide Operationen Vor- und Nachteile für Ihre individuelle Situation haben.";
  }

  return {
    eligible: true,
    recommendation,
    reasoning,
    strengthsSchlauchmagen:
      "Technisch einfacherer Eingriff, kein Fremdmaterial, natürliche Verdauung bleibt erhalten, schnellere Erholung, gutes Sättigungsgefühl durch Ghrelinreduktion.",
    strengthsBypass:
      "Stärkerer und nachhaltigerer Gewichtsverlust, sehr effektiv bei Typ-2-Diabetes (Remission), verbessert Reflux, bewährt bei sehr hohem BMI.",
  };
}

router.get("/assessment", async (req, res) => {
  const rows = await db
    .select()
    .from(assessmentTable)
    .where(eq(assessmentTable.userId, req.userId))
    .orderBy(desc(assessmentTable.createdAt))
    .limit(1);

  if (rows.length === 0) {
    res.json(null);
    return;
  }

  const r = rows[0];
  const parsed = GetLatestAssessmentResponse.parse({
    ...r,
    bmi: Number(r.bmi),
    weightKg: Number(r.weightKg),
    createdAt: r.createdAt.toISOString(),
  });
  res.json(parsed);
});

router.post("/assessment", async (req, res) => {
  const body = SubmitAssessmentBody.parse(req.body);

  const bmi = body.weightKg / Math.pow(body.heightCm / 100, 2);

  const { eligible, recommendation, reasoning, strengthsSchlauchmagen, strengthsBypass } =
    computeRecommendation({
      bmi,
      hasReflux: body.hasReflux,
      hasDiabetes: body.hasDiabetes,
      hasHypertension: body.hasHypertension,
      hasSleepApnea: body.hasSleepApnea,
      hasJointPain: body.hasJointPain,
      hasHeartDisease: body.hasHeartDisease,
      previousAbdominalSurgery: body.previousAbdominalSurgery,
    });

  const [row] = await db
    .insert(assessmentTable)
    .values({
      userId: req.userId,
      ageYears: body.ageYears,
      heightCm: body.heightCm,
      weightKg: String(body.weightKg),
      bmi: bmi.toFixed(2),
      hasReflux: body.hasReflux,
      hasDiabetes: body.hasDiabetes,
      hasHypertension: body.hasHypertension,
      hasSleepApnea: body.hasSleepApnea,
      hasJointPain: body.hasJointPain,
      hasHeartDisease: body.hasHeartDisease,
      previousAbdominalSurgery: body.previousAbdominalSurgery,
      previousWeightLossDuration: body.previousWeightLossDuration,
      motivationText: body.motivationText,
      eligible,
      recommendation,
      reasoning,
      strengthsSchlauchmagen,
      strengthsBypass,
    })
    .returning();

  res.status(201).json({
    ...row,
    bmi: Number(row.bmi),
    weightKg: Number(row.weightKg),
    createdAt: row.createdAt.toISOString(),
  });
});

export default router;
