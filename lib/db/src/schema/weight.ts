import { pgTable, serial, numeric, timestamp, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const weightTable = pgTable("weight", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  weightKg: numeric("weight_kg", { precision: 5, scale: 1 }).notNull(),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertWeightSchema = createInsertSchema(weightTable).omit({ id: true, recordedAt: true });
export type InsertWeight = z.infer<typeof insertWeightSchema>;
export type WeightEntry = typeof weightTable.$inferSelect;
