# Schlauchmagen-Begleiter (bari-guide.de)

Begleit-App für Menschen vor und nach einer bariatrischen OP. Ehrlich, ohne Versprechen, ohne Schönreden.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — API-Server starten (Port 5000)
- `pnpm --filter @workspace/schlauchmagen run dev` — Frontend starten (Port 3000)
- `pnpm run typecheck` — Typecheck über alle Pakete
- `pnpm run build` — Typecheck + Build aller Pakete
- `pnpm --filter @workspace/db run push` — DB-Schema pushen (nur Dev)
- Pflicht-Env: `DATABASE_URL` — Neon PostgreSQL Connection String

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 (Port 5000), serviert React-SPA als statische Dateien aus `dist/public`
- DB: Neon PostgreSQL + Drizzle ORM
- Auth: JWT (30 Tage) + Magic Link via Resend
- Validation: Zod (zod/v4), drizzle-zod
- Frontend: React + Vite + Wouter (Routing) + Tailwind + shadcn/ui
- API-Codegen: Orval (aus OpenAPI-Spec)
- Build: esbuild (CJS Bundle für Server)

## Where things live

- DB-Schema: `lib/db/src/schema/`
- API-Spec (Quelle): `lib/api-spec/openapi.yaml`
- Generierte API-Hooks: `lib/api-client-react/src/generated/api.ts`
- Server-Routen: `artifacts/api-server/src/routes/`
- Frontend-Seiten: `artifacts/schlauchmagen/src/pages/`
- Öffentliche Assets: `artifacts/schlauchmagen/public/`
- Middleware (Auth): `artifacts/api-server/src/middleware/`

## Architecture decisions

- Öffentliche SEO-Seiten unter `/info/*` laufen ohne ProtectedRoute (kein Login nötig für Google-Crawler)
- Onboarding-Flow: einmalig nach erstem Login, gespeichert als `onboarding_completed` in `user_profile`
- Magic Link Auth: kein Passwort, Token im localStorage unter `slm_token`
- Frontend und API laufen auf demselben Origin in Prod (Express serviert den Vite-Build)

## Product

- **Vor der OP**: Beratung (Schlauchmagen vs. Bypass), Voraussetzungen, Checkliste, Termine
- **Nach der OP**: Tagebuch, Gewichtstracker, KI-Chatbot
- **Öffentlich** (ohne Login): 6 SEO-Seiten unter `/info/` für organischen Traffic

## Deployment

- Railway (EU West), automatisch bei Push auf `main`
- Domain: bari-guide.de (INWX-Registrar, Cloudflare-DNS)
- E-Mail: Resend (Domain verifiziert mit DKIM + SPF)

## Personas

- Strategie-Projekt: `C:\claude-projekt\Strategie\PERSONAS-SCHLAUCHMAGEN.md`

## Gotchas

- Nach Schema-Änderungen: `pnpm --filter @workspace/db run push` ausführen
- Nach OpenAPI-Änderungen: `pnpm --filter @workspace/api-spec run codegen` ausführen (regeneriert Hooks + Zod-Typen)
- `mockup-sandbox` benötigt eine `PORT`-Env-Variable – schlägt beim globalen Build fehl, irrelevant für Prod
- Generierte Dateien in `lib/api-client-react/src/generated/` und `lib/api-zod/src/generated/` nicht manuell bearbeiten (außer als temporärer Workaround)
