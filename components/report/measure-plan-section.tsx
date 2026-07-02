import { ArrowRight, CheckCircle2 } from "lucide-react";

import type { OfferRecommendation } from "@/types/audit";

interface MeasurePlanSectionProps {
  primary: OfferRecommendation;
  nextStep?: OfferRecommendation;
}

/**
 * Client-facing, softly worded recommendation built from the same offer
 * match as the internal panel — but stripped of fit scores and the
 * internal sales note, which are Synkro-only context.
 */
export function MeasurePlanSection({ primary, nextStep }: MeasurePlanSectionProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-border-subtle p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-primary">
          Passende Lösung
        </p>
        <h3 className="mt-1 text-lg font-semibold text-brand-dark">
          {primary.offer.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {primary.offer.shortDescription}
        </p>

        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Warum diese Lösung sinnvoll ist
          </p>
          <ul className="mt-2 space-y-1.5">
            {primary.reasons.slice(0, 3).map((reason) => (
              <li key={reason} className="flex items-start gap-2 text-sm text-brand-dark">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Erwartete Wirkung
          </p>
          <p className="mt-1 text-sm text-brand-dark">{primary.expectedImpact}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-border-subtle pt-4 text-sm text-muted-foreground">
          <span>Umsetzungsrahmen: {primary.offer.implementationTime}</span>
          <span>{primary.offer.monthlyPriceLabel} · {primary.offer.setupPriceLabel}</span>
        </div>
      </div>

      {nextStep ? (
        <div className="flex items-start gap-3 rounded-lg bg-surface-muted px-4 py-3">
          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-brand-dark">Optionaler nächster Ausbauschritt: </span>
            {nextStep.offer.name} — {nextStep.expectedImpact}
          </p>
        </div>
      ) : null}
    </div>
  );
}
