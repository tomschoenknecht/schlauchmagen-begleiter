import { Sparkles, Lock } from "lucide-react";

/**
 * Zentrale Feature-Schalter.
 * Zum Freischalten einfach den jeweiligen Wert auf `true` setzen –
 * die Funktionen sind vollständig vorhanden, nur vorläufig gesperrt (spätere Paywall).
 */
export const FEATURES = {
  chatbot: false,      // KI-Begleiter -> "Coming soon"
  appointments: false, // Termine -> nur ansehen
  journal: false,      // Tagebuch -> nur ansehen
  weight: false,       // Gewichtsprotokoll -> nur ansehen
} as const;

/** Ganzseitiger "Coming soon"-Platzhalter (für vollständig deaktivierte Funktionen). */
export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground max-w-md">
        Diese Funktion ist in Arbeit und bald verfügbar. Schau bald wieder vorbei.
      </p>
      <span className="mt-6 inline-flex items-center rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-semibold">
        Coming soon
      </span>
    </div>
  );
}

/**
 * Zeigt die Funktion sichtbar an, macht sie aber unbedienbar (nur ansehen).
 * Bei `locked=false` werden die Kinder unverändert und voll nutzbar gerendert.
 */
export function PreviewLock({
  locked,
  feature,
  children,
}: {
  locked: boolean;
  feature: string;
  children: React.ReactNode;
}) {
  if (!locked) return <>{children}</>;
  return (
    <div>
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-foreground">{feature} – Vorschau</p>
          <p className="text-sm text-muted-foreground">
            Du kannst dir diese Funktion schon ansehen. Nutzen kannst du sie in Kürze.
          </p>
        </div>
      </div>
      <div className="pointer-events-none select-none opacity-60" aria-disabled="true">
        {children}
      </div>
    </div>
  );
}
