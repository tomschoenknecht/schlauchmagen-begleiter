import { Link } from "wouter";
import { ChevronLeft, ShieldAlert, Heart, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BeratungRisikenPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground mb-4">
        <Link href="/beratung" className="hover:text-primary transition-colors flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Zurück zur Übersicht
        </Link>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-orange-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Risiken & Chancen
        </h1>
        <p className="text-xl text-muted-foreground">
          Bariatrische Operationen sind sichere Eingriffe. Dennoch ist eine realistische Abwägung der Operationsrisiken gegenüber den enormen gesundheitlichen Chancen entscheidend.
        </p>
      </div>

      {/* Section 1: Sicherheit */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b pb-2">Warum die Chirurgie sicher ist</h2>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" /> Beide Operationen gelten bei erfahrenen Zentren als sehr sicher.</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" /> Die perioperative Mortalität liegt bei &lt; 0,1–0,3% und ist damit vergleichbar mit einer Gallenblasenentfernung.</li>
              <li className="flex items-start gap-2 font-medium text-foreground"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" /> Wichtig: Das Risiko OHNE Operation (Diabetes-Folgen, Herzinfarkt, Gelenkschäden, Krebsrisiko durch Adipositas) ist langfristig deutlich höher.</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" /> Zertifizierte bariatrische Zentren (DGAV) haben nachweislich die niedrigsten Komplikationsraten.</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Section 2: Allgemeine Risiken */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
          <AlertTriangle className="h-6 w-6 text-muted-foreground" /> Allgemeine Operationsrisiken
        </h2>
        <p className="text-muted-foreground mb-4">Diese Risiken gelten für beide Verfahren und für Bauchoperationen im Allgemeinen:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full text-red-600"><AlertTriangle className="h-4 w-4" /></div>
              <div>
                <h4 className="font-semibold">Thrombose / Embolie</h4>
                <p className="text-xs text-muted-foreground">Erhöhtes Risiko bei Adipositas (Blutverdünner obligat)</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full text-red-600"><AlertTriangle className="h-4 w-4" /></div>
              <div>
                <h4 className="font-semibold">Narkosekomplikationen</h4>
                <p className="text-xs text-muted-foreground">Durch moderne Anästhesie heute sehr selten</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full text-red-600"><AlertTriangle className="h-4 w-4" /></div>
              <div>
                <h4 className="font-semibold">Wundheilungsstörungen</h4>
                <p className="text-xs text-muted-foreground">Oder Wundinfektionen im Bereich der kleinen Schnitte</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full text-red-600"><AlertTriangle className="h-4 w-4" /></div>
              <div>
                <h4 className="font-semibold">Pneumonie (Lungenentzündung)</h4>
                <p className="text-xs text-muted-foreground">Erhöhtes Risiko vor allem bei Rauchern</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 3 & 4: Spezifische Risiken */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <Card className="border-teal-200 shadow-md">
          <CardHeader className="bg-teal-50/50 pb-4">
            <CardTitle className="text-xl">Spezifische Risiken: Schlauchmagen</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="p-4">
                <h4 className="font-semibold text-sm mb-1">Leckage der Nahtlinie (1–3%)</h4>
                <p className="text-sm text-muted-foreground">Kann lebensbedrohlich sein und erfordert sofortige Behandlung.</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-sm mb-1">Neu auftretender Reflux</h4>
                <p className="text-sm text-muted-foreground">Bis zu 20% der Patienten leiden nach 5 Jahren unter Sodbrennen.</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-sm mb-1">Gewichtswiederzunahme</h4>
                <p className="text-sm text-muted-foreground">Bis zu 30% nehmen mittelfristig Gewicht wieder zu (ohne Lebensstiländerung).</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-sm mb-1">Stenose (Verengung)</h4>
                <p className="text-sm text-muted-foreground">&lt; 1%, meist gut behandelbar durch endoskopische Dehnung.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-md">
          <CardHeader className="bg-blue-50/50 pb-4">
            <CardTitle className="text-xl">Spezifische Risiken: Bypass</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="p-4">
                <h4 className="font-semibold text-sm mb-1 text-orange-600">Vitaminmangel</h4>
                <p className="text-sm text-muted-foreground">Schwerwiegend ohne Substitution (Polyneuropathie, Anämie, Osteoporose).</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-sm mb-1">Dumping-Syndrom (bis 20%)</h4>
                <p className="text-sm text-muted-foreground">Meist mild, vermeidbar durch angepasste Ernährung (wenig Zucker/Fett).</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-sm mb-1">Innere Hernien (2–3%)</h4>
                <p className="text-sm text-muted-foreground">Lebenszeitrisiko (auch Jahre nach der OP), erfordert oft Reoperation.</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-sm mb-1">Anastomosen-Ulcus (1–4%)</h4>
                <p className="text-sm text-muted-foreground">Magengeschwür, häufiger bei Rauchern und Schmerzmittel-Einnahme.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 5: Chancen */}
      <section className="space-y-4 pt-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
          <Heart className="h-6 w-6 text-red-500" /> Die Chancen & Langzeiteffekte
        </h2>
        <Card className="border-border/60 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 w-full"></div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-600" /> Gewichtsverlust
                </h4>
                <p className="text-sm text-muted-foreground">Dauerhafter Verlust von durchschnittlich 60–80% des Übergewichts.</p>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-1">
                  <Heart className="h-4 w-4 text-green-600" /> Lebenserwartung
                </h4>
                <p className="text-sm text-muted-foreground">Studien zeigen eine um bis zu 30–40% reduzierte Gesamtmortalität gegenüber unbehandelter Adipositas.</p>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-1">
                  <span className="text-green-600 font-bold">»</span> Typ-2-Diabetes
                </h4>
                <p className="text-sm text-muted-foreground">Remission bei 60–80% (Bypass) bzw. 50–60% (Schlauchmagen) der Patienten.</p>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-1">
                  <span className="text-green-600 font-bold">»</span> Bluthochdruck & Schlafapnoe
                </h4>
                <p className="text-sm text-muted-foreground">Verbesserung/Remission bei &gt; 60% (Bluthochdruck) bzw. &gt; 80% (Schlafapnoe).</p>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-1">
                  <span className="text-green-600 font-bold">»</span> Gelenkschmerzen
                </h4>
                <p className="text-sm text-muted-foreground">Deutliche Reduktion und mehr Mobilität bei fast allen Patienten.</p>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-1">
                  <span className="text-green-600 font-bold">»</span> Lebensqualität
                </h4>
                <p className="text-sm text-muted-foreground">Signifikante physische und oft psychische Verbesserung (Depressionen erfordern dennoch Nachsorge).</p>
              </div>

            </div>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}
