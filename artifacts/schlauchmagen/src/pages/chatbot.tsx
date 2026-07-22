import { useState, useRef, useCallback, useEffect } from "react";
import { useConversation, ConversationProvider } from "@elevenlabs/react";
import { SimliClient, generateSimliSessionToken, generateIceServers } from "simli-client";
import { Mic, PhoneOff } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const SIMLI_API_KEY = "63uvrgzby45agk9evrt1s";
const SIMLI_FACE_ID = "cace3ef7-a4c4-425d-a8cf-a5358eb0c427";

type ConvPhase = "idle" | "connecting" | "listening" | "speaking" | "error";

function b64ToUint8(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

export default function ChatbotPage() {
  return <ConversationProvider><ChatbotInner /></ConversationProvider>;
}

function ChatbotInner() {
  const [convPhase, setConvPhase] = useState<ConvPhase>("idle");
  const [simliReady, setSimliReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const simliRef = useRef<SimliClient | null>(null);

  // ── Simli beim Seitenaufruf verbinden ─────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function initSimli() {
      if (!videoRef.current || !audioRef.current) return;
      try {
        const [{ session_token }, iceServers] = await Promise.all([
          generateSimliSessionToken({
            config: { faceId: SIMLI_FACE_ID, handleSilence: true, maxSessionLength: 3600, maxIdleTime: 600, model: "fasttalk" },
            apiKey: SIMLI_API_KEY,
          }),
          generateIceServers(SIMLI_API_KEY),
        ]);
        if (cancelled) return;
        const simli = new SimliClient(session_token, videoRef.current!, audioRef.current!, iceServers);
        simliRef.current = simli;
        await simli.start();
      } catch (e) {
        console.error("Simli init error:", e);
      }
    }
    initSimli();
    return () => {
      cancelled = true;
      simliRef.current?.stop().catch(() => {});
      simliRef.current = null;
    };
  }, []);

  // ── ElevenLabs ────────────────────────────────────────────────────────────
  const conversation = useConversation({
    onConnect:    () => { setError(null); setConvPhase("listening"); },
    onDisconnect: (details?: { reason?: string; message?: string }) => {
      simliRef.current?.ClearBuffer();
      if (details?.reason === "error") {
        setError(`Verbindung unterbrochen: ${details.message ?? "Unbekannter Fehler"}`);
        setConvPhase("error");
      } else {
        setConvPhase("idle");
      }
    },
    onError: (msg) => { simliRef.current?.ClearBuffer(); setError(String(msg)); setConvPhase("error"); },
    onMessage: ({ source }) => {
      if (source === "ai")   setConvPhase("speaking");
      if (source === "user") setConvPhase("listening");
    },
    // Feuert exakt wenn Lisa aufhört / anfängt zu sprechen
    onModeChange: ({ mode }) => {
      if (mode === "listening") simliRef.current?.ClearBuffer();
    },
    onAudio: (base64Audio: string) => {
      if (!simliRef.current) return;
      try { simliRef.current.sendAudioData(b64ToUint8(base64Audio)); } catch { }
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
    simliRef.current?.ClearBuffer();
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

      <div
        className="relative rounded-3xl overflow-hidden transition-shadow duration-700"
        style={{
          width: "min(16rem, 60vw)",
          aspectRatio: "9/16",
          boxShadow: `0 0 0 4px ${ringColor[convPhase]}, 0 32px 80px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Lade-Animation bis Simli-Video spielt */}
        {!simliReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: "linear-gradient(160deg,#1a2e28 0%,#0d1b2a 100%)" }}>
            <div className="w-20 h-20 rounded-full border-2 border-emerald-500/30 flex items-center justify-center mb-4 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20" />
            </div>
            <p className="text-white/30 text-xs">Lisa wird geladen …</p>
          </div>
        )}

        {/* Simli-Video — onPlaying ist zuverlässiger als das "start"-Event */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onPlaying={() => setSimliReady(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: simliReady ? 1 : 0, transition: "opacity 0.6s" }}
        />

        {/* Simli-Audio STUMM — ElevenLabs übernimmt die Audiowiedergabe
            damit die Browser-eigene Echo-Unterdrückung korrekt funktioniert */}
        <audio ref={audioRef} autoPlay muted />

        {convPhase === "listening" && (
          <div className="absolute bottom-4 inset-x-0 flex justify-center">
            <div className="flex gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 items-center">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs text-white/70">Sprich jetzt …</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        {error && <p className="text-red-300 text-sm text-center max-w-xs">{error}</p>}

        {!isActive ? (
          <button
            onClick={startConv}
            disabled={convPhase === "connecting"}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition-all text-white font-semibold text-base shadow-lg shadow-emerald-500/30 disabled:opacity-50"
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
