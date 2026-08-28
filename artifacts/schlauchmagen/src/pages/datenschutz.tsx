import { LegalLayout } from "@/components/layout/legal-layout";

export default function DatenschutzPage() {
  return (
    <LegalLayout title="Datenschutzerklärung">
      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich für die Datenverarbeitung in dieser Anwendung ist:
        <br />
        Tom Daniel Schönknecht, Missionsstr. 1b, 42285 Wuppertal,
        <br />
        E-Mail: tom.schoenknecht@googlemail.com.
      </p>

      <h2>2. Überblick: Welche Daten wir verarbeiten</h2>
      <p>
        bari-guide begleitet dich vor und nach einer bariatrischen Operation. Damit die App
        funktioniert, verarbeiten wir im Wesentlichen: deine <strong>E-Mail-Adresse</strong>{" "}
        (für die passwortlose Anmeldung), von dir eingegebene{" "}
        <strong>Gesundheits- und Nutzungsdaten</strong> (z. B. geplante oder erfolgte OP-Art,
        Gewichtsverlauf, Tagebucheinträge, Termine, Antworten im Eingangstest) sowie
        technisch notwendige <strong>Server-Logdaten</strong>. Wir setzen keine Tracking-Cookies
        und keine Analyse- oder Werbedienste ein.
      </p>

      <h2>3. Hosting (Northflank)</h2>
      <p>
        Die Anwendung wird bei <strong>Northflank Ltd</strong> (Vereinigtes Königreich) in einem
        Rechenzentrum in <strong>Frankfurt am Main (EU)</strong> betrieben. Beim Aufruf
        verarbeitet der Server technisch notwendige Logdaten, insbesondere die IP-Adresse,
        Datum und Uhrzeit des Zugriffs sowie den verwendeten Browser. Rechtsgrundlage ist
        Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer sicheren, stabilen
        Bereitstellung). Für das Vereinigte Königreich besteht ein Angemessenheitsbeschluss
        der EU-Kommission.
      </p>

      <h2>4. Nutzerkonto und Anmeldung per Magic-Link</h2>
      <p>
        Die Nutzung erfolgt über ein Konto. Zur Anmeldung nutzen wir ein passwortloses
        Verfahren (Magic-Link): Du gibst deine E-Mail-Adresse ein und erhältst einen
        Anmeldelink. Für den Versand dieser E-Mails setzen wir den Dienstleister{" "}
        <strong>Resend, Inc.</strong> (USA) ein, der den technischen Versand über Amazon SES in
        einem Rechenzentrum innerhalb der <strong>EU (Irland)</strong> abwickelt. Übermittelt
        wird dabei deine E-Mail-Adresse. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
        (Bereitstellung des von dir angeforderten Kontos). Deine Anmeldung wird anschließend
        über ein technisch notwendiges Token in deinem Browser (Local Storage) gehalten; dies
        ist kein Tracking.
      </p>

      <h2>5. Gesundheitsdaten (besondere Kategorien, Art. 9 DSGVO)</h2>
      <p>
        Ein Teil der von dir freiwillig eingegebenen Angaben – etwa die Art der geplanten oder
        erfolgten Operation, dein Gewichtsverlauf, Tagebucheinträge oder Antworten im
        Eingangstest – sind <strong>Gesundheitsdaten</strong> und damit besonders geschützte
        Daten im Sinne von Art. 9 DSGVO. Wir verarbeiten diese Daten ausschließlich, um dir die
        von dir genutzten Funktionen (Tagebuch, Gewichtsprotokoll, Termine, persönliche
        Auswertungen) bereitzustellen. Rechtsgrundlage ist deine{" "}
        <strong>ausdrückliche Einwilligung</strong> nach Art. 9 Abs. 2 lit. a DSGVO, die du mit
        der Eingabe dieser Daten erteilst, in Verbindung mit Art. 6 Abs. 1 lit. b DSGVO. Diese
        Daten sind nur dir in deinem Konto zugänglich; wir geben sie nicht an Dritte weiter und
        nutzen sie nicht zu Werbezwecken. Du kannst einzelne Einträge oder dein gesamtes Konto
        jederzeit löschen; deine Einwilligung kannst du jederzeit mit Wirkung für die Zukunft
        widerrufen.
      </p>

      <h2>6. Speicherung deiner Daten (Neon-Datenbank)</h2>
      <p>
        Deine Konto- und App-Daten werden in einer Datenbank unseres Auftragsverarbeiters{" "}
        <strong>Neon, Inc.</strong> (USA) gespeichert, die in einem Rechenzentrum innerhalb der{" "}
        <strong>EU (Frankfurt am Main)</strong> betrieben wird. Rechtsgrundlage ist Art. 6
        Abs. 1 lit. b DSGVO bzw. – für Gesundheitsdaten – Art. 9 Abs. 2 lit. a DSGVO. Soweit
        Neon als US-Unternehmen Zugriff haben könnte, ist die Übermittlung über die
        EU-Standardvertragsklauseln bzw. das EU-US Data Privacy Framework abgesichert. Die
        Daten werden gespeichert, bis du sie oder dein Konto löschst.
      </p>

      <h2>7. KI-Begleiter (optional, nur im Deluxe-Tarif)</h2>
      <p>
        Im Deluxe-Tarif kannst du einen KI-gestützten Begleiter nutzen. Diese Funktion läuft
        nur, wenn du sie <strong>aktiv auslöst</strong>. Dabei werden deine{" "}
        <strong>Nachrichten und ein kurzer Kontext</strong> zu deiner Situation zur Verarbeitung
        an KI-Dienstleister übermittelt: <strong>OpenAI</strong> (OpenAI, L.L.C., USA) für die
        Textantworten und Sprachausgabe sowie – für die sprechende Darstellung –{" "}
        <strong>ElevenLabs</strong> (ElevenLabs Inc., USA) und <strong>D-ID</strong> (D-ID Ltd.,
        Israel). Da hierbei Gesundheitsbezug bestehen kann, ist Rechtsgrundlage deine{" "}
        <strong>ausdrückliche Einwilligung</strong> nach Art. 9 Abs. 2 lit. a in Verbindung mit
        Art. 6 Abs. 1 lit. a DSGVO, die du durch das aktive Nutzen der Funktion erteilst. Für
        Israel besteht ein Angemessenheitsbeschluss der EU-Kommission; die Übermittlung in die
        USA ist über die EU-Standardvertragsklauseln bzw. das EU-US Data Privacy Framework
        abgesichert. Wenn du den KI-Begleiter nicht nutzt, findet keine solche Übermittlung
        statt.
      </p>

      <h2>8. Abonnement und Zahlungsabwicklung (Stripe)</h2>
      <p>
        Für kostenpflichtige Abonnements nutzen wir den Zahlungsdienstleister{" "}
        <strong>Stripe, Inc.</strong> (USA). Bei einem Kauf werden Name, E-Mail-Adresse und
        Zahlungsdaten an Stripe übermittelt und dort verarbeitet; die Zahlungsdaten selbst
        werden von Stripe erhoben, wir erhalten keine vollständigen Kartendaten. Die
        Übermittlung in die USA erfolgt auf Grundlage der EU-Standardvertragsklauseln.
        Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
        Weitere Informationen:{" "}
        <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer">
          stripe.com/de/privacy
        </a>
        . Für das Abo-Management (Kündigung, Planwechsel) steht dir im Bereich „Konto" das
        Stripe-Kundenportal zur Verfügung.
      </p>

      <h2>9. Schriftarten</h2>
      <p>
        Die verwendete Schriftart wird <strong>lokal von unserem eigenen Server ausgeliefert</strong>{" "}
        und nicht von einem externen Anbieter (z. B. Google Fonts) nachgeladen. Es findet dabei
        keine Übermittlung deiner IP-Adresse oder anderer Daten an Dritte statt.
      </p>

      <h2>10. Speicherdauer</h2>
      <p>
        Wir speichern deine Daten nur so lange, wie es für die genannten Zwecke erforderlich
        ist oder wie du dein Konto nutzt. Nach Löschung deines Kontos werden deine Konto- und
        Gesundheitsdaten gelöscht, soweit keine gesetzlichen Aufbewahrungspflichten
        entgegenstehen (z. B. handels- und steuerrechtliche Pflichten bei
        Zahlungsvorgängen).
      </p>

      <h2>11. Deine Rechte</h2>
      <p>
        Dir stehen jederzeit die Rechte auf Auskunft (Art. 15), Berichtigung (Art. 16),
        Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit
        (Art. 20) sowie Widerspruch (Art. 21) zu. Eine erteilte Einwilligung kannst du
        jederzeit mit Wirkung für die Zukunft widerrufen. Zudem hast du ein Beschwerderecht bei
        einer Datenschutz-Aufsichtsbehörde – für uns zuständig ist die Landesbeauftragte für
        Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW).
      </p>

      <h2>12. Widerrufsrecht (digitale Inhalte)</h2>
      <p>
        Du hast das Recht, einen Abo-Vertrag binnen 14 Tagen ohne Angabe von Gründen zu
        widerrufen. Die Widerrufsfrist beträgt 14 Tage ab dem Tag des Vertragsabschlusses. Mit
        dem Kauf stimmst du ausdrücklich zu, dass wir mit der Ausführung des Vertrags beginnen;
        dein Widerrufsrecht erlischt, sobald der Zugang vollständig freigeschaltet wurde und du
        die Nutzung aktiv begonnen hast (§ 356 Abs. 5 BGB). Zur Ausübung des Widerrufsrechts
        wende dich per E-Mail an tom.schoenknecht@googlemail.com.
      </p>

      <h2>13. Kontakt in Datenschutzfragen</h2>
      <p>
        Bei Fragen zum Datenschutz oder zur Ausübung deiner Rechte wende dich an:
        tom.schoenknecht@googlemail.com.
      </p>

      <p className="text-sm text-muted-foreground">Stand: August 2026</p>
    </LegalLayout>
  );
}
