import { LegalLayout } from "@/components/layout/legal-layout";

export default function ImpressumPage() {
  return (
    <LegalLayout title="Impressum">
      <p>Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG):</p>

      <h2>Anbieter</h2>
      <p>
        Tom Daniel Schönknecht
        <br />
        Missionsstr. 1b
        <br />
        42285 Wuppertal
        <br />
        Deutschland
      </p>

      <h2>Kontakt</h2>
      <p>E-Mail: tom.schoenknecht@googlemail.com</p>

      <h2>Umsatzsteuer</h2>
      <p>
        Als Kleinunternehmer im Sinne von § 19 Abs. 1 UStG wird keine Umsatzsteuer
        berechnet und daher nicht ausgewiesen.
      </p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>Tom Daniel Schönknecht (Anschrift wie oben)</p>

      <h2>Haftung für Inhalte und Links</h2>
      <p>
        Die Inhalte dieser Anwendung wurden mit Sorgfalt erstellt. bari-guide ist ein
        Informations- und Begleitangebot von Betroffenen für Betroffene und stellt
        ausdrücklich keine medizinische Beratung, Diagnose oder Behandlung dar. Für die
        Richtigkeit, Vollständigkeit und Aktualität der Inhalte wird keine Gewähr übernommen;
        sie ersetzen keine ärztliche oder therapeutische Beratung. Für Inhalte externer Links
        sind ausschließlich deren Betreiber verantwortlich.
      </p>

      <h2>EU-Streitschlichtung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
        bereit:{" "}
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr/
        </a>
        . Zur Teilnahme an einem Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle sind wir nicht verpflichtet und nicht bereit.
      </p>

      <p className="text-sm text-muted-foreground">Stand: August 2026</p>
    </LegalLayout>
  );
}
