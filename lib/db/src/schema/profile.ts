import { pgTable, serial, date, timestamp, text, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userProfileTable = pgTable("user_profile", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  surgeryDate: date("surgery_date"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [unique("user_profile_user_id_unique").on(t.userId)]);

export const insertUserProfileSchema = createInsertSchema(userProfileTable).omit({ id: true, updatedAt: true });
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfileTable.$inferSelect;
