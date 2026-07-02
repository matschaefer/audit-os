import type { ImplementationPhase } from "@/lib/report-narrative";

interface ImplementationTimelineProps {
  phases: ImplementationPhase[];
}

export function ImplementationTimeline({ phases }: ImplementationTimelineProps) {
  return (
    <ol className="space-y-6">
      {phases.map((phase, index) => (
        <li key={phase.range} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white">
              {index + 1}
            </span>
            {index < phases.length - 1 ? (
              <span className="mt-1 w-px flex-1 bg-border-subtle" />
            ) : null}
          </div>
          <div className="pb-2">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-primary">
              {phase.range}
            </p>
            <p className="mt-1 font-semibold text-brand-dark">{phase.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {phase.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
