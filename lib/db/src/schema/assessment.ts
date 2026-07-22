import { pgTable, serial, integer, numeric, boolean, text, timestamp } from "drizzle-orm/pg-core"; // text already imported
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const assessmentTable = pgTable("assessment", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  ageYears: integer("age_years").notNull(),
  heightCm: integer("height_cm").notNull(),
  weightKg: numeric("weight_kg", { precision: 5, scale: 1 }).notNull(),
  bmi: numeric("bmi", { precision: 5, scale: 2 }).notNull(),
  hasReflux: boolean("has_reflux").notNull().default(false),
  hasDiabetes: boolean("has_diabetes").notNull().default(false),
  hasHypertension: boolean("has_hypertension").notNull().default(false),
  hasSleepApnea: boolean("has_sleep_apnea").notNull().default(false),
  hasJointPain: boolean("has_joint_pain").notNull().default(false),
  hasHeartDisease: boolean("has_heart_disease").notNull().default(false),
  previousAbdominalSurgery: boolean("previous_abdominal_surgery").notNull().default(false),
  previousWeightLossDuration: text("previous_weight_loss_duration").notNull(),
  motivationText: text("motivation_text").notNull(),
  eligible: boolean("eligible").notNull(),
  recommendation: text("recommendation").notNull(),
  reasoning: text("reasoning").notNull(),
  strengthsSchlauchmagen: text("strengths_schlauchmagen"),
  strengthsBypass: text("strengths_bypass"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAssessmentSchema = createInsertSchema(assessmentTable).omit({ id: true, createdAt: true });
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessmentTable.$inferSelect;
