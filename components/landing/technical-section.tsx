import {
  Code2,
  GitBranch,
  Layers,
  Lock,
  ShieldCheck,
  ToggleLeft,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const HIGHLIGHTS: { icon: LucideIcon; label: string }[] = [
  { icon: Code2, label: "Next.js App Router & TypeScript" },
  { icon: Layers, label: "Wiederverwendbare Komponentenstruktur" },
  { icon: GitBranch, label: "Deterministische Scoring- und Matching-Logik" },
  { icon: ShieldCheck, label: "Clerk Auth vorbereitet" },
  { icon: ToggleLeft, label: "Demo-/Production-Modus über Environment-Konfiguration" },
  { icon: Lock, label: "Privacy-safe Demo ohne echte Kundendaten" },
];

export function TechnicalSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Warum dieses Projekt technisch relevant ist
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {HIGHLIGHTS.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface px-4 py-3.5"
          >
            <item.icon className="h-4 w-4 shrink-0 text-brand-primary" />
            <span className="text-sm text-brand-dark">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
