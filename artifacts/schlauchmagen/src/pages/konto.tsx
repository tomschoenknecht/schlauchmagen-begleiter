import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMe, openBillingPortal, syncBilling } from "@/hooks/useTier";

const TIER_LABEL: Record<string, string> = {
  free: "Kostenlos",
  basis: "Basis",
  deluxe: "Deluxe",
};

export default function KontoPage() {
  const { data } = useMe();
  const qc = useQueryClient();

  useEffect(() => {
    // Bei jedem Konto-Aufruf den Abo-Status direkt von Stripe holen –
    // so werden auch Kündigungen/Verlängerungen ohne Webhook sichtbar.
    let cancelled = false;
    (async () => {
      try {
        await syncBilling();
      } catch {
        /* ignore */
      }
      if (!cancelled) qc.invalidateQueries({ queryKey: ["me"] });
    })();
    return () => {
      cancelled = true;
    };
  }, [qc]);

  const tier = data?.tier ?? "free";

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-foreground mb-6">Dein Konto</h1>
      <div className="rounded-2xl border bg-card p-6 mb-6">
        <p className="text-sm text-muted-foreground">Aktueller Tarif</p>
        <p className="text-2xl font-bold text-foreground mb-1">{TIER_LABEL[tier] ?? tier}</p>
        {data?.email && <p className="text-sm text-muted-foreground">{data.email}</p>}
        {data?.subscriptionStatus && (
          <p className="text-xs text-muted-foreground mt-2">Status: {data.subscriptionStatus}</p>
        )}
      </div>
      {tier === "free" ? (
        <a
          href="/upgrade"
          className="block text-center rounded-xl bg-primary text-white py-3 font-semibold hover:opacity-90 transition-opacity"
        >
          Jetzt freischalten
        </a>
      ) : (
        <button
          onClick={() => openBillingPortal().catch(() => alert("Portal ist gerade nicht verfügbar."))}
          className="w-full rounded-xl border py-3 font-semibold text-foreground hover:bg-muted transition-colors"
        >
          Abo verwalten (Kündigung / Zahlung)
        </button>
      )}
    </div>
  );
}
