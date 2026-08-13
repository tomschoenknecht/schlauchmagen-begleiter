import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  // Abo/Paywall: "free" | "basis" | "deluxe"
  tier: text("tier").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  // Stripe-Status, z.B. "active" | "trialing" | "past_due" | "canceled"
  subscriptionStatus: text("subscription_status"),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
});
