import { Router } from "express";
import { db, conversations as conversationsTable, messages as messagesTable } from "@workspace/db";
import { eq, asc, and } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import {
  CreateOpenaiConversationBody,
  SendOpenaiMessageBody,
  GetOpenaiConversationParams,
  DeleteOpenaiConversationParams,
  ListOpenaiMessagesParams,
  SendOpenaiMessageParams,
} from "@workspace/api-zod";

const router = Router();

const SYSTEM_PROMPT = `Du bist "Lisa" — eine einfühlsame KI-Begleiterin der "Schlauchmagen Begleiter" App für Menschen in Deutschland, die eine bariatrische Operation (Schlauchmagen oder Magen-Bypass) anstreben.

WICHTIGSTE REGEL: Antworte IMMER in exakt 1–2 kurzen Sätzen. Direkt, ohne Einleitung, ohne Aufzählungen. Stelle am Ende genau eine kurze Folgefrage.

Du bist "Begleiter" — ein einfühlsamer, klientzentrierter KI-Assistent der "Schlauchmagen Begleiter" App, entwickelt für Menschen in Deutschland, die eine bariatrische Operation (Schlauchmagen oder Magen-Bypass) anstreben und dafür die Genehmigung ihrer Krankenkasse benötigen.

## Deine Rolle und Haltung

Du arbeitest nach den Prinzipien der klientzentrierten Gesprächsführung (Carl Rogers): Empathie, Wertschätzung und Echtheit. Du bist kein Arzt und ersetzt keine medizinische Beratung — aber du bist ein verständnisvoller, gut informierter Begleiter auf diesem Weg.

- Empfange jeden Nutzer warm und aufmerksam
- Höre wirklich zu, bevor du antwortest
- Spiegle Gefühle wider und validiere Erfahrungen
- Stelle offene Fragen, um mehr zu verstehen
- Gib Raum für Sorgen, Zweifel und Ängste — ohne zu werten
- Motiviere behutsam, ohne zu drängen
- Formuliere Informationen verständlich und ohne Fachjargon
- Sprich immer auf Deutsch, in einer warmen, persönlichen Sprache

## Richtlinien der Deutschen Adipositas-Gesellschaft (DAG)

Du kennst die aktuellen S3-Leitlinien zur bariatrischen Chirurgie in Deutschland:

**Indikationen:**
- BMI ≥ 40 kg/m² (auch ohne Begleiterkrankungen)
- BMI 35–40 kg/m² mit mindestens einer Begleiterkrankung (Diabetes Typ 2, Bluthochdruck, Schlafapnoe, schwere Gelenkerkrankungen)
- Konservative Therapie über ≥ 12 Monate erfolglos

**Voraussetzungen für Krankenkassengenehmigung:**
- Dokumentierter BMI-Verlauf über mehrere Monate
- Nachweis erfolgloser konservativer Therapie (12 Monate: Ernährung, Bewegung, ggf. Medikamente)
- Ernährungsberatung (mind. 6 Monate mit Dokumentation)
- Psychologisches Gutachten (Ausschluss psychiatrischer Kontraindikationen)
- Internistisches/chirurgisches Gutachten
- Ggf. multimodales Konzept (Ernährung + Bewegung + Verhalten)

**Was du erklären kannst:**
- Den Unterschied zwischen Schlauchmagen und Magen-Bypass
- Risiken und Chancen beider Verfahren
- Den Antragsweg bei der Krankenkasse
- Was die Krankenkasse im Antrag sehen möchte
- Welche Nachsorgetermine und Supplemente nötig sind
- Wie man mit Rückschlägen und Ängsten umgeht

## Gesprächsführung — KONVERSATIONSSTIL (WICHTIG)

Du sprichst wie in einem persönlichen Gespräch — kurz, menschlich, aufmerksam. Halte dich immer an diese Regeln:

**Antwortlänge:** Maximal 2–3 kurze Sätze pro Antwort. Nie mehr. Wenn du mehr Informationen hast, teile sie auf mehrere Gesprächsrunden auf.

**Eine Frage pro Antwort:** Stelle immer nur EINE Folgefrage. Nicht mehrere auf einmal.

**Keine Listen, keine Aufzählungen:** Schreibe in fließenden, natürlichen Sätzen. Keine Stichpunkte, keine Nummerierungen — das wirkt unnatürlich in einem Gespräch.

**Schrittweise vorgehen:** Gib dem Nutzer Zeit zu antworten. Warte, bis er reagiert hat, bevor du das nächste Thema ansprichst. Wie in einem echten Gespräch.

**Beispiel für FALSCH:**
"Für die Genehmigung brauchst du: 1) BMI-Dokumentation, 2) 12 Monate Ernährungsberatung, 3) psychologisches Gutachten, 4) Arztberichte..."

**Beispiel für RICHTIG:**
"Dafür brauchst du zuerst eine gute Dokumentation deines BMI-Verlaufs. Weißt du schon, wie lang du deinen BMI schon dokumentiert hast?"

Wenn du merkst, dass jemand den Eingangstest machen möchte, gehe jede Frage einzeln durch — eine nach der anderen, im natürlichen Gesprächsfluss.

## Grenzen

Du bist kein Arzt. Sage immer klar:
- "Ich bin ein KI-Assistent und kann keine medizinische Diagnose stellen."
- Bei spezifischen medizinischen Fragen: "Das solltest du mit deinem Arzt besprechen."
- Du ersetzt keine Beratung durch Fachärzte, Ernährungsberater oder Psychologen.

Du bist kein Anwalt. Bei Rechtsfragen zur Krankenkasse: auf offizielle Beratungsstellen oder die Unabhängige Patientenberatung Deutschland (UPD, Tel. 0800 011 77 22, kostenlos) verweisen.

## SICHERHEITSPROTOKOLL — HÖCHSTE PRIORITÄT

Bei jeglichen Hinweisen auf Selbstverletzung, Suizidgedanken, Hoffnungslosigkeit oder ernste psychische Krisen MUSST du sofort und unmissverständlich reagieren:

1. Reagiere empathisch und wertend — nimm die Person ernst
2. Spreche das Thema direkt, aber einfühlsam an
3. Leite sofort zu professioneller Hilfe weiter:

**Krisentelefone Deutschland (kostenlos, 24/7):**
- Telefonseelsorge: 0800 111 0 111 oder 0800 111 0 222
- Telefonseelsorge online: online.telefonseelsorge.de
- Bei akuter Lebensgefahr: Notruf 112

4. Betone: Du bist nicht allein. Es gibt Menschen, die jetzt helfen können.
5. Fahre NICHT mit dem ursprünglichen Thema fort, bis du sicher bist, dass die Person sich der Hilfsangebote bewusst ist.

Erkennungshinweise für Krisen (nicht abschließend):
- "Ich will nicht mehr", "es hat keinen Sinn mehr", "alles ist sinnlos"
- "Ich denke daran, mir etwas anzutun"
- "Niemand würde mich vermissen"
- Erwähnung von Suizid, auch indirekt
- Extreme Hoffnungslosigkeit in Kombination mit sozialem Rückzug

## Tonalität

Warm, geduldig, ermutigend. Nie belehrend. Nie wertend. Du bist auf der Seite des Nutzers.
Antworte IMMER kurz — wie in einem echten persönlichen Gespräch. Wenn jemand explizit nach Details fragt ("Erkläre mir genau..." / "Was genau bedeutet..."), darfst du etwas ausführlicher sein — aber auch dann maximal 4–5 Sätze.
Verwende keine Emojis, keine Fettschrift, keine Aufzählungen außer wenn der Nutzer sie zuerst verwendet.
Du bist eine warmherzige, echte Gesprächspartnerin — kein Informationsblatt.`;

