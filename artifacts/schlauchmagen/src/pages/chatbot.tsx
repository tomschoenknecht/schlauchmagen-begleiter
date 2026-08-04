import { useState, useCallback } from "react";
import { useConversation, ConversationProvider } from "@elevenlabs/react";
import { Mic, PhoneOff, HeartHandshake } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type ConvPhase = "idle" | "connecting" | "listening" | "speaking" | "error";

export default function ChatbotPage() {
  return <ConversationProvider><ChatbotInner /></ConversationProvider>;
}

function ChatbotInner() {
  const [convPhase, setConvPhase] = useState<ConvPhase>("idle");
  const [error, setError] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect:    () => { setError(null); setConvPhase("listening"); },
    onDisconnect: (details?: { reason?: string; message?: string }) => {
      if (details?.reason === "error") {
        setError(`Verbindung unterbrochen: ${details.message ?? "Unbekannter Fehler"}`);
        setConvPhase("error");
      } else {
        setConvPhase("idle");
      }
    },
    onError: (msg) => { setError(String(msg)); setConvPhase("error"); },
    onMessage: ({ source }) => {
      if (source === "ai")   setConvPhase("speaking");
      if (source === "user") setConvPhase("listening");
    },
  });

  const startConv = useCallback(async () => {
    setError(null);
    setConvPhase("connecting");
    try {
      const r = await fetch(`${BASE}/api/elevenlabs/signed-url`);
      if (!r.ok) throw new Error("Token konnte nicht geladen werden");
      const { signedUrl } = await r.json() as { signedUrl: string };
      await navigator.mediaDevices.getUserMedia({ audio: true });
      conversation.startSession({ signedUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verbindungsfehler");
      setConvPhase("error");
    }
  }, [conversation]);

  const stopConv = useCallback(async () => {
    await conversation.endSession();
    setConvPhase("idle");
  }, [conversation]);

  const label: Record<ConvPhase, string> = {
    idle:       "Tippe auf den Button um Lisa zu starten",
    connecting: "Verbinde …",
    listening:  "Lisa hört zu …",
    speaking:   "Lisa spricht …",
    error:      "Fehler aufgetreten",
  };

  const ringColor: Record<ConvPhase, string> = {
    idle:       "rgba(255,255,255,0.12)",
    connecting: "rgba(251,191,36,0.6)",
    listening:  "rgba(59,130,246,0.7)",
    speaking:   "rgba(52,211,153,0.8)",
    error:      "rgba(239,68,68,0.7)",
  };

  const isActive = convPhase !== "idle" && convPhase !== "error";

  return (
    <div
      className="flex flex-col h-[calc(100vh-4rem)] items-center justify-between py-8 px-4"
      style={{ background: "linear-gradient(170deg,#0b1c18 0%,#09131f 100%)" }}
    >
      <div className="text-center">
        <h2 className="text-white font-semibold text-lg tracking-wide">Lisa</h2>
        <p className="text-white/50 text-sm mt-1">{label[convPhase]}</p>
      </div>

      {/* Avatar-Placeholder ohne Simli */}
      <div
        className="relative rounded-3xl overflow-hidden transition-shadow duration-700 flex items-center justify-center"
        style={{
          width: "min(16rem, 60vw)",
          aspectRatio: "9/16",
          background: "linear-gradient(160deg,#1a2e28 0%,#0d1b2a 100%)",
          boxShadow: `0 0 0 4px ${ringColor[convPhase]}, 0 32px 80px rgba(0,0,0,0.8)`,
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: convPhase === "speaking"
                ? "radial-gradient(circle, rgba(52,211,153,0.3) 0%, rgba(52,211,153,0.05) 70%)"
                : convPhase === "listening"
                ? "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.05) 70%)"
                : "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 70%)",
              transition: "background 0.5s",
            }}
          >
            <HeartHandshake
              className="w-10 h-10"
              style={{
                color: convPhase === "speaking" ? "#34d399"
                  : convPhase === "listening" ? "#60a5fa"
                  : "rgba(255,255,255,0.3)",
                transition: "color 0.5s",
              }}
            />
          </div>
          {convPhase === "speaking" && (
            <div className="flex gap-1 items-end h-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-emerald-400"
                  style={{
                    height: `${8 + Math.sin(i * 1.2) * 8}px`,
                    animation: `pulse ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </div>
          )}
          {convPhase === "listening" && (
            <div className="flex gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 items-center">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs text-white/70">Sprich jetzt …</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {error && <p className="text-red-300 text-sm text-center max-w-xs">{error}</p>}

        {!isActive ? (
          <button
            onClick={startConv}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition-all text-white font-semibold text-base shadow-lg shadow-emerald-500/30"
          >
            <Mic className="w-5 h-5" />
            Gespräch starten
          </button>
        ) : (
          <button
            onClick={stopConv}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-red-500/20 border border-red-400/40 hover:bg-red-500/30 active:scale-95 transition-all text-red-300 font-semibold text-base"
          >
            <PhoneOff className="w-5 h-5" />
            Gespräch beenden
          </button>
        )}

        <p className="text-white/20 text-xs text-center">
          Lisa ersetzt keine medizinische Fachberatung.
        </p>
      </div>
    </div>
  );
}
