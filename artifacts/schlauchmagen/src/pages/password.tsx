import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getToken } from "@/hooks/useAuth";
import {
  Scale,
  ClipboardList,
  HeartHandshake,
  Star,
  Sparkles,
  ShieldCheck,
  MessageCircleHeart,
  MailCheck,
} from "lucide-react";

export default function PasswordPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    if (getToken()) setLocation("/");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      toast({
        title: "Fehler beim Senden",
        description: "Der Link konnte nicht gesendet werden. Bitte versuche es erneut.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">

      {/* HERO */}
      <section className="relative text-white" style={{ overflow: "hidden", height: "118vw", maxHeight: "100vh" }}>
        <img
          src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/hero.jpg`}
          alt=""
          className="w-full h-auto block"
          style={{ marginTop: "-32%" }}
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, transparent 15%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.75) 70%)"
        }} />
        <div className="absolute inset-x-0 text-center px-6" style={{ top: "38%" }}>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-300 drop-shadow mb-4">
            Jetzt entscheide ich mich!
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight drop-shadow-lg">
            Mein Begleiter auf dem Weg zu einer bariatrischen OP
          </h1>
        </div>
      </section>

      {/* CELEBRATION BANNER */}
      <section className="bg-amber-50 border-y border-amber-200 py-10 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-3">
            Herzlichen Glückwunsch!
          </h2>
          <p className="text-amber-800 text-lg leading-relaxed max-w-xl mx-auto">
            Du bist hier, weil du dein Leben verändern möchtest. Das erfordert Mut und Entschlossenheit —
            und genau das hast du bewiesen. Du bist nicht allein.
          </p>
        </div>
      </section>

      {/* WORUM GEHT ES */}
      <section id="mehr" className="py-20 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Worum geht es hier?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Viele Menschen mit Übergewicht fragen sich: <em>Ist eine Operation der richtige Weg für mich?</em>
              Genau dabei hilft dir diese App.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Scale,
                color: "bg-primary/10 text-primary",
                title: "Welche OP ist die richtige?",
                desc: "Schlauchmagen, Magenbypass oder etwas anderes? Wir erklären dir verständlich die Unterschiede und helfen dir, die für dich passende Option zu finden.",
              },
              {
                icon: ClipboardList,
                color: "bg-violet-100 text-violet-600",
                title: "Was sind die Voraussetzungen?",
                desc: "Nicht jeder kommt sofort für eine OP in Frage. Wir zeigen dir klar und ehrlich, welche medizinischen und persönlichen Kriterien erfüllt sein müssen.",
              },
              {
                icon: HeartHandshake,
                color: "bg-rose-100 text-rose-600",
                title: "Begleitung auf dem Weg",
                desc: "Von der ersten Überlegung bis nach der Operation. Mit Tagebuch, Gewichtstracker, Terminen und einem persönlichen KI-Assistenten bist du nie allein.",
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`inline-flex p-3 rounded-xl mb-5 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FÜR WEN IST DAS */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-14">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
                alt="Glückliche Menschen"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Du bist nicht allein
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Adipositas betrifft Millionen Menschen. Es ist keine Frage der Willenskraft —
                es ist eine komplexe Erkrankung. Und du verdienst Unterstützung, Verständnis
                und einen klaren Weg nach vorne.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Tausende Menschen haben diesen Schritt bereits gewagt — und ihr Leben
                grundlegend verändert. Du kannst das auch.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              { value: "26%", label: "der Deutschen leben mit Adipositas" },
              { value: "2×", label: "höheres Risiko für Herzerkrankungen" },
              { value: "85%", label: "Gewichtsverlust dauerhaft nach OP" },
            ].map(({ value, label }) => (
              <div key={label} className="rounded-2xl bg-card border p-8 shadow-sm">
                <div className="text-4xl font-bold text-primary mb-2">{value}</div>
                <div className="text-muted-foreground text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VERSPRECHEN */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Unser Versprechen an dich</h2>
          </div>
          <div className="space-y-4">
            {[
              { icon: ShieldCheck, text: "Verständliche Informationen — kein Mediziner-Deutsch, kein Fachchinesisch." },
              { icon: HeartHandshake, text: "Wertschätzend und respektvoll — du wirst hier niemals verurteilt." },
              { icon: MessageCircleHeart, text: "Motivierend und ehrlich — wir zeigen dir den echten Weg, Schritt für Schritt." },
              { icon: Sparkles, text: "Persönlich — ein KI-Assistent beantwortet deine Fragen jederzeit." },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-4 rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-foreground leading-relaxed pt-1">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOGIN */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
            <HeartHandshake className="w-8 h-8 text-white" />
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <MailCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Link gesendet</h2>
              <p className="text-muted-foreground">
                Wir haben dir einen Zugangslink an <strong>{email}</strong> geschickt.
                Klicke auf den Link in der E-Mail, um dich einzuloggen.
              </p>
              <p className="text-xs text-muted-foreground">
                Kein E-Mail? Prüfe deinen Spam-Ordner oder{" "}
                <button
                  className="underline hover:no-underline"
                  onClick={() => setSent(false)}
                >
                  versuche es erneut
                </button>
                .
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-foreground mb-3">Bereit loszulegen?</h2>
              <p className="text-muted-foreground mb-8">
                Gib deine E-Mail-Adresse ein. Wir schicken dir einen Zugangslink — kein Passwort nötig.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="deine@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-center text-lg h-14 rounded-xl shadow-sm"
                  autoFocus
                  required
                />
                <Button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                >
                  {loading ? "Wird gesendet…" : "Zugangslink senden"}
                </Button>
              </form>

              <p className="mt-6 text-xs text-muted-foreground">
                Deine Daten bleiben privat und werden nicht weitergegeben.
              </p>
            </>
          )}
        </div>
      </section>

    </div>
  );
}
