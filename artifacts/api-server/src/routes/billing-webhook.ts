import type { Request, Response } from "express";
import Stripe from "stripe";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { stripe, tierForPrice } from "../lib/stripe";
import { logger } from "../lib/logger";

/**
 * Stripe-Webhook. MUSS mit express.raw() gemountet werden (Signaturprüfung
 * braucht den unveränderten Body) – siehe app.ts, vor express.json().
 */
export async function billingWebhookHandler(req: Request, res: Response): Promise<void> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers["stripe-signature"];
  if (!secret || typeof sig !== "string") {
    res.status(400).send("Webhook nicht konfiguriert");
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, secret);
  } catch (err) {
    logger.error({ err }, "Stripe-Webhook-Signatur ungültig");
    res.status(400).send("Signatur ungültig");
    return;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await syncSubscription(event);
        break;
      default:
        break;
    }
  } catch (err) {
    logger.error({ err, type: event.type }, "Fehler beim Verarbeiten des Stripe-Events");
    res.status(500).send("Verarbeitungsfehler");
    return;
  }

  res.json({ received: true });
}

async function syncSubscription(event: Stripe.Event): Promise<void> {
  let subscription: Stripe.Subscription | null = null;

  if (event.type.startsWith("customer.subscription")) {
    subscription = event.data.object as Stripe.Subscription;
  } else if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.subscription) {
      subscription = await stripe.subscriptions.retrieve(String(session.subscription));
    }
  }
  if (!subscription) return;

  const customerId = String(subscription.customer);
  const priceId = subscription.items.data[0]?.price?.id ?? null;
  const boughtTier = tierForPrice(priceId) ?? "free";
  const status = subscription.status;
  const active = status === "active" || status === "trialing";
  const periodEndUnix = (subscription as unknown as { current_period_end?: number })
    .current_period_end;

  await db
    .update(usersTable)
    .set({
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: status,
      tier: active ? boughtTier : "free",
      currentPeriodEnd: periodEndUnix ? new Date(periodEndUnix * 1000) : null,
    })
    .where(eq(usersTable.stripeCustomerId, customerId));
}
