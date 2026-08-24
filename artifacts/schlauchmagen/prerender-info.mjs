// Rendert die statischen /info/-Seiten zu HTML, damit Crawler ohne JavaScript
// den Inhalt sehen. Ergebnis landet in dist/public/info-prerender.json und wird
// vom api-server in das leere <div id="root"> injiziert.
//
// Hintergrund: Die App ist eine SPA. Ohne diesen Schritt liefert der Server für
// jede Info-Seite ein leeres div aus. Google rendert JavaScript verzoegert,
// Bing nur eingeschraenkt, und die KI-Crawler (GPTBot, ClaudeBot, PerplexityBot)
// gar nicht. Die in llms.txt verlinkten Seiten waeren fuer sie leer.
//
// Aufruf: node prerender-info.mjs   (laeuft nach dem vite-Build)

import { createRequire } from "node:module";
import { renderToStaticMarkup } from "react-dom/server";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HIER = path.dirname(fileURLToPath(import.meta.url));

// esbuild liegt im api-server-Paket des Workspace, nicht hier.
const require2 = createRequire(import.meta.url);
const { build } = require2(path.join(HIER, "../api-server/node_modules/esbuild"));
const SEITEN_DIR = path.join(HIER, "src/pages/info");
const ZIEL = path.join(HIER, "dist/public/info-prerender.json");
const TMP = path.join(HIER, ".prerender-tmp");

// InfoLayout durch eine Fassung ersetzen, die nur den Artikelinhalt liefert.
// Das echte Layout braucht den wouter-Router und rendert Kopf- und Fusszeile,
// die im injizierten HTML nichts zu suchen haben - die baut React beim Mounten.
const LAYOUT_STUB = `
import React from "react";
export function InfoLayout({ title, description, children }) {
  return React.createElement(
    "article",
    null,
    React.createElement("h1", null, title),
    React.createElement("p", null, description),
    children,
  );
}
export default InfoLayout;
`;

async function main() {
  const dateien = fs
    .readdirSync(SEITEN_DIR)
    .filter((f) => f.endsWith(".tsx"))
    .sort();

  if (dateien.length === 0) {
    console.error("Keine Info-Seiten gefunden in " + SEITEN_DIR);
    process.exit(1);
  }

  fs.mkdirSync(TMP, { recursive: true });
  const stubPfad = path.join(TMP, "info-layout-stub.mjs");
  fs.writeFileSync(stubPfad, LAYOUT_STUB, "utf8");

  const ergebnis = {};

  for (const datei of dateien) {
    const slug = datei.replace(/\.tsx$/, "");
    const eintrag = path.join(SEITEN_DIR, datei);
    const gebaut = path.join(TMP, slug + ".mjs");

    await build({
      entryPoints: [eintrag],
      outfile: gebaut,
      bundle: true,
      format: "esm",
      platform: "node",
      jsx: "automatic",
      logLevel: "silent",
      external: ["react", "react-dom"],
      alias: {
        "@/components/layout/info-layout": stubPfad,
      },
      plugins: [
        {
          // Alles andere aus dem Frontend (Router, Icons, UI-Bausteine) wird
          // fuer den Artikeltext nicht gebraucht und durch Leerteile ersetzt.
          name: "frontend-stubs",
          setup(b) {
            b.onResolve({ filter: /^(wouter|lucide-react|@\/)/ }, (args) => {
              if (args.path === "@/components/layout/info-layout") return null;
              return { path: args.path, namespace: "stub" };
            });
            b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({
              contents:
                'export default new Proxy(function(){}, { get: () => () => null });' +
                'export const Link = () => null;' +
                'export const useLocation = () => ["/"];',
              loader: "js",
            }));
          },
        },
      ],
    });

    const modul = await import("file://" + gebaut.replace(/\\/g, "/") + "?t=" + Date.now());
    const Komponente = modul.default;
    const html = renderToStaticMarkup(Komponente());

    // Titel und Beschreibung stehen als erstes h1/p im Stub-Layout und werden
    // vom Server separat als Meta-Tags gesetzt - hier interessiert der Fliesstext.
    ergebnis["/info/" + slug] = html;
    const woerter = html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
    console.log("  " + slug + ": " + woerter + " Woerter");
  }

  fs.mkdirSync(path.dirname(ZIEL), { recursive: true });
  fs.writeFileSync(ZIEL, JSON.stringify(ergebnis, null, 2), "utf8");
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log("\ngeschrieben: dist/public/info-prerender.json (" + dateien.length + " Seiten)");
}

main().catch((e) => {
  console.error("Prerendering fehlgeschlagen:", e);
  process.exit(1);
});
