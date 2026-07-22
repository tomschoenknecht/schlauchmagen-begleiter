import { Link } from "wouter";
import { ChevronLeft, Info, CheckCircle2, AlertTriangle, Scale, Clock, ActivitySquare, Syringe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BeratungBypassPage() {
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
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">Roux-en-Y Gastric Bypass</Badge>
          <Badge variant="outline">Goldstandard</Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Der Magen-Bypass im Detail
        </h1>
        <p className="text-xl text-muted-foreground">
          Das bewährteste Verfahren mit dem stärksten Gewichtsverlust. Es kombiniert eine Magenverkleinerung mit einer Umleitung des Darms.
        </p>
      </div>

      {/* Section 1: Wie funktioniert es? */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
          <Syringe className="h-6 w-6 text-blue-600" /> Wie funktioniert es?
        </h2>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6">
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span> Ein kleiner Magenpouch (ca. 30 ml) wird erstellt und vom restlichen Magen getrennt.</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span> Der Dünndarm wird umgeleitet: der Pouch wird direkt mit dem Jejunum verbunden (Roux-en-Y).</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span> Der restliche Magen und der Zwölffingerdarm werden umgangen — Nahrung gelangt nicht mehr durch sie.</li>
              <li className="flex items-start gap-2 font-medium text-foreground"><span className="text-blue-500 mt-0.5">•</span> Doppelter Wirkmechanismus: Restriktion (kleiner Pouch) + Malabsorption (Darmumleitung).</li>
            </ul>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-muted/30 p-4 rounded-lg flex flex-col items-center text-center">
                <Clock className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm text-muted-foreground">Operationsdauer</span>
                <span className="font-semibold">2–3 Stunden</span>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg flex flex-col items-center text-center">
                <ActivitySquare className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm text-muted-foreground">Klinikaufenthalt</span>
                <span className="font-semibold">4–7 Tage</span>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg flex flex-col items-center text-center">
                <Scale className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm text-muted-foreground">Arbeitsfähigkeit</span>
                <span className="font-semibold">3–6 Wochen</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 2: Gewichtsverlust */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b pb-2">Gewichtsverlust</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50/50 border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-blue-800">Nach 1 Jahr</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-1">70–80%</div>
              <p className="text-xs text-blue-700/80">Verlust des Übergewichts</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50/50 border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-blue-800">Nach 2 Jahren</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-1">75–85%</div>
              <p className="text-xs text-blue-700/80">Verlust des Übergewichts</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50/50 border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-blue-800">Langfristig</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-1">65–75%</div>
              <p className="text-xs text-blue-700/80">Stärkster Gewichtsverlust</p>
            </CardContent>
          </Card>
        </div>
        <Card className="border-l-4 border-l-blue-500 bg-blue-50/30">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-800 mb-1">Typ-2-Diabetes-Remission</h4>
            <p className="text-sm text-muted-foreground">
              Bis zu 80% der Patienten benötigen nach der OP keine Diabetes-Medikamente mehr. Diese Verbesserung tritt oft schon Tage nach der Operation ein, bevor der eigentliche Gewichtsverlust beginnt.
            </p>
          </CardContent>
        </Card>
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
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Stärkster und nachhaltigster Gewichtsverlust aller Verfahren.</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Sehr hohe Remissionsrate bei Typ-2-Diabetes.</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Verbessert oder heilt Reflux/Sodbrennen in der Regel komplett.</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Sehr effektiv bei Metabolischem Syndrom (Bluthochdruck, Schlafapnoe).</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Bewährtestes bariatrisches Verfahren weltweit (seit Jahrzehnten etabliert).</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Besonders geeignet bei sehr hohem BMI (&gt; 50).</li>
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
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">⚠</span> 
                  <span><strong>Vitaminmangel:</strong> Lebenslange Substitution ZWINGEND. Ohne drohen ernste Mangelzustände.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">⚠</span> 
                  <span><strong>Dumping-Syndrom:</strong> Übelkeit, Schwindel nach süßem/fettigem Essen durch schnellen Nahrungsübertritt in den Darm. Durch Ernährung vermeidbar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">⚠</span> 
                  <span><strong>Innere Hernien:</strong> Darmschlingen können durch Öffnungen gleiten (~2–3%).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">⚠</span> 
                  <span><strong>Anastomosen-Leckage:</strong> Undichtigkeit an den Nähten (~1–2%).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">⚠</span> 
                  <span><strong>Magengeschwüre (Ulcera):</strong> An der Verbindungsstelle möglich (Rauchverzicht wichtig!).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">⚠</span> 
                  <span><strong>Hypoglykämie:</strong> Zu starke Blutzuckersenkung (v.a. bei vorherigem Diabetes).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">⚠</span> 
                  <span><strong>Technisch komplex:</strong> Schwerer rückgängig zu machen als der Schlauchmagen.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>

    </div>
  );
}