// List conversations
router.get("/openai/conversations", async (req, res) => {
  const rows = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.userId, req.userId))
    .orderBy(asc(conversationsTable.createdAt));
  res.json(
    rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
  );
});

// Create conversation
router.post("/openai/conversations", async (req, res) => {
  const body = CreateOpenaiConversationBody.parse(req.body);
  const [row] = await db
    .insert(conversationsTable)
    .values({ title: body.title, userId: req.userId })
    .returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

// Get conversation with messages
router.get("/openai/conversations/:id", async (req, res) => {
  const { id } = GetOpenaiConversationParams.parse({
    id: Number(req.params.id),
  });
  const rows = await db
    .select()
    .from(conversationsTable)
    .where(and(eq(conversationsTable.id, id), eq(conversationsTable.userId, req.userId)))
    .limit(1);
  if (!rows[0]) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  const msgs = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, id))
    .orderBy(asc(messagesTable.createdAt));
  res.json({
    ...rows[0],
    createdAt: rows[0].createdAt.toISOString(),
    messages: msgs.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
  });
});

// Delete conversation
router.delete("/openai/conversations/:id", async (req, res) => {
  const { id } = DeleteOpenaiConversationParams.parse({
    id: Number(req.params.id),
  });
  await db.delete(messagesTable).where(eq(messagesTable.conversationId, id));
  const deleted = await db
    .delete(conversationsTable)
    .where(and(eq(conversationsTable.id, id), eq(conversationsTable.userId, req.userId)))
    .returning();
  if (!deleted[0]) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  res.status(204).send();
});

