import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, magicLinksTable } from "@workspace/db/schema";
import { eq, and, gt, isNull } from "drizzle-orm";
import { Resend } from "resend";
import { randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Einfacher In-Memory-Rate-Limiter fuer den Magic-Link-Versand. Verhindert, dass jemand
// massenhaft Login-Mails an beliebige Adressen ausloest (Mail-Spam / Resend-Kosten).
// Reicht fuer den aktuellen Single-Instance-Betrieb; bei mehreren Instanzen spaeter durch
// einen geteilten Speicher (z. B. Redis) ersetzen.
const MAGIC_LINK_WINDOW_MS = 15 * 60 * 1000; // 15 Minuten
const MAGIC_LINK_MAX_PER_EMAIL = 3; // pro E-Mail im Fenster
const MAGIC_LINK_MAX_GLOBAL = 60; // insgesamt im Fenster (grobe Notbremse)
const magicLinkHits = new Map<string, number[]>();

function tooManyMagicLinks(email: string): boolean {
  const now = Date.now();
  const cutoff = now - MAGIC_LINK_WINDOW_MS;
  for (const [key, times] of magicLinkHits) {
    const kept = times.filter((t) => t > cutoff);
    if (kept.length === 0) magicLinkHits.delete(key);
    else magicLinkHits.set(key, kept);
  }
  const globalCount = [...magicLinkHits.values()].reduce((n, t) => n + t.length, 0);
  const emailHits = magicLinkHits.get(email) ?? [];
  if (emailHits.length >= MAGIC_LINK_MAX_PER_EMAIL || globalCount >= MAGIC_LINK_MAX_GLOBAL) {
    return true;
  }
  magicLinkHits.set(email, [...emailHits, now]);
  return false;
}

router.post("/auth/magic-link", async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "E-Mail fehlt" });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (tooManyMagicLinks(normalizedEmail)) {
    res.status(429).json({ error: "Zu viele Anfragen. Bitte in einigen Minuten erneut versuchen." });
    return;
  }
  const secret = process.env.JWT_SECRET;
  const resendKey = process.env.RESEND_API_KEY;
  if (!secret || !resendKey) {
    res.status(500).json({ error: "Server-Konfiguration unvollständig" });
    return;
  }

  // Nutzer anlegen wenn noch nicht vorhanden
  let [user] = await db.select().from(usersTable).where(eq(usersTable.email, normalizedEmail));
  if (!user) {
    [user] = await db.insert(usersTable).values({ email: normalizedEmail }).returning();
  }

  // Token generieren
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 Minuten
  await db.insert(magicLinksTable).values({ email: normalizedEmail, token, expiresAt });

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const link = `${appUrl}/auth/callback?token=${token}`;

  const resend = new Resend(resendKey);
  const from = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

  const { error } = await resend.emails.send({
    from: `Bari-Guide <${from}>`,
    to: normalizedEmail,
    subject: "Dein Zugangslink",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
        <h2 style="margin-bottom:16px">Dein Zugangslink</h2>
        <p>Klicke auf den Button, um dich einzuloggen. Der Link ist 15 Minuten gültig.</p>
        <a href="${link}"
           style="display:inline-block;margin-top:24px;padding:14px 28px;background:#7c3aed;color:#fff;
                  border-radius:8px;text-decoration:none;font-weight:600">
          Jetzt einloggen
        </a>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">
          Falls du diesen Link nicht angefordert hast, kannst du diese E-Mail ignorieren.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Magic-Link-Versand fehlgeschlagen:", error);
    res.status(502).json({ error: "E-Mail konnte nicht versendet werden" });
    return;
  }

  res.json({ ok: true });
});

router.get("/auth/verify", async (req, res) => {
  const { token } = req.query;
  if (!token || typeof token !== "string") {
    res.status(400).json({ error: "Token fehlt" });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: "Server-Konfiguration unvollständig" });
    return;
  }

  const [link] = await db
    .select()
    .from(magicLinksTable)
    .where(
      and(
        eq(magicLinksTable.token, token),
        gt(magicLinksTable.expiresAt, new Date()),
        isNull(magicLinksTable.usedAt),
      ),
    );

  if (!link) {
    res.status(401).json({ error: "Link ungültig oder abgelaufen" });
    return;
  }

  await db
    .update(magicLinksTable)
    .set({ usedAt: new Date() })
    .where(eq(magicLinksTable.token, token));

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, link.email));
  if (!user) {
    res.status(401).json({ error: "Benutzer nicht gefunden" });
    return;
  }

  const jwtToken = jwt.sign({ sub: user.id }, secret, { expiresIn: "30d" });
  res.json({ token: jwtToken });
});

router.get("/auth/refresh", requireAuth, (req, res) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: "Server-Konfiguration unvollständig" });
    return;
  }
  const token = jwt.sign({ sub: req.userId }, secret, { expiresIn: "30d" });
  res.json({ token });
});

export const authRouter = router;
