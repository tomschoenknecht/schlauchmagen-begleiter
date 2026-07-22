import { useEffect, useState } from "react";
import { saveToken } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setError("Kein Token gefunden. Bitte fordere einen neuen Link an.");
      return;
    }

    fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data: { token?: string; error?: string }) => {
        if (data.token) {
          saveToken(data.token);
          // Hard-Redirect damit useAuth frisch initialisiert wird
          window.location.href = "/";
        } else {
          setError(data.error ?? "Link ungültig oder abgelaufen.");
        }
      })
      .catch(() => setError("Verbindungsfehler. Bitte versuche es erneut."));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-sm">
          <p className="text-destructive mb-6">{error}</p>
          <a href="/login" className="underline text-primary hover:no-underline">
            Zurück zum Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p>Einloggen…</p>
      </div>
    </div>
  );
}
