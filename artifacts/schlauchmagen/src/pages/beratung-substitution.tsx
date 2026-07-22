import { Link } from "wouter";
import { ChevronLeft, Pill, AlertCircle, Check, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BeratungSubstitutionPage() {
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
          <Pill className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Nahrungsergänzung & Substitution
        </h1>
      </div>

      <Alert className="bg-red-50 border-red-200 text-red-900 shadow-sm">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <AlertTitle className="text-red-800 font-bold">WICHTIGER HINWEIS: Auch beim Schlauchmagen!</AlertTitle>
        <AlertDescription className="mt-2 text-red-800/90">
          Ein weit verbreiteter Irrtum: Auch nach dem Schlauchmagen ist eine lebenslange Vitaminsubstitution wichtig — nicht optional! Zwar ist der Bedarf geringer als beim Bypass, aber durch das stark reduzierte Magenvolumen wird deutlich weniger Nahrung aufgenommen. Ohne Substitution drohen langfristig Mangelzustände.
        </AlertDescription>
      </Alert>

      {/* Section 1: Warum? */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b pb-2">Warum brauche ich Nahrungsergänzungsmittel?</h2>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6">
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-purple-500 mt-0.5">•</span> <strong>Reduziertes Magenvolumen:</strong> Sie nehmen deutlich weniger Nahrung und damit Vitamine auf.</li>
              <li className="flex items-start gap-2"><span className="text-purple-500 mt-0.5">•</span> <strong>Malabsorption (beim Bypass):</strong> Durch die Darmumleitung können Nährstoffe schlechter in den Körper aufgenommen werden.</li>
              <li className="flex items-start gap-2"><span className="text-purple-500 mt-0.5">•</span> <strong>Intrinsic Factor:</strong> Wird im Magen produziert und ist nötig für die B12-Aufnahme — beim Bypass ist dies stark reduziert.</li>
              <li className="flex items-start gap-2 font-medium text-foreground"><span className="text-red-500 mt-0.5">⚠</span> <strong>Folgen ohne Substitution:</strong> Anämie (Blutarmut), Knochenschwund, Nervenschäden, Haarausfall, chronische Müdigkeit.</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Section 2: Schlauchmagen */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-xl font-bold">Nach Schlauchmagen</h2>
            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">Dringend empfohlen</Badge>
          </div>
          <div className="space-y-3">
            <SupplementCard 
              title="Multivitamin (bariatrisch)" 
              desc="Täglich, dauerhaft. Enthält erhöhte Mengen aller wichtigen Vitamine." 
            />
            <SupplementCard 
              title="Vitamin D3 + Kalzium" 
              desc="Täglich 1000–1500 mg Kalzium (aufgeteilt, nicht zusammen einnehmen) + mind. 1000 IE Vitamin D3. Wichtig für Knochen." 
            />
            <SupplementCard 
              title="Vitamin B12" 
              desc="Monatlich intramuskulär ODER täglich sublingual (unter die Zunge). B12 wird im Magen aktiviert." 
            />
            <SupplementCard 
              title="Eisen" 
              desc="Besonders für Frauen. 45–60 mg täglich, getrennt von Kalzium einnehmen." 
            />
            <SupplementCard 
              title="Folsäure & Zink" 
              desc="Folsäure wichtig für Frauen im gebärfähigen Alter. Zink unterstützt Wundheilung und Haarwuchs." 
            />
          </div>
        </section>

        {/* Section 3: Bypass */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-xl font-bold">Nach Magen-Bypass</h2>
            <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Lebenslang Pflicht</Badge>
          </div>
          <div className="space-y-3">
            <SupplementCard 
              title="Multivitamin (bariatrisch)" 
              desc="Mindestens 2x täglich (höher dosiert als beim Schlauchmagen)." 
              isPflicht 
            />
            <SupplementCard 
              title="Vitamin D3 + Kalzium" 
              desc="1500–2000 mg Kalzium täglich (Kalziumcitrat bevorzugt — wird ohne Magensäure besser aufgenommen als Carbonat)." 
              isPflicht 
            />
            <SupplementCard 
              title="Vitamin B12" 
              desc="Monatlich intramuskulär empfohlen. B12-Mangel ist die häufigste Komplikation nach Bypass." 
              isPflicht 
            />
            <SupplementCard 
              title="Eisen & Thiamin (B1)" 
              desc="Eisen: 45–60 mg täglich, ggf. i.v.-Gabe. Thiamin ist v.a. in den ersten Wochen kritisch (Nervenschäden)." 
              isPflicht 
            />
            <SupplementCard 
              title="Folsäure & Zink" 
              desc="Folsäure: 400–800 µg täglich. Zink: 8–22 mg täglich." 
              isPflicht 
            />
          </div>
        </section>
      </div>

      {/* Section 4 & 5: Kontrollen & Kosten */}
      <section className="space-y-4 pt-6">
        <h2 className="text-2xl font-bold border-b pb-2">Laborkontrollen & Hinweise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Regelmäßige Laborkontrollen</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Nach 3, 6 und 12 Monaten: Großes Blutbild, Vitamine, Mineralstoffe, Ferritin, B12, Vitamin D.</p>
              <p className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Danach: Jährlich, lebenslang.</p>
              <p className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Der Hausarzt oder Ihr Nachsorgezentrum koordiniert diese Kontrollen.</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" /> Kosten & Tipps
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• <strong>Kosten:</strong> Bariatrische Multivitamin-Präparate kosten ca. 30–80 € pro Monat.</p>
              <p>• <strong>Krankenkasse:</strong> Übernimmt in der Regel nur die Laborkosten, nicht die Supplemente selbst.</p>
              <p>• <strong>Präparate:</strong> Fachgesellschaften empfehlen keine Standard-Drogerie-Vitamine, sondern spezielle bariatrische Formeln (z.B. Bariatric Advantage, Optisource).</p>
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  );
}

function SupplementCard({ title, desc, isPflicht = false }: { title: string, desc: string, isPflicht?: boolean }) {
  return (
    <div className={`p-4 rounded-lg border ${isPflicht ? 'border-red-100 bg-red-50/10' : 'border-border bg-card'}`}>
      <h4 className="font-semibold flex items-center justify-between mb-1">
        {title}
      </h4>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
