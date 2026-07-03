import { FileText, ListChecks, Sparkles, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ListChecks,
    title: "Audit-Scoring",
    description:
      "Bewertet Antwortzeiten, manuelle Prozesse, CRM-Reife und Schmerzpunkte.",
  },
  {
    icon: Wallet,
    title: "ROI-Kalkulation",
    description:
      "Schätzt monatliche Zeitersparnis und wirtschaftliches Potenzial.",
  },
  {
    icon: Sparkles,
    title: "Offer Matching",
    description:
      "Ordnet erkannte Probleme den passenden Synkro-Angeboten zu.",
  },
  {
    icon: FileText,
    title: "Report Preview",
    description:
      "Bereitet eine kundenfähige Auswertung für das nächste Gespräch vor.",
  },
];

export function FeatureSection() {
  return (
    <section className="bg-surface-muted py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-brand-dark sm:text-3xl">
            Was der Workspace intern berechnet
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border-subtle bg-surface p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-brand-dark">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
