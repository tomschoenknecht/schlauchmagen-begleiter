import { useListJournalEntries, useCreateJournalEntry, useDeleteJournalEntry, getListJournalEntriesQueryKey, getGetOverviewQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookHeart, Trash2, Send, Quote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const journalSchema = z.object({
  content: z.string().min(1, { message: "Bitte schreiben Sie etwas auf." }),
  mood: z.string().min(1, { message: "Bitte wählen Sie eine Stimmung." }),
});

type JournalFormValues = z.infer<typeof journalSchema>;

const moods = [
  { value: "motiviert", label: "Motiviert", color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
  { value: "glücklich", label: "Glücklich", color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30" },
  { value: "neutral", label: "Neutral", color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
  { value: "erschöpft", label: "Erschöpft", color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30" },
  { value: "frustriert", label: "Frustriert", color: "text-red-600 bg-red-100 dark:bg-red-900/30" },
];

export default function JournalPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: entries, isLoading } = useListJournalEntries();
  const createMutation = useCreateJournalEntry();
  const deleteMutation = useDeleteJournalEntry();

  const form = useForm<JournalFormValues>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      content: "",
      mood: "",
    },
  });

  const onSubmit = (data: JournalFormValues) => {
    createMutation.mutate(
      { data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListJournalEntriesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetOverviewQueryKey() });
          form.reset({ content: "", mood: data.mood }); // Keep mood for convenience
          toast({
            title: "Gespeichert",
            description: "Ihr Eintrag wurde dem Tagebuch hinzugefügt.",
          });
        },
        onError: () => {
          toast({
            title: "Fehler",
            description: "Der Eintrag konnte nicht gespeichert werden.",
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListJournalEntriesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetOverviewQueryKey() });
          toast({
            title: "Gelöscht",
            description: "Der Eintrag wurde entfernt.",
          });
        },
        onError: () => {
          toast({
            title: "Fehler",
            description: "Der Eintrag konnte nicht gelöscht werden.",
            variant: "destructive",
          });
        }
      }
    );
  };

  const getMoodColor = (moodValue: string | null) => {
    const mood = moods.find(m => m.value === moodValue);
    return mood ? mood.color : "text-gray-600 bg-gray-100 dark:bg-gray-800";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-10">

      {/* HERO */}
      <section className="relative rounded-3xl overflow-hidden shadow-lg" style={{ minHeight: 200 }}>
        <img
          src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
        <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end" style={{ minHeight: 200 }}>
          <div className="flex items-center gap-2 mb-2">
            <BookHeart className="w-5 h-5 text-rose-300" />
            <span className="text-rose-300 text-xs font-semibold uppercase tracking-wider">Mein Raum</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-1 drop-shadow">Tagebuch</h1>
          <p className="text-white/75 text-sm">Gedanken, Sorgen und Erfolge — dieser Raum gehört nur Ihnen.</p>
        </div>
      </section>

      <Card className="border-primary/20 shadow-md">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem className="max-w-[250px]">
                    <FormLabel>Wie fühlen Sie sich heute?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-journal-mood">
                          <SelectValue placeholder="Stimmung wählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {moods.map((mood) => (
                          <SelectItem key={mood.value} value={mood.value}>
                            {mood.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ihre Gedanken</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Was beschäftigt Sie heute? Was lief gut? Wofür sind Sie dankbar?" 
                        className="min-h-[150px] resize-y text-base p-4" 
                        {...field} 
                        data-testid="input-journal-content"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={createMutation.isPending} className="gap-2" data-testid="button-submit-journal">
                  <Send className="h-4 w-4" />
                  {createMutation.isPending ? "Wird gespeichert..." : "Eintrag speichern"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6 mt-12">
        <h2 className="text-2xl font-semibold border-b pb-2">Bisherige Einträge</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : !entries || entries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Quote className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Das Tagebuch ist noch leer.</p>
            <p>Machen Sie den ersten Schritt und schreiben Sie Ihre Gedanken auf.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {entries
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((entry) => (
                <div key={entry.id} className="relative group">
                  <div className="absolute left-6 top-10 bottom-[-24px] w-px bg-border group-last:hidden" />
                  
                  <div className="flex gap-4">
                    <div className="relative z-10 flex flex-col items-center mt-1">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shadow-sm border border-primary/20">
                        {format(parseISO(entry.createdAt), "d.MMM", { locale: de })}
                      </div>
                    </div>
                    
                    <Card className="flex-1 hover:shadow-md transition-shadow" data-testid={`card-journal-${entry.id}`}>
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground font-medium">
                              {format(parseISO(entry.createdAt), "EEEE, HH:mm 'Uhr'", { locale: de })}
                            </span>
                            {entry.mood && (
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}>
                                {moods.find(m => m.value === entry.mood)?.label || entry.mood}
                              </span>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-2 -mr-2"
                            onClick={() => handleDelete(entry.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-journal-${entry.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                          {entry.content}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
