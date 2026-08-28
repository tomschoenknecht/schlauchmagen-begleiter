import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

interface LegalLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b bg-card px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/">
            <span className="text-sm font-semibold text-primary cursor-pointer">bari-guide</span>
          </Link>
          <Link href="/">
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Zur App</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/">
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer mb-8">
            <ArrowLeft className="w-4 h-4" /> Zurück zur Startseite
          </span>
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 leading-tight">{title}</h1>

        <div className="prose prose-stone max-w-none text-foreground leading-relaxed">
          {children}
        </div>

        <div className="mt-16 flex gap-4 text-sm text-muted-foreground border-t pt-6">
          <Link href="/impressum"><span className="hover:text-foreground cursor-pointer">Impressum</span></Link>
          <span>·</span>
          <Link href="/datenschutz"><span className="hover:text-foreground cursor-pointer">Datenschutz</span></Link>
        </div>
      </main>

      <footer className="border-t py-8 px-6 text-center text-xs text-muted-foreground">
        bari-guide ist kein medizinisches Produkt und ersetzt keine ärztliche Beratung.
      </footer>
    </div>
  );
}
