import { useState } from "react";
import { useGetOverview, useGetProfile, useUpdateProfile } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import {
  CheckSquare, Calendar, BookHeart, Activity,
  ArrowRight, TrendingDown, MessageSquare, Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function weeksAndDaysSince(dateStr: string): { weeks: number; days: number; total: number } {
  const then = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return { weeks: Math.floor(diffDays / 7), days: diffDays % 7, total: diffDays };
}

function PhaseIndicator({ surgeryDate }: { surgeryDate: string | null }) {
  const updateProfile = useUpdateProfile();
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");

  if (!surgeryDate) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <p className="text-sm text-muted-foreground mb-1 font-medium">OP-Datum noch nicht eingetragen</p>
        {editing ? (
          <div className="flex gap-2 items-center mt-2">
            <Input
              type="date"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="max-w-[180px] h-8 text-sm"
            />
            <Button
              size="sm"
              disabled={!input || updateProfile.isPending}
              onClick={() => {
                updateProfile.mutate(
                  { data: { surgeryDate: input } },
                  { onSuccess: () => setEditing(false) }
                );
              }}
            >
              Speichern
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Abbrechen</Button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
          >
            OP-Datum eintragen <ArrowRight className="w-3 h-3" />
          </button>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Mit OP-Datum zeigen wir Ihnen, in welcher Phase Sie sich befinden und was in dieser Woche normal ist.
        </p>
      </div>
    );
  }

  const { weeks, days, total } = weeksAndDaysSince(surgeryDate);

  let phaseLabel = "";
  let phaseNote = "";

  if (total < 0) {
    const daysUntil = Math.abs(total);
    phaseLabel = `${daysUntil} Tag${daysUntil !== 1 ? "e" : ""} bis zur OP`;
    phaseNote = "Die Vorbereitungsphase ist entscheidend. Nutzen Sie die Zeit, um Fragen zu sammeln.";
  } else if (weeks < 2) {
    phaseLabel = `Woche ${weeks + 1} nach der OP`;
    phaseNote = "Die ersten zwei Wochen: Körper und Wunden erholen sich. Flüssige Kost, viel Ruhe.";
  } else if (weeks < 6) {
    phaseLabel = `Woche ${weeks + 1} nach der OP`;
    phaseNote = "Pürierte und weiche Kost. Der neue Mageninhalt überrascht viele — das ist normal.";
  } else if (weeks < 12) {
    phaseLabel = `Woche ${weeks + 1} nach der OP`;
    phaseNote = "Übergang zur Normalkost beginnt. Kleine Portionen, langsam essen, gut kauen.";
  } else if (weeks < 26) {
    phaseLabel = `Monat ${Math.floor(total / 30) + 1} nach der OP`;
    phaseNote = "Körperwahrnehmung verändert sich weiter. Das Umfeld reagiert — das ist normal und geht vielen so.";
  } else {
    phaseLabel = `${Math.floor(total / 30)} Monate nach der OP`;
    phaseNote = "Langzeitphase: Substitution und Routinechecks bleiben wichtig.";
  }

  return (
    <div className="rounded-2xl bg-slate-900 text-white p-5 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-widest mb-1">
        <Clock className="w-3 h-3" />
        Ihre Phase
      </div>
      <div className="text-2xl font-bold">{phaseLabel}</div>
      <p className="text-sm text-slate-300 leading-relaxed mt-1">{phaseNote}</p>
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-slate-500 hover:text-slate-300 mt-2 text-left transition-colors"
      >
        OP-Datum ändern
      </button>
      {editing && (
        <div className="flex gap-2 items-center mt-2">
          <Input
            type="date"
            value={input || surgeryDate}
            onChange={(e) => setInput(e.target.value)}
            className="max-w-[180px] h-8 text-sm bg-slate-800 border-slate-600 text-white"
          />
          <Button
            size="sm"
            disabled={!input || updateProfile.isPending}
            onClick={() => {
              updateProfile.mutate(
                { data: { surgeryDate: input } },
                { onSuccess: () => setEditing(false) }
              );
            }}
          >
            Speichern
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setEditing(false)} className="text-slate-300">
            Abbrechen
          </Button>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { data: overview, isLoading } = useGetOverview();
  const { data: profile, isLoading: isLoadingProfile } = useGetProfile();

  const progressPercentage = overview?.totalRequirements
    ? Math.round((overview.completedRequirements / overview.totalRequirements) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">

      {/* HERO */}
      <section className="relative rounded-3xl overflow-hidden shadow-lg" style={{ minHeight: 260 }}>
        <img
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center top" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
        <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end h-full" style={{ minHeight: 260 }}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3 drop-shadow">
            Willkommen zurück
          </h1>
          <p className="text-white/75 text-base md:text-lg max-w-xl leading-relaxed">
            Hier sehen Sie, was Sie bisher dokumentiert haben — und wo Sie gerade stehen.
          </p>
        </div>
      </section>

      {/* PHASEN-INDIKATOR */}
      {!isLoadingProfile && (
        <PhaseIndicator surgeryDate={profile?.surgeryDate ?? null} />
      )}

      {/* STATISTIK-KARTEN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Anforderungen */}
        <Link href="/voraussetzungen">
          <Card className="relative overflow-hidden border shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full" />
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckSquare className="h-4 w-4 text-emerald-700" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Voraussetzungen</span>
              </div>
              {isLoading ? <Skeleton className="h-7 w-20 mb-2" /> : (
                <div className="text-2xl font-bold text-foreground mb-2">
                  {overview?.completedRequirements}
                  <span className="text-base text-muted-foreground font-normal"> / {overview?.totalRequirements}</span>
                </div>
              )}
              <Progress value={progressPercentage} className="h-1 mb-1" />
              <p className="text-xs text-muted-foreground text-right">{progressPercentage}%</p>
            </CardContent>
          </Card>
        </Link>

        {/* Termine */}
        <Link href="/termine">
          <Card className="relative overflow-hidden border shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="absolute top-0 right-0 w-16 h-16 bg-violet-50 rounded-bl-full" />
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-violet-700" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Nächste Termine</span>
              </div>
              {isLoading ? <Skeleton className="h-7 w-12" /> : (
                <div className="text-2xl font-bold text-foreground">{overview?.upcomingAppointments}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">geplant</p>
            </CardContent>
          </Card>
        </Link>

        {/* Gewicht */}
        <Link href="/gewicht">
          <Card className="relative overflow-hidden border shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="absolute top-0 right-0 w-16 h-16 bg-sky-50 rounded-bl-full" />
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-sky-700" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Aktuelles Gewicht</span>
              </div>
              {isLoading ? <Skeleton className="h-7 w-20" /> : (
                <div className="text-2xl font-bold text-foreground">
                  {overview?.latestWeight ? `${overview.latestWeight} kg` : "—"}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {overview?.startWeight && overview?.latestWeight ? (
                  <><TrendingDown className="h-3 w-3 text-emerald-600" /> {(overview.startWeight - overview.latestWeight).toFixed(1)} kg seit Start</>
                ) : "Noch kein Startgewicht"}
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Tagebuch */}
        <Link href="/tagebuch">
          <Card className="relative overflow-hidden border shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="absolute top-0 right-0 w-16 h-16 bg-rose-50 rounded-bl-full" />
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center">
                  <BookHeart className="h-4 w-4 text-rose-700" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Tagebücher</span>
              </div>
              {isLoading ? <Skeleton className="h-7 w-12" /> : (
                <div className="text-2xl font-bold text-foreground">{overview?.journalCount}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Einträge</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* ZWEI BILD-KARTEN UNTEN */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Zitat mit Foto */}
        <div className="rounded-3xl overflow-hidden shadow-md border-0 relative" style={{ minHeight: 220 }}>
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
          <div className="relative z-10 p-7 flex flex-col justify-end h-full" style={{ minHeight: 220 }}>
            <p className="text-white font-semibold text-lg leading-snug drop-shadow">
              "Dieser Weg ist keine Abkürzung.<br />Es ist ein anderer Weg — aber kein leichterer."
            </p>
            <p className="text-white/60 text-xs mt-2">
              Was viele Betroffene von ihrer Ernährungsberaterin gehört haben.
            </p>
          </div>
        </div>

        {/* Chat mit Foto */}
        <div className="rounded-3xl overflow-hidden shadow-md border-0 relative bg-gradient-to-br from-teal-600 via-emerald-600 to-green-700" style={{ minHeight: 220 }}>
          <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 right-8 w-36 h-36 bg-white/10 rounded-full translate-y-10" />
          <div className="absolute top-1/2 right-6 -translate-y-1/2 flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center shadow-lg backdrop-blur-sm">
              <MessageSquare className="w-10 h-10 text-white/80" />
            </div>
          </div>
          <div className="relative z-10 p-7 flex flex-col justify-end h-full" style={{ minHeight: 220 }}>
            <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2">Fragen zur OP?</p>
            <p className="text-white font-semibold text-lg leading-snug drop-shadow max-w-[60%]">
              Fragen stellen — jederzeit, ohne Wartezimmer.
            </p>
            <p className="text-white/60 text-xs mt-1 max-w-[60%]">Kein Ersatz für den Arzt — aber immer verfügbar.</p>
            <Link href="/chatbot">
              <button className="mt-3 text-sm text-white/80 hover:text-white flex items-center gap-1 transition-colors">
                Gespräch starten <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
