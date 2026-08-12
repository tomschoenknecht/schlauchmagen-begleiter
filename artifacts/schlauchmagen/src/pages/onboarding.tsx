import { useState } from "react";
import { useUpdateProfile } from "@workspace/api-client-react";
import { useLocation } from "wouter";

type Phase = "planning" | "waiting" | "upcoming" | "post_op";

const phases: { id: Phase; label: string; sub: string }[] = [
  { id: "planning", label: "Ich denke noch nach", sub: "Ich informiere mich, habe aber noch nicht entschieden." },
  { id: "waiting", label: "Ich warte", sub: "Auf einen Termin, auf die Genehmigung der Krankenkasse." },
  { id: "upcoming", label: "Die OP ist bald", sub: "In den nächsten Wochen geht es los." },
  { id: "post_op", label: "Die OP liegt hinter mir", sub: "Ich bin in der Phase danach." },
];

const phaseDestination: Record<Phase, string> = {
  planning: "/beratung",
  waiting: "/voraussetzungen",
  upcoming: "/beratung/risiken",
  post_op: "/tagebuch",
};

const phaseIntro: Record<Phase, { heading: string; body: string }> = {
  planning: {
    heading: "Guter Zeitpunkt, um anzufangen.",
    body: "Der Beratungsbereich zeigt dir den Unterschied zwischen Schlauchmagen und Bypass – ohne Werbung, ohne Versprechen. Was du jetzt brauchst, ist Klarheit.",
  },
  waiting: {
    heading: "Die Wartezeit ist keine verlorene Zeit.",
    body: "Die Checkliste zeigt dir, was die Krankenkasse braucht und was du jetzt vorbereiten kannst. Wer gut dokumentiert, hat seltener Probleme.",
  },
  upcoming: {
    heading: "Kurz vor dem Eingriff.",
    body: "Im Risikobereich findest du ehrliche Informationen – was passiert wirklich, was sagen Betroffene. Kein Schönreden.",
  },
  post_op: {
    heading: "Willkommen im Danach.",
    body: "Das Tagebuch begleitet dich durch die ersten Wochen. Und das Gewicht lässt sich direkt hier eintragen – ohne Kommentar, ohne Wertung.",
  },
};

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<Phase | null>(null);
  const [, setLocation] = useLocation();
  const updateProfile = useUpdateProfile();

  function handleSelect(phase: Phase) {
    setSelected(phase);
    setStep(2);
  }

  function handleStart() {
    if (!selected) return;
    updateProfile.mutate(
      { data: { phase: selected, onboardingCompleted: true } },
      {
        onSettled: () => {
          setLocation(phaseDestination[selected]);
        },
      }
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {step === 1 && (
          <>
            <p className="text-sm text-muted-foreground mb-2">Einmalige Frage</p>
            <h1 className="text-2xl font-semibold mb-1">Wo stehst du gerade?</h1>
            <p className="text-muted-foreground mb-8 text-sm">
              Die Antwort bestimmt, womit du einsteigst. Du kannst das jederzeit ändern.
            </p>
            <div className="flex flex-col gap-3">
              {phases.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  className="text-left border border-border rounded-xl px-5 py-4 hover:border-foreground transition-colors bg-card"
                >
                  <p className="font-medium text-sm">{p.label}</p>
                  <p className="text-muted-foreground text-sm mt-0.5">{p.sub}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && selected && (
          <>
            <button
              onClick={() => setStep(1)}
              className="text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors"
            >
              &larr; Andere Antwort
            </button>
            <h1 className="text-2xl font-semibold mb-3">
              {phaseIntro[selected].heading}
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {phaseIntro[selected].body}
            </p>
            <button
              onClick={handleStart}
              disabled={updateProfile.isPending}
              className="w-full bg-foreground text-background rounded-xl px-6 py-3 font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {updateProfile.isPending ? "Einen Moment…" : "Los geht's"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
