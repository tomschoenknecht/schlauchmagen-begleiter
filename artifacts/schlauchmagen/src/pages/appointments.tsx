import { useState } from "react";
import { useListAppointments, useCreateAppointment, useDeleteAppointment, getListAppointmentsQueryKey, getGetOverviewQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Clock, Trash2, Plus, AlertCircle, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const appointmentSchema = z.object({
  title: z.string().min(1, { message: "Titel ist erforderlich" }),
  date: z.string().min(1, { message: "Datum ist erforderlich" }),
  type: z.string().min(1, { message: "Typ ist erforderlich" }),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const appointmentTypes = [
  { value: "Ernährung", label: "Ernährungsberatung" },
  { value: "Psychologie", label: "Psychologisches Gutachten" },
  { value: "Medizin", label: "Medizinische Untersuchung" },
  { value: "Sonstiges", label: "Sonstiges" },
];

export default function AppointmentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: appointments, isLoading } = useListAppointments();
  const createMutation = useCreateAppointment();
  const deleteMutation = useDeleteAppointment();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      title: "",
      date: "",
      type: "",
      notes: "",
    },
  });

  const onSubmit = (data: AppointmentFormValues) => {
    createMutation.mutate(
      { data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetOverviewQueryKey() });
          setIsDialogOpen(false);
          form.reset();
          toast({
            title: "Termin gespeichert",
            description: "Der Termin wurde erfolgreich hinzugefügt.",
          });
        },
        onError: () => {
          toast({
            title: "Fehler",
            description: "Der Termin konnte nicht gespeichert werden.",
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
          queryClient.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetOverviewQueryKey() });
          toast({
            title: "Termin gelöscht",
            description: "Der Termin wurde entfernt.",
          });
        },
        onError: () => {
          toast({
            title: "Fehler",
            description: "Der Termin konnte nicht gelöscht werden.",
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">

      {/* HERO */}
      <section className="relative rounded-3xl overflow-hidden shadow-lg" style={{ minHeight: 200 }}>
        <img
          src="https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
        <div className="relative z-10 p-8 md:p-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4" style={{ minHeight: 200 }}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="w-5 h-5 text-violet-300" />
              <span className="text-violet-300 text-xs font-semibold uppercase tracking-wider">Planung</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-1 drop-shadow">Meine Termine</h1>
            <p className="text-white/75 text-sm">Behalten Sie den Überblick über alle wichtigen Termine.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-add-appointment">
              <Plus className="h-4 w-4" />
              Neuer Termin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Neuen Termin eintragen</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titel</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. Erstgespräch Ernährungsberatung" {...field} data-testid="input-appointment-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Datum & Uhrzeit</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} data-testid="input-appointment-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Typ</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-appointment-type">
                              <SelectValue placeholder="Bitte wählen" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {appointmentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notizen (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Was muss ich mitbringen? Woran muss ich denken?" 
                          className="resize-none" 
                          {...field} 
                          data-testid="input-appointment-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-appointment">
                    {createMutation.isPending ? "Wird gespeichert..." : "Termin speichern"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        </div>
      </section>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : !appointments || appointments.length === 0 ? (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <CalendarIcon className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-lg font-medium mb-2">Noch keine Termine eingetragen</p>
            <p>Fügen Sie Ihren ersten Termin hinzu, um bestens organisiert zu bleiben.</p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => setIsDialogOpen(true)}
            >
              Termin hinzufügen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((appointment) => {
              const appointmentDate = parseISO(appointment.date);
              const isPast = appointmentDate < new Date();
              
              return (
                <Card 
                  key={appointment.id} 
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-md ${
                    isPast ? "opacity-70 grayscale-[0.5]" : ""
                  }`}
                  data-testid={`card-appointment-${appointment.id}`}
                >
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${
                    appointment.type === 'Ernährung' ? 'bg-chart-2' :
                    appointment.type === 'Psychologie' ? 'bg-chart-3' :
                    appointment.type === 'Medizin' ? 'bg-chart-1' : 'bg-chart-4'
                  }`} />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold pr-6">{appointment.title}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-2 -mr-2 absolute top-4 right-4"
                        onClick={() => handleDelete(appointment.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-appointment-${appointment.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center text-foreground font-medium">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        {format(appointmentDate, "EEEE, d. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de })}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {appointment.type}
                      </div>
                    </div>
                    
                    {appointment.notes && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm border">
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-muted-foreground">{appointment.notes}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
}
