import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { OFFER_TYPE_LABELS } from "@/lib/constants";
import type { OfferRecommendation } from "@/types/audit";

interface OfferRecommendationPanelProps {
  recommendations: OfferRecommendation[];
}

/**
 * Internal "which Synkro offer fits this client" panel, shown on the audit
 * detail page and the live audit-form preview. Not for the client report —
 * fit scores and the internal sales note are Synkro-only context.
 */
export function OfferRecommendationPanel({
  recommendations,
}: OfferRecommendationPanelProps) {
  const primary = recommendations.find((r) => r.recommendationType === "primary");
  const secondary = recommendations.filter((r) => r.recommendationType === "secondary");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-brand-dark">
          Empfohlenes Synkro-Angebot
        </h2>
        <p className="text-sm text-muted-foreground">
          Automatisch aus den Audit-Signalen abgeleitet — internes Matching, nicht Teil des Kundenreports.
        </p>
      </div>

      {primary ? (
        <Card className="border-brand-primary/30 bg-brand-primary/[0.03]">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="primary">Hauptempfehlung</Badge>
                  <Badge variant="neutral">{OFFER_TYPE_LABELS[primary.offer.type]}</Badge>
                </div>
                <CardTitle className="mt-2 text-xl">{primary.offer.name}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {primary.offer.shortDescription}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-2xl font-semibold text-brand-dark">
                  {primary.fitScore}
                  <span className="text-sm font-normal text-muted-foreground">/100</span>
                </p>
                <p className="text-xs text-muted-foreground">Fit-Score</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <Progress value={primary.fitScore} />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Preis
                </p>
                <p className="mt-1 text-sm font-medium text-brand-dark">
                  {primary.offer.monthlyPriceLabel} · {primary.offer.setupPriceLabel}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Umsetzungsdauer
                </p>
                <p className="mt-1 text-sm font-medium text-brand-dark">
                  {primary.offer.implementationTime}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Warum es passt
              </p>
              <ul className="mt-2 space-y-1.5">
                {primary.reasons.map((reason) => (
                  <li key={reason} className="flex items-start gap-2 text-sm text-brand-dark">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {primary.solvedProblems.length > 0 ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Gelöste Probleme
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {primary.solvedProblems.map((problem) => (
                    <Badge key={problem} variant="neutral">
                      {problem}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Erwartete Wirkung
              </p>
              <p className="mt-1 text-sm text-brand-dark">{primary.expectedImpact}</p>
            </div>

            <div className="rounded-lg bg-surface-muted px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Interne Vertriebsnotiz
              </p>
              <p className="mt-1 text-sm text-brand-dark">{primary.internalSalesNote}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-sm text-muted-foreground">
            Keine Empfehlung erreicht die Schwelle für eine Hauptempfehlung — der Kunde wirkt in den erfassten Bereichen bereits gut aufgestellt.
          </CardContent>
        </Card>
      )}

      {secondary.length > 0 ? (
        <div>
          <p className="mb-3 text-sm font-medium text-brand-dark">Zusatzempfehlungen</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {secondary.map((rec) => (
              <Card key={rec.offer.id}>
                <CardContent className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge variant="neutral" className="mb-1.5">
                        Zusatzangebot
                      </Badge>
                      <p className="font-semibold text-brand-dark">{rec.offer.name}</p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-brand-dark">
                      {rec.fitScore}
                      <span className="text-xs font-normal text-muted-foreground">/100</span>
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">{rec.offer.monthlyPriceLabel}</p>
                  <p className="text-sm text-muted-foreground">{rec.reasons[0]}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
