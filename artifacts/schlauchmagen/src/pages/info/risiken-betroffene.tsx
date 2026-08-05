import { InfoLayout } from "@/components/layout/info-layout";

export default function RisikenBetroffene() {
  return (
    <InfoLayout
      title="Schlauchmagen-Risiken – was sagen Betroffene?"
      description="Klinikprospekte listen Risiken auf. Was sie selten sagen: wie sich diese Risiken im echten Leben anfühlen und welche wirklich häufig vorkommen."
    >
      <p>
        Jede OP trägt Risiken. Das weiß man. Aber die Art, wie diese Risiken in Aufklärungsbögen
        präsentiert werden – als Liste mit Prozentsätzen – hilft selten dabei zu verstehen,
        was das im Alltag bedeutet. Dieser Text versucht, das anders zu machen.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">Die häufigsten Beschwerden in den ersten Wochen</h2>
      <p>
        Was fast alle berichten, ist nicht dramatisch, aber real: Übelkeit in den ersten Wochen,
        Schlucken das sich fremd anfühlt, Erschöpfung. Der Körper hat gerade einen großen
        Eingriff hinter sich. Das braucht Zeit.
      </p>
      <p>
        Reflux – saures Aufstoßen – tritt bei einem Teil der Betroffenen auf und kann
        hartnäckig sein. Manche berichten, dass er nach Monaten besser wird. Bei einigen
        bleibt er. Das ist einer der Punkte, den viele im Rückblick stärker gewichtet hätten.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">Nährstoffmangel – unterschätzt, aber lösbar</h2>
      <p>
        Nach einem Schlauchmagen verändert sich die Nährstoffaufnahme. Eisen, Vitamin B12,
        Vitamin D und Folsäure müssen dauerhaft ergänzt werden – lebenslang. Wer das
        vergisst oder aussetzt, riskiert ernsthafte Mangelerscheinungen: Erschöpfung,
        Haarausfall, Kribbeln in den Extremitäten.
      </p>
      <p>
        Viele berichten, dass dieser Punkt in der Aufklärung zwar erwähnt wird, aber
        nicht ausreichend vermittelt wird, wie ernst er zu nehmen ist. Regelmäßige
        Blutbild-Kontrollen sind kein Nice-to-have, sondern Pflicht.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">Das "Stretching" – was mit dem Magen passiert</h2>
      <p>
        Der verkleinerte Magen kann sich über Jahre wieder dehnen – besonders wenn man
        regelmäßig mehr isst als der Magen eigentlich fasst. Einige berichten, dass sie
        nach 5 bis 7 Jahren wieder deutlich mehr essen können als kurz nach der OP.
        Das ist kein Versagen, aber ein Risiko das viele nicht einkalkulieren.
      </p>
      <p>
        Ob es zu erneuter Gewichtszunahme führt, hängt auch von Gewohnheiten ab, die man
        in den ersten Jahren nach der OP aufbaut.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">Ernsthafte Komplikationen – wie häufig sind sie?</h2>
      <p>
        Schwere Komplikationen wie Nahtundichtigkeiten, Infektionen oder Thrombosen
        kommen vor – aber sie sind selten. Erfahrene Zentren mit hohen OP-Zahlen haben
        niedrigere Komplikationsraten als kleinere Krankenhäuser, die den Eingriff
        gelegentlich durchführen. Die Wahl des Zentrums macht einen Unterschied.
      </p>
      <p>
        Was viele berichten: Das Risiko der OP hat sich für sie anders angefühlt als das
        Risiko des Weiterlebens ohne OP. Diabetische Spätfolgen, Herzerkrankungen,
        eingeschränkte Mobilität – das sind auch Risiken. Nur leiser.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">Was viele im Rückblick sagen</h2>
      <p>
        Die meisten Betroffenen, die nach mehreren Jahren auf die Entscheidung zurückblicken,
        bereuen sie nicht. Das ist die ehrliche Mehrheit. Aber es gibt auch eine Minderheit,
        die sagt: Ich hätte bestimmte Risiken ernster genommen – besonders den Reflux,
        den Nährstoffmangel und die emotionalen Veränderungen.
      </p>
      <p>
        Eine gute Entscheidung trifft man mit vollständigen Informationen. Nicht nur mit
        den guten Seiten.
      </p>
    </InfoLayout>
  );
}