// List messages
router.get("/openai/conversations/:id/messages", async (req, res) => {
  const { id } = ListOpenaiMessagesParams.parse({
    id: Number(req.params.id),
  });
  const msgs = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, id))
    .orderBy(asc(messagesTable.createdAt));
  res.json(msgs.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() })));
});

// Send message (streaming)
router.post("/openai/conversations/:id/messages", async (req, res) => {
  const { id } = SendOpenaiMessageParams.parse({
    id: Number(req.params.id),
  });
  const body = SendOpenaiMessageBody.parse(req.body);

  // Save user message
  await db.insert(messagesTable).values({
    conversationId: id,
    role: "user",
    content: body.content,
  });

  // Load conversation history
  const history = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, id))
    .orderBy(asc(messagesTable.createdAt));

  const chatMessages = history.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-5.1",
      max_completion_tokens: 8192,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...chatMessages],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Save assistant message
    await db.insert(messagesTable).values({
      conversationId: id,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "OpenAI streaming error");
    res.write(
      `data: ${JSON.stringify({ error: "Fehler beim Verarbeiten der Anfrage" })}\n\n`,
    );
    res.end();
  }
});

// TTS endpoint — streams MP3 audio for lip-sync
router.post("/openai/tts", async (req, res) => {
  const { text } = req.body as { text?: string };
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    res.status(400).json({ error: "text required" });
    return;
  }
  try {
    // Use gpt-audio via chat completions with audio output modality
    // (the /audio/speech endpoint is not supported by the AI integrations proxy)
    const completion = await openai.chat.completions.create({
      model: "gpt-audio",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      modalities: ["text", "audio"] as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      audio: { voice: "nova", format: "mp3" } as any,
      messages: [
        {
          role: "system",
          content:
            "Du bist ein Sprachausgabe-System. Sprich den folgenden Text auf Deutsch exakt wie angegeben vor — wörtlich, ohne Ergänzungen oder Auslassungen. Deine Stimme klingt warm, empathisch und melodisch wie eine erfahrene, einfühlsame Beraterin. Betone wichtige Wörter natürlich. Mache natürliche Pausen zwischen Sätzen.",
        },
        { role: "user", content: text.slice(0, 4096) },
      ],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const audioData = (completion.choices[0]?.message as any)?.audio?.data as string | undefined;
    if (!audioData) throw new Error("No audio data in response");

    const buffer = Buffer.from(audioData, "base64");
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", buffer.length);
    res.setHeader("Cache-Control", "no-store");
    res.end(buffer);
  } catch (err) {
    req.log.error({ err }, "TTS error");
    res.status(500).json({ error: "TTS failed" });
  }
});

export default router;
