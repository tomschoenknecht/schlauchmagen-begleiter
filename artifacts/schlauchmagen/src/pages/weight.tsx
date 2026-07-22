import { useListWeightEntries, useCreateWeightEntry, getListWeightEntriesQueryKey, getGetOverviewQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Activity, Plus, TrendingDown, Scale } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const weightSchema = z.object({
  weightKg: z.coerce.number().min(30, "Bitte geben Sie ein realistisches Gewicht ein").max(400, "Bitte geben Sie ein realistisches Gewicht ein"),
});

type WeightFormValues = z.infer<typeof weightSchema>;

export default function WeightPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: entries, isLoading } = useListWeightEntries();
  const createMutation = useCreateWeightEntry();

  const form = useForm<WeightFormValues>({
    resolver: zodResolver(weightSchema),
    defaultValues: {
      weightKg: undefined,
    },
  });

  const onSubmit = (data: WeightFormValues) => {
    createMutation.mutate(
      { data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListWeightEntriesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetOverviewQueryKey() });
          form.reset();
          toast({
            title: "Gespeichert",
            description: "Gewicht wurde erfolgreich eingetragen.",
          });
        },
        onError: () => {
          toast({
            title: "Fehler",
            description: "Das Gewicht konnte nicht gespeichert werden.",
            variant: "destructive",
          });
        }
      }
    );
  };

  // Process data for charts and stats
  const sortedEntries = entries ? [...entries].sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()) : [];
  
  const chartData = sortedEntries.map(entry => ({
    date: format(parseISO(entry.recordedAt), "dd.MM.yy", { locale: de }),
    fullDate: format(parseISO(entry.recordedAt), "dd. MMMM yyyy", { locale: de }),
    weight: Number(entry.weightKg),
  }));

  const currentWeight = sortedEntries.length > 0 ? sortedEntries[sortedEntries.length - 1].weightKg : null;
  const startWeight = sortedEntries.length > 0 ? sortedEntries[0].weightKg : null;
  const totalLoss = startWeight && currentWeight ? (startWeight - currentWeight).toFixed(1) : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-10">

      {/* HERO */}
      <section className="relative rounded-3xl overflow-hidden shadow-lg" style={{ minHeight: 200 }}>
        <img
          src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
        <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end" style={{ minHeight: 200 }}>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-sky-300" />
            <span className="text-sky-300 text-xs font-semibold uppercase tracking-wider">Mein Fortschritt</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-1 drop-shadow">Gewichtsprotokoll</h1>
          <p className="text-white/75 text-sm">Verfolgen Sie Ihre Fortschritte — jedes Gramm zählt!</p>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 border-primary/20 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Neuer Eintrag</CardTitle>
            <CardDescription>Wie viel wiegen Sie heute?</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="weightKg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gewicht in kg</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1" 
                            placeholder="z.B. 120.5" 
                            className="text-lg h-12"
                            {...field} 
                            value={field.value || ""}
                            data-testid="input-weight"
                          />
                        </FormControl>
                        <Button type="submit" disabled={createMutation.isPending} className="h-12 w-12 shrink-0 px-0" data-testid="button-submit-weight">
                          <Plus className="h-6 w-6" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            <div className="mt-8 pt-6 border-t space-y-4">
              <div className="bg-muted/30 p-4 rounded-xl border flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Aktuelles Gewicht</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">
                      {currentWeight ? `${currentWeight} kg` : "---"}
                    </p>
                  )}
                </div>
                <Scale className="h-8 w-8 text-primary/50" />
              </div>
              
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary/80">Abnahme gesamt</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-primary">
                      {totalLoss ? `${totalLoss} kg` : "0.0 kg"}
                    </p>
                  )}
                </div>
                <TrendingDown className="h-8 w-8 text-primary/50" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Ihre Erfolgskurve</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : chartData.length < 2 ? (
              <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl">
                <Activity className="h-12 w-12 mb-4 opacity-20" />
                <p>Noch nicht genügend Daten für ein Diagramm.</p>
                <p className="text-sm mt-1">Tragen Sie Ihr Gewicht regelmäßig ein.</p>
              </div>
            ) : (
              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      domain={['auto', 'auto']} 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      dx={-10}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-popover border border-border shadow-md rounded-lg p-3">
                              <p className="text-sm text-muted-foreground mb-1">{payload[0].payload.fullDate}</p>
                              <p className="text-xl font-bold text-primary">{payload[0].value} kg</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {sortedEntries.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Verlauf</h3>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...sortedEntries].reverse().map((entry) => (
              <div key={entry.id} className="bg-card border rounded-lg p-3 flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {format(parseISO(entry.recordedAt), "dd.MM.yyyy", { locale: de })}
                </span>
                <span className="font-medium text-foreground">{entry.weightKg} kg</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
