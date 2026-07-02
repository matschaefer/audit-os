import { Compass, Lightbulb, Target, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROCESS_MATURITY_LABELS, SALES_PRIORITY_LABELS } from "@/lib/constants";
import type { ConsultantAssessment } from "@/types/audit";

interface InternalAssessmentCardProps {
  assessment: ConsultantAssessment;
}

function priorityBadgeVariant(priority: ConsultantAssessment["salesPriority"]) {
  if (priority === "high") return "danger" as const;
  if (priority === "medium") return "warning" as const;
  return "neutral" as const;
}

/** Consultant-only view of an opportunity — never shown on the client-facing report. */
export function InternalAssessmentCard({ assessment }: InternalAssessmentCardProps) {
  return (
    <Card className="border-brand-primary/20 bg-brand-primary/[0.03]">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Interne Einschätzung</CardTitle>
          <span className="text-xs font-medium text-muted-foreground">
            Nur für Synkro sichtbar
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <Badge variant="neutral">
            {PROCESS_MATURITY_LABELS[assessment.processMaturity]}
          </Badge>
          <Badge variant={priorityBadgeVariant(assessment.salesPriority)}>
            Vertriebspriorität: {SALES_PRIORITY_LABELS[assessment.salesPriority]}
          </Badge>
        </div>

        <div className="flex gap-3">
          <Compass className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Beraternotizen
            </p>
            <p className="mt-1 text-sm text-brand-dark">
              {assessment.discoveryNotes}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Kontext zum Entscheider
            </p>
            <p className="mt-1 text-sm text-brand-dark">
              {assessment.decisionMakerContext}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Vertriebsansatz
            </p>
            <p className="mt-1 text-sm text-brand-dark">{assessment.salesAngle}</p>
          </div>
        </div>

        <div className="flex gap-3 rounded-lg bg-surface px-4 py-3">
          <Target className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Empfohlener nächster Schritt
            </p>
            <p className="mt-1 text-sm font-medium text-brand-dark">
              {assessment.recommendedNextStep}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
