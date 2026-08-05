import { InfoLayout } from "@/components/layout/info-layout";

export default function KlinikterminFragen() {
  return (
    <InfoLayout
      title="Was fragt man beim ersten Kliniktermin?"
      description="Der erste Termin in einem Adipositas-Zentrum ist oft kürzer als erwartet. Wer vorbereitet kommt, holt mehr raus – und trifft eine bessere Entscheidung."
    >
      <p>
        Viele berichten, dass sie nach dem ersten Kliniktermin verwirrt nach Hause gegangen sind.
        Nicht weil der Arzt unfreundlich war, sondern weil so viel gesagt wurde – und so wenig
        davon hängen blieb. Und weil die eigenen Fragen irgendwie nicht dran kamen.
      </p>
      <p>
        Das lässt sich ändern. Wer mit einer Liste kommt, kommt mit Antworten nach Hause.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">Fragen zur OP selbst</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Welche OP empfehlen Sie mir – und warum genau für mein Profil?</li>
        <li>Wie viele dieser Eingriffe machen Sie pro Jahr?</li>
        <li>Wie lange dauert die OP, wie lange der Krankenhausaufenthalt?</li>
        <li>Was passiert, wenn es Komplikationen gibt – wie ist das hier organisiert?</li>
        <li>Ist der Eingriff laparoskopisch geplant oder offen?</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">Fragen zum Prozess davor</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Welche Schritte muss ich durchlaufen, bevor ich operiert werden kann?</li>
        <li>Wie lange dauert das erfahrungsgemäß von heute bis zur OP?</li>
        <li>Was übernimmt die Krankenkasse – und was nicht?</li>
        <li>Brauche ich eine Kostenzusage, und wie beantrage ich die?</li>
        <li>Welche Voruntersuchungen sind nötig – und kann ich die beim Hausarzt machen lassen?</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">Fragen zur Nachsorge</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Wie läuft die Nachsorge bei Ihnen ab – wie oft, wie lange?</li>
        <li>Gibt es eine Ernährungsberatung, die zur Klinik gehört?</li>
        <li>Was passiert, wenn ich Fragen habe nach der OP – wen rufe ich an?</li>
        <li>Welche Nahrungsergänzungen brauche ich dauerhaft?</li>
        <li>Wie lange bin ich krankgeschrieben?</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">Fragen die viele nicht stellen – aber sollten</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Was passiert, wenn ich nach der OP wieder zunehme?</li>
        <li>Wie viel Gewicht verliere ich realistischerweise – nicht im besten Fall?</li>
        <li>Was sind die häufigsten Komplikationen bei diesem Eingriff in Ihrer Klinik?</li>
        <li>Gibt es Fälle, in denen Sie eine OP ablehnen – und welche wären das bei mir?</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">Was viele im Nachhinein sagen</h2>
      <p>
        "Ich hätte mehr fragen sollen." Das ist einer der häufigsten Sätze, wenn Betroffene auf
        den Zeitraum vor ihrer OP zurückblicken. Nicht weil die Klinik schlechte Arbeit geleistet
        hat – sondern weil der Termin kurz war, man selbst nervös war und die Fragen irgendwie
        im Kopf blieben.
      </p>
      <p>
        Es ist völlig in Ordnung, eine Liste mitzubringen. Und es ist völlig in Ordnung, nachzufragen
        wenn eine Antwort unklar war. Ein gutes Adipositas-Zentrum erwartet das.
      </p>
    </InfoLayout>
  );
}
