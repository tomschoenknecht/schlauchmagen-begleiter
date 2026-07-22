import { Link } from "wouter";
import { useGetLatestAssessment } from "@workspace/api-client-react";
import { 
  Stethoscope, 
  ChevronRight, 
  AlertTriangle, 
  HeartPulse,
  Syringe,
  Pill,
  ArrowRight,
  ShieldAlert,
  Info
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function BeratungPage() {
  const { data: latestAssessment, isLoading } = useGetLatestAssessment();

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Stethoscope className="h-8 w-8 text-primary" />
          Beratung & Verfahren
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Informieren Sie sich umfassend über die verschiedenen bariatrischen Operationen, 
          deren Risiken und die lebenslange Nachsorge.
        </p>
      </div>

      {/* Section 1: Personalisierte Empfehlung (Kompakt) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Personalisierte Empfehlung</h2>
        
        {isLoading ? (
          <Skeleton className="h-32 w-full rounded-xl" />
        ) : latestAssessment ? (
          <Card className={`border-l-4 shadow-sm ${
            latestAssessment.recommendation === "schlauchmagen" || latestAssessment.recommendation === "bypass" 
            ? "border-l-primary" : "border-l-yellow-500"
          }`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="font-medium text-primary uppercase tracking-wider text-xs">
                  Ergebnis Ihres Eingangstests
                </CardDescription>
                <Link href="/eingangstest">
                  <Button variant="ghost" size="sm" className="h-8 text-xs">Test wiederholen <RefreshIcon className="h-3 w-3 ml-2" /></Button>
                </Link>
              </div>
              <CardTitle className="text-xl">
                {latestAssessment.recommendation === "schlauchmagen" && "Schlauchmagen empfohlen"}
                {latestAssessment.recommendation === "bypass" && "Magen-Bypass empfohlen"}
                {latestAssessment.recommendation === "grenzfall" && "Individuelle Abklärung erforderlich"}
                {latestAssessment.recommendation === "nichtEligible" && "Derzeit keine klare OP-Indikation"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{latestAssessment.reasoning}</p>
              <div className="flex flex-wrap gap-2">
                {latestAssessment.hasReflux && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200 text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Reflux
                  </Badge>
                )}
                {latestAssessment.hasDiabetes && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 text-xs">
                    <HeartPulse className="h-3 w-3 mr-1" /> Diabetes
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-primary/5 border-primary/20 shadow-sm">
            <CardContent className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-1 text-foreground">Welches Verfahren passt zu Ihnen?</h3>
                <p className="text-sm text-muted-foreground">
                  Machen Sie unseren Test für eine erste Einschätzung.
                </p>
              </div>
              <Link href="/eingangstest" className="shrink-0 w-full md:w-auto">
                <Button>
                  Eingangstest starten
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Section 2: Detailbereiche (Grid) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Informationsbereiche</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <Card className="flex flex-col h-full hover:border-primary/40 transition-colors shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <Info className="h-5 w-5 text-teal-600" />
                <CardTitle className="text-lg">Schlauchmagen</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                Erfahren Sie alles über die Schlauchmagen-OP (Sleeve Gastrectomy). 
                Wie der Eingriff funktioniert, welchen Gewichtsverlust Sie erwarten können, 
                sowie spezifische Vor- und Nachteile.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/beratung/schlauchmagen" className="w-full">
                <Button variant="outline" className="w-full justify-between" data-testid="link-schlauchmagen">
                  Mehr erfahren <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full hover:border-primary/40 transition-colors shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <Syringe className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Magen-Bypass</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                Der "Goldstandard" der bariatrischen Chirurgie. Informationen zur 
                Wirkungsweise (Restriktion & Malabsorption), Diabetes-Remission und 
                wichtigen Besonderheiten wie dem Dumping-Syndrom.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/beratung/bypass" className="w-full">
                <Button variant="outline" className="w-full justify-between" data-testid="link-bypass">
                  Mehr erfahren <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full hover:border-primary/40 transition-colors shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="h-5 w-5 text-orange-500" />
                <CardTitle className="text-lg">Risiken & Chancen</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                Eine ehrliche Gegenüberstellung: Operationsrisiken, mögliche Komplikationen 
                wie Leckagen oder Reflux im Vergleich zu den enormen Chancen für 
                Lebensqualität und Gesundheit.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/beratung/risiken" className="w-full">
                <Button variant="outline" className="w-full justify-between" data-testid="link-risiken">
                  Mehr erfahren <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full hover:border-primary/40 transition-colors shadow-sm bg-muted/10 border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <Pill className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg">Substitution</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                Nahrungsergänzungsmittel nach der OP. Welche Vitamine Sie brauchen, 
                Dosierungen und Laborkontrollen.
              </p>
              <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">
                Wichtig: Auch für Schlauchmagen!
              </Badge>
            </CardContent>
            <CardFooter>
              <Link href="/beratung/substitution" className="w-full">
                <Button variant="default" className="w-full justify-between" data-testid="link-substitution">
                  Mehr erfahren <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

        </div>
      </section>

      {/* Section 3: Kurze FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Häufigste Fragen</h2>
        
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="px-6">
                <AccordionTrigger className="text-sm font-semibold">Welche Operation ist sicherer?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">
                  Beide gelten heutzutage als sehr sichere Routineeingriffe. Der Schlauchmagen ist technisch einfacher, der Bypass hat dafür andere langfristige Vorteile. Details unter <Link href="/beratung/risiken" className="text-primary hover:underline">Risiken & Chancen</Link>.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="px-6">
                <AccordionTrigger className="text-sm font-semibold flex gap-2 items-center">
                  <Pill className="h-4 w-4 text-primary" /> Muss ich lebenslang Vitamine nehmen?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">
                  Ja. Sowohl beim Bypass (zwingend) als auch beim Schlauchmagen (dringend empfohlen) benötigen Sie spezielle Präparate. Details unter <Link href="/beratung/substitution" className="text-primary hover:underline">Substitution</Link>.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="px-6 border-b-0">
                <AccordionTrigger className="text-sm font-semibold">Kann ich nach dem Schlauchmagen zum Bypass wechseln?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">
                  Ja. Wenn der Schlauchmagen nicht den gewünschten Erfolg bringt oder zu schwerem Reflux führt, kann er in einer zweiten Operation zu einem Magen-Bypass umgebaut werden.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </section>

      {/* Schnelllinks */}
      <div className="flex flex-wrap gap-3 pt-4 border-t">
        <span className="text-sm text-muted-foreground py-1">Direkt zu:</span>
        <Link href="/beratung/schlauchmagen" className="text-sm text-primary hover:underline py-1">Schlauchmagen</Link>
        <Link href="/beratung/bypass" className="text-sm text-primary hover:underline py-1">Magen-Bypass</Link>
        <Link href="/beratung/risiken" className="text-sm text-primary hover:underline py-1">Risiken & Chancen</Link>
        <Link href="/beratung/substitution" className="text-sm text-primary hover:underline py-1">Substitution</Link>
      </div>

    </div>
  );
}

function RefreshIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}
