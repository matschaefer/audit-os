const STEPS = [
  {
    title: "Kundensituation erfassen",
    description: "Unternehmensdaten, Lead-Situation und Schmerzpunkte im Erstgespräch aufnehmen.",
  },
  {
    title: "Manuelle Prozesse analysieren",
    description: "Wiederkehrende Abläufe, Häufigkeit und Automatisierungsgrad bewerten.",
  },
  {
    title: "ROI & Zeitersparnis berechnen",
    description: "Prozess-Score, Automatisierungspotenzial und Kosteneinsparung deterministisch ableiten.",
  },
  {
    title: "Synkro-Angebot empfehlen",
    description: "Erkannte Probleme automatisch dem passenden Angebot zuordnen.",
  },
  {
    title: "Report für Kundengespräch vorbereiten",
    description: "Kundenfähige Auswertung mit Maßnahmenplan und Umsetzungsrahmen erzeugen.",
  },
];

export function ProductFlowSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-brand-dark sm:text-3xl">
          Vom Erstgespräch zum kundenfähigen Report
        </h2>
      </div>

      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="rounded-xl border border-border-subtle bg-surface p-5 shadow-sm"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-semibold text-brand-primary">
              {index + 1}
            </span>
            <p className="mt-3 text-sm font-semibold text-brand-dark">
              {step.title}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
