import { useState } from "react";
import { Check } from "lucide-react";
import { useMe, startCheckout, TIER_RANK } from "@/hooks/useTier";

const TIERS = [
  {
    key: "basis",
    name: "Basis",
    price: "49 €",
    period: "/ Jahr",
    features: [
      "Alle Inhalte & Wochenstruktur",
      "Termine, Tagebuch & Gewichtsprotokoll",
      "Dokumentation für Kasse & Klinik",
    ],
  },
  {
    key: "deluxe",
    name: "Deluxe",
    price: "99 €",
    period: "/ Jahr",
    highlight: true,
    features: [
      "Alles aus Basis",
      "KI-Begleiter – dein persönlicher Chat",
      "Neue Funktionen zuerst",
    ],
  },
] as const;

export default function UpgradePage() {
  const { data } = useMe();
  const currentRank = TIER_RANK[data?.tier ?? "free"];
  const [loading, setLoading] = useState<string | null>(null);

  async function buy(tier: "basis" | "deluxe") {
    setLoading(tier);
    try {
      await startCheckout(tier);
    } catch (e) {
      setLoading(null);
      alert("Checkout-Fehler: " + (e instanceof Error ? e.message : "unbekannt"));
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-3">Wähle deinen Begleiter</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Einmal im Jahr entscheiden – dann ein Jahr volle Begleitung auf deinem Weg.
          Kein Monatsabo.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {TIERS.map((t) => {
          const owned = currentRank >= TIER_RANK[t.key];
          return (
            <div
              key={t.key}
              className={`rounded-2xl border p-6 flex flex-col ${
                "highlight" in t && t.highlight
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "bg-card"
              }`}
            >
              {"highlight" in t && t.highlight && (
                <span className="self-start mb-3 inline-flex rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                  Empfohlen
                </span>
              )}
              <h2 className="text-xl font-bold text-foreground">{t.name}</h2>
              <div className="mt-2 mb-5">
                <span className="text-3xl font-extrabold text-foreground">{t.price}</span>
                <span className="text-muted-foreground"> {t.period}</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={owned || loading !== null}
                onClick={() => buy(t.key)}
                className="rounded-xl bg-primary text-white py-3 font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {owned
                  ? "Bereits freigeschaltet"
                  : loading === t.key
                    ? "Weiter zu Stripe …"
                    : `${t.name} freischalten`}
              </button>
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs text-muted-foreground mt-6">
        Sichere Zahlung über Stripe. Jederzeit im Konto kündbar.
      </p>
    </div>
  );
}
