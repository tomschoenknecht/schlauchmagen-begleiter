import { Link } from "wouter";
import { ChevronLeft, Info, CheckCircle2, AlertTriangle, Scale, Clock, ActivitySquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BeratungSchlauchmagenPage() {
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
          <Badge variant="secondary" className="bg-teal-100 text-teal-800">Sleeve Gastrectomy</Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Der Schlauchmagen im Detail
        </h1>
        <p className="text-xl text-muted-foreground">
          Eines der weltweit am häufigsten durchgeführten bariatrischen Verfahren. Erfahren Sie alles über Funktionsweise, Gewichtsverlust und das Leben danach.
        </p>
      </div>

      {/* Section 1: Wie funktioniert es? */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
          <Info className="h-6 w-6 text-primary" /> Wie funktioniert es?
        </h2>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6">
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Ca. 70–80% des Magens wird laparoskopisch (Schlüsselloch-Technik) entfernt.</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Der verbleibende, röhrenförmige Restmagen fasst nur noch ca. 100–150 ml.</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Der Magenausgang (Pylorus) bleibt erhalten — dadurch entsteht eine natürliche Magenentleerung.</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Kein Fremdmaterial, keine Umleitung des Darms.</li>
              <li className="flex items-start gap-2 font-medium text-foreground"><span className="text-primary mt-0.5">•</span> Wichtig: Es handelt sich um einen irreversiblen Eingriff.</li>
            </ul>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-muted/30 p-4 rounded-lg flex flex-col items-center text-center">
                <Clock className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm text-muted-foreground">Operationsdauer</span>
                <span className="font-semibold">60–90 Minuten</span>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg flex flex-col items-center text-center">
                <ActivitySquare className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm text-muted-foreground">Klinikaufenthalt</span>
                <span className="font-semibold">3–5 Tage</span>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg flex flex-col items-center text-center">
                <Scale className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm text-muted-foreground">Arbeitsfähigkeit</span>
                <span className="font-semibold">2–6 Wochen</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 2: Gewichtsverlust */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b pb-2">Gewichtsverlust — was kann ich erwarten?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-teal-50/50 border-teal-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-teal-800">Nach 1 Jahr</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal-600 mb-1">60–70%</div>
              <p className="text-xs text-teal-700/80">Verlust des Übergewichts (EWL)</p>
            </CardContent>
          </Card>
          <Card className="bg-teal-50/50 border-teal-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-teal-800">Nach 2 Jahren</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal-600 mb-1">65–75%</div>
              <p className="text-xs text-teal-700/80">Verlust des Übergewichts (EWL)</p>
            </CardContent>
          </Card>
          <Card className="bg-teal-50/50 border-teal-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-teal-800">Langfristig (5+ J.)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal-600 mb-1">55–65%</div>
              <p className="text-xs text-teal-700/80">Mit gesunder Lebensführung</p>
            </CardContent>
          </Card>
        </div>
        <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
          <strong>Erklärung:</strong> EWL (Excess Weight Loss) bezeichnet den prozentualen Verlust des <em>Übergewichts</em>, nicht des Gesamtgewichts. Ergebnisse variieren stark je nach Ernährung, Bewegung und regelmäßiger Nachsorge.
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 3: Vorteile */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" /> Vorteile
          </h2>
          <Card className="h-full border-border/60 shadow-sm">
            <CardContent className="p-6">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Technisch einfacherer Eingriff als der Bypass.</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Natürliche Verdauung bleibt vollständig erhalten.</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Starke Reduktion des Hungerhormons Ghrelin (produziert im entfernten Magenanteil) → deutlich weniger Hunger.</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Kein erhöhtes Risiko für Nährstoffmangel durch Malabsorption (im Vergleich zum Bypass).</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Kann bei Bedarf zu einem Magen-Bypass konvertiert werden.</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Geringere Komplikationsrate als der Bypass.</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Kein Dumping-Syndrom.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Section 4: Risiken */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
            <AlertTriangle className="h-6 w-6 text-orange-500" /> Risiken
          </h2>
          <Card className="h-full border-border/60 shadow-sm">
            <CardContent className="p-6">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">⚠</span> <strong>Undichtigkeit (Leckage):</strong> Selten, aber ernst (~1–3%) an der Nahtreihe — erfordert ggf. Reoperation.</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">⚠</span> <strong>Reflux / Sodbrennen:</strong> Kann neu entstehen oder sich verschlimmern — bei vorhandenem starkem Reflux ist der Bypass vorzuziehen.</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">⚠</span> <strong>Magenenge (Stenose):</strong> Selten, kann durch Endoskopie behandelt werden.</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">⚠</span> <strong>Gewichtswiederzunahme:</strong> Möglich bei unveränderten Essgewohnheiten (kein Ersatz für Lebensstiländerung).</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">⚠</span> <strong>Allgemeine OP-Risiken:</strong> Thrombose, Embolie, Narkosekomplikationen.</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">⚠</span> <strong>Haarausfall:</strong> In den ersten 3–6 Monaten möglich (vorübergehend).</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Section 5: Leben danach */}
      <section className="space-y-4 pt-4">
        <h2 className="text-2xl font-bold border-b pb-2">Leben nach der Operation</h2>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-3">Ernährung</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> <strong>Kostaufbau:</strong> Flüssig → Püriert → Weich → Normal (über 4–6 Wochen).</li>
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> <strong>Mahlzeiten:</strong> Klein und häufig (5–6 kleine Mahlzeiten täglich).</li>
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> <strong>Trinkregel:</strong> Niemals trinken beim Essen, da das Magenvolumen zu gering ist.</li>
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> <strong>Getränke:</strong> Keine Kohlensäure (kann den Restmagen dehnen).</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Nachsorge</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> <strong>Termine:</strong> Regelmäßige Kontrollen nach 3, 6, 12 Monaten, danach jährlich.</li>
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> <strong>Unterstützung:</strong> Langfristige Ernährungsberatung, Bewegung und psychologische Begleitung empfohlen.</li>
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> <strong>Vitamine:</strong> Substitution von Vitaminen ist wichtig. <Link href="/beratung/substitution" className="text-primary hover:underline">Mehr dazu</Link>.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}
