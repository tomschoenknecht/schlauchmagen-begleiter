import { InfoLayout } from "@/components/layout/info-layout";

export default function WegZurOp() {
  return (
    <InfoLayout
      title="Wie lange dauert der Weg zur bariatrischen OP?"
      description="Von der ersten Recherche bis zum OP-Termin vergehen oft Monate. Was in dieser Zeit passiert – und wie man die Wartezeit sinnvoll nutzt."
    >
      <p>
        Eine der ersten Fragen, die viele stellen: Wie lange dauert das alles? Die ehrliche
        Antwort ist: länger als man denkt. Und gleichzeitig ist diese Zeit nicht verschwendet –
        wenn man sie richtig nutzt.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">Die typische Zeitlinie</h2>
      <p>
        Erfahrungswerte aus dem Gespräch mit Betroffenen zeigen ein ähnliches Muster:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Monat 1–2:</strong> Erster Kliniktermin, erste Gespräche, Voruntersuchungen</li>
        <li><strong>Monat 2–6:</strong> Konservatives Therapieprogramm, Ernährungsberatung, psychologisches Assessment</li>
        <li><strong>Monat 3–8:</strong> Antrag auf Kostenübernahme bei der Krankenkasse, Warten auf Genehmigung</li>
        <li><strong>Monat 6–12:</strong> OP-Termin, je nach Warteliste des Zentrums</li>
      </ul>
      <p>
        Insgesamt berichten viele von 9 bis 18 Monaten zwischen erstem Termin und OP. Manche
        schaffen es in 6 Monaten, andere warten länger – besonders wenn Kassen Anträge ablehnen
        oder Unterlagen fehlen.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">Die Kostenzusage – der häufigste Stolperstein</h2>
      <p>
        Viele berichten, dass die Krankenkasse der schwierigste Teil des Prozesses war – nicht
        die Klinik, nicht die Untersuchungen. Ablehnungen kommen vor, oft mit der Begründung,
        dass konservative Maßnahmen nicht ausreichend dokumentiert sind.
      </p>
      <p>
        Was hilft: Alle Versuche des Abnehmens über die Jahre dokumentieren, Arztbriefe sammeln,
        Ernährungsberatungen belegen. Wer einen Widerspruch einlegt, hat oft Erfolg – aber es
        braucht Zeit und manchmal anwaltliche Unterstützung.
      </p>
      <p>
        Manche Kliniken haben eigene Sozialarbeiter oder Case Manager, die bei diesem Prozess
        helfen. Das lohnt sich zu fragen.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">Was man in dieser Zeit tun kann</h2>
      <p>
        Die Wartezeit fühlt sich oft wie Stillstand an. Ist sie nicht. Viele berichten im
        Rückblick, dass sie die Monate vor der OP unterschätzt haben – und dass sie froh wären,
        sie bewusster genutzt zu haben.
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Ernährung beobachten und langsam anpassen – nicht für Gewichtsverlust, sondern als Vorbereitung</li>
        <li>Bewegung einführen, die nach der OP weitergeführt werden kann</li>
        <li>Fragen sammeln für den nächsten Kliniktermin</li>
        <li>Sich mit dem Thema Nahrungsergänzung auseinandersetzen</li>
        <li>Unterstützung im Umfeld klären: Wer weiß davon, wer hilft direkt nach der OP?</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">Selbstzahler – schneller, aber teuer</h2>
      <p>
        Wer die Kosten selbst trägt, kann den Prozess erheblich verkürzen. Ein Schlauchmagen
        kostet als Selbstzahlerleistung je nach Klinik und Region zwischen 8.000 und 15.000 Euro.
        Manche Betroffene entscheiden sich dafür, wenn die Krankenkasse ablehnt oder die
        Wartezeit zu lang ist.
      </p>
      <p>
        Das ist eine persönliche Entscheidung. Wer diesen Weg erwägt, sollte mehrere Angebote
        vergleichen und auf die Erfahrung des Zentrums achten – nicht nur auf den Preis.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">Der erste Schritt</h2>
      <p>
        Viele berichten, dass der erste Schritt der schwerste war – nicht die OP, nicht
        die Wartezeit. Sondern der erste Anruf bei einem Adipositas-Zentrum. Das Gefühl,
        es wirklich in Angriff zu nehmen.
      </p>
      <p>
        Wenn du das liest und noch nicht angerufen hast: Das ist der einzige Schritt,
        der heute zählt.
      </p>
    </InfoLayout>
  );
}
