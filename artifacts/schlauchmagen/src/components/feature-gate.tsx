import { Sparkles, Lock } from "lucide-react";
import { Link } from "wouter";
import { useMe, TIER_RANK } from "@/hooks/useTier";

/**
 * Sperrt eine Funktion nach Abo-Tier.
 * - `mode="lock"`: ganzseitige Sperre mit Upgrade-Button (z.B. KI-Begleiter).
 * - `mode="preview"`: Inhalt sichtbar, aber unbedienbar + Upgrade-Hinweis (Tracker).
 * Hat der Nutzer den nötigen Tier, werden die Kinder normal gerendert.
 */
export function TierGate({
  need,
  feature,
  mode,
  children,
}: {
  need: "basis" | "deluxe";
  feature: string;
  mode: "lock" | "preview";
  children: React.ReactNode;
}) {
  const { data, isLoading } = useMe();
  if (isLoading) return null;

  const tier = data?.tier ?? "free";
  const allowed = TIER_RANK[tier] >= TIER_RANK[need];
  if (allowed) return <>{children}</>;

  const tierName = need === "deluxe" ? "Deluxe" : "Basis";

  if (mode === "lock") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{feature}</h1>
        <p className="text-muted-foreground max-w-md mb-6">
          Diese Funktion ist Teil von <strong>{tierName}</strong>. Schalte sie frei und
          nutze deinen vollen Begleiter.
        </p>
        <Link
          href="/upgrade"
          className="inline-flex items-center rounded-xl bg-primary text-white px-6 py-3 font-semibold shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
        >
          {tierName} freischalten
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <Lock className="w-5 h-5 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-[12rem]">
          <p className="font-semibold text-foreground">{feature} – in {tierName} enthalten</p>
          <p className="text-sm text-muted-foreground">
            Du kannst dir alles ansehen. Zum Nutzen schalte {tierName} frei.
          </p>
        </div>
        <Link
          href="/upgrade"
          className="inline-flex items-center rounded-lg bg-primary text-white px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Freischalten
        </Link>
      </div>
      <div className="pointer-events-none select-none opacity-60" aria-disabled="true">
        {children}
      </div>
    </div>
  );
}
