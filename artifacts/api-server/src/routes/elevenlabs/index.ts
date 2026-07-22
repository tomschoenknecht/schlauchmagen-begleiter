import { Router } from "express";

const router = Router();
const ELEVEN_API = "https://api.elevenlabs.io/v1";
const DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

router.post("/elevenlabs/tts", async (req, res) => {
  try {
    const { text, voice_id = DEFAULT_VOICE_ID } = req.body as { text: string; voice_id?: string };
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      res.status(500).json({ error: "ELEVENLABS_API_KEY not configured" });
      return;
    }

    const response = await fetch(
      `${ELEVEN_API}/text-to-speech/${voice_id}/stream?optimize_streaming_latency=3&output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      },
    );

    if (!response.ok) {
      const txt = await response.text();
      req.log.error({ status: response.status, body: txt }, "ElevenLabs TTS failed");
      res.status(response.status).json({ error: txt });
      return;
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Transfer-Encoding", "chunked");

    const reader = response.body!.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
    res.end();
  } catch (err) {
    req.log.error({ err }, "ElevenLabs TTS error");
    res.status(500).json({ error: "TTS failed" });
  }
});

router.get("/elevenlabs/signed-url", async (req, res) => {
  try {
    const apiKey  = process.env.ELEVENLABS_API_KEY;
    const agentId = process.env.ELEVENLABS_AGENT_ID;
    if (!apiKey || !agentId) {
      res.status(500).json({ error: "ElevenLabs not configured" });
      return;
    }
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      { headers: { "xi-api-key": apiKey } },
    );
    if (!response.ok) {
      res.status(response.status).json({ error: "Failed to get signed URL" });
      return;
    }
    const data = await response.json() as { signed_url: string };
    res.json({ signedUrl: data.signed_url });
  } catch (err) {
    req.log.error({ err }, "ElevenLabs signed URL error");
    res.status(500).json({ error: "Failed" });
  }
});

export default router;
