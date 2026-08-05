import { InfoLayout } from "@/components/layout/info-layout";

export default function BinIchGeeignet() {
  return (
    <InfoLayout
      title="Bin ich für eine Bariatrie-OP geeignet?"
      description="Nicht jeder kommt sofort für eine bariatrische OP in Frage – und das hat nichts mit Willenskraft zu tun. Was die Kriterien sind und was viele über den Prozess berichten."
    >
      <p>
        Eine der häufigsten Fragen vor dem ersten Kliniktermin: Komme ich überhaupt in Frage?
        Die Antwort hängt von mehreren Faktoren ab – und ist oft komplexer als ein einfaches
        Ja oder Nein.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">Was die Leitlinien sagen</h2>
      <p>
        In Deutschland orientieren sich Adipositas-Zentren an den Leitlinien der Deutschen
        Gesellschaft für Allgemein- und Viszeralchirurgie. Die Grundkriterien:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>BMI ab 40 – oder BMI ab 35 mit einer schwerwiegenden Begleiterkrankung (Diabetes Typ 2, Bluthochdruck, Schlafapnoe, schwere Gelenkerkrankungen)</li>
        <li>Nachweis, dass konservative Therapien (Diäten, Ernährungsberatung, Medikamente) über einen längeren Zeitraum nicht ausreichend gewirkt haben</li>
        <li>Psychologische Eignung: keine aktive Suchterkrankung, keine unbehandelte schwere psychische Erkrankung</li>
        <li>Bereitschaft zur lebenslangen Nachsorge</li>
      </ul>
      <p className="text-sm text-muted-foreground mt-2">
        Dies sind allgemeine Leitlinien. Ob und welcher Eingriff für dich geeignet ist,
        entscheidet das Adipositas-Team nach einem individuellen Assessment.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">Was "konservative Therapie" bedeutet</h2>
      <p>
        Viele berichten Frustration darüber, dass sie erst nachweisen müssen, dass Diäten
        nicht funktioniert haben. Das fühlt sich an wie: "Beweise, dass du es wirklich versucht hast."
      </p>
      <p>
        Was dahintersteckt: Die Krankenkassen verlangen diesen Nachweis als Bedingung für
        die Kostenübernahme. In der Praxis bedeutet das oft ein strukturiertes Programm über
        6 bis 12 Monate – manchmal weniger, wenn Begleiterkrankungen die Dringlichkeit erhöhen.
        Dokumentation ist dabei wichtig: Ernährungsberatung, Arztbesuche, Therapieprogramme.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">Die psychologische Evaluation</h2>
      <p>
        Ein Gespräch mit einem Psychologen oder Psychiater ist Teil des Prozesses.
        Das schreckt viele ab – aber es ist kein Test den man bestehen oder nicht bestehen kann.
        Es geht darum zu verstehen, ob du weißt was auf dich zukommt, ob du ein stabiles
        Umfeld hast und ob es akute psychische Belastungen gibt, die zuerst behandelt werden sollten.
      </p>
      <p>
        Viele berichten, dass dieses Gespräch das hilfreichste im ganzen Prozess war –
        weil es ihnen geholfen hat, die eigene Motivation zu klären.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">Was passiert, wenn man abgelehnt wird</h2>
      <p>
        Manchmal empfiehlt ein Adipositas-Zentrum, zunächst andere Schritte zu gehen:
        eine psychische Erkrankung behandeln, eine Sucht adressieren, zunächst Gewicht
        durch Medikamente oder Programme reduzieren. Das ist keine Ablehnung auf Dauer,
        sondern eine Empfehlung zur Reihenfolge.
      </p>
      <p>
        Zweitmeinungen sind möglich und manchmal sinnvoll. Verschiedene Zentren haben
        unterschiedliche Schwerpunkte und Erfahrungen.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">Was die Frage wirklich ist</h2>
      <p>
        Ob man "geeignet" ist, hängt an Kriterien. Ob man bereit ist, ist eine andere Frage –
        und die stellt man sich selbst. Viele berichten, dass sie lange gewartet haben mit
        dem ersten Schritt, weil sie unsicher waren ob sie "schlimm genug dran" sind.
      </p>
      <p>
        Wenn du seit Jahren mit dem Gewicht kämpfst, es Begleiterkrankungen gibt und du
        das Thema OP ernsthaft in Erwägung ziehst – dann lohnt sich das erste Gespräch
        mit einem Adipositas-Zentrum. Das kostet nichts außer Zeit und gibt dir Klarheit.
      </p>
    </InfoLayout>
  );
}
