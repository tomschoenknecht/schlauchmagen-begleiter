import { useRef, useState, useCallback, useEffect } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const CONNECT_TIMEOUT_MS = 20_000;

type DIDState = "idle" | "connecting" | "ready" | "speaking" | "error";

interface DIDStream {
  id: string;
  session_id: string;
}

export function useDIDAvatar(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [state, setState] = useState<DIDState>("idle");
  const [error, setError] = useState<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<DIDStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const speakingTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const connectTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Ref to avoid stale closure on connection state guard
  const isConnectingRef = useRef(false);

  const destroy = useCallback(async () => {
    clearTimeout(speakingTimerRef.current);
    clearTimeout(connectTimerRef.current);
    isConnectingRef.current = false;

    if (streamRef.current) {
      try {
        await fetch(`${BASE}/api/did/stream/${streamRef.current.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: streamRef.current.session_id }),
        });
      } catch {}
      streamRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    remoteStreamRef.current = null;
    setState("idle");
  }, [videoRef]);

  const connect = useCallback(async () => {
    if (isConnectingRef.current) return;
    isConnectingRef.current = true;
    setState("connecting");
    setError(null);

    // Timeout guard — give up after CONNECT_TIMEOUT_MS
    connectTimerRef.current = setTimeout(async () => {
      if (isConnectingRef.current) {
        isConnectingRef.current = false;
        if (pcRef.current) {
          pcRef.current.close();
          pcRef.current = null;
        }
        if (streamRef.current) {
          try {
            await fetch(`${BASE}/api/did/stream/${streamRef.current.id}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ session_id: streamRef.current.session_id }),
            });
          } catch {}
          streamRef.current = null;
        }
        setState("error");
        setError("Zeitüberschreitung beim Verbinden — bitte erneut versuchen.");
      }
    }, CONNECT_TIMEOUT_MS);

    try {
      const createResp = await fetch(`${BASE}/api/did/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!createResp.ok) throw new Error(`Create stream failed: ${createResp.status}`);

      const { id, session_id, offer, ice_servers } = await createResp.json() as {
        id: string;
        session_id: string;
        offer: RTCSessionDescriptionInit;
        ice_servers: RTCIceServer[];
      };
      streamRef.current = { id, session_id };

      // Force TURN relay-only — bypasses Replit's UDP restrictions
      const pc = new RTCPeerConnection({
        iceServers: ice_servers,
        iceTransportPolicy: "relay",
      });
      pcRef.current = pc;

      // Single persistent MediaStream — both tracks land here together
      const remoteStream = new MediaStream();
      remoteStreamRef.current = remoteStream;

      pc.ontrack = (evt) => {
        const track = evt.track;
        const attach = () => {
          if (!remoteStream.getTrackById(track.id)) {
            remoteStream.addTrack(track);
          }
          if (videoRef.current) {
            if (videoRef.current.srcObject !== remoteStream) {
              videoRef.current.srcObject = remoteStream;
            }
            videoRef.current.play().catch(() => {});
          }
        };
        if (track.readyState === "live") {
          attach();
        } else {
          track.onunmute = attach;
        }
      };

      pc.onicecandidate = async ({ candidate }) => {
        if (!candidate || !streamRef.current) return;
        try {
          await fetch(`${BASE}/api/did/stream/${streamRef.current.id}/ice`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              candidate: candidate.candidate,
              sdpMid: candidate.sdpMid ?? "",
              sdpMLineIndex: candidate.sdpMLineIndex ?? 0,
              session_id: streamRef.current.session_id,
            }),
          });
        } catch {}
      };

      const onConnected = () => {
        clearTimeout(connectTimerRef.current);
        isConnectingRef.current = false;
        setState("ready");
      };

      // Listen to both events — browsers differ on which fires first
      pc.oniceconnectionstatechange = () => {
        const s = pc.iceConnectionState;
        if (s === "connected" || s === "completed") {
          onConnected();
        } else if (s === "failed") {
          clearTimeout(connectTimerRef.current);
          isConnectingRef.current = false;
          setState("error");
          setError("ICE-Verbindung fehlgeschlagen — WebRTC vom Netzwerk blockiert.");
        }
      };

      pc.onconnectionstatechange = () => {
        const s = pc.connectionState;
        if (s === "connected") {
          onConnected();
        } else if (s === "failed" || s === "disconnected") {
          clearTimeout(connectTimerRef.current);
          isConnectingRef.current = false;
          setState("error");
          setError("Verbindung getrennt.");
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      await fetch(`${BASE}/api/did/stream/${id}/sdp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, session_id }),
      });

    } catch (err) {
      clearTimeout(connectTimerRef.current);
      isConnectingRef.current = false;
      const msg = err instanceof Error ? err.message : "Verbindungsfehler";
      setError(msg);
      setState("error");
    }
  }, [videoRef]);

  const speak = useCallback(async (text: string, onEnd?: () => void) => {
    if (!streamRef.current) return;
    if (state !== "ready" && state !== "speaking") return;

    setState("speaking");
    clearTimeout(speakingTimerRef.current);

    try {
      const resp = await fetch(`${BASE}/api/did/stream/${streamRef.current.id}/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          session_id: streamRef.current.session_id,
        }),
      });
      if (!resp.ok) throw new Error(`Speak failed: ${resp.status}`);

      const words = text.split(/\s+/).length;
      const durationMs = Math.max(2500, words * 460 + 1500);
      speakingTimerRef.current = setTimeout(() => {
        setState("ready");
        onEnd?.();
      }, durationMs);

    } catch (err) {
      setState("ready");
      setError(err instanceof Error ? err.message : "Sprachfehler");
    }
  }, [state]);

  useEffect(() => () => { void destroy(); }, [destroy]);

  return { state, error, connect, speak, destroy };
}
