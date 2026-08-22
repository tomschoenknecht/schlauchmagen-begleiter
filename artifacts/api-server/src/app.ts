import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "node:path";
import fs from "node:fs";
import router from "./routes";
import { billingWebhookHandler } from "./routes/billing-webhook";
import { logger } from "./lib/logger";

const INFO_META: Record<string, { title: string; description: string }> = {
  "/info/schlauchmagen-oder-bypass": {
    title: "Schlauchmagen oder Magenbypass – was passt zu mir?",
    description: "Beide OPs helfen beim Abnehmen. Aber sie funktionieren anders, haben unterschiedliche Risiken und passen zu unterschiedlichen Menschen.",
  },
  "/info/kliniktermin-fragen": {
    title: "Was fragt man beim ersten Kliniktermin?",
    description: "Der erste Termin in einem Adipositas-Zentrum ist oft kürzer als erwartet. Wer vorbereitet kommt, holt mehr raus – und trifft eine bessere Entscheidung.",
  },
  "/info/was-danach-passiert": {
    title: "Schlauchmagen: Was danach wirklich passiert",
    description: "Die ersten Wochen nach einer bariatrischen OP sind anders als man sie sich vorstellt. Was viele berichten – ehrlich, ohne Beschönigung.",
  },
  "/info/bin-ich-geeignet": {
    title: "Bin ich für eine Bariatrie-OP geeignet?",
    description: "Nicht jeder kommt sofort für eine bariatrische OP in Frage – und das hat nichts mit Willenskraft zu tun. Was die Kriterien sind und was viele über den Prozess berichten.",
  },
  "/info/risiken-betroffene": {
    title: "Schlauchmagen-Risiken – was sagen Betroffene?",
    description: "Klinikprospekte listen Risiken auf. Was sie selten sagen: wie sich diese Risiken im echten Leben anfühlen und welche wirklich häufig vorkommen.",
  },
  "/info/weg-zur-op": {
    title: "Wie lange dauert der Weg zur bariatrischen OP?",
    description: "Von der ersten Recherche bis zum OP-Termin vergehen oft Monate. Was in dieser Zeit passiert – und wie man die Wartezeit sinnvoll nutzt.",
  },
};

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());

// www -> Apex (301). Ersetzt die bisherige Cloudflare-Redirect-Rule, sobald www auf Northflank zeigt.
app.use((req, res, next) => {
  const host = req.headers.host;
  if (host && host.toLowerCase().startsWith("www.")) {
    res.redirect(301, `https://${host.slice(4)}${req.originalUrl}`);
    return;
  }
  next();
});

// Stripe-Webhook braucht den Raw-Body und muss VOR express.json() stehen.
app.post(
  "/api/billing/webhook",
  express.raw({ type: "application/json" }),
  billingWebhookHandler,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Frontend-Dateien ausliefern (Production)
// __dirname wird vom esbuild-Banner auf das dist/-Verzeichnis gesetzt
const frontendDist = path.join(__dirname, "../../schlauchmagen/dist/public");
app.use(express.static(frontendDist));

// OG-Tags für /info/*-Seiten serverseitig injizieren
app.get("/info/:slug", (req, res) => {
  const meta = INFO_META[`/info/${req.params.slug}`];
  if (!meta) {
    res.sendFile(path.join(frontendDist, "index.html"));
    return;
  }
  const indexPath = path.join(frontendDist, "index.html");
  const html = fs.readFileSync(indexPath, "utf-8");
  const url = `https://bari-guide.de/info/${req.params.slug}`;
  const patched = html
    .replace(/<title>.*?<\/title>/, `<title>${meta.title} | bari-guide</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${meta.description}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${meta.title}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${meta.description}" />`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${meta.title}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${meta.description}" />`)
    .replace(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="article" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:site_name"[^>]*>/, `<meta property="og:site_name" content="bari-guide" />`)
    .replace(/<meta property="og:locale"[^>]*>/, `<meta property="og:locale" content="de_DE" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
  res.send(patched);
});

app.use((_req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

export default app;

