import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const STEPS = [
  "Unternehmensdaten",
  "Lead- & Prozesssituation",
  "Schmerzpunkte",
  "Manuelle Prozesse",
  "Demo-Auswertung",
];

interface DemoFlowStepperProps {
  /** Whether the final step (the evaluation) has been computed yet. */
  completed: boolean;
}

/** Purely visual overview of the demo flow's five conceptual steps. */
export function DemoFlowStepper({ completed }: DemoFlowStepperProps) {
  return (
    <ol className="flex flex-wrap items-center gap-x-1 gap-y-2.5 text-xs">
      {STEPS.map((step, index) => {
        const isLastStep = index === STEPS.length - 1;
        const isFilled = !isLastStep || completed;

        return (
          <li key={step} className="flex items-center gap-1.5">
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                isFilled
                  ? "bg-brand-primary text-white"
                  : "border border-dashed border-border-subtle text-muted-foreground",
              )}
            >
              {isLastStep && completed ? <Check className="h-3 w-3" /> : index + 1}
            </span>
            <span
              className={cn(
                "font-medium",
                isFilled ? "text-brand-dark" : "text-muted-foreground",
              )}
            >
              {step}
            </span>
            {!isLastStep ? (
              <span aria-hidden className="mx-1 h-px w-4 bg-border-subtle sm:w-6" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
