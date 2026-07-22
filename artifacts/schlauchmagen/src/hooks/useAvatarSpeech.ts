import { useRef, useCallback, useState } from "react";
import { Lipsync } from "wawa-lipsync";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export type MorphTarget = Record<string, number>;

export interface AvatarSpeechHandle {
  state: "idle" | "loading" | "speaking";
  morphTargets: MorphTarget;
  speak: (text: string, onDone?: () => void) => Promise<void>;
  stop: () => void;
}

const ZERO_MORPHS: MorphTarget = {};

function stripMarkdown(t: string) {
  return t
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/`+[^`]*`+/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}

export function useAvatarSpeech(): AvatarSpeechHandle {
  const [state, setState]               = useState<"idle" | "loading" | "speaking">("idle");
  const [morphTargets, setMorphTargets] = useState<MorphTarget>(ZERO_MORPHS);

  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const lipsyncRef  = useRef<Lipsync | null>(null);
  const rafRef      = useRef<number>(0);
  const blobUrlRef  = useRef<string | null>(null);
  const stopped     = useRef(false);

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    audioRef.current?.pause();
    if (audioRef.current) { audioRef.current.src = ""; audioRef.current = null; }
    if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = null; }
    lipsyncRef.current = null;
  }, []);

  const stop = useCallback(() => {
    stopped.current = true;
    cleanup();
    setState("idle");
    setMorphTargets(ZERO_MORPHS);
  }, [cleanup]);

  const speak = useCallback(async (text: string, onDone?: () => void) => {
    stop();
    stopped.current = false;
    setState("loading");

    try {
      const res = await fetch(`${BASE}/api/elevenlabs/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: stripMarkdown(text) }),
      });
      if (!res.ok) throw new Error(`TTS ${res.status}`);
      if (stopped.current) return;

      const blob    = await res.blob();
      if (stopped.current) return;

      const url     = URL.createObjectURL(blob);
      blobUrlRef.current = url;

      const audio   = new Audio(url);
      audioRef.current = audio;

      const lipsync = new Lipsync({ fftSize: 256, historySize: 5 });
      lipsyncRef.current = lipsync;
      lipsync.connectAudio(audio);

      setState("speaking");
      await audio.play();

      const tick = () => {
        if (stopped.current || !lipsyncRef.current) return;
        lipsyncRef.current.processAudio();
        const avg  = lipsyncRef.current.getAveragedFeatures();
        const cur  = lipsyncRef.current.extractFeatures();
        const sc   = lipsyncRef.current.computeVisemeScores(
          cur, avg, cur.volume - avg.volume, cur.centroid - avg.centroid,
        );
        setMorphTargets({
          ...(lipsyncRef.current.adjustScoresForConsistency(
            sc as Parameters<typeof lipsyncRef.current.adjustScoresForConsistency>[0],
          )),
        });
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

      audio.onended = () => {
        if (stopped.current) return;
        cleanup();
        setState("idle");
        setMorphTargets(ZERO_MORPHS);
        onDone?.();
      };
      audio.onerror = () => {
        if (stopped.current) return;
        cleanup();
        setState("idle");
        setMorphTargets(ZERO_MORPHS);
      };
    } catch {
      if (!stopped.current) { setState("idle"); setMorphTargets(ZERO_MORPHS); cleanup(); }
    }
  }, [stop, cleanup]);

  return { state, morphTargets, speak, stop };
}
