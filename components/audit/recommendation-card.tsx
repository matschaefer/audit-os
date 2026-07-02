import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { painPointLabel } from "@/lib/constants";
import type { Recommendation } from "@/types/audit";

const PRIORITY_CONFIG = {
  high: { label: "Hohe Priorität", variant: "danger" as const },
  medium: { label: "Mittlere Priorität", variant: "warning" as const },
  low: { label: "Niedrige Priorität", variant: "neutral" as const },
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

export function RecommendationCard({
  recommendation,
  index,
}: RecommendationCardProps) {
  const priority = PRIORITY_CONFIG[recommendation.priority];

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-semibold text-brand-primary">
              {index + 1}
            </span>
            <h3 className="pt-0.5 font-semibold text-brand-dark">
              {recommendation.title}
            </h3>
          </div>
          <Badge variant={priority.variant} className="shrink-0">
            {priority.label}
          </Badge>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {recommendation.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 border-t border-border-subtle pt-3">
          <Badge variant="primary">{recommendation.impactEstimate}</Badge>
          {recommendation.relatedPainPointIds.map((id) => (
            <Badge key={id} variant="neutral">
              {painPointLabel(id)}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
