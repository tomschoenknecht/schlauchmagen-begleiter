import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getStripe, priceForTier, tierForPrice, effectiveTier } from "../lib/stripe";

const router = Router();

const appUrl = () => process.env.APP_URL ?? "https://bari-guide.de";

/** Aktueller Tarif-Status des eingeloggten Nutzers. */
router.get("/me", async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId));
  res.json({
    email: user?.email ?? null,
    tier: effectiveTier(user ?? {}),
    subscriptionStatus: user?.subscriptionStatus ?? null,
    currentPeriodEnd: user?.currentPeriodEnd ?? null,
  });
});

/** Startet einen Stripe-Checkout für den gewählten Tarif. */
router.post("/billing/checkout", async (req, res) => {
  const { tier } = req.body as { tier?: "basis" | "deluxe" };
  if (tier !== "basis" && tier !== "deluxe") {
    res.status(400).json({ error: "Ungültiger Tarif" });
    return;
  }
  const price = priceForTier(tier);
  if (!price) {
    res.status(500).json({ error: "Preis nicht konfiguriert" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId));
  if (!user) {
    res.status(404).json({ error: "Benutzer nicht gefunden" });
    return;
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await db
      .update(usersTable)
      .set({ stripeCustomerId: customerId })
      .where(eq(usersTable.id, user.id));
  }

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${appUrl()}/konto?checkout=success`,
    cancel_url: `${appUrl()}/upgrade?checkout=cancel`,
    metadata: { userId: user.id, tier },
    subscription_data: { metadata: { userId: user.id, tier } },
  });

  res.json({ url: session.url });
});

/** Öffnet das Stripe-Kundenportal (Kündigung/Upgrade/Zahlungsmittel). */
router.get("/billing/portal", async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId));
  if (!user?.stripeCustomerId) {
    res.status(400).json({ error: "Kein Abo vorhanden" });
    return;
  }
  const portal = await getStripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${appUrl()}/konto`,
  });
  res.json({ url: portal.url });
});

/** Holt den aktuellen Abo-Status direkt von Stripe und aktualisiert den Nutzer.
 *  Wird nach der Rückkehr aus dem Checkout aufgerufen (ersetzt den Webhook fürs Freischalten). */
router.post("/billing/sync", async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId));
  if (!user?.stripeCustomerId) {
    res.json({ tier: "free" });
    return;
  }

  const subs = await getStripe().subscriptions.list({
    customer: user.stripeCustomerId,
    status: "all",
    limit: 10,
  });
  const sub =
    subs.data.find((s) => s.status === "active" || s.status === "trialing") ?? subs.data[0];

  if (!sub) {
    await db
      .update(usersTable)
      .set({ tier: "free", subscriptionStatus: null })
      .where(eq(usersTable.id, user.id));
    res.json({ tier: "free" });
    return;
  }

  const priceId = sub.items.data[0]?.price?.id ?? null;
  const boughtTier = tierForPrice(priceId) ?? "free";
  const status = sub.status;
  const active = status === "active" || status === "trialing";
  const periodEndUnix = (sub as unknown as { current_period_end?: number }).current_period_end;

  await db
    .update(usersTable)
    .set({
      stripeSubscriptionId: sub.id,
      subscriptionStatus: status,
      tier: active ? boughtTier : "free",
      currentPeriodEnd: periodEndUnix ? new Date(periodEndUnix * 1000) : null,
    })
    .where(eq(usersTable.id, user.id));

  res.json({ tier: active ? boughtTier : "free", subscriptionStatus: status });
});

export default router;
