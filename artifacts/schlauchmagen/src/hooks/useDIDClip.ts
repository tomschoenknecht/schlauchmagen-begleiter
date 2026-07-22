import { useRef, useState, useCallback } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export type ClipState = "idle" | "generating" | "playing" | "error";

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export function useDIDClip(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [state, setState] = useState<ClipState>("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const speak = useCallback(async (text: string, onEnd?: () => void) => {
    abortRef.current = false;
    setState("generating");
    setError(null);

    try {
      // 1. Create clip
      const createResp = await fetch(`${BASE}/api/did/clip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!createResp.ok) throw new Error("Clip-Erstellung fehlgeschlagen");
      const { id } = await createResp.json() as { id: string };

      // 2. Poll until done (max 60 s, every 2 s)
      let resultUrl: string | null = null;
      for (let i = 0; i < 30; i++) {
        if (abortRef.current) return;
        await sleep(2000);
        const statusResp = await fetch(`${BASE}/api/did/clip/${id}`);
        const data = await statusResp.json() as {
          status: string;
          result_url?: string;
        };
        if (data.status === "done" && data.result_url) {
          resultUrl = data.result_url;
          break;
        }
        if (data.status === "error") throw new Error("Clip-Generierung fehlgeschlagen");
      }

      if (!resultUrl) throw new Error("Zeitüberschreitung bei Video-Generierung");
      if (abortRef.current) return;

      // 3. Play
      setState("playing");
      if (videoRef.current) {
        videoRef.current.src = resultUrl;
        videoRef.current.onended = () => {
          setState("idle");
          onEnd?.();
        };
        await videoRef.current.play();
      } else {
        setState("idle");
        onEnd?.();
      }
    } catch (err) {
      if (abortRef.current) return;
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
      setState("error");
      onEnd?.();
    }
  }, [videoRef]);

  const stop = useCallback(() => {
    abortRef.current = true;
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
    }
    setState("idle");
    setError(null);
  }, [videoRef]);

  return { state, error, speak, stop };
}
