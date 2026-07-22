import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  ClipboardList, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Activity, 
  RefreshCw, 
  Stethoscope, 
  HeartPulse 
} from "lucide-react";
import { useGetLatestAssessment, useSubmitAssessment, getGetLatestAssessmentQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  ageYears: z.coerce.number().min(18, "Mindestalter ist 18").max(70, "Höchstalter ist 70"),
  heightCm: z.coerce.number().min(100, "Bitte gültige Größe angeben").max(250, "Bitte gültige Größe angeben"),
  weightKg: z.coerce.number().min(50, "Bitte gültiges Gewicht angeben").max(500, "Bitte gültiges Gewicht angeben"),
  
  hasDiabetes: z.boolean().default(false),
  hasHypertension: z.boolean().default(false),
  hasSleepApnea: z.boolean().default(false),
  hasJointPain: z.boolean().default(false),
  hasHeartDisease: z.boolean().default(false),
  hasReflux: z.boolean().default(false),
  noneOfAbove: z.boolean().default(false),

  previousAbdominalSurgery: z.boolean().default(false),
  previousWeightLossDuration: z.string().min(1, "Bitte auswählen"),
  
  motivationText: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EingangstestPage() {
  const queryClient = useQueryClient();
  const { data: latestAssessment, isLoading: isLoadingAssessment } = useGetLatestAssessment();
  const submitAssessment = useSubmitAssessment();
  
  const [step, setStep] = useState(1);
  const [showResult, setShowResult] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ageYears: undefined,
      heightCm: undefined,
      weightKg: undefined,
      hasDiabetes: false,
      hasHypertension: false,
      hasSleepApnea: false,
      hasJointPain: false,
      hasHeartDisease: false,
      hasReflux: false,
      noneOfAbove: false,
      previousAbdominalSurgery: false,
      previousWeightLossDuration: "",
      motivationText: "",
    },
  });

  const height = form.watch("heightCm");
  const weight = form.watch("weightKg");
  
  let bmi = 0;
  if (height && weight && height > 0) {
    bmi = weight / Math.pow(height / 100, 2);
  }

  const handleNextStep = async () => {
    let isValid = false;
    
    if (step === 1) {
      isValid = await form.trigger(["ageYears", "heightCm", "weightKg"]);
    } else if (step === 2) {
      isValid = true; // checkboxes
    } else if (step === 3) {
      isValid = await form.trigger(["previousWeightLossDuration"]);
    }
    
    if (isValid) {
      setStep(s => s + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setStep(s => Math.max(1, s - 1));
  };

  const onSubmit = (data: FormValues) => {
    submitAssessment.mutate({
      data: {
        ageYears: data.ageYears,
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        hasDiabetes: data.hasDiabetes,
        hasHypertension: data.hasHypertension,
        hasSleepApnea: data.hasSleepApnea,
        hasJointPain: data.hasJointPain,
        hasHeartDisease: data.hasHeartDisease,
        hasReflux: data.hasReflux,
        previousAbdominalSurgery: data.previousAbdominalSurgery,
        previousWeightLossDuration: data.previousWeightLossDuration,
        motivationText: data.motivationText || "",
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetLatestAssessmentQueryKey() });
        setShowResult(true);
        window.scrollTo(0, 0);
      }
    });
  };

  const startNewTest = () => {
    form.reset();
    setStep(1);
    setShowResult(false);
  };

  if (isLoadingAssessment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Eingangstest</h1>
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  // Show previous result or just submitted result
  if ((latestAssessment && !showResult && step === 1) || (showResult && latestAssessment)) {
    const result = latestAssessment;
    const isEligible = result.eligible;
    const isBorderline = result.recommendation === "grenzfall";
    
    let statusColor = "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    let statusIcon = <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />;
    
    if (isBorderline) {
      statusColor = "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
      statusIcon = <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />;
    } else if (!isEligible) {
      statusColor = "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      statusIcon = <Info className="h-6 w-6 text-red-600 dark:text-red-400" />;
    }

    const opName = result.recommendation === "schlauchmagen" ? "Schlauchmagen" : 
                   result.recommendation === "bypass" ? "Magen-Bypass" : "Individuelle Klärung nötig";

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Ihr Testergebnis</h1>
          </div>
          <Button variant="outline" onClick={startNewTest} data-testid="button-restart-test">
            <RefreshCw className="h-4 w-4 mr-2" />
            Neuen Test starten
          </Button>
        </div>

        <div className={`p-6 rounded-2xl border ${statusColor} flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm`}>
          <div className="p-4 bg-white/60 dark:bg-black/20 rounded-full shrink-0">
            {statusIcon}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">
              {isEligible ? "Wahrscheinlich geeignet" : isBorderline ? "Grenzfall - Ärztliche Klärung empfohlen" : "Wahrscheinlich nicht geeignet"}
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              {result.reasoning}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-primary/20 shadow-md">
            <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-primary">
                <Stethoscope className="h-5 w-5" />
                Empfohlenes Verfahren
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-foreground block mb-2">{opName}</span>
                {result.recommendation === "schlauchmagen" && result.strengthsSchlauchmagen && (
                  <p className="text-muted-foreground">{result.strengthsSchlauchmagen}</p>
                )}
                {result.recommendation === "bypass" && result.strengthsBypass && (
                  <p className="text-muted-foreground">{result.strengthsBypass}</p>
                )}
              </div>
              
              <div className="flex justify-center mt-6">
                <Link href="/beratung" data-testid="link-beratung">
                  <Button className="w-full md:w-auto" size="lg">
                    Verfahren vergleichen
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="h-5 w-5 text-muted-foreground" />
                Ihr Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <span className="font-medium">Ihr BMI</span>
                <span className="text-2xl font-bold text-primary">{result.bmi.toFixed(1)}</span>
              </div>
              
              <div>
                <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">Erfasste Risikofaktoren</h4>
                <div className="flex flex-wrap gap-2">
                  {result.hasDiabetes && <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Typ-2-Diabetes</Badge>}
                  {result.hasHypertension && <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">Bluthochdruck</Badge>}
                  {result.hasSleepApnea && <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">Schlafapnoe</Badge>}
                  {result.hasJointPain && <Badge variant="secondary">Gelenk-/Rückenschmerzen</Badge>}
                  {result.hasHeartDisease && <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Herzerkrankung</Badge>}
                  {result.hasReflux && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200">Reflux / Sodbrennen</Badge>}
                  
                  {!result.hasDiabetes && !result.hasHypertension && !result.hasSleepApnea && !result.hasJointPain && !result.hasHeartDisease && !result.hasReflux && (
                    <span className="text-muted-foreground text-sm">Keine erfasst</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const stepsCount = 4;
  const progress = (step / stepsCount) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-primary" />
          Eingangstest
        </h1>
        <p className="text-muted-foreground text-lg">
          Finden Sie in wenigen Minuten heraus, ob eine Operation für Sie in Frage kommt und welches Verfahren am besten passen könnte.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-primary">Schritt {step} von {stepsCount}</span>
          <span className="text-muted-foreground">
            {step === 1 && "Körperdaten"}
            {step === 2 && "Begleiterkrankungen"}
            {step === 3 && "Vorgeschichte"}
            {step === 4 && "Motivation"}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-lg border-primary/10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="pt-6">
              
              {/* Step 1: Körperdaten */}
              {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="ageYears"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Alter (Jahre)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="z.B. 35" {...field} value={field.value || ''} data-testid="input-age" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="heightCm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Körpergröße (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="z.B. 175" {...field} value={field.value || ''} data-testid="input-height" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weightKg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Aktuelles Gewicht (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="z.B. 120" {...field} value={field.value || ''} data-testid="input-weight" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {bmi > 0 && (
                    <Alert className="bg-primary/5 border-primary/20 mt-4">
                      <Activity className="h-4 w-4 text-primary" />
                      <AlertTitle className="text-primary font-semibold">Ihr berechneter BMI: {bmi.toFixed(1)}</AlertTitle>
                      <AlertDescription>
                        {bmi < 35 ? "Ein BMI unter 35 reicht meist nicht für eine Kostenübernahme." : 
                         bmi < 40 ? "Ein BMI zwischen 35 und 40 kann mit Begleiterkrankungen eine Indikation sein." : 
                         "Ein BMI über 40 ist in der Regel eine klare Indikation für eine Operation."}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Step 2: Begleiterkrankungen */}
              {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Leiden Sie an einer der folgenden Erkrankungen?</h3>
                    <p className="text-sm text-muted-foreground">Mehrfachauswahl möglich. Diese Informationen sind wichtig für die Wahl des richtigen Operationsverfahrens.</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="hasDiabetes"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (checked) form.setValue("noneOfAbove", false);
                              }}
                              data-testid="checkbox-diabetes"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium cursor-pointer">Typ-2-Diabetes</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hasHypertension"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (checked) form.setValue("noneOfAbove", false);
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium cursor-pointer">Bluthochdruck</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasSleepApnea"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (checked) form.setValue("noneOfAbove", false);
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium cursor-pointer">Schlafapnoe</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasJointPain"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (checked) form.setValue("noneOfAbove", false);
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium cursor-pointer">Gelenk- oder Rückenschmerzen</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasHeartDisease"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (checked) form.setValue("noneOfAbove", false);
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium cursor-pointer">Herzerkrankung</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasReflux"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-200/50">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (checked) form.setValue("noneOfAbove", false);
                              }}
                              data-testid="checkbox-reflux"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium cursor-pointer text-yellow-900 dark:text-yellow-500">Reflux / Sodbrennen</FormLabel>
                            <FormDescription className="text-xs">Wichtig für die Verfahrenswahl</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6 border-t pt-6">
                    <FormField
                      control={form.control}
                      name="noneOfAbove"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (checked) {
                                  form.setValue("hasDiabetes", false);
                                  form.setValue("hasHypertension", false);
                                  form.setValue("hasSleepApnea", false);
                                  form.setValue("hasJointPain", false);
                                  form.setValue("hasHeartDisease", false);
                                  form.setValue("hasReflux", false);
                                }
                              }}
                              data-testid="checkbox-none"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium cursor-pointer text-muted-foreground">Keine der genannten</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Vorgeschichte */}
              {step === 3 && (
                <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                  <FormField
                    control={form.control}
                    name="previousAbdominalSurgery"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-6 shadow-sm">
                        <div className="space-y-1.5 max-w-[70%]">
                          <FormLabel className="text-base">Haben Sie frühere Bauchoperationen gehabt?</FormLabel>
                          <FormDescription>
                            Dazu zählen z.B. Blinddarm, Gallenblase, Kaiserschnitt oder andere Eingriffe im Bauchraum.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-surgery"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="previousWeightLossDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Wie lange versuchen Sie bereits, ernsthaft abzunehmen?</FormLabel>
                        <FormDescription className="mb-3">
                          Für die Kassenübernahme sind in der Regel Diätversuche über einen längeren Zeitraum relevant.
                        </FormDescription>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12" data-testid="select-duration">
                              <SelectValue placeholder="Bitte wählen Sie einen Zeitraum" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="unter1Jahr">Weniger als 1 Jahr</SelectItem>
                            <SelectItem value="1bis5Jahre">1 bis 5 Jahre</SelectItem>
                            <SelectItem value="ueber5Jahre">Mehr als 5 Jahre</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 4: Motivation */}
              {step === 4 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                  <div className="bg-primary/5 p-4 rounded-xl flex items-start gap-3 mb-6 border border-primary/10">
                    <HeartPulse className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-primary">Fast geschafft!</h4>
                      <p className="text-sm text-primary/80 mt-1">
                        Wir werten Ihre Angaben gleich aus. Verraten Sie uns zum Schluss noch kurz Ihre persönlichen Ziele.
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="motivationText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Was motiviert Sie zu dieser Operation?</FormLabel>
                        <FormDescription>
                          Was erhoffen Sie sich? (Optional)
                        </FormDescription>
                        <FormControl>
                          <Textarea 
                            placeholder="z.B. Ich möchte wieder mit meinen Kindern spielen können, ohne aus der Puste zu sein..." 
                            className="min-h-[120px] resize-none"
                            {...field} 
                            data-testid="textarea-motivation"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

            </CardContent>
            
            <CardFooter className="flex justify-between border-t bg-muted/20 p-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePrevStep}
                disabled={step === 1 || submitAssessment.isPending}
                data-testid="button-prev"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück
              </Button>
              
              {step < stepsCount ? (
                <Button 
                  type="button" 
                  onClick={handleNextStep}
                  data-testid="button-next"
                >
                  Weiter
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={submitAssessment.isPending}
                  data-testid="button-submit"
                >
                  {submitAssessment.isPending ? "Wird ausgewertet..." : "Auswertung anzeigen"}
                  {!submitAssessment.isPending && <CheckCircle2 className="h-4 w-4 ml-2" />}
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
