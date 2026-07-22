import { Router } from "express";

const router = Router();

const DID_API = "https://api.d-id.com";

function didHeaders() {
  const key = process.env.D_ID_API_KEY;
  if (!key) throw new Error("D_ID_API_KEY not set");
  return {
    Authorization: `Basic ${key}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

// 1. Create streaming session — returns WebRTC offer + ICE servers
router.post("/did/stream", async (req, res) => {
  try {
    const { sourceUrl } = req.body as { sourceUrl?: string };
    const avatarUrl =
      sourceUrl ??
      `https://${process.env.REPLIT_DEV_DOMAIN}/avatar.jpg`;

    const resp = await fetch(`${DID_API}/talks/streams`, {
      method: "POST",
      headers: didHeaders(),
      body: JSON.stringify({
        source_url: avatarUrl,
        driver_url: "bank://lively/driver-06",
        output_resolution: 512,
        stream_warmup: true,
        config: {
          stitch: true,
          pad_audio: 0,
          align_driver: true,
          auto_match: true,
          normalization_factor: 0,
          sharpen: true,
          result_format: "mp4",
        },
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      req.log.error({ status: resp.status, body: txt }, "D-ID create stream failed");
      res.status(resp.status).json({ error: txt });
      return;
    }

    const data = await resp.json() as {
      id: string;
      session_id: string;
      offer: Record<string, unknown>;
      ice_servers: Record<string, unknown>[];
    };
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "D-ID create stream error");
    res.status(500).json({ error: "Failed to create D-ID stream" });
  }
});

// 2. Send SDP answer
router.post("/did/stream/:id/sdp", async (req, res) => {
  try {
    const { id } = req.params;
    const { answer, session_id } = req.body as {
      answer: Record<string, unknown>;
      session_id: string;
    };

    const resp = await fetch(`${DID_API}/talks/streams/${id}/sdp`, {
      method: "POST",
      headers: didHeaders(),
      body: JSON.stringify({ answer, session_id }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      req.log.error({ status: resp.status }, "D-ID SDP failed");
      res.status(resp.status).json({ error: txt });
      return;
    }
    res.json(await resp.json());
  } catch (err) {
    req.log.error({ err }, "D-ID SDP error");
    res.status(500).json({ error: "SDP exchange failed" });
  }
});

// 3. Send ICE candidate
router.post("/did/stream/:id/ice", async (req, res) => {
  try {
    const { id } = req.params;
    const { candidate, sdpMid, sdpMLineIndex, session_id } = req.body as {
      candidate: string;
      sdpMid: string;
      sdpMLineIndex: number;
      session_id: string;
    };

    const resp = await fetch(`${DID_API}/talks/streams/${id}/ice`, {
      method: "POST",
      headers: didHeaders(),
      body: JSON.stringify({ candidate, sdpMid, sdpMLineIndex, session_id }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      res.status(resp.status).json({ error: txt });
      return;
    }
    res.json(await resp.json());
  } catch (err) {
    req.log.error({ err }, "D-ID ICE error");
    res.status(500).json({ error: "ICE exchange failed" });
  }
});

// 4. Send text to speak — triggers lip-synced video
router.post("/did/stream/:id/speak", async (req, res) => {
  try {
    const { id } = req.params;
    const { text, session_id } = req.body as { text: string; session_id: string };

    const resp = await fetch(`${DID_API}/talks/streams/${id}`, {
      method: "POST",
      headers: didHeaders(),
      body: JSON.stringify({
        script: {
          type: "text",
          input: text,
          provider: {
            type: "microsoft",
            voice_id: "de-DE-KatjaNeural",
          },
          ssml: false,
        },
        session_id,
        config: {
          fluent: true,
          pad_audio: 0,
        },
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      req.log.error({ status: resp.status, body: txt }, "D-ID speak failed");
      res.status(resp.status).json({ error: txt });
      return;
    }
    res.json(await resp.json());
  } catch (err) {
    req.log.error({ err }, "D-ID speak error");
    res.status(500).json({ error: "Speak request failed" });
  }
});

// 5a. Create lip-sync clip via /talks (HTTP, no WebRTC needed)
router.post("/did/clip", async (req, res) => {
  try {
    const { text } = req.body as { text: string };
    const avatarUrl = `https://${process.env.REPLIT_DEV_DOMAIN}/avatar.jpg`;

    const resp = await fetch(`${DID_API}/talks`, {
      method: "POST",
      headers: didHeaders(),
      body: JSON.stringify({
        source_url: avatarUrl,
        script: {
          type: "text",
          input: text,
          provider: { type: "microsoft", voice_id: "de-DE-KatjaNeural" },
          ssml: false,
        },
        config: { fluent: true, pad_audio: 0 },
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      req.log.error({ status: resp.status, body: txt }, "D-ID create clip failed");
      res.status(resp.status).json({ error: txt });
      return;
    }
    res.json(await resp.json());
  } catch (err) {
    req.log.error({ err }, "D-ID create clip error");
    res.status(500).json({ error: "Failed to create clip" });
  }
});

// 5b. Poll clip status
router.get("/did/clip/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { Authorization, Accept } = didHeaders();
    const resp = await fetch(`${DID_API}/talks/${id}`, {
      headers: { Authorization, Accept },
    });
    if (!resp.ok) {
      const txt = await resp.text();
      res.status(resp.status).json({ error: txt });
      return;
    }
    res.json(await resp.json());
  } catch (err) {
    req.log.error({ err }, "D-ID clip status error");
    res.status(500).json({ error: "Failed to get clip status" });
  }
});

// 6. Destroy stream
router.delete("/did/stream/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { session_id } = req.body as { session_id: string };

    const resp = await fetch(`${DID_API}/talks/streams/${id}`, {
      method: "DELETE",
      headers: didHeaders(),
      body: JSON.stringify({ session_id }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      res.status(resp.status).json({ error: txt });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "D-ID destroy error");
    res.status(500).json({ error: "Failed to destroy stream" });
  }
});

export default router;
