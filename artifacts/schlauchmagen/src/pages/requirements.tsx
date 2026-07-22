import { useListRequirements, useToggleRequirement, getListRequirementsQueryKey, getGetOverviewQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, CheckCircle2, ExternalLink } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function RequirementsPage() {
  const queryClient = useQueryClient();
  const { data: requirements, isLoading } = useListRequirements();
  const toggleMutation = useToggleRequirement();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const grouped = requirements?.reduce((acc, req) => {
    if (!acc[req.category]) {
      acc[req.category] = [];
    }
    acc[req.category].push(req);
    return acc;
  }, {} as Record<string, typeof requirements>);

  const handleToggle = (id: number, currentCompleted: boolean) => {
    toggleMutation.mutate(
      { id, data: { completed: !currentCompleted } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListRequirementsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetOverviewQueryKey() });
        }
      }
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">

      {/* HERO */}
      <section className="relative rounded-3xl overflow-hidden shadow-lg" style={{ minHeight: 220 }}>
        <img
          src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
        <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end" style={{ minHeight: 220 }}>
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-5 h-5 text-emerald-300" />
            <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">Kostenübernahme</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2 drop-shadow">
            Anforderungen
          </h1>
          <p className="text-white/75 text-base max-w-xl">
            Schritt für Schritt ans Ziel. Haken Sie ab, was Sie bereits erledigt haben.
          </p>
        </div>
      </section>

      {!requirements || requirements.length === 0 ? (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mb-4 opacity-20" />
            <p>Keine Anforderungen gefunden.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped || {}).map(([category, reqs]) => {
            const completedCount = reqs.filter(r => r.completed).length;
            const progress = Math.round((completedCount / reqs.length) * 100);
            
            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground border-b-2 border-primary/20 pb-2 inline-block">
                    {category}
                  </h2>
                  <div className="flex items-center gap-4 w-1/3">
                    <Progress value={progress} className="h-2 flex-1" />
                    <span className="text-sm text-muted-foreground font-medium min-w-[3rem] text-right">
                      {progress}%
                    </span>
                  </div>
                </div>
                
                <div className="grid gap-3">
                  {reqs.map((req) => (
                    <div 
                      key={req.id}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
                        req.completed 
                          ? "bg-primary/5 border-primary/20 shadow-sm" 
                          : "bg-card border-border hover:border-primary/30 hover:shadow-md"
                      }`}
                    >
                      <div className="pt-1">
                        <Checkbox 
                          id={`req-${req.id}`}
                          checked={req.completed}
                          onCheckedChange={() => handleToggle(req.id, req.completed)}
                          className="h-6 w-6 rounded-md data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          data-testid={`checkbox-requirement-${req.id}`}
                        />
                      </div>
                      <div className="grid gap-1 flex-1">
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`req-${req.id}`}
                            className={`font-medium cursor-pointer transition-colors ${
                              req.completed ? "text-primary line-through opacity-70" : "text-card-foreground"
                            }`}
                          >
                            {req.title}
                          </label>
                          {req.link && (
                            <a
                              href={req.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors"
                              title="Weiterführende Informationen"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                        <p className={`text-sm ${req.completed ? "text-muted-foreground opacity-70" : "text-muted-foreground"}`}>
                          {req.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
