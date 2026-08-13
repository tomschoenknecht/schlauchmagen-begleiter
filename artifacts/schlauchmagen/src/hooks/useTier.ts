import { useQuery } from "@tanstack/react-query";
import { getToken } from "./useAuth";

export type Tier = "free" | "basis" | "deluxe";

export interface MeInfo {
  email: string | null;
  tier: Tier;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
}

export const TIER_RANK: Record<Tier, number> = { free: 0, basis: 1, deluxe: 2 };

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Aktueller Tarif/Abo-Status des Nutzers. */
export function useMe() {
  return useQuery<MeInfo>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch("/api/me", { headers: authHeaders() });
      if (!res.ok) throw new Error("me-Abruf fehlgeschlagen");
      return res.json();
    },
    staleTime: 60_000,
  });
}

/** Startet den Stripe-Checkout für einen Tarif und leitet dorthin weiter. */
export async function startCheckout(tier: "basis" | "deluxe"): Promise<void> {
  const res = await fetch("/api/billing/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ tier }),
  });
  const data = (await res.json()) as { url?: string; error?: string };
  if (data.url) window.location.href = data.url;
  else throw new Error(data.error ?? "Checkout fehlgeschlagen");
}

/** Öffnet das Stripe-Kundenportal. */
export async function openBillingPortal(): Promise<void> {
  const res = await fetch("/api/billing/portal", { headers: authHeaders() });
  const data = (await res.json()) as { url?: string; error?: string };
  if (data.url) window.location.href = data.url;
  else throw new Error(data.error ?? "Portal konnte nicht geöffnet werden");
}
