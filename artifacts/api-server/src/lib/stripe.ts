import Stripe from "stripe";

let _stripe: Stripe | null = null;

/** Lazy-Init: Stripe-Client erst bei Bedarf erzeugen, damit der Server auch
 *  ohne gesetzten STRIPE_SECRET_KEY startet (Konstruktor wirft bei leerem Key). */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY ist nicht gesetzt");
    _stripe = new Stripe(key);
  }
  return _stripe;
}

export type Tier = "free" | "basis" | "deluxe";

export const TIER_RANK: Record<Tier, number> = { free: 0, basis: 1, deluxe: 2 };

/** Stripe-Price-ID -> Tier (per ENV konfiguriert). */
export function tierForPrice(priceId: string | null | undefined): Tier | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_DELUXE) return "deluxe";
  if (priceId === process.env.STRIPE_PRICE_BASIS) return "basis";
  return null;
}

/** Tier -> Stripe-Price-ID. */
export function priceForTier(tier: "basis" | "deluxe"): string | undefined {
  return tier === "deluxe"
    ? process.env.STRIPE_PRICE_DELUXE
    : process.env.STRIPE_PRICE_BASIS;
}

/** Nur bei aktivem Abo zählt der gekaufte Tier, sonst "free". */
export function effectiveTier(user: {
  tier?: string | null;
  subscriptionStatus?: string | null;
}): Tier {
  const active =
    user.subscriptionStatus === "active" || user.subscriptionStatus === "trialing";
  if (!active) return "free";
  const t = user.tier;
  return t === "deluxe" || t === "basis" ? t : "free";
}
