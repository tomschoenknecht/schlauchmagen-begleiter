import { Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

interface InfoLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function InfoLayout({ title, description, children }: InfoLayoutProps) {
  const [location] = useLocation();
  const pageUrl = `https://bari-guide.de${location}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: pageUrl,
    inLanguage: "de",
    publisher: {
      "@type": "Organization",
      name: "bari-guide",
      url: "https://bari-guide.de",
    },
    author: {
      "@type": "Organization",
      name: "bari-guide",
    },
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="border-b bg-card px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/login">
            <span className="text-sm font-semibold text-primary cursor-pointer">bari-guide</span>
          </Link>
          <Link href="/login">
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Zur App</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/login">
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer mb-8">
            <ArrowLeft className="w-4 h-4" /> Zurück zur Startseite
          </span>
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">{title}</h1>
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">{description}</p>

        <div className="prose prose-stone max-w-none text-foreground leading-relaxed space-y-6">
          {children}
        </div>

        <div className="mt-16 rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center">
          <h2 className="text-xl font-bold text-foreground mb-3">Nicht allein durch diesen Weg</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            bari-guide begleitet dich von der ersten Überlegung bis nach der OP — mit Tagebuch,
            Tracker, Informationen und einem persönlichen KI-Assistenten.
          </p>
          <Link href="/login">
            <span className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-xl cursor-pointer hover:opacity-90 transition-opacity">
              Kostenlos ausprobieren
            </span>
          </Link>
        </div>
      </main>

      <footer className="border-t py-8 px-6 text-center text-xs text-muted-foreground space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Link href="/impressum"><span className="hover:text-foreground cursor-pointer">Impressum</span></Link>
          <span>·</span>
          <Link href="/datenschutz"><span className="hover:text-foreground cursor-pointer">Datenschutz</span></Link>
        </div>
        <p>bari-guide ist kein medizinisches Produkt und ersetzt keine ärztliche Beratung.</p>
      </footer>
    </div>
  );
}
